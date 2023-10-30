import React, { lazy } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './Layout';

import { selectAuth } from './state';

const Dashboard = lazy(() => import('./pages/dashboard/containers/Dashboard'));
const Login = lazy(() => import('./pages/login/containers/Login'));
const NotFound = lazy(() => import('./pages/not-found/NotFound'));
const ProductsCreator = lazy(() => import('./pages/products-creator/containers/ProductsCreator'));
const Register = lazy(() => import('./pages/register/containers/Register'));

function App() {
  const { user } = useSelector(selectAuth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard user={user} />} />
          <Route path="login" element={<Login />} />
          <Route path="products-creator" element={<ProductsCreator />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
