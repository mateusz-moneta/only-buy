import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { EditProductComponent } from './edit-product.component';

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
