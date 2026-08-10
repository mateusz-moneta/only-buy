import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { EmptyStateComponent } from './empty-state.component';

describe(EmptyStateComponent.name, () => {
  const createComponent = createComponentFactory({
    component: EmptyStateComponent,
  });

  let spectator: Spectator<EmptyStateComponent>;

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
