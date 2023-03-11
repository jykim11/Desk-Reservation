import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mergeMap, Observable, of, shareReplay } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

export enum Role {
  STUDENT = 0,
  STAFF = 1,
  FACULTY = 2,
  ADMIN = 3
}

export interface Profile {
  id: number | null;
  pid: number;
  onyen: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  pronouns: string | null;
  registered: boolean;
  role: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public profile$: Observable<Profile | undefined>;

  constructor(protected http: HttpClient, protected auth: AuthenticationService) {
    this.profile$ = this.auth.isAuthenticated$.pipe(
      mergeMap(isAuthenticated => {
        if (isAuthenticated) {
          return this.http.get<Profile>('/api/profile');
        } else {
          return of(undefined);
        }
      }),
      shareReplay(1)
    );
  }

  put(profile: Profile) {
    return this.http.put<Profile>("/api/profile", profile);
  }

}