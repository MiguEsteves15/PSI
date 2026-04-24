import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ArtistApiService, ArtistListItem } from '../artist-search/artist-api.service';
import { Subject, Subscription, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string | null = null;
  searchQuery = '';
  searchResults: ArtistListItem[] = [];
  isSearching = false;
  searchError = '';
  showSearchResults = false;
  showProfileMenu = false;

  private readonly queryChanges$ = new Subject<string>();
  private readonly subscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private artistApiService: ArtistApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.subscription = this.queryChanges$
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.searchError = '';
          this.isSearching = true;
          this.cdr.detectChanges();
        }),
        switchMap((query) =>
          this.artistApiService.searchArtists(query).pipe(
            catchError((error) => {
              const message = error?.error?.message || 'Nao foi possivel pesquisar artistas.';
              this.searchError = message;
              return of({ success: false, data: [] as ArtistListItem[] });
            })
          )
        )
      )
      .subscribe((response) => {
        this.searchResults = response.data ?? [];
        this.isSearching = false;
        this.cdr.detectChanges();
      });
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
  }

  onSearchChange(value: string): void {
    const trimmedValue = value.trim();
    this.searchQuery = value;
    this.showSearchResults = true;

    if (!trimmedValue) {
      this.searchResults = [];
      this.searchError = '';
      this.isSearching = false;
      this.showSearchResults = false;
      return;
    }

    this.queryChanges$.next(trimmedValue);
  }

  onNavigateToArtist(artistId: string): void {
    this.router.navigate(['/artists', artistId]);
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  onNavigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.showProfileMenu = false;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
