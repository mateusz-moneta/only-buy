import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly httpClient = inject(HttpClient);

  public getRoles(): Observable<string[]> {
    return this.httpClient.get<string[]>('/api/roles');
  }
}
