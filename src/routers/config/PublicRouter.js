import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { ADMINISTRADOR, CLIENTE, TRANSPORTISTA } from "../../Utils/constants";

// Children es una prop que simpre esta, los hijos de este componente
const PublicRouter = ({ children }) => {
  const user = useSelector(selectUser);

  // Si no esta autenticado, retorna el children (componente hijo)

  // Si se accede a la ruta /paints, se muestra el children (componente hijo)
  const path = window.location.pathname;

  if (path === "/paints") {
    return children;
  }

  return !user ? (
    children
  ) : (
    <Navigate
      to={`/app/${
        user.role === ADMINISTRADOR
          ? "residuos"
          : user.role === TRANSPORTISTA
          ? "recolecciones"
          : user.role === CLIENTE && "residuos"
      }`}
    />
  );
};

export default PublicRouter;
