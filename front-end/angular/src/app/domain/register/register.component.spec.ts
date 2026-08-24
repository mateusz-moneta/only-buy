import { ActivatedRoute } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { EMPTY } from 'rxjs';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { RegisterComponent } from './register.component';

describe(RegisterComponent.name, () => {
  const createComponent = createComponentFactory({
    component: RegisterComponent,
    imports: [
      TranslocoTestingModule.forRoot({
        langs: {
          en: {},
          pl: {},
        },
        translocoConfig: {
          availableLangs: ['en', 'pl'],
          defaultLang: 'en',
        },
      }),
    ],
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

  let spectator: Spectator<RegisterComponent>;

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
