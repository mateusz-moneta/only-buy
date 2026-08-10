import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { beforeEach, describe, expect, it } from 'vitest';
import { FilesUploaderComponent } from './files-uploader.component';

describe(FilesUploaderComponent.name, () => {
  const createComponent = createComponentFactory({
    component: FilesUploaderComponent,
  });

  let spectator: Spectator<FilesUploaderComponent>;

  beforeEach(() => {
    spectator = createComponent({
      props: {
        name: 'avatar',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should match snapshot', () => {
    expect(spectator.element.innerHTML).toMatchSnapshot();
  });
});
