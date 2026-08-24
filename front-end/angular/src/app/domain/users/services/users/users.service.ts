import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DEFAULT_PAGE } from '@core/constants';
import { Page } from '@core/models';
import { UpdateActive, User } from '../../models';

@Injectable()
export class UsersService {
  private readonly httpClient = inject(HttpClient);

  private readonly basePath = '/api/users';

  public getUsers(page = DEFAULT_PAGE): Observable<Page<User>> {
    const params = new HttpParams().append('page', page);

    return this.httpClient.get<Page<User>>(this.basePath, { params });
  }

  public updateUserActive({ active, id }: UpdateActive): Observable<User> {
    return this.httpClient.patch<User>(`${this.basePath}/${id}`, {
      active,
    });
  }
}
