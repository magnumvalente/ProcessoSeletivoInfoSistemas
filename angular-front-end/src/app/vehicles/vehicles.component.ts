import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../Models/vehicle';
import { VehicleService } from '../services/vehicle.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {

  vehicle = {} as Vehicle;
  vehicles: Vehicle[];

  constructor(
    private vehicleService: VehicleService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.getVehicles();
  }

  getVehicles(): void {
    window.scroll(0,0);
    this.vehicleService.getVehicles()
      .subscribe(vehicles => this.vehicles = vehicles);
  }

  editVehicle(vehicle: Vehicle, el: HTMLElement): void {
    this.vehicle = { ...vehicle };
    el.scrollIntoView();
  }

  removeVehicle(vehicle: Vehicle): void {
    this.vehicleService.removeVehicle(vehicle.id)
      .subscribe((result) => {
        if (result.success){
          this.alertService.success(`Veículo '${vehicle.placa}' removido.`);
          this.getVehicles()
        }else{
          this.alertService.error(`Erro ao remover o veículo '${vehicle.placa}'. ${result.message}`);
        }
      });
  }

  updateVehicles(reflesh){    
    if (reflesh){
      this.getVehicles();
    }
  }

}