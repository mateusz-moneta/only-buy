import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { beforeEach, describe, expect, it } from 'vitest';

import { FilesUploader } from './files-uploader';

describe(FilesUploader.name, () => {
  const createComponent = createComponentFactory({
    component: FilesUploader,
  });

  let spectator: Spectator<FilesUploader>;

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
