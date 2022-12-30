import { ComponentType } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { AuthState } from "../redux/store";

/**
 * HOC para no permitir acceder las rutas que NO requieran autenticación
 * una vez que el usuario está autenticado, como las páginas login y signup.
 */
const withoutAuthentication = (Component: ComponentType) => {
  return () => {
    const {isAuth, loading} = useSelector((state: AuthState) => state.auth);

    if(loading) {
      return (
        <Spinner
          containerHeight="100vh"
          spinnerWidth="50px"
          spinnerHeight="50px"
          spinnerColor="black"
        />
      )
    };

    if(isAuth && !loading) {
      return <Navigate to="/" replace />
    };

    return <Component />;
  };
};

export default withoutAuthentication;