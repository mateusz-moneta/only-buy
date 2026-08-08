import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, RefreshTokenRequest, RegisterRequest } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  public login(payload: LoginRequest): Observable<string> {
    return this.httpClient.post<string>('/api/auth/login', payload);
  }

  public refreshToken(payload: RefreshTokenRequest): Observable<string> {
    return this.httpClient.post<string>('/api/auth/register', payload);
  }

  public register(payload: RegisterRequest): Observable<string> {
    return this.httpClient.post<string>('/api/auth/register', payload);
  }
}
