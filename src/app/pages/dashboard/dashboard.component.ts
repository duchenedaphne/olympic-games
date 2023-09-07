
import { Component, OnInit } from '@angular/core';
import { take, tap } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /***** VARIABLES : *****/
  public josNumber$: number = 0;

  public olympicsLength$: number = 0;

  /***** CONSTRUCTEUR : *****/
  constructor(
    private olympicService: OlympicService
  ) {}

  /***** ON INIT : *****/
  ngOnInit(): void {

    this.olympicService.getOlympics().pipe(
      take(1),
      tap(
        (olympics:Olympic[]) => {
            
          this.olympicsLength$ = olympics.length

          olympics.map(
            (olympic:Olympic) => { 

              this.getJOsNumber(olympic.participations.length);
            }
          )   
        }
      )
    ).subscribe();    
  }

  /***** METHODES : *****/
  public getJOsNumber(josCount:number) {

    this.josNumber$ += josCount;
  }

}
