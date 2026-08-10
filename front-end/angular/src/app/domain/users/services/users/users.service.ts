import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateActive, User } from '../../models';

@Injectable()
export class UsersService {
  private readonly httpClient = inject(HttpClient);

  private readonly basePath = '/api/users';

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.basePath);
  }

  public updateUserActive({ active, id }: UpdateActive): Observable<User> {
    return this.httpClient.patch<User>(`${this.basePath}/${id}`, {
      active,
    });
  }
}
