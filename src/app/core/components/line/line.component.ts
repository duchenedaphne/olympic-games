
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartOptions, ChartType, Color } from 'chart.js';
import { take, tap } from 'rxjs';
import { Olympic } from '../../models/Olympic';
import { Participation } from '../../models/Participation';
import { OlympicService } from '../../services/olympic.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {

  /***** VARIABLES : *****/  
  public olympicsDatas$: Olympic[] = [];

  public olympicsCountries$: string[] = [];
  
  public olympic$!: Olympic;
  
  public olympicParticipationsYears$: number[] = [];

  public olympicsIds$: number[] = [];

  public allMedalsValues$: number[] = [];

  public totalMedals$: number = 0;

  /***** GRAPHIQUE : *****/
  public lineChartData = {
    labels: ["un","deux","trois","quatre","cinq"],
    // labels: this.olympicParticipationsYears$,
    datasets: [
      {
        data: [89,34,43,54,28],
        label: 'Sales Percent',
        // fill: true,
        backgroundColor: 'rgba(4,131,143,0.3)',
        borderColor: 'rgb(4,131,143)',
        // tension: 0.5
      }
    ]
  }
  /*
  public lineChartData = {
    datasets: [
      {
        data: [89,34,43,54,28,74], 
        label: 'Series A',
        backgroundColor: [
          'rgba(121,61,82,1)',
          'rgba(137,161,219,1)',
          'rgba(151,128,161,1)',
          'rgba(191,224,241,1)',
          'rgba(184,203,231,1)',
          'rgba(149,96,101,1)',
        ],
        // fill: true,
        borderColor: 'rgb(4,131,143)',
        // tension: 0.5
      }
    ]
  }
  
    public lineChartData: ChartDataSetsLine[] = [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    ];
  
    */
    // public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
    public lineChartOptions: ChartOptions = {
      responsive: true,
    };
  
    public lineChartColors: Color[] = [
      // {
      //   borderColor: 'black',
      //   backgroundColor: 'rgba(255,0,0,0.3)',
      // },
    ];
    public lineChartLegend = true;
    public lineChartType: ChartType = 'line';
    public lineChartPlugins = [];

  /***** CONSTRUCTEUR : *****/
  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) { }

  /***** ON INIT : *****/
  ngOnInit(): void {

    this.olympicService.getOlympics().pipe(
      take(1),
      tap(
          (olympics:Olympic[]) => {
            this.olympicsDatas$ = olympics;
            
            olympics.map(
              (olympic:Olympic) => { 

                this.olympic$ = olympic;
                
                this.olympicsCountries$.push(olympic.country);

                this.olympicsIds$.push(olympic.id); 

                this.olympicsDatas$.push(olympic);

                olympic.participations.map(
                  (participation: Participation) => {
        
                    // this.olympicParticipationsYears$.push(participation.year);

                    this.getTotalMedals(participation.medalsCount);   
                  }
                )
        
                olympic.participations.slice(olympic.participations.length -1).map( 

                  (participation: Participation) => {
        
                    this.getAllMedalsValues(this.totalMedals$)      
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
  public addCountryName(countryName: string): void {

    this.olympicsCountries$.push(countryName);
    console.log(this.olympicsCountries$);
  }

  public showCountriesName():void {

    console.log(this.olympicsCountries$);
  }

  public getTotalMedals(medalsCount: number) {

      this.totalMedals$ += medalsCount;         
  }

  public getAllMedalsValues(totalMedals: number): void {

    this.allMedalsValues$.push(totalMedals);
  }

  public resetTotalMedals() {

    this.totalMedals$ = 0;
  }

  public viewDetailByName(event:any) {
    
    // this.router.navigateByUrl(`detail/${olympicId}`);
  }

  public viewDetail(olympicId:number) {
    
    this.router.navigateByUrl(`detail/${olympicId}`);
  }

}
