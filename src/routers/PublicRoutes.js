import React from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/private/NotFound/NotFound";
// routes
import { routes } from "./routes";

const PublicRoutes = () => {
  const publicRoutes = routes.filter((route) => !route.isPrivate);
  /* RUTAS PUBLICAS */
  return (
    <>
      {/* Login, acceso si no se esta logueado */}
      <Routes>
        {publicRoutes.map((route) => (
          <Route end path={route.path} key={route.path} element={<route.component />} />
        ))}
        <Route path="" element={<NotFound/>} />
      </Routes>
    </>
  );
};

export default PublicRoutes;
