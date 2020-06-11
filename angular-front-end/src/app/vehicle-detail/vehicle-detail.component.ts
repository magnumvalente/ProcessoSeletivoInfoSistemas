import { Component, OnInit, Input } from '@angular/core';
import { Vehicle } from '../Models/vehicle';
import { VehicleService } from '../services/vehicle.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {

  @Input() vehicle = {} as Vehicle;

  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {
    
  }

  saveVehicle(form: NgForm) {
    if (this.vehicle.id !== undefined) {
      this.vehicleService.updateVehicle(this.vehicle).subscribe(() => {
        this.cleanForm(form);
      });
    } else {
      this.vehicleService.saveVehicle(this.vehicle).subscribe(() => {
        this.cleanForm(form);
      });
    }
  }

  // limpa o formulario
  cleanForm(form: NgForm) {
    form.resetForm();
    this.vehicle = {} as Vehicle;
  }
}
