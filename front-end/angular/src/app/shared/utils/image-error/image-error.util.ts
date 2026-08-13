export const handleImageError = (event: Event): void => {
  const image = event.target as HTMLImageElement;

  image.src = '/images/placeholder.png';
  image.className = 'product__image--error';
};
