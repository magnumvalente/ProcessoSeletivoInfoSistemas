import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Vehicle } from '../Models/vehicle';
import { VehicleService } from '../services/vehicle.service';
import { NgForm } from '@angular/forms';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {

  @Input() vehicle = {} as Vehicle;
  @Output() reflesh = new EventEmitter();

  constructor(
    private vehicleService: VehicleService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    
  }

  saveVehicle(form: NgForm) {
    if (this.vehicle.id !== undefined) {
      this.vehicleService.updateVehicle(this.vehicle).subscribe((result) => {
        if (result.success){
          this.alertService.success(`Veículo '${this.vehicle.placa}' atualizado com sucesso.`);
          this.cleanForm(form);
        } else{
          this.alertService.error(`Erro ao salvar o veículo '${this.vehicle.placa}'. ${result.message}`);
        }
      });
    } else {
      this.vehicleService.saveVehicle(this.vehicle).subscribe((result) => {
        if (result.success){
          this.alertService.success(`Veículo '${this.vehicle.placa}' salvo com sucesso.`);
          this.cleanForm(form);
        } else{
          this.alertService.error(`Erro ao salvar o veículo '${this.vehicle.placa}'. ${result.message}`);
        }
      });
    }
    this.reflesh.emit(true);
  }

  // limpa o formulario
  cleanForm(form: NgForm) {
    form.resetForm();
    this.vehicle = {} as Vehicle;
  }
}
