import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/dashboard/Dashboard';
import Layout from './Layout';
import Login from './pages/login/Login';
import NotFound from './pages/not-found/NotFound';
import Register from './pages/register/Register';

import { selectAuth } from './state';

function App() {
  const { user } = useSelector(selectAuth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard user={user} />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
