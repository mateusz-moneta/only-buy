import React, { startTransition, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import { apiUrl } from '../../../api';
import { Product as ProductModel } from '../../../models';
import { request } from '../../../utils';
import { UserContext } from '../../../contexts';
import { Spinner } from '../../../components';

import './Product.scss';

export const Product = () => {
  const { id } = useParams();

  const userContext = useContext(UserContext);

  const shouldLoadProduct = useRef(true);

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductModel | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (shouldLoadProduct.current) {
      shouldLoadProduct.current = false;
      loadProduct();
    }
  }, []);

  const goToDashboard = async () => {
    startTransition(() => {
      navigate('/');
    });
  };

  const loadProduct = () => {
    setLoading(true);

    request(
      `${apiUrl}/products/${id}`,
      null,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userContext.user?.accessToken}`
        }
      },
      userContext
    )
      .then((response) => response.json())
      .then((product: ProductModel) => setProduct(product))
      .then(() => setTimeout(() => setLoading(false), 300))
      .catch(() => setTimeout(() => setLoading(false), 300));
  };

  return (
    <div className="container">
      <div className="row">
        <header className="col-md-6 col-sm-8 col-12 offset-sm-2 offset-md-3 d-flex align-items-center">
          <button onClick={() => goToDashboard()} type="button">
            <img alt="Left arrow" src="/icons/left-arrow.svg" />
          </button>

          <h1>Details of product</h1>
        </header>
      </div>

      <div className="col-md-6 col-sm-8 col-12 offset-sm-2 offset-md-3 product__content">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <h1>{product?.name}</h1>

            <div>
              <h2>Code</h2>
              <p>{product?.code || 'Not assigned'}</p>
            </div>

            <div>
              <h2>Description</h2>
              <p>{product?.description}</p>
            </div>

            <div>
              <h2>Price</h2>
              <p>{product?.price} PLN</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Product;
