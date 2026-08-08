import { EditProduct } from './edit-product';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';

describe(EditProduct.name, () => {
  const createComponent = createComponentFactory({
    component: EditProduct,
  });

  let spectator: Spectator<EditProduct>;

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
