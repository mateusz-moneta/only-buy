import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';

import { apiUrl } from '../../../api';
import { Avatar, EmptyProducts, Product } from '../components';
import { Checkbox, Search, Spinner } from '../../../components';
import { Product as ProductModel, RoleName } from '../../../models';
import { request } from '../../../utils';
import { UserContext } from '../../../contexts';

import './Dashboard.scss';

const Dashboard = () => {
  const userContext = useContext(UserContext);

  const shouldLoadProducts = useRef(true);

  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [products, setProducts] = useState([] as ProductModel[]);
  const [promo, setPromo] = useState(false);

  useEffect(() => {
    if (shouldLoadProducts.current) {
      shouldLoadProducts.current = false;
      loadProducts();
    }
  }, []);

  const logout = () => userContext.logout();

  const toggleActive = async () => {
    setActive(!active);
    loadProducts();
  };

  const togglePromo = () => {
    setPromo(!promo);
    loadProducts();
  };

  const changePhrase = (phrase: string) => {
    setPhrase(phrase);
    loadProducts();
  };

  const loadProducts = () => {
    setLoading(true);

    request(
      `${apiUrl}/products?active=${active}&phrase=${phrase}&promo=${promo}`,
      null,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userContext.user?.accessToken}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      },
      userContext
    )
      .then((response) => response.json())
      .then((products: ProductModel[]) => setProducts(products))
      .then(() => setTimeout(() => setLoading(false), 300))
      .catch(() => setTimeout(() => setLoading(false), 300));
  };

  return (
    <div className="container-fluid d-flex flex-column">
      <header className="row">
        <div className="col-md-3 col-sm-6 col-12 d-flex align-items-center offset-md-1">
          <Search
            change={({ target: { value: phrase } }: ChangeEvent<HTMLInputElement>) =>
              changePhrase(phrase)
            }
            name="search"
            placeholder="Search"
          />
        </div>

        <div className="col-md-3 col-sm-4 col-6 d-flex mt-2 offset-md-1">
          <Checkbox change={() => toggleActive()} checked={active} label="Active" name="active" />

          <Checkbox change={() => togglePromo()} checked={promo} label="Promo" name="promo" />
        </div>

        <div className="col-md-3 col-sm-2 col-6 d-flex align-items-center mt-2 offset-md-1">
          <Avatar logout={() => logout()} roleName={userContext.user?.role as RoleName} src={''} />
        </div>
      </header>

      {loading ? (
        <Spinner />
      ) : products.length ? (
        <div className="row mt-sm-4 mt-md-5">
          {products.map((product, index) => (
            <div className="col-md-4 col-sm-6 col-12" key={product.id}>
              <Product product={product} index={index} />
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
