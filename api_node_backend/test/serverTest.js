const chai = require("chai");
const chaiHttp = require("chai-http");
const expect  = chai.expect;
const app = require("../server");
const pathData = '../api/data/vehicle_data.json';

chai.use(chaiHttp);

describe("Backend API", () => {

    before((done) => {
        
        const { vehiclesDataDB: vehiclesData } = require(pathData);

        vehiclesData.data.forEach((vehicle, index) => {

            chai.request(app)
                .delete(`/api/v1/vehicles/${vehicle.id}`)
                .end((error, response) => {
                    expect(response).to.have.status(200);                    
                });
        });

        done();
    })

    describe("POST vehicles", () => {
        
        it("insert a vehicle", (done) => {

            let vehicle = {
                placa: "PAV2385",
                chassi: "58C43343DE44B6535",
                renavam: "546788967",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }

            chai.request(app)
            .post("/api/v1/vehicles")
            .send(vehicle)
            .end((error, response) => {                
                expect(response).to.have.status(201);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(true);

                const { vehiclesDataDB: vehiclesData } = require(pathData);
                let vehicleInsertedIndex = vehiclesData.data.findIndex(v => v.placa === vehicle.placa);

                expect(vehicleInsertedIndex).to.not.equal(-1);
                expect(vehiclesData.data[vehicleInsertedIndex].id).to.not.equal(null);
                expect(vehiclesData.data[vehicleInsertedIndex].placa).to.equal(vehicle.placa);
                expect(vehiclesData.data[vehicleInsertedIndex].chassi).to.equal(vehicle.chassi);
                expect(vehiclesData.data[vehicleInsertedIndex].renavam).to.equal(vehicle.renavam);
                expect(vehiclesData.data[vehicleInsertedIndex].modelo).to.equal(vehicle.modelo);
                expect(vehiclesData.data[vehicleInsertedIndex].marca).to.equal(vehicle.marca);
                expect(vehiclesData.data[vehicleInsertedIndex].ano).to.equal(vehicle.ano);

                done();
            });            
        });

        it("insert a vehicle with invalid placa", (done) => {

            let vehicle = {
                placa: "PAVR385",
                chassi: "58C43343DE44B6545",
                renavam: "467879676",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }

            chai.request(app)
            .post("/api/v1/vehicles")
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal(`Veículo com a placa '${vehicle.placa}' inválida.`);                
                done();
            });            
        });

        it("insert a vehicle with placa that already exists", (done) => {

            let vehicle = {
                placa: "PAV2385",
                chassi: "58C43343DE44B6545",
                renavam: "546789676",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }

            chai.request(app)
            .post("/api/v1/vehicles")
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal(`Veículo com a placa '${vehicle.placa}' já existe.`);                
                done();
            });            
        });

        it("insert a vehicle with chassi that already exists", (done) => {

            let vehicle = {
                placa: "PAV5385",
                chassi: "58C43343DE44B6535",
                renavam: "546779676",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }

            chai.request(app)
            .post("/api/v1/vehicles")
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal(`Veículo com o chassi '${vehicle.chassi}' já existe.`);
                done();
            });            
        });

        it("insert a vehicle with renavam that already exists", (done) => {

            let vehicle = {
                placa: "PAV3585",
                chassi: "58C45643DE44B6535",
                renavam: "546788967",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }

            chai.request(app)
            .post("/api/v1/vehicles")
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal(`Veículo com o renavam '${vehicle.renavam}' já existe.`); 
                done();
            });            
        });

        it("insert a vehicle with invalid renavam", (done) => {

            let vehicle = {
                placa: "PAV3585",
                chassi: "58C45643DE44B6535",
                renavam: "54678849676",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }

            chai.request(app)
            .post("/api/v1/vehicles")
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal(`Veículo com o renavam '${vehicle.renavam}' inválido.`); 
                done();
            });            
        });
    });

    describe("PUT vehicles", () => {
    
        var vehicleToUpdateId;

        it("insert a vehicle for update", (done) => {

            let vehicle = {
                placa: "HJG7342",
                chassi: "58A9888DE44A3374",
                renavam: "645767555",
                modelo: "Uno Fire",
                marca: "Fiat",
                ano: 2010
            }

            chai.request(app)
            .post("/api/v1/vehicles")
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(201);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(true);

                const { vehiclesDataDB: vehiclesData } = require(pathData);
                let vehicleToUpdateIndex = vehiclesData.data.findIndex(v => v.placa === "HJG7342");

                expect(vehicleToUpdateIndex).to.not.equal(-1);
                expect(vehiclesData.data[vehicleToUpdateIndex].id).to.not.equal(null);
                expect(vehiclesData.data[vehicleToUpdateIndex].placa).to.equal(vehicle.placa);
                expect(vehiclesData.data[vehicleToUpdateIndex].chassi).to.equal(vehicle.chassi);
                expect(vehiclesData.data[vehicleToUpdateIndex].renavam).to.equal(vehicle.renavam);
                expect(vehiclesData.data[vehicleToUpdateIndex].modelo).to.equal(vehicle.modelo);
                expect(vehiclesData.data[vehicleToUpdateIndex].marca).to.equal(vehicle.marca);
                expect(vehiclesData.data[vehicleToUpdateIndex].ano).to.equal(vehicle.ano);
                
                vehicleToUpdateId = vehiclesData.data[vehicleToUpdateIndex].id;

                done();
            });            
        });

        it("update a vehicle", (done) => {

            let vehicle = {
                placa: "HJG7342",
                chassi: "58A9888DE44A3374",
                renavam: "645767555",
                modelo: "Uno Fire",
                marca: "Fiat",
                ano: 2012
            }

            chai.request(app)
            .put(`/api/v1/vehicles/${vehicleToUpdateId}`)
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(true);

                const { vehiclesDataDB: vehiclesData } = require(pathData);
                let vehicleToUpdateIndex = vehiclesData.data.findIndex(v => v.placa === "HJG7342");

                expect(vehicleToUpdateIndex).to.not.equal(-1); 
                expect(vehiclesData.data[vehicleToUpdateIndex].id).to.not.equal(null);
                expect(vehiclesData.data[vehicleToUpdateIndex].placa).to.equal(vehicle.placa);
                expect(vehiclesData.data[vehicleToUpdateIndex].chassi).to.equal(vehicle.chassi);
                expect(vehiclesData.data[vehicleToUpdateIndex].renavam).to.equal(vehicle.renavam);
                expect(vehiclesData.data[vehicleToUpdateIndex].modelo).to.equal(vehicle.modelo);
                expect(vehiclesData.data[vehicleToUpdateIndex].marca).to.equal(vehicle.marca);
                expect(vehiclesData.data[vehicleToUpdateIndex].ano).to.equal(vehicle.ano);

                done();
            });            
        });

        it("update a vehicle with invalid placa", (done) => {

            let vehicle = {
                placa: "PAV238D",
                chassi: "58C43343DE44B6545",
                renavam: "5467879676",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }

            chai.request(app)
            .put(`/api/v1/vehicles/${vehicleToUpdateId}`)
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal(`Veículo com a placa '${vehicle.placa}' inválida.`);
                done();
            });
        });

        it("update a vehicle with placa already exists", (done) => {

            let vehicle = {
                placa: "PAV2385",
                chassi: "58C43343DE44B6545",
                renavam: "546787976",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }

            chai.request(app)
            .put(`/api/v1/vehicles/${vehicleToUpdateId}`)
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal(`Veículo com a placa '${vehicle.placa}' já existe.`);
                done();
            });
        });

        it("update a vehicle with chassi that already exists", (done) => {

            let vehicle = {
                placa: "PAV5385",
                chassi: "58C43343DE44B6535",
                renavam: "546787676",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }

            chai.request(app)
            .put(`/api/v1/vehicles/${vehicleToUpdateId}`)
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal(`Veículo com o chassi '${vehicle.chassi}' já existe.`);
                done();
            });
        });

        it("update a vehicle with invalid renavam", (done) => {

            let vehicle = {
                placa: "PAV3585",
                chassi: "58C45643DE44B6535",
                renavam: "546788C76",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }

            chai.request(app)
            .put(`/api/v1/vehicles/${vehicleToUpdateId}`)
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal(`Veículo com o renavam '${vehicle.renavam}' inválido.`);
                done();   
            });            
        });

        it("update a vehicle with renavam that already exists", (done) => {

            let vehicle = {
                placa: "PAV3585",
                chassi: "58C45643DE44B6535",
                renavam: "546788967",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }

            chai.request(app)
            .put(`/api/v1/vehicles/${vehicleToUpdateId}`)
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal(`Veículo com o renavam '${vehicle.renavam}' já existe.`);
                done();   
            });            
        });

        it("update a invalid vehicle id", (done) => {

            let vehicle = {
                placa: "PAV3585",
                chassi: "58C45643DE44B6535",
                renavam: "645767555",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }

            chai.request(app)
            .put("/api/v1/vehicles/0")
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal("Veículo não encontrado.");
                done();
            });            
        });
    });

    describe("GET vehicles", () => {
        
        it("returns list of vehicles", (done) => {

            chai.request(app)
                .get("/api/v1/vehicles")
                .end((error, response) => {
                    expect(response).to.have.status(200);
                    expect(response.body).to.not.equal(null);
                    const { vehiclesDataDB: vehiclesData } = require(pathData);
                    expect(JSON.stringify(response.body)).to.equal(JSON.stringify(vehiclesData.data));
                    done();
                });            
        });
           
        it("returns a vehicle", (done) => {

            const { vehiclesDataDB: vehiclesData } = require(pathData);
            let vehicle = vehiclesData.data.find(v => v.placa === "PAV2385");
            expect(vehicle).to.not.equal(null);
            expect(vehicle.id).to.not.equal(null);

            chai.request(app)
                .get(`/api/v1/vehicles/${vehicle.id}`)
                .end((error, response) => {
                    expect(response).to.have.status(200);
                    expect(response.body).to.not.equal(null);
                    expect(JSON.stringify(response.body)).to.equal(JSON.stringify(vehicle)); 
                    done();
                });
        });

        it("returns that there is no vehicle", (done) => {

            chai.request(app)
                .get("/api/v1/vehicles/0")
                .end((error, response) => {
                    expect(response).to.have.status(200);
                    expect(response.body).to.have.property("success");
                    expect(response.body.success).to.equal(false);
                    expect(response.body).to.have.property("message");
                    expect(response.body.message).to.equal("Veículo não encontrado.");
                    done();
                });            
        });
    });    

    describe("DELETE vehicles", () => {
        
        it("remove a vehicle", (done) => {

            let { vehiclesDataDB: vehiclesData } = require(pathData);
            let vehicle = vehiclesData.data.find(v => v.placa === "PAV2385");
            expect(vehicle).to.not.equal(null);
            expect(vehicle.id).to.not.equal(null);

            chai.request(app)
            .delete(`/api/v1/vehicles/${vehicle.id}`)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.equal(true);
                done();  
            });            
        });

        it("returns that there is no vehicle", (done) => {

            chai.request(app)
                .delete("/api/v1/vehicles/0")
                .end((error, response) => {
                    expect(response).to.have.status(200);
                    expect(response.body).to.have.property("success");
                    expect(response.body.success).to.equal(false);
                    expect(response.body).to.have.property("message");
                    expect(response.body.message).to.equal("Veículo não encontrado.");
                    done();
                });            
        });
    });
});