import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Song } from '../models/song.interface';
import { Submission } from '../models/submission.interface';
import { UserBadges } from '../models/user-badges.interface';

interface ApiResponse<T> {
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Songs
  getAllSongs(): Observable<Song[]> {
    return this.http.get<ApiResponse<Song[]>>(`${this.baseUrl}/songs`).pipe(
      map(response => response.data)
    );
  }

  getSong(id: string): Observable<Song> {
    return this.http.get<ApiResponse<Song>>(`${this.baseUrl}/songs?id=${id}`)
      .pipe(map(response => response.data));
  }

  // Submissions
  getAllSubmissions(): Observable<Submission[]> {
    return this.http.get<ApiResponse<Submission[]>>(`${this.baseUrl}/submissions`).pipe(
      map(response => response.data)
    );
  }

  getSubmissionsBySong(songId: string): Observable<Submission[]> {
    return this.http.get<ApiResponse<Submission[]>>(`${this.baseUrl}/submissions?songId=${songId}`)
      .pipe(map(response => response.data));
  }

  getSubmissionsByContributor(contributor: string): Observable<Submission[]> {
    return this.http.get<ApiResponse<Submission[]>>(`${this.baseUrl}/submissions?contributor=${contributor}`)
      .pipe(map(response => response.data));
  }

  getSpecificSubmission(songId: string, contributor: string): Observable<Submission> {
    return this.http.get<ApiResponse<Submission>>(
      `${this.baseUrl}/submissions?songId=${songId}&contributor=${contributor}`
    ).pipe(map(response => response.data));
  }

  createOrUpdateSubmission(submission: {
    songId: number;
    username: string;
    url: string;
    firstSub?: boolean;
    songWikiUpdated?: boolean;
    userWikiUpdated?: boolean;
  }): Observable<Submission> {
    return this.http.post<ApiResponse<Submission>>(`${this.baseUrl}/submissions`, submission)
      .pipe(map(response => response.data));
  }

  deleteSubmission(songId: string, contributor: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/submissions?songId=${songId}&contributor=${contributor}`
    );
  }

  // Users
  getAllUsers(): Observable<Record<string, UserBadges>> {
    return this.http.get<ApiResponse<Record<string, UserBadges>>>(`${this.baseUrl}/users`)
      .pipe(map(response => response.data));
  }

  getUser(username: string): Observable<UserBadges> {
    return this.http.get<ApiResponse<UserBadges>>(`${this.baseUrl}/users?username=${username}`)
      .pipe(map(response => response.data));
  }

  updateUser(username: string, badges: UserBadges): Observable<UserBadges> {
    return this.http.post<ApiResponse<UserBadges>>(`${this.baseUrl}/users`, {
      username,
      ...badges
    }).pipe(map(response => response.data));
  }

  deleteUser(username: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users?username=${username}`);
  }
}