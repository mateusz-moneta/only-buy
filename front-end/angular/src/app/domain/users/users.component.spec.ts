import { signal } from '@angular/core';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { UsersStore } from './state';
import { UsersComponent } from './users.component';

describe(UsersComponent.name, () => {
  const createComponent = createComponentFactory({
    component: UsersComponent,
    componentProviders: [
      {
        provide: UsersStore,
        useValue: {
          isLoading: signal(false),
          pageable: signal({
            page: 1,
            size: 20,
          }),
          totalPages: signal(0),
          users: signal([]),
          loadUsers: vi.fn(),
          updateUserActive: vi.fn(),
        },
      },
    ],
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
  });

  let spectator: Spectator<UsersComponent>;

  beforeEach(() => {
    vi.clearAllMocks();

    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should match snapshot', () => {
    expect(spectator.element.innerHTML).toMatchSnapshot();
  });
});
