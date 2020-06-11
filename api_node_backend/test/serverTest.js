const chai = require("chai");
const chaiHttp = require("chai-http");
const expect  = chai.expect;
const request = require("request");
const app = require("../server");

chai.use(chaiHttp);

describe("Backend API", () => {

    before((done) => {
        const { vehiclesDataDB: vehiclesData } = require('../api/data/vehicle_data.json');
        vehiclesData.data.forEach((vehicle, index) => {
            chai.request(app)
                .delete(`/api/v1/vehicle/${vehicle.id}`);
        });
        done();
    })

    describe("Post vehicles", function() {
        
        it("insert a vehicle", function(done) {
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
                const { vehiclesDataDB: vehiclesData } = require('../api/data/vehicle_data.json');
                expect(JSON.stringify(response.body)).to.equal(JSON.stringify(vehiclesData));       
            });
            done();
        });
    });

    describe("Get vehicles", () => {
        
        it("returns list of vehicles", (done) => {
            chai.request(app)
                .get("/api/v1/vehicles")
                .end((error, response) => {
                    expect(response).to.have.status(200);
                    const { vehiclesDataDB: vehiclesData } = require('../api/data/vehicle_data.json');
                    expect(JSON.stringify(response.body)).to.equal(JSON.stringify(vehiclesData));       
                });
            done();
        });
    });

    describe("Get vehicle", () => {
        
        it("return a vehicle", (done) => {
            const { vehiclesDataDB: vehiclesData } = require('../api/data/vehicle_data.json');
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

        it("return a not exists vehicle", (done) => {
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

    describe("Delete vehicle", function() {
        
        it("remove a vehicle", function(done) {
            let { vehiclesDataDB: vehiclesData } = require('../api/data/vehicle_data.json');
            let vehicle = vehiclesData.data.find(v => v.placa === "PAV2385");

            if (vehicle !== null){

                chai.request(app)
                .delete(`/api/v1/vehicle/${vehicle.id}`)
                .end((error, response) => {
                    expect(response).to.have.status(200);
                    let { vehiclesDataDB: vehiclesData } = require('../api/data/vehicle_data.json');
                    expect(JSON.stringify(response.body)).to.equal(JSON.stringify(vehiclesData));       
                });
            }            
            done();
        });
    });

  });