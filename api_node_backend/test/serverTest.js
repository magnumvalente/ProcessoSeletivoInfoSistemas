const chai = require("chai");
const chaiHttp = require("chai-http");
const expect  = chai.expect;
const request = require("request");
const app = require("../server");
const pathData = '../api/data/vehicle_data.json';

chai.use(chaiHttp);

describe("Backend API", () => {

    before((done) => {
        const { vehiclesDataDB: vehiclesData } = require(pathData);
        vehiclesData.data.forEach((vehicle, index) => {
            chai.request(app)
                .delete(`/api/v1/vehicle/${vehicle.id}`)
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
                renavam: "5467889676",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }
            chai.request(app)
            .post("/api/v1/vehicles")
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(201);
                const { vehiclesDataDB: vehiclesData } = require(pathData);
                expect(JSON.stringify(response.body)).to.equal(JSON.stringify(vehiclesData));       
            });
            done();
        });

        it("insert a vehicle with invalid placa", (done) => {
            let vehicle = {
                placa: "PAV2385",
                chassi: "58C43343DE44B6545",
                renavam: "5467879676",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }
            chai.request(app)
            .post("/api/v1/vehicles")
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(409);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal("Veículo com a placa \'PAV2385\' já existe.")      
            });
            done();
        });

        it("insert a vehicle with invalid chassi", (done) => {
            let vehicle = {
                placa: "PAV5385",
                chassi: "58C43343DE44B6535",
                renavam: "5467879676",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }
            chai.request(app)
            .post("/api/v1/vehicles")
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(409);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal("Veículo com o chassi \'58C43343DE44B6535\' já existe.")         
            });
            done();
        });

        it("insert a vehicle with invalid renavam", (done) => {
            let vehicle = {
                placa: "PAV3585",
                chassi: "58C45643DE44B6535",
                renavam: "5467889676",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }
            chai.request(app)
            .post("/api/v1/vehicles")
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(409);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal("Veículo com o renavam \'5467889676\' já existe.")    
            });
            done();
        });

    });

    describe("PUT vehicles", () => {

        var vehicleToUpdate;
        
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
                const { vehiclesDataDB: vehiclesData } = require(pathData);
                expect(JSON.stringify(response.body)).to.equal(JSON.stringify(vehiclesData));
                vehicleToUpdate = vehiclesData.data.find(v => v.placa === "HJG7342");
            });
            done();
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
            .put(`/api/v1/vehicle/${vehicleToUpdate.id}`)
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("data");
                let vehicleupdatedIndex = response.body.data.findIndex(v => v.placa === "HJG7342");
                expect(response.body.data[vehicleupdatedIndex]).to.have.property("placa");
                expect(response.body.data[vehicleupdatedIndex]).to.have.property("chassi");
                expect(response.body.data[vehicleupdatedIndex]).to.have.property("renavam");
                expect(response.body.data[vehicleupdatedIndex]).to.have.property("modelo");
                expect(response.body.data[vehicleupdatedIndex]).to.have.property("marca");
                expect(response.body.data[vehicleupdatedIndex]).to.have.property("ano");
                expect(response.body.data[vehicleupdatedIndex].placa).to.equal(vehicle.placa);
                expect(response.body.data[vehicleupdatedIndex].chassi).to.equal(vehicle.chassi);
                expect(response.body.data[vehicleupdatedIndex].renavam).to.equal(vehicle.renavam);
                expect(response.body.data[vehicleupdatedIndex].modelo).to.equal(vehicle.modelo);
                expect(response.body.data[vehicleupdatedIndex].marca).to.equal(vehicle.marca);
                expect(response.body.data[vehicleupdatedIndex].ano).to.equal(vehicle.ano);
            });
            done();
        });

        it("update a vehicle with invalid placa", (done) => {
            let vehicle = {
                placa: "PAV2385",
                chassi: "58C43343DE44B6545",
                renavam: "5467879676",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }
            chai.request(app)
            .put(`/api/v1/vehicle/${vehicleToUpdate.id}`)
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(409);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal("Veículo com a placa \'PAV2385\' já existe.")      
            });
            done();
        });

        it("update a vehicle with invalid chassi", (done) => {
            let vehicle = {
                placa: "PAV5385",
                chassi: "58C43343DE44B6535",
                renavam: "5467879676",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }
            chai.request(app)
            .put(`/api/v1/vehicle/${vehicleToUpdate.id}`)
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(409);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal("Veículo com o chassi \'58C43343DE44B6535\' já existe.")         
            });
            done();
        });

        it("update a vehicle with invalid renavam", (done) => {
            let vehicle = {
                placa: "PAV3585",
                chassi: "58C45643DE44B6535",
                renavam: "5467889676",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }
            chai.request(app)
            .put(`/api/v1/vehicle/${vehicleToUpdate.id}`)
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(409);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal("Veículo com o renavam \'5467889676\' já existe.")    
            });
            done();
        });

        it("update a invalid vehicle", (done) => {
            let vehicle = {
                placa: "PAV3585",
                chassi: "58C45643DE44B6535",
                renavam: "645767555",
                modelo: "Eco Sports",
                marca: "Ford",
                ano: 2015
            }
            chai.request(app)
            .put("/api/v1/vehicle/0")
            .send(vehicle)
            .end((error, response) => {
                expect(response).to.have.status(404);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.equal("Veículo não encontrado.")    
            });
            done();
        });

    });

    describe("GET vehicles", () => {
        
        it("returns list of vehicles", (done) => {
            chai.request(app)
                .get("/api/v1/vehicles")
                .end((error, response) => {
                    expect(response).to.have.status(200);
                    const { vehiclesDataDB: vehiclesData } = require(pathData);
                    expect(JSON.stringify(response.body)).to.equal(JSON.stringify(vehiclesData));       
                });
            done();
        });
           
        it("returns a vehicle", (done) => {
            const { vehiclesDataDB: vehiclesData } = require(pathData);
            let vehicle = vehiclesData.data.find(v => v.placa === "PAV2385");

            if (vehicle !== null){

                chai.request(app)
                    .get(`/api/v1/vehicle/${vehicle.id}`)
                    .end((error, response) => {
                        expect(response).to.have.status(200);
                        
                        expect(JSON.stringify(response.body)).to.equal(JSON.stringify(vehicle));       
                    });
            }
            done();
        });

        it("returns that there is no vehicle", (done) => {
            chai.request(app)
                .get("/api/v1/vehicle/0")
                .end((error, response) => {
                    expect(response).to.have.status(404);
                    expect(response.body).to.have.property("message");
                    expect(response.body.message).to.equal("Veículo não encontrado.")
                });
            done();
        });
    });    

    describe("DELETE vehicles", () => {
        
        it("remove a vehicle", (done) => {
            let { vehiclesDataDB: vehiclesData } = require(pathData);
            let vehicle = vehiclesData.data.find(v => v.placa === "PAV2385");

            if (vehicle !== null){

                chai.request(app)
                .delete(`/api/v1/vehicle/${vehicle.id}`)
                .end((error, response) => {
                    expect(response).to.have.status(200);
                    let { vehiclesDataDB: vehiclesData } = require(pathData);
                    expect(JSON.stringify(response.body)).to.equal(JSON.stringify(vehiclesData));       
                });
            }            
            done();
        });

        it("returns that there is no vehicle", (done) => {
            chai.request(app)
                .delete("/api/v1/vehicle/0")
                .end((error, response) => {
                    expect(response).to.have.status(404);
                    expect(response.body).to.have.property("message");
                    expect(response.body.message).to.equal("Veículo não encontrado.")
                });
            done();
        });

    });

  });