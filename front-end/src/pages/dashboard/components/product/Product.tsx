import React, { useState } from 'react';

import { Product as ProductModel } from '../../../../models';
import { Rates } from '../rates';

import './Product.scss';

export const Product = ({
  product: { description, productsImages, isPromo, name, rate },
  index
}: {
  product: ProductModel;
  index: number;
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [confirmedRating, setConfirmedRating] = useState(rate || 0);

  const selectRates = (rating: number) => {
    setConfirmedRating(rating);
    console.log(rating);
  };

  const showDetails = () => {
    return;
  };

  return (
    <div className="product">
      <div className="product__image">
        {isPromo && <div className="product__promo">Promo</div>}

        <img
          alt=""
          className="w-100"
          src={`http://localhost:5000${productsImages[imageIndex].path}`}
        />
      </div>

      <div className="product__content">
        <h4>{name}</h4>
        <p>{description.length > 100 ? description.slice(0, 150) + '...' : description}</p>

        <Rates confirmedRating={confirmedRating} selectRates={selectRates} />

        <button onClick={() => showDetails()} type="button">
          Show details
        </button>
      </div>
    </div>
  );
};

export default Product;
