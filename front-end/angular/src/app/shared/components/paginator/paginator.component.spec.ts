import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { PaginatorComponent } from './paginator.component';

describe(PaginatorComponent.name, () => {
  const createComponent = createComponentFactory({
    component: PaginatorComponent,
  });

  let spectator: Spectator<PaginatorComponent>;

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
