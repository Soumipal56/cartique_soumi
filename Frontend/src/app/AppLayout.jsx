import React from 'react';
import { Outlet } from 'react-router';
import Nav from '../features/Shared/Components/Nav';
import CartToast from '../features/cart/components/CartToast';

const AppLayout = () => {
  return (
    <>
        <Nav />
        <Outlet />
        <CartToast />
    </>
  );
};

export default AppLayout;
