import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { SpinnerComponent } from './spinner.component';

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
