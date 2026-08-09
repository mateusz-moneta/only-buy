import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { FilesUploaderComponent } from '../../shared/components';
import { beforeEach, expect, it } from 'vitest';

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
