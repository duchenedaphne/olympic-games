
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  
  /***** VARIABLES : *****/
  public olympic$!: Observable<Olympic | undefined>;

  public olympic!: Olympic;

  public totalMedals$: number = 0;
  public totalEntries$: number = 0;
  public totalAthlete$: number = 0;

  /***** CONSTRUCTEUR : *****/
  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) { }

  /***** ON INIT : *****/
  ngOnInit(): void {
    
    const olympicId = +this.route.snapshot.params['id'];

    this.olympicService.getOlympics().pipe(
      take(1),
      map(
        (olympics: Olympic[]) => (

          olympics.find(
            (olympic: Olympic) => {

              olympic.id === olympicId;
              this.olympic = olympic;
            }
          )
        )
      )
    ).subscribe()
    console.log(this.olympic);
    
  }

  /***** METHODES : *****/
  getTotalMedals(medalsCount:number) {
    
    this.totalMedals$ += medalsCount;
  }

  getTotalEntries(entriesCount:number) {
    
    this.totalEntries$ += entriesCount;
  }

  getTotalAthlete(athleteCount:number) {
    
    this.totalAthlete$ += athleteCount;
  }

  resetTotals() {
    this.totalMedals$ = 0;
    this.totalEntries$ = 0;
    this.totalAthlete$ = 0;
  }

}
