import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { CheckboxComponent } from './checkbox.component';

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
