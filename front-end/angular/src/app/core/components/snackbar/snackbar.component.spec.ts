import { SnackbarComponent } from './snackbar.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';

describe(SnackbarComponent.name, () => {
  const createComponent = createComponentFactory({
    component: SnackbarComponent,
  });

  let spectator: Spectator<SnackbarComponent>;

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
