import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly httpClient = inject(HttpClient);

  public getRoles(): Observable<string[]> {
    return this.httpClient.get<string[]>('/api/roles');
  }
}
