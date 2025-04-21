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

interface UserResponse {
  username: string;
  badge_one: boolean;
  badge_two: boolean;
  badge_three: boolean;
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
    id?: string | null;
    songId: number;
    username: string;
    url: string;
    firstSub?: boolean;
    songWikiUpdated?: boolean;
    userWikiUpdated?: boolean;
    isPublic?: boolean;
    isMulti?: boolean;
    isFeatured?: boolean;
    isDownscroll?: boolean;
    isAAAA?: boolean;
    isOddScroll?: boolean;
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
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.baseUrl}/users`)
      .pipe(map(response => response.data));
  }

  getUser(username: string): Observable<UserBadges | null> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.baseUrl}/users?username=${username}`)
      .pipe(
        map(response => {
          const user = response.data[0];
          if (!user) return null;
          return {
            badge_one: user.badge_one,
            badge_two: user.badge_two,
            badge_three: user.badge_three
          };
        })
      );
  }

  updateUser(username: string, badges: UserBadges): Observable<UserBadges> {
    const apiPayload = {
      username,
      badge_one: badges.badge_one ? 1 : 0,
      badge_two: badges.badge_two ? 1 : 0,
      badge_three: badges.badge_three ? 1 : 0
    };

    return this.http.post<ApiResponse<UserBadges>>(`${this.baseUrl}/users`, apiPayload)
      .pipe(
        map(response => ({
          badge_one: Boolean(response.data.badge_one),
          badge_two: Boolean(response.data.badge_two),
          badge_three: Boolean(response.data.badge_three)
        }))
      );
  }

  deleteUser(username: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users?username=${username}`);
  }
}