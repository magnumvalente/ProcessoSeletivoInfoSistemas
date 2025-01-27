module.exports = app => {
    const controller = app.controllers.vehicle_controller;
  
    app.route('/api/v1/vehicles')
        .get(controller.listVehicles)
        .post(controller.saveVehicle);

    app.route('/api/v1/vehicles/:vehicleId')
        .get(controller.getVehicle)
        .delete(controller.removeVehicle)
        .put(controller.updateVehicle);
}