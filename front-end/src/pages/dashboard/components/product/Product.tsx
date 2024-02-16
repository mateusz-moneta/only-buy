import React, { startTransition, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { apiUrl } from '../../../../api';
import { Product as ProductModel, Rate } from '../../../../models';
import { Rates } from '../rates';
import { request } from '../../../../utils';
import { UserContext } from '../../../../contexts';

import './Product.scss';

const calculateAverageRating = (rates: Rate[]) => {
  if (!rates.length) {
    return 0;
  }

  const sum = rates.reduce((acc, rate) => acc + rate.rating, 0);
  const average = sum / rates.length;

  return average;
};

export const Product = ({
  product: { id, description, images, isPromo, name, rates },
  index
}: {
  product: ProductModel;
  index: number;
}) => {
  const navigate = useNavigate();

  const userContext = useContext(UserContext);

  const [imageIndex, setImageIndex] = useState(0);
  const [confirmedRating, setConfirmedRating] = useState(calculateAverageRating(rates) || 0);

  const selectRates = (rating: number) => {
    if (rating === confirmedRating) {
      return;
    }

    request(
      `${apiUrl}/products/rate`,
      {
        productId: id,
        rating
      },
      {
        method: confirmedRating > 0 ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Bearer ${userContext.user?.accessToken}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      },
      userContext
    )
      .then((response) => response.text())
      .then(() => setConfirmedRating(rating));
  };

  const showDetails = () => startTransition(() => navigate(`/product/${id}`));

  return (
    <div className="product">
      <div className="product__image">
        {isPromo && <div className="product__promo">Promo</div>}

        <img alt="" className="w-100" src={`http://localhost:5000${images[imageIndex].path}`} />
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
