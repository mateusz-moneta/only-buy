import { CheckboxComponent } from './checkbox.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';

describe(CheckboxComponent.name, () => {
  const createComponent = createComponentFactory({
    component: CheckboxComponent,
  });

  let spectator: Spectator<CheckboxComponent>;

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
