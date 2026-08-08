import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetails } from './product-details';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { FilesUploader } from '../../../shared/components';
import { beforeEach, expect, it } from 'vitest';

describe(ProductDetails.name, () => {
  const createComponent = createComponentFactory({
    component: ProductDetails,
  });

  let spectator: Spectator<ProductDetails>;

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
