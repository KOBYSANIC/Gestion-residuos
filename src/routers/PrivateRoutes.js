import React from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/features/userSlice";
import NotFound from "../pages/private/NotFound/NotFound";

const PrivateRoutes = () => {
  /* RUTAS PRIVADAS */
  const privateRoutes = routes.filter((route) => route.isPrivate === true);

  // USER
  const user = useSelector(selectUser);

  return (
    <>
      <Routes>
        {/* ----Routes---- */}
        {privateRoutes.map((route) => {
          const isAuthorized = route.accessValidate.includes(user?.role);
          const subRoutes = route.subMenu;

          return subRoutes ? (
            subRoutes.map((subRoute) => (
              <Route
                end
                key={subRoute.path}
                path={subRoute.path}
                element={
                  isAuthorized ? (
                    <subRoute.component />
                  ) : (
                    <NotFound
                      Title={"401: No autorizado :("}
                      Description={
                        "Minino cree que no tienes acceso a esta página. ¿Quizás es hora de volver a casa?"
                      }
                    />
                  )
                }
              />
            ))
          ) : (
            // if the route has no subroutes, render the route
            <Route
              end
              key={route.path}
              path={route.path}
              element={
                isAuthorized ? (
                  <route.component />
                ) : (
                  <NotFound
                    Title={"401: No autorizado :("}
                    Description={
                      "Minino cree que no tienes acceso a esta página. ¿Quizás es hora de volver a casa?"
                    }
                  />
                )
              }
            />
          );
        })}
        <Route
          path="*"
          element={
            <NotFound
              Title={"404: Oh no, minino no encontro la página"}
              Description={
                "Parece que minino no pudo encontrar el camino. ¿Quizás es hora de volver a casa?"
              }
            />
          }
        />
      </Routes>
    </>
  );
};

export default PrivateRoutes;
