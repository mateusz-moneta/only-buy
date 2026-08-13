import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/vitest';
import { describe, expect, it } from 'vitest';
import { SafeHtmlPipe } from './safe-html.pipe';

describe(SafeHtmlPipe.name, () => {
  let spectator: SpectatorPipe<SafeHtmlPipe>;

  const createPipe = createPipeFactory({
    pipe: SafeHtmlPipe,
  });

  it('should create', () => {
    spectator = createPipe('{{ value | safeHtml }}', {
      hostProps: {
        value: 'Hello',
      },
    });

    expect(spectator).toBeTruthy();
  });

  it('should return empty string for null value', () => {
    spectator = createPipe('{{ value | safeHtml }}', {
      hostProps: {
        value: null,
      },
    });

    expect(spectator.element).toHaveText('');
  });

  it('should return empty string for undefined value', () => {
    spectator = createPipe('{{ value | safeHtml }}', {
      hostProps: {
        value: undefined,
      },
    });

    expect(spectator.element).toHaveText('');
  });

  it('should return empty string for empty string', () => {
    spectator = createPipe('{{ value | safeHtml }}', {
      hostProps: {
        value: '',
      },
    });

    expect(spectator.element).toHaveText('');
  });
});
