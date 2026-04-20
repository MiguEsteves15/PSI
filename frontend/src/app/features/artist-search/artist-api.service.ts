import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ArtistListItem {
  _id: string;
  nome: string;
  isni: string;
}

interface ArtistSearchResponse {
  success: boolean;
  data: ArtistListItem[];
}

export interface ArtistDetail {
  _id: string;
  nome: string;
  isni: string;
  anoInicioAtividade: number;
  tipoArtista: string;
}

export interface AlbumListItem {
  _id: string;
  titulo: string;
  anoLancamento: number;
  tipo: string;
  imagemCapa?: string;
  artista?: {
    nome: string;
  } | null;
}

interface ArtistDetailResponse {
  success: boolean;
  data: {
    artist: ArtistDetail;
    recentAlbums: AlbumListItem[];
    totalAlbums: number;
  };
}

interface ArtistAlbumsResponse {
  success: boolean;
  data: {
    artist: ArtistDetail;
    albums: AlbumListItem[];
  };
}

@Injectable({ providedIn: 'root' })
export class ArtistApiService {
  private readonly baseUrl = 'http://localhost:3000/api/artists';

  constructor(private readonly http: HttpClient) {}

  searchArtists(query: string): Observable<ArtistSearchResponse> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ArtistSearchResponse>(`${this.baseUrl}/search`, { params });
  }

  getArtistById(id: string): Observable<ArtistDetailResponse> {
    return this.http.get<ArtistDetailResponse>(`${this.baseUrl}/${id}`);
  }

  getArtistAlbums(id: string): Observable<ArtistAlbumsResponse> {
    return this.http.get<ArtistAlbumsResponse>(`${this.baseUrl}/${id}/albums`);
  }
}
