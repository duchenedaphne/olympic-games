
import { Component, OnInit } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public olympics$: Observable<Olympic[]> | undefined;
  public josNumber$: number = 0;
  public olympicsLength$: number = 0;
  
  constructor(
    private olympicService: OlympicService
  ) {}
  
  ngOnInit(): void {
      
    this.olympics$ = this.olympicService.getOlympics();
      
    this.olympics$.pipe(
      take(2),
      tap(
        (olympics:Olympic[]) => {
          this.olympicsLength$ = olympics.length;

          olympics.map(
            (olympic:Olympic) => {
              this.josNumber$ += olympic.participations.length;
            }
          );
        }
      )
    ).subscribe(); 
  }
  
}
