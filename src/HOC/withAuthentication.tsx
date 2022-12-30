import { ComponentType } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { AuthState } from "../redux/store";

/**
 * HOC para proteger las rutas que requieran autenticación
 */
const withAuthentication = (Component: ComponentType) => {
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

    if(!isAuth && !loading) {
      return <Navigate to="/login" replace />
    };

    return <Component />;
  };
};

export default withAuthentication;