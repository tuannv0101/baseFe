import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import RoomDetail from '../pages/RoomDetail';
import { ROUTES } from '../constants';

const AppRoutes = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.ROOM_DETAIL} element={<RoomDetail />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;
