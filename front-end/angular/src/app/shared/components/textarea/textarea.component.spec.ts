import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { TextareaComponent } from './textarea.component';

describe(TextareaComponent.name, () => {
  const createComponent = createComponentFactory({
    component: TextareaComponent,
  });

  let spectator: Spectator<TextareaComponent>;

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
