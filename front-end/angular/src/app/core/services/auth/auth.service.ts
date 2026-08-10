import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Login,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from '../../models';
import { UserData } from '../../models/user-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  public login(payload: LoginRequest): Observable<Login> {
    return this.httpClient.post<Login>('/api/auth/login', payload);
  }

  public refreshToken(payload: RefreshTokenRequest): Observable<UserData> {
    return this.httpClient.post<UserData>('/api/auth/refresh-token', payload);
  }

  public register(payload: RegisterRequest): Observable<string> {
    return this.httpClient.post<string>('/api/auth/register', payload);
  }
}
