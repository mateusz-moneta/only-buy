import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { InputComponent } from './input.component';

describe(InputComponent.name, () => {
  const createComponent = createComponentFactory({
    component: InputComponent,
  });

  let spectator: Spectator<InputComponent>;

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
