import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../Models/vehicle';
import { VehicleService } from '../services/vehicle.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {

  vehicles: Vehicle[];
  selectedVehicle: Vehicle;

  constructor(private vehicleService: VehicleService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getVehicles();
  }

  getVehicles(): void {
    this.vehicleService.getVehicles()
      .subscribe(vehicles => this.vehicles = vehicles);
  }

  onSelect(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.messageService.add(`O veículo '${vehicle.id}' foi selecionado.`)
  }

}
