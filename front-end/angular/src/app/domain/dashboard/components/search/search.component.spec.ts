import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, expect, it } from 'vitest';
import { SearchComponent } from './search.component';

describe(SearchComponent.name, () => {
  const createComponent = createComponentFactory({
    component: SearchComponent,
  });

  let spectator: Spectator<SearchComponent>;

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
