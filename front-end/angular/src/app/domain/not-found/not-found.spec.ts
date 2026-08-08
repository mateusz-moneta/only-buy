import { NotFound } from './not-found';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';

describe(NotFound.name, () => {
  const createComponent = createComponentFactory({
    component: NotFound,
  });

  let spectator: Spectator<NotFound>;

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
