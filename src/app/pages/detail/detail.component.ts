
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  
  /***** VARIABLES : *****/
  public olympics$: Observable<Olympic[]> | undefined;

  public olympicOne$!: Observable<Olympic | undefined>;
  
  public olympic$!: Olympic | undefined;
  public olympicId$!:number;

  public olympicCountry$:string | undefined;

  public participationsYears$: number[] = [];

  public totalMedals$: number = 0;
  public totalEntries$: number | undefined;
  public totalAthlete$: number = 0;

  /***** CONSTRUCTEUR : *****/
  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
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
              this.totalMedals$ += participation.medalsCount;
              this.totalAthlete$ += participation.athleteCount;
            }
          )
        }
      )
    ).subscribe();
  }

  /***** METHODES : *****/
  public resetTotals(): void {
    this.totalMedals$ = 0;
    this.totalEntries$ = 0;
    this.totalAthlete$ = 0;
  }

  public goBack(): void {
    this.router.navigateByUrl('');
  }

}
