import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { AvatarComponent } from './avatar.component';

describe(AvatarComponent.name, () => {
  const createComponent = createComponentFactory({
    component: AvatarComponent,
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
