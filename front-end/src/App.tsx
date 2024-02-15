import React, { lazy, useCallback, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import { User } from './models';
import { UserContext } from './contexts';
import { SecureRoute } from './SecureRoute';

const Dashboard = lazy(() => import('./pages/dashboard/containers/Dashboard'));
const Login = lazy(() => import('./pages/login/containers/Login'));
const NotFound = lazy(() => import('./pages/not-found/NotFound'));
const ProductsCreator = lazy(() => import('./pages/products-creator/containers/ProductsCreator'));
const Register = lazy(() => import('./pages/register/containers/Register'));

function getInitialState(): User | null {
  const user = localStorage.getItem('user');

  return user ? JSON.parse(user) : null;
}

function App() {
  const [user, setUser] = useState<User | null>(getInitialState());

  const login = useCallback((user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const replaceAccessToken = useCallback((accessToken: string) => {
    if (user) {
      const updatedUser: User = {
        ...user,
        accessToken
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }, []);

  const userContextValue = useMemo(
    () => ({
      user,
      login,
      logout,
      replaceAccessToken
    }),
    [user, login, logout, replaceAccessToken]
  );

  return (
    <BrowserRouter>
      <UserContext.Provider value={userContextValue}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <SecureRoute>
                  <Dashboard />
                </SecureRoute>
              }
            />
            <Route
              path="products-creator"
              element={
                <SecureRoute>
                  <ProductsCreator />
                </SecureRoute>
              }
            />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
