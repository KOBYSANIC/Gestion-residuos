import React from "react";
import { Routes, Route } from "react-router-dom";

// Verifiacion de rutas privadas
import PrivateRouter from "./config/PrivateRouter";

// Rutas privadas y publicas
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import PublicRouter from "./config/PublicRouter";
import Dashboard from "../pages/private/Dashboard";

const Rutas = () => {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <PublicRouter>
            <PublicRoutes />
          </PublicRouter>
        }
      />

      <Route
        path="/app/*"
        element={
          <PrivateRouter>
            <Dashboard>
              <PrivateRoutes />
            </Dashboard>
          </PrivateRouter>
        }
      />
    </Routes>
  );
};

export default Rutas;
