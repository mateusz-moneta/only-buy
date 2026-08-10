import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { LoginComponent } from './login.component';

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
