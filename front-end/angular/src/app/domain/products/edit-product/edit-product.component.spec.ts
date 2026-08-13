import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { Product, ProductImage } from '@core/models';
import { ProductsService } from '@core/services';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { UsersService } from '../../users/services';
import { EditProductComponent } from './edit-product.component';

describe(EditProductComponent.name, () => {
  const createComponent = createComponentFactory({
    component: EditProductComponent,
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          params: EMPTY,
          queryParams: EMPTY,
          snapshot: {
            params: {},
            queryParams: {},
          },
        },
      },
      {
        provide: ProductsService,
        useValue: {
          getProduct: vi.fn().mockReturnValue(
            of({
              id: '0000-0000-0000',
              name: 'Test Product',
              description: 'Description',
              price: 1000.0,
              code: 'TS',
              isActive: true,
              isPromo: true,
              images: [],
              averageRating: 4,
              rating: 4,
              createdDate: new Date().toString(),
              updatedDate: new Date().toString(),
            } as Product)
          ),
        },
      },
    ],
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
