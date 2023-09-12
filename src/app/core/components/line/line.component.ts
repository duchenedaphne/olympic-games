
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { Observable, take, tap } from 'rxjs';
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

  public olympicOne$!: Observable<Olympic | undefined>;
  public olympicId!:number;
  public participationsYears: number[] = [];
  public allMedalsValues: number[] = [];
  public allAthleteValues: number[] = [];
  
  public lineChartData!: ChartData;  
  public lineChartType: ChartType = 'line';
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  
  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    
    this.olympicId = +this.route.snapshot.params['id'];
    this.olympicOne$ = this.olympicService.getOneOlympic(this.olympicId);

    this.olympicOne$?.pipe(
      take(2),
      tap(        
        (olympic: Olympic | undefined) => {
          olympic?.participations.map(
            (participation: Participation) => {

              this.participationsYears.push(participation.year);
              this.allMedalsValues.push(participation.medalsCount);
              this.allAthleteValues.push(participation.athleteCount);
            }
          )
          this.initChart();
        }
      )
    ).subscribe();
  }

  public initChart(): void {
    this.lineChartData = {
      labels: this.participationsYears,
      datasets: [
        {
          data: this.allMedalsValues,
          label: 'Medals',
          backgroundColor: 'rgba(4,131,143,0.3)',
          borderColor: 'rgb(4,131,143)',
          hidden: false
        },
        {
          data: this.allAthleteValues,
          label: 'Athletes',
          backgroundColor: 'rgba(184,203,231,0.3)', 
          borderColor: 'rgba(184,203,231,1)',
          hidden: false
        }
      ]
    }
  }
}
