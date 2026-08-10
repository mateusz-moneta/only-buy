import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { RegisterComponent } from './register.component';

describe(RegisterComponent.name, () => {
  const createComponent = createComponentFactory({
    component: RegisterComponent,
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
