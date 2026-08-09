import { NewProductComponent } from './new-product.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';

describe(NewProductComponent.name, () => {
  const createComponent = createComponentFactory({
    component: NewProductComponent,
  });

  let spectator: Spectator<NewProductComponent>;

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
