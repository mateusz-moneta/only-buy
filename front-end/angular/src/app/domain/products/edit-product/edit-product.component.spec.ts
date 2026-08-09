import { EditProductComponent } from './edit-product.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';

describe(EditProductComponent.name, () => {
  const createComponent = createComponentFactory({
    component: EditProductComponent,
  });

  let spectator: Spectator<EditProductComponent>;

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
