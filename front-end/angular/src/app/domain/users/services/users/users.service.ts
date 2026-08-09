import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models';

@Injectable()
export class UsersService {
  private readonly httpClient = inject(HttpClient);

  private readonly basePath = '/api/users';

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.basePath);
  }
}
