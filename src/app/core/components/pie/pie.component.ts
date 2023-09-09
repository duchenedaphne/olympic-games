
import { Component, OnInit, ViewChild } from '@angular/core';
import { Olympic } from '../../models/Olympic';
import { Observable, tap } from 'rxjs';
import { ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js';
import { Participation } from '../../models/Participation';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { OlympicService } from '../../services/olympic.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  /***** VARIABLES : *****/
  public olympics$: Observable<Olympic[]> | undefined;

  public olympicsDatas$: Olympic[] = [];
  
  public olympicsIds$: Array<{}> = [];
  public olympicsCountries$: string[] = [];

  public allMedalsValues$: number[] = [];
  public totalMedals$: number = 0;

  public olympicSelected$: Olympic | undefined;

  /***** GRAPHIQUE : *****/
  public pieChartData: ChartData = {
    
    labels: this.olympicsCountries$,
    datasets: [
      {
        data: this.allMedalsValues$,
        label: '',
        backgroundColor: [
          'rgba(149,96,101,1)', 
          'rgba(184,203,231,1)', 
          'rgba(137,161,219,1)', 
          'rgba(121,61,82,1)',  
          'rgba(151,128,161,1)'
        ],
        borderColor: [
          'rgba(149,96,101,1)',
          'rgba(184,203,231,1)',
          'rgba(137,161,219,1)',
          'rgba(121,61,82,1)',
          'rgba(151,128,161,1)' 
        ],
        // dataPoints: this.olympicsIds$,
        // active: 
        // datasetIndex: 
      }
    ]
  }

  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  // public pieChartPlugins = [DataLabelsPlugin];

  public pieChartOptions: ChartOptions = {
    responsive: true,
    onClick: () => {

      // console.log();      
    } 
  }

  public chartClicked({
    event,
    active
  } : {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);    
  }

  public onChartClick(event:any) {

    console.log(event);
  }

  /***** CONSTRUCTEUR : *****/
  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) { }

  /***** ON INIT : *****/
  ngOnInit(): void {

    this.olympics$ = this.olympicService.getOlympics();
    
    this.olympics$.pipe(
      tap(
          (olympics:Olympic[]) => {
            this.olympicsDatas$ = olympics;
            
            olympics.map(
              (olympic:Olympic) => { 

                this.olympicsIds$.push({
                  id: olympic.id, 
                  country: olympic.country
                }); 

                this.olympicsCountries$.push(olympic.country);

                olympic.participations.map(
                  (participation: Participation) => {
        
                    this.totalMedals$ += participation.medalsCount;     
                  }
                )
        
                olympic.participations.slice(olympic.participations.length -1).map( 

                  (participation: Participation) => {
        
                    this.allMedalsValues$.push(this.totalMedals$);
                  }
                )
                this.resetTotalMedals();
              }
            )   
          }
      ),
    ).subscribe();
  }

  /***** METHODES : *****/
  public resetTotalMedals() {

    this.totalMedals$ = 0;
  }

  public getOlympicDetail(country:string): void {
    
    this.olympicSelected$ = this.olympicsDatas$.find(
      (olympic: Olympic) => olympic.country === country
    )

    if (this.olympicSelected$ != undefined) {
      
      this.router.navigateByUrl(`detail/${this.olympicSelected$?.id}`);
    }
  }

}
