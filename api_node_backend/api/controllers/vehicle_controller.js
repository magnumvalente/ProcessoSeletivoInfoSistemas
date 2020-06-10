const { v4 : uuidv4 } = require('uuid');

module.exports = app => {

    const vehiclesDataDB = app.data.vehicle_data;
    const controller = {};
    const { vehiclesData: vehiclesDataMock } = vehiclesDataDB;
  
    controller.listVehicles = (req, res) => res.status(200).json(vehiclesDataDB);

    controller.saveVehicle = (req, res) => {

        vehiclesDataMock.data.push({
            id: uuidv4(),
            placa: req.body.placa,
            chassi: req.body.chassi,
            renavan: req.body.renavan,
            modelo: req.body.modelo,
            marca: req.body.marca,
            ano: req.body.ano
        });

        res.status(201).json(vehicleData);
    }
  
    return controller;
  }