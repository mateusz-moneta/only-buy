import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private readonly cookieService = inject(CookieService);

  private readonly refreshTokenKey = 'refreshToken';

  public setRefreshToken(token: string): void {
    this.cookieService.set(this.refreshTokenKey, token, {
      path: '/',
      sameSite: 'Lax',
      secure: false,
    });
  }

  public getRefreshToken(): string {
    return this.cookieService.get(this.refreshTokenKey);
  }

  public hasRefreshToken(): boolean {
    return this.cookieService.check(this.refreshTokenKey);
  }

  public removeRefreshToken(): void {
    this.cookieService.delete(this.refreshTokenKey, '/');
  }
}
