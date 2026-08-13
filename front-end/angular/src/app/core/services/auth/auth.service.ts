import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Login,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  UserData,
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  private readonly basePath = '/api/auth';

  public login(payload: LoginRequest): Observable<Login> {
    return this.httpClient.post<Login>(`${this.basePath}/login`, payload);
  }

  public refreshToken(payload: RefreshTokenRequest): Observable<UserData> {
    return this.httpClient.post<UserData>(`${this.basePath}/refresh`, payload);
  }

  public register(payload: RegisterRequest): Observable<boolean> {
    const formData = new FormData();

    formData.append('email', payload.email);
    formData.append('password', payload.password);
    formData.append('username', payload.username);

    if (payload.avatar) {
      formData.append('avatar', payload.avatar);
    }

    return this.httpClient.post<boolean>(`${this.basePath}/register`, formData);
  }
}
