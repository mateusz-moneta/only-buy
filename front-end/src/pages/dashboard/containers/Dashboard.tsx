import React, { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Dispatch } from 'redux';

import { Checkbox, Search } from '../../../components';
import { EmptyProducts, Product } from '../components';
import {
  changePhrase,
  selectActive,
  selectProducts,
  selectPromo,
  toggleActive,
  togglePromo
} from '../../../state';
import { Product as ProductModel, User } from '../../../models';

import './Dashboard.scss';

const Dashboard = ({ user }: { user: User | null }) => {
  /* if (!user) {
    return <Navigate to="/login" replace />;
  } */

  const active = useSelector(selectActive);
  const products = useSelector(selectProducts);
  const promo = useSelector(selectPromo);

  const dispatch: Dispatch = useDispatch();

  return (
    <div className="container-fluid d-flex flex-column">
      <header className="row">
        <div className="col-md-3 col-sm-6 col-12 d-flex align-items-center offset-md-1">
          <Search
            change={({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
              dispatch(
                changePhrase({
                  phrase: value
                })
              )
            }
            name="search"
            placeholder="Search"
          />
        </div>

        <div className="col-md-3 col-sm-4 col-6 d-flex offset-md-1">
          <Checkbox
            change={() => dispatch(toggleActive())}
            checked={active}
            label="Active"
            name="active"
          />

          <Checkbox
            change={() => dispatch(togglePromo())}
            checked={promo}
            label="Promo"
            name="promo"
          />
        </div>
      </header>

      {products.length ? (
        <div className="row">
          {products.map((product: ProductModel) => (
            <div className="col-md-4 col-sm-6 col-12" key={product.productId}>
              <Product product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="align-items-center d-flex flex-grow-1 justify-content-center row">
          <EmptyProducts />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
