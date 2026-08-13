import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { LoginComponent } from './login.component';

describe(LoginComponent.name, () => {
  const createComponent = createComponentFactory({
    component: LoginComponent,
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          params: EMPTY,
          queryParams: EMPTY,
          snapshot: {
            params: {},
            queryParams: {},
          },
        },
      },
    ],
  });

  let spectator: Spectator<LoginComponent>;

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should match snapshot', () => {
    expect(spectator.element.innerHTML).toMatchSnapshot();
  });
});
