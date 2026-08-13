import { describe, expect, it } from 'vitest';
import { handleImageError } from './image-error.util';

describe(handleImageError.name, () => {
  it('should set placeholder image', () => {
    const image = document.createElement('img');
    const event = new Event('error');

    Object.defineProperty(event, 'target', {
      value: image,
    });

    handleImageError(event);

    expect(image.src).toContain('/images/placeholder.png');
  });

  it('should set error class', () => {
    const image = document.createElement('img');
    const event = new Event('error');

    Object.defineProperty(event, 'target', {
      value: image,
    });

    handleImageError(event);

    expect(image.className).toBe('product__image--error');
  });

  it('should set placeholder image and error class', () => {
    const image = document.createElement('img');
    const event = new Event('error');

    Object.defineProperty(event, 'target', {
      value: image,
    });

    handleImageError(event);

    expect(image.src).toContain('/images/placeholder.png');
    expect(image.className).toBe('product__image--error');
  });
});
