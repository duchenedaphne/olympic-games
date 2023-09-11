
import { Component, OnInit, ViewChild } from '@angular/core';
import { Olympic } from '../../models/Olympic';
import { Observable, take, tap } from 'rxjs';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { Participation } from '../../models/Participation';
import { BaseChartDirective } from 'ng2-charts';
import { OlympicService } from '../../services/olympic.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  public olympics$: Observable<Olympic[]> | undefined;
  public olympicsIds$: number[] = [];
  public olympicsCountries$: string[] = [];
  public allMedalsValues$: number[] = [];
  public totalMedals$: number = 0;
  
  public pieChartData!: ChartData;
  public pieChartType: ChartType = 'pie';
  public pieChartOptions!: ChartOptions;

  constructor(
    private olympicService: OlympicService
  ) { }
  
  ngOnInit(): void {

    this.olympics$ = this.olympicService.getOlympics();
    
    this.olympics$.pipe(
      take(2),
      tap(
        (olympics:Olympic[]) => {            
          olympics.map(
            (olympic:Olympic) => { 
              this.olympicsIds$.push(olympic.id); 
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
              this.totalMedals$ = 0;
            }
          )
          this.initChart();
          this.initChartOptions();
        }
      )
    ).subscribe();
  }

  public initChart():void {
    this.pieChartData = {    
      labels: this.olympicsCountries$,
      datasets: [
        {
          data: this.allMedalsValues$,
          label: 'Medals per country',
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
          hidden: false,
        }
      ]
    }
  }
  
  public initChartOptions(): void {
    this.pieChartOptions = {
      responsive: true,
      onClick: (event:any) => {
        const points = this.chart?.chart?.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

        if (points?.length) {
          const firstPoint = points[0];
          window.open(`detail/${this.olympicsIds$[firstPoint.index]}`, '_self');
        }
      } 
    }
  }

}
