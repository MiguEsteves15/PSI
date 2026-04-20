import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { AlbumListItem, ArtistApiService, ArtistDetail } from '../artist-search/artist-api.service';

interface ArtistAlbumsViewModel {
  artist: ArtistDetail;
  albums: AlbumListItem[];
}

@Component({
  selector: 'app-artist-albums',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artist-albums.component.html',
  styleUrl: './artist-albums.component.css'
})
export class ArtistAlbumsComponent implements OnInit {
  artistAlbums$!: Observable<ArtistAlbumsViewModel>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly artistApiService: ArtistApiService
  ) {}

  ngOnInit(): void {
    this.artistAlbums$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((id) => this.artistApiService.getArtistAlbums(String(id))),
      map((response) => response.data)
    );
  }
}
