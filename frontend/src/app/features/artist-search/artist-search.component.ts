import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, Subscription, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ArtistApiService, ArtistListItem } from './artist-api.service';

@Component({
  selector: 'app-artist-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './artist-search.component.html',
  styleUrl: './artist-search.component.css'
})
export class ArtistSearchComponent implements OnDestroy {
  query = '';
  artists: ArtistListItem[] = [];
  isLoading = false;
  errorMessage = '';
  hasSearched = false;

  private readonly queryChanges$ = new Subject<string>();
  private readonly subscription: Subscription;

  constructor(
    private readonly artistApiService: ArtistApiService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.subscription = this.queryChanges$
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.errorMessage = '';
          this.isLoading = true;
        }),
        switchMap((searchQuery) =>
          this.artistApiService.searchArtists(searchQuery).pipe(
            catchError((error) => {
              const message = error?.error?.message || 'Nao foi possivel pesquisar artistas.';
              this.errorMessage = message;
              return of({ success: false, data: [] as ArtistListItem[] });
            })
          )
        )
      )
      .subscribe((response) => {
        this.artists = response.data ?? [];
        this.isLoading = false;
        this.hasSearched = true;
        this.cdr.detectChanges();
      });
  }

  onSearchChange(value: string): void {
    const trimmedValue = value.trim();

    this.query = value;

    if (!trimmedValue) {
      this.artists = [];
      this.errorMessage = '';
      this.isLoading = false;
      this.hasSearched = false;
      return;
    }

    this.queryChanges$.next(trimmedValue);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
