import { Injectable } from '@angular/core';
import { Vehicle } from '../Models/vehicle';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private vehiclesUrl = 'http://localhost:8080/api/v1/vehicles';

  constructor(
    private httpClient: HttpClient, 
    private messageService: MessageService) { }

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

  getVehicles(): Observable<Vehicle[]>{
    return this.httpClient.get<Vehicle[]>(this.vehiclesUrl)
      .pipe(
        tap(_ => this.log('Buscando a lista de veículos')),
        catchError(this.handleError<Vehicle[]>('getVehicles', []))
      );
  }

  removeVehicle(id: string) : Observable<Result> {
    return this.httpClient.delete<Result>(`${this.vehiclesUrl}/${id}`, this.httpOptions)
      .pipe(
        tap(_ => this.log(`Removendo o veículo id: '${id}'.`)),
        catchError(this.handleError<Result>('removeVehicle'))
      );
  }

  saveVehicle(vehicle: Vehicle) : Observable<Result> {
    return this.httpClient.post<Result>(this.vehiclesUrl, JSON.stringify(vehicle), this.httpOptions)
      .pipe(
        tap(_ => this.log(`Criando o veículo de placa: '${vehicle.placa}'.`)),
        catchError(this.handleError<Result>('saveVehicle'))
      );
  }

  updateVehicle(vehicle: Vehicle) : Observable<Result> {
    return this.httpClient.put<Result>(`${this.vehiclesUrl}/${vehicle.id}`, JSON.stringify(vehicle), this.httpOptions)
      .pipe(
        tap(_ => this.log(`Alteando o veículo id: '${vehicle.id}'.`)),
        catchError(this.handleError<Result>('updateVehicle'))
      );
  }
 
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

}
