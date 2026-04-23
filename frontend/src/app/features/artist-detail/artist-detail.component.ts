import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { ArtistApiService, AlbumListItem, ArtistDetail } from '../artist-search/artist-api.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

interface ArtistDetailViewModel {
  artist: ArtistDetail;
  recentAlbums: AlbumListItem[];
  totalAlbums: number;
}

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artist-detail.component.html',
  styleUrl: './artist-detail.component.css'
})
export class ArtistDetailComponent implements OnInit {
  artistDetail$!: Observable<ArtistDetailViewModel>;
  isAuthenticated = false;
  favoriteArtistId: string | null = null;
  favoriteActionLoading = false;
  favoriteErrorMessage = '';
  favoriteSuccessMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly artistApiService: ArtistApiService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();

    if (this.isAuthenticated) {
      this.loadFavoriteArtist();
    }

    this.artistDetail$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((id) => this.artistApiService.getArtistById(String(id))),
      map((response) => response.data)
    );
  }

  isCurrentArtistFavorite(artistId: string): boolean {
    return this.favoriteArtistId === artistId;
  }

  onFavoriteToggle(artistId: string): void {
    if (!this.isAuthenticated) {
      this.favoriteErrorMessage = '';
      this.favoriteSuccessMessage = '';
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.favoriteActionLoading = true;
    this.favoriteErrorMessage = '';
    this.favoriteSuccessMessage = '';

    const currentPassword = globalThis.prompt('Introduz a tua password para confirmar esta alteração:');
    if (!currentPassword) {
      this.favoriteActionLoading = false;
      this.favoriteErrorMessage = 'Operacao cancelada. A password e obrigatoria.';
      return;
    }

    const request$ = this.isCurrentArtistFavorite(artistId)
      ? this.userService.removeFavoriteArtist(currentPassword)
      : this.userService.setFavoriteArtist(artistId, currentPassword);

    request$.subscribe({
      next: (response) => {
        this.favoriteActionLoading = false;
        this.favoriteSuccessMessage =
          response?.message || 'Favorito atualizado com sucesso.';
        this.favoriteErrorMessage = '';

        if (this.isCurrentArtistFavorite(artistId)) {
          this.favoriteArtistId = null;
          return;
        }

        this.favoriteArtistId = artistId;
      },
      error: (error) => {
        this.favoriteActionLoading = false;
        this.favoriteSuccessMessage = '';
        this.favoriteErrorMessage =
          error?.error?.message || 'Nao foi possivel atualizar o artista favorito.';
      }
    });
  }

  private loadFavoriteArtist(): void {
    this.userService.getProfile().subscribe({
      next: (response) => {
        this.favoriteArtistId = response?.data?.user?.artistaFavorito?._id || null;
      },
      error: () => {
        this.favoriteArtistId = null;
      }
    });
  }
}
