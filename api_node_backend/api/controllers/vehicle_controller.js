module.exports = app => {
    const vehiclesDataDB = app.data.vehicle_data;
    const controller = {};
  
    controller.listVehicles = (req, res) => res.status(200).json(vehiclesDataDB);
  
    return controller;
  }