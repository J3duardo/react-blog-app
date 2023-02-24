import {useState, useEffect, useRef, MutableRefObject} from "react";
import {AppBar, Toolbar, Button, Box} from "@mui/material";
import {NavLink} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import NoAuthLinks from "./NoAuthLinks";
import AuthLinks from "./AuthLinks";
import SearchBar from "./SearchBar";
import VerificationWarning from "./VerificationWarning";
import Spinner from "../Spinner";
import useResizeObserver from "../../hooks/useResizeObserver";
import {AuthState} from "../../redux/store";
import {setNavbarHeight, setPagePadding} from "../../redux/features/layoutSlice";
import "./navBar.css";

const NavBar = () => {
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const {isAuth, user, loading} = useSelector((state: AuthState) => state.auth);
  const dispatch = useDispatch();

  const [showVerificationWarning, setShowVerificationWarning] = useState(true);

  // Determinar el height del navbar
  const {elemHeight: navbarHeight} = useResizeObserver({
    elementRef: navbarRef as MutableRefObject<HTMLDivElement>
  });

  // Actualizar el state global del layout
  useEffect(() => {
    dispatch(setNavbarHeight(navbarHeight));
    dispatch(setPagePadding({
      top: `calc(${navbarHeight}px + 1rem)`,
      bottom: `calc(${navbarHeight}px + 1rem)`
    }));
  }, [navbarHeight]);


  return (
    <AppBar
      ref={navbarRef}
      className="navbar"
      component="nav"
    >
      <Toolbar className="inner-wrapper">
        <Box className="navbar__items--desktop">
          <NavLink to="/" className="navbar__item">
            {({isActive}) => {
              return (
                <Button
                  className={isActive ? "navbar__item__btn navbar__item__btn--active" : "navbar__item__btn"}
                  disableRipple
                >
                  MY BLOG
                </Button>
              )
            }}
          </NavLink>

          <SearchBar />

          {loading &&
            <Box className="navbar__spinner" position="relative">
              <Spinner
                containerHeight="auto"
                spinnerWidth="1.2rem"
                spinnerHeight="1.2rem"
                spinnerColor="white"
              />
            </Box>
          }

          {/* Items para usuarios no autenticados */}
          {!isAuth && !loading &&
            <NoAuthLinks />
          }

          {/* Items para usuarios autenticados */}
          {isAuth && !loading &&
            <AuthLinks user={user!} />
          }
        </Box>
      </Toolbar>

      {/* Barra del mensaje de email no verificado */}
      {isAuth && !user?.emailVerified && showVerificationWarning &&
        <VerificationWarning setShowWarning={setShowVerificationWarning} />
      }
    </AppBar>
  )
};

export default NavBar;