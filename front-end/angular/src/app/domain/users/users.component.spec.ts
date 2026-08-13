import { signal } from '@angular/core';
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
          users: signal([]),
          loadUsers: vi.fn(),
          updateUserActive: vi.fn(),
        },
      },
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
