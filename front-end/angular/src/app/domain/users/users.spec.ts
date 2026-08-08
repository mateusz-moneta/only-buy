import { Users } from './users';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';

describe(Users.name, () => {
  const createComponent = createComponentFactory({
    component: Users,
  });

  let spectator: Spectator<Users>;

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
