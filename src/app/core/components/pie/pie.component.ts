
import { Component, OnInit } from '@angular/core';
import { Olympic } from '../../models/Olympic';
import { take, tap } from 'rxjs';
import { ChartOptions, ChartType } from 'chart.js';
import { OlympicService } from '../../services/olympic.service';
import { Participation } from '../../models/Participation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {

  /***** VARIABLES : *****/  
  public olympicsDatas$: Olympic[] = [];

  public olympicsCountries$: string[] = [];
  
  public olympic$!: Olympic;
  
  public olympicsIds$: number[] = [];

  public allMedalsValues$: number[] = [];

  public totalMedals$: number = 0;

  /***** GRAPHIQUE : *****/
  public pieChartData = {
    
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
      }
    ]
  }

  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public pieChartOptions: ChartOptions = {
    responsive: true,
  }    

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
                
                this.olympicsCountries$.push(olympic.country);
                this.olympicsIds$.push(olympic.id); 
                this.olympicsDatas$.push(olympic);

                olympic.participations.map(
                  (participation: Participation) => {
        
                    this.getTotalMedals(participation.medalsCount)      
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

  public viewDetailByName() {

    const olympicId:number = 2;
    
    this.router.navigateByUrl(`detail/${olympicId}`);
  }

  public viewDetail(olympicId:number) {
    
    this.router.navigateByUrl(`detail/${olympicId}`);
  }

}
