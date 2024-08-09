import React, { useEffect } from "react";

import { Toaster } from "react-hot-toast";

import Rutas from "./routers/RoutesMain";

import "./styles/index.css";
import { useLogOut } from "./hooks/useLogOut";

function App() {
  const { verifiyUser } = useLogOut();

  // check at page load if a user is authenticated
  useEffect(() => {
    verifiyUser();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />
      <Rutas />
    </>
  );
}

export default App;
