import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly apiUrl = 'http://localhost:3000/api/users/me';

    constructor(private readonly http: HttpClient) { }

    // US3
    getProfile(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    // US4
    updateUsername(newUsername: string, currentPassword: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/username`, { username: newUsername, currentPassword });
    }

    updateEmail(email: string, currentPassword: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/email`, { email, currentPassword });
    }

    updateBirthDate(dataNascimento: string, currentPassword: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/birth-date`, { dataNascimento, currentPassword });
    }

    // US4
    updatePassword(currentPassword: string, newPassword: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/password`, { currentPassword, newPassword });
    }

    // US7
    setFavoriteArtist(artistId: string, currentPassword: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/favorite-artist`, { artistId, currentPassword });
    }

    // US7
    removeFavoriteArtist(currentPassword: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/favorite-artist`, { body: { currentPassword } });
    }
}
