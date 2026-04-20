import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { ArtistApiService, AlbumListItem, ArtistDetail } from '../artist-search/artist-api.service';

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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly artistApiService: ArtistApiService
  ) {}

  ngOnInit(): void {
    this.artistDetail$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((id) => this.artistApiService.getArtistById(String(id))),
      map((response) => response.data)
    );
  }
}
