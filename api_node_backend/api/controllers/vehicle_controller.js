const { v4 : uuidv4 } = require('uuid');
const fs = require('fs');

function saveVehicleData(vehiclesData){
    fs.writeFileSync('api/data/vehicle_data.json', JSON.stringify(vehiclesData));
}

function findVehicleIndex(vehiclesDataMock, req, res){

    const { vehicleId } = req.params;
    const vehicleIndex = vehiclesDataMock.data.findIndex(vehicle => vehicle.id === vehicleId);

    if (vehicleIndex === -1){

        res.status(404).json({
            message: 'Veículo não encontrado.',
            sucess: false
        });
    }
    return vehicleIndex;
}

function validateSaveOrUpdateData(vehiclesDataMock, req, res){
    
    let vehicleIndex = vehiclesDataMock.data.findIndex(vehicle => vehicle.placa === req.body.placa);
    if (vehicleIndex > -1){
        res.status(409).json({
            message: `Veículo com a placa '${req.body.placa}' já existe.`,
            sucess: false
        });
        return false;
    }

    vehicleIndex = vehiclesDataMock.data.findIndex(vehicle => vehicle.chassi === req.body.chassi);
    if (vehicleIndex > -1){
        res.status(409).json({
            message: `Veículo com o chassi '${req.body.chassi}' já existe.`,
            sucess: false
        });
        return false;
    }

    vehicleIndex = vehiclesDataMock.data.findIndex(vehicle => vehicle.renavam === req.body.renavam);
    if (vehicleIndex > -1){
        res.status(409).json({
            message: `Veículo com o renavam '${req.body.renavam}' já existe.`,
            sucess: false
        });
        return false;
    }

    return true;
}

module.exports = app => {

    const vehiclesData = app.data.vehicle_data;
    const controller = {};
    const { vehiclesDataDB: vehiclesDataMock } = vehiclesData;
  
    controller.listVehicles = (req, res) => res.status(200).json(vehiclesDataMock);

    controller.saveVehicle = (req, res) => {

        if (validateSaveOrUpdateData(vehiclesDataMock, req, res)){

            vehiclesDataMock.data.push({
                id: uuidv4(),
                placa: req.body.placa,
                chassi: req.body.chassi,
                renavam: req.body.renavam,
                modelo: req.body.modelo,
                marca: req.body.marca,
                ano: req.body.ano
            });

            saveVehicleData(vehiclesData);

            res.status(201).json(vehiclesDataMock);
        }
    }

    controller.getVehicle = (req, res) => {

        const vehicleIndex = findVehicleIndex(vehiclesDataMock, req, res);

        if (vehicleIndex > -1){

            res.status(200).json(vehiclesDataMock.data[vehicleIndex]);
        }
    }

    controller.removeVehicle = (req, res) => {

        const vehicleIndex = findVehicleIndex(vehiclesDataMock, req, res);

        if (vehicleIndex > -1){

            vehiclesDataMock.data.splice(vehicleIndex, 1);

            saveVehicleData(vehiclesData);

            res.status(200).json(vehiclesDataMock);
        }
    }    

    controller.updateVehicle = (req, res) => {

        const vehicleIndex = findVehicleIndex(vehiclesDataMock, req, res);

        if (vehicleIndex > -1){

            const vehicleRemoved = vehiclesDataMock.data.splice(vehicleIndex, 1)[0];

            if (validateSaveOrUpdateData(vehiclesDataMock, req, res)){

                const { vehicleId } = req.params;
                vehiclesDataMock.data.push({
                    id: vehicleId,
                    placa: req.body.placa,
                    chassi: req.body.chassi,
                    renavam: req.body.renavam,
                    modelo: req.body.modelo,
                    marca: req.body.marca,
                    ano: req.body.ano
                });

                res.status(200).json(vehiclesDataMock);

            }else{

                vehiclesDataMock.data.push(vehicleRemoved);
            }

            saveVehicleData(vehiclesData);            
        }
    }

    return controller;
  }