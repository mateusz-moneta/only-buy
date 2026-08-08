import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly httpClient = inject(HttpClient);

  public getUsers(): Observable<string[]> {
    return this.httpClient.get<string[]>('/api/users');
  }
}
