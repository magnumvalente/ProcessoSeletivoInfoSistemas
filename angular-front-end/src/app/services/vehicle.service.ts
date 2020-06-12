import { Injectable } from '@angular/core';
import { Vehicle } from '../Models/vehicle';
import { Observable, throwError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private vehiclesUrl = 'http://localhost:8080/api/v1/vehicles';

  constructor(
    private httpClient: HttpClient) { }

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }

  getVehicles(): Observable<Vehicle[]>{
    return this.httpClient.get<Vehicle[]>(this.vehiclesUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  removeVehicle(id: string) : Observable<Result> {
    return this.httpClient.delete<Result>(`${this.vehiclesUrl}/${id}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  saveVehicle(vehicle: Vehicle) : Observable<Result> {
    return this.httpClient.post<Result>(this.vehiclesUrl, JSON.stringify(vehicle), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateVehicle(vehicle: Vehicle) : Observable<Result> {
    return this.httpClient.put<Result>(`${this.vehiclesUrl}/${vehicle.id}`, JSON.stringify(vehicle), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
 
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }

}
