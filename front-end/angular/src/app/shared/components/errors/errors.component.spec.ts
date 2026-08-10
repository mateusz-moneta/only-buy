import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { ErrorsComponent } from './errors.component';

describe(ErrorsComponent.name, () => {
  const createComponent = createComponentFactory({
    component: ErrorsComponent,
  });

  let spectator: Spectator<ErrorsComponent>;

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
