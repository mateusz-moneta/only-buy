import { SpinnerComponent } from './spinner.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';

describe(SpinnerComponent.name, () => {
  const createComponent = createComponentFactory({
    component: SpinnerComponent,
  });

  let spectator: Spectator<SpinnerComponent>;

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
