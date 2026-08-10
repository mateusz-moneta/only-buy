import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { ButtonComponent } from './button.component';

describe(ButtonComponent.name, () => {
  const createComponent = createComponentFactory({
    component: ButtonComponent,
  });

  let spectator: Spectator<ButtonComponent>;

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
