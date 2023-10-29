import React, { useState } from 'react';

import { Product as ProductModel } from '../../../../models';

export const Product = ({
  product: { description, images, isPromo, name }
}: {
  product: ProductModel;
}) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="product">
      <div className="product__image">
        {isPromo && <div className="product__promo">Promo</div>}

        <img alt={`Image of ${name}`} className="w-100" src={images[index]} />
      </div>

      <h4>{name}</h4>
      <p>{description}</p>

      <div>
        {Array.from(Array(5).keys()).map((value: number) => (
          <img
            className="dashboard__rate"
            data-rate={value + 1}
            key={value}
            role="button"
            src="/icons/star.svg'"
          />
        ))}
      </div>
    </div>
  );
};

export default Product;
