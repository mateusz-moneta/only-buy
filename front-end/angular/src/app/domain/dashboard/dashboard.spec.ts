import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { FilesUploader } from '../../shared/components';
import { beforeEach, expect, it } from 'vitest';

describe(Dashboard.name, () => {
  const createComponent = createComponentFactory({
    component: Dashboard,
  });

  let spectator: Spectator<Dashboard>;

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
