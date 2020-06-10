const { v4 : uuidv4 } = require('uuid');

module.exports = app => {

    const vehiclesData = app.data.vehicle_data;
    const controller = {};
    const { vehiclesDataDB: vehiclesDataMock } = vehiclesData;
  
    controller.listVehicles = (req, res) => res.status(200).json(vehiclesDataMock);

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

        res.status(201).json(vehiclesDataMock);
    }

    controller.removeVehicle = (req, res) => {
        const { vehicleId } = req.params;
        const vehicleIndex = vehiclesDataMock.data.findIndex(vehicle => vehicle.id === vehicleId);

        if (vehicleIndex === -1){
            res.status(404).json({
                message: 'Veículo não encontrado.',
                sucess: false,
                vehiclesDataDB: vehiclesDataMock
            });
        }else{
            vehiclesDataMock.data.splice(vehicleIndex, 1);
            
            res.status(200).json({
                sucess: true,
                vehiclesDataDB: vehiclesDataMock
            })
        }
    }

    controller.updateVehicle = (req, res) => {
        const { vehicleId } = req.params;
        const vehicleIndex = vehiclesDataMock.data.findIndex(vehicle => vehicle.id === vehicleId);

        if (vehicleIndex === -1){
            res.status(404).json({
                message: 'Veículo não encontrado.',
                sucess: false,
                vehiclesDataDB: vehiclesDataMock
            });
        }else{
            const vehicleUpdated = {
                id: vehicleId,
                placa: req.body.placa,
                chassi: req.body.chassi,
                renavan: req.body.renavan,
                modelo: req.body.modelo,
                marca: req.body.marca,
                ano: req.body.ano
            };

            vehiclesDataMock.data.splice(vehicleIndex, 1, vehicleUpdated);

            res.status(200).json({
                sucess: true,
                vehiclesDataDB: vehiclesDataMock
            })
        }
    }

    return controller;
  }