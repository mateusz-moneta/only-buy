import { LoginComponent } from './login.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';

describe(LoginComponent.name, () => {
  const createComponent = createComponentFactory({
    component: LoginComponent,
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
