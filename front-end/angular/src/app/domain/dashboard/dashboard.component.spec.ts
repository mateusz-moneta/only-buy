import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { DashboardComponent } from './dashboard.component';

describe(DashboardComponent.name, () => {
  const createComponent = createComponentFactory({
    component: DashboardComponent,
  });

  let spectator: Spectator<DashboardComponent>;

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
