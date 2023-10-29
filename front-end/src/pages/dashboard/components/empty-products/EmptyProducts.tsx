import React from 'react';

import './EmptyProducts.scss';

export const EmptyProducts = () => (
  <div className="align-items-center d-flex empty-products flex-column justify-content-center">
    <img src="/icons/task-list.svg" alt="List of tasks" />

    <p className="empty-products__title">Ooops… It’s empty here</p>
    <p className="empty-products__description">There are no products on the list</p>
  </div>
);

export default EmptyProducts;
