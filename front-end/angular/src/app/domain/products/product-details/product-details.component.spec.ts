import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { ProductDetailsComponent } from './product-details.component';

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
