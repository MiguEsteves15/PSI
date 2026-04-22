import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:3000/api/users/me';

    constructor(private http: HttpClient) { }

    // US3
    getProfile(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    // US4
    updateUsername(newUsername: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/username`, { username: newUsername });
    }

    // US4
    updatePassword(currentPassword: string, newPassword: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/password`, { currentPassword, newPassword });
    }

    // US7
    setFavoriteArtist(artistId: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/favorite-artist`, { artistId });
    }

    // US7
    removeFavoriteArtist(): Observable<any> {
        return this.http.delete(`${this.apiUrl}/favorite-artist`);
    }
}
