import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { UsersComponent } from './users.component';

describe(UsersComponent.name, () => {
  const createComponent = createComponentFactory({
    component: UsersComponent,
  });

  let spectator: Spectator<UsersComponent>;

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
