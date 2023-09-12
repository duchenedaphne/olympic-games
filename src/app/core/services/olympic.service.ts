
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {

    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),

      catchError(
        (error: any) => {

          if (error.status === 404) {
            error.message = "Oops... The olympic results can't be found."
            alert(error.message);
            
          } else {
            error.message = "Oops... Something went wrong, please try again."
            alert(error.message + ' : ' + error.statusText);
          }

          this.olympics$.next([]);

        throw new Error(error.message + ' code status : ' + error.status + ' : ' + error.statusText)
      })
    );
  }
  
  public getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  public getOneOlympic(id:number): Observable<Olympic | undefined> {

    return this.getOlympics().pipe(
      map(
        (olympics: Olympic[]) => (
          olympics.find(
            (olympic: Olympic) => 
              olympic.id === id
          )
        )
      )
    )
  }

}


