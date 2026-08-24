import { TranslocoTestingModule } from '@jsverse/transloco';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { ProductComponent } from './product.component';

describe(ProductComponent.name, () => {
  const createComponent = createComponentFactory({
    component: ProductComponent,
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
  });

  let spectator: Spectator<ProductComponent>;

  beforeEach(() => {
    vi.clearAllMocks();

    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should match snapshot', () => {
    expect(spectator.element.innerHTML).toMatchSnapshot();
  });
});
