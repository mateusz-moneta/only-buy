import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsComponent } from './product-details.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { FilesUploaderComponent } from '../../../shared/components';
import { beforeEach, expect, it } from 'vitest';

describe(ProductDetailsComponent.name, () => {
  const createComponent = createComponentFactory({
    component: ProductDetailsComponent,
  });

  let spectator: Spectator<ProductDetailsComponent>;

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
