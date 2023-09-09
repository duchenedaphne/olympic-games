
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { Observable, map, tap } from 'rxjs';
import { Olympic } from '../../models/Olympic';
import { Participation } from '../../models/Participation';
import { OlympicService } from '../../services/olympic.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  /***** VARIABLES : *****/  
  public olympics$: Observable<Olympic[]> | undefined;

  public olympicOne$!: Observable<Olympic | undefined>;
  
  public olympic$!: Olympic | undefined;
  public olympicId$!:number;

  public olympicCountry$:string | undefined;

  public participationsYears$: number[] = [];
  public allMedalsValues$: number[] = [];
  public allAthleteValues$: number[] = [];
  
  public totalMedals$: number = 0;
  public totalEntries$: number | undefined;
  public totalAthlete$: number = 0;

  /***** GRAPHIQUE : *****/
  public lineChartData: ChartData = {
    labels: this.participationsYears$,
    datasets: [
      {
        data: this.allMedalsValues$,
        label: 'Medals',
        backgroundColor: 'rgba(4,131,143,0.3)',
        borderColor: 'rgb(4,131,143)',
        hidden: false
      },
      {
        data: this.allAthleteValues$,
        label: 'Athletes',
        backgroundColor: 'rgba(184,203,231,0.3)', 
        borderColor: 'rgba(184,203,231,1)',
        hidden: false
      }
    ]
  }
  
  public lineChartType: ChartType = 'line';
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartLegend = true;
  public lineChartPlugins = [];

  /***** CONSTRUCTEUR : *****/
  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) { }

  /***** ON INIT : *****/
  ngOnInit(): void {
      
    this.olympics$ = this.olympicService.getOlympics();
    
    this.olympicId$ = +this.route.snapshot.params['id'];

    this.olympicOne$ = this.olympics$.pipe(
      map(
        (olympics: Olympic[]) => (

          olympics.find(
            (olympic: Olympic) => 
              olympic.id === this.olympicId$
          )
        )
      )
    );

    this.olympicOne$?.pipe(
      tap(        
        (olympic: Olympic | undefined) => {
          
          this.olympic$ = olympic;

          this.olympicCountry$ = "Name of country";          
          this.olympicCountry$ = olympic?.country;   
          
          this.totalEntries$ = olympic?.participations.length;

          olympic?.participations.map(
            (participation: Participation) => {

              this.participationsYears$.push(participation.year);
              this.allMedalsValues$.push(participation.medalsCount);
              this.allAthleteValues$.push(participation.athleteCount);

              this.totalMedals$ += participation.medalsCount;
              this.totalAthlete$ += participation.athleteCount;
            }
          )
        }
      )
    ).subscribe();
  }

}
