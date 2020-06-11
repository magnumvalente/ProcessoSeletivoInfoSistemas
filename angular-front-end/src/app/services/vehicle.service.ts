import { Injectable } from '@angular/core';
import { Vehicle } from '../Models/vehicle';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

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
        tap(_ => this.log('fetched vehicles')),
        catchError(this.handleError<Vehicle[]>('getVehicles', []))
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
