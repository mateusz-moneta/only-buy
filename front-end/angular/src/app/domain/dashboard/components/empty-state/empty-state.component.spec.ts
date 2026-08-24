import { TranslocoTestingModule } from '@jsverse/transloco';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { EmptyStateComponent } from './empty-state.component';

describe(EmptyStateComponent.name, () => {
  const createComponent = createComponentFactory({
    component: EmptyStateComponent,
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

  let spectator: Spectator<EmptyStateComponent>;

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
