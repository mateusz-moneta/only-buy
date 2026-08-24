import { TranslocoTestingModule } from '@jsverse/transloco';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { AvatarComponent } from './avatar.component';

describe(AvatarComponent.name, () => {
  const createComponent = createComponentFactory({
    component: AvatarComponent,
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

  let spectator: Spectator<AvatarComponent>;

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
