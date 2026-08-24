import { ActivatedRoute } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { EMPTY, of } from 'rxjs';
import { Product } from '@core/models';
import { ProductsService } from '@core/services';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { ProductDetailsComponent } from './product-details.component';

describe(ProductDetailsComponent.name, () => {
  const createComponent = createComponentFactory({
    component: ProductDetailsComponent,
    imports: [
      TranslocoTestingModule.forRoot({
        langs: {
          en: {},
          pl: {},
        },
        translocoConfig: {
          availableLangs: ['en', 'pl'],
          defaultLang: 'en',
        },
      }),
    ],
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
              details: '<p>Details</p>',
              price: 1000.0,
              code: 'TS',
              isActive: true,
              isPromo: true,
              images: [],
              averageRating: 4,
              rating: 4,
              ratingCount: 1,
              createdDate: new Date().toString(),
              updatedDate: new Date().toString(),
            } as Product)
          ),
        },
      },
    ],
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
