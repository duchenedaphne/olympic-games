
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  public olympicOne$!: Observable<Olympic | undefined>;
  public olympicId!:number;
  public olympicCountry:string | undefined;
  public totalMedals: number = 0;
  public totalEntries: number | undefined;
  public totalAthlete: number = 0;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  
  ngOnInit(): void {

    this.olympicId = +this.route.snapshot.params['id'];
    this.olympicOne$ = this.olympicService.getOneOlympic(this.olympicId);

    this.olympicOne$.pipe(
      take(2),
      tap(
        (olympic: Olympic | undefined) => {
          this.olympicCountry = olympic?.country;
          this.totalEntries = olympic?.participations.length;
          
          olympic?.participations.map(
            (participation: Participation) => {
              this.totalMedals += participation.medalsCount;
              this.totalAthlete += participation.athleteCount;
            }
          )
        }
      )
    ).subscribe();
  }

  public goBack(): void {
    this.router.navigateByUrl('');
  }

}
