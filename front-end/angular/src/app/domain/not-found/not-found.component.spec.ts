import { NotFoundComponent } from './not-found.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';

describe(NotFoundComponent.name, () => {
  const createComponent = createComponentFactory({
    component: NotFoundComponent,
  });

  let spectator: Spectator<NotFoundComponent>;

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
