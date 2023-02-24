import {useState, useEffect, useRef, MutableRefObject} from "react";
import {AppBar, Toolbar, Button, Box, IconButton} from "@mui/material";
import {NavLink, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {AiOutlineMenu} from "react-icons/ai";
import {VscChromeClose} from "react-icons/vsc";
import {collection, doc, setDoc} from "firebase/firestore";
import NoAuthLinks from "./NoAuthLinks";
import AuthLinks from "./AuthLinks";
import SearchBar from "./SearchBar";
import NavbarMobileDrawer from "./NavbarMobileDrawer";
import VerificationWarning from "./VerificationWarning";
import Spinner from "../Spinner";
import useResizeObserver from "../../hooks/useResizeObserver";
import {AuthState} from "../../redux/store";
import {setNavbarHeight, setPagePadding} from "../../redux/features/layoutSlice";
import {logoutUser} from "../../redux/features/authSlice";
import {auth, db} from "../../firebase";
import "./navBar.css";

const NavBar = () => {
  const navbarRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  
  const {isAuth, user, profile, loading} = useSelector((state: AuthState) => state.auth);
  const dispatch = useDispatch();

  const [showVerificationWarning, setShowVerificationWarning] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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


  // Funcionalidad para cerrar sesión
  const logoutHandler = async () => {
    try {
      setIsLoggingOut(true);

      // Pasar el estado a offline
      await setDoc(
        doc(collection(db, "onlineUsers"), user!.uid),
        {userId: user!.uid, isOnline: false},
        {merge: true}
      );

      await auth.signOut();

      dispatch(logoutUser());
      navigate("/login", {replace: true});

    } catch (error: any) {
      console.log(`Error logging user out`, error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };


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
          {profile && !loading &&
            <AuthLinks
              profile={profile}
              isLoggingOut={isLoggingOut}
              logoutHandler={logoutHandler}
            />
          }
        </Box>

        {/* Items del navbar en pantallas mobile */}
        <Box className="navbar__items--mobile">
          <SearchBar disabled={isMobileDrawerOpen} />

          {/* Botón para abrir/cerrar el drawer */}
          <IconButton
            className="navbar__items__drawer-btn"
            size="large"
            onClick={() => setIsMobileDrawerOpen((prev) => !prev)}
          >
            {isMobileDrawerOpen ? <VscChromeClose /> : <AiOutlineMenu />}
          </IconButton>

          {/* Drawer del menú de navegación mobile */}
          <NavbarMobileDrawer
            profile={profile}
            navbarHeight={navbarHeight}
            open={isMobileDrawerOpen}
            isLoggingOut={isLoggingOut}
            setOpen={setIsMobileDrawerOpen}
            logoutHandler={logoutHandler}
          />

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