import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { auth } from "../../firebase/config";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";

const PrivateRouter = ({ children }) => {
  const [loader, setLodaer] = useState(true);
  const user = useSelector(selectUser);
  const path = window.location.pathname;

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        setLodaer(false);
      }
    });

    return () => {
      setLodaer(true);
    };
  }, []);

  // onAuthStateChanged

  // Si se accede a la ruta /paints, se muestra el children (componente hijo)
  if (path === "/paints") {
    return children;
  }

  // Si esta autenticado, retorna el children (componente hijo)
  return user ? children : loader ? <Spinner /> : <Navigate to="/" />;
};

export default PrivateRouter;
