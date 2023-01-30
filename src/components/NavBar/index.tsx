import {useState, useEffect, useRef, MutableRefObject} from "react";
import {AppBar, Toolbar, Button, Box, Avatar} from "@mui/material";
import {NavLink, useNavigate, useLocation} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {collection, doc, setDoc} from "firebase/firestore";
import SearchBar from "./SearchBar";
import VerificationWarning from "./VerificationWarning";
import Spinner from "../Spinner";
import useResizeObserver from "../../hooks/useResizeObserver";
import {AuthState} from "../../redux/store";
import {logoutUser} from "../../redux/features/authSlice";
import {setNavbarHeight, setPagePadding} from "../../redux/features/layoutSlice";
import {auth, db} from "../../firebase";
import "./navBar.css";

const MENU_ITEMS_NOAUTH = [
  {id: 4, title: "Login", to: "/login"},
  {id: 5, title: "Signup", to: "/signup"}
];

const NavBar = () => {
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const {isAuth, user, loading} = useSelector((state: AuthState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {pathname} = useLocation();

  const [loggingOut, setLoggingOut] = useState(false);
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

  // Funcionalidad para cerrar sesión
  const logoutHandler = async () => {
    try {
      setLoggingOut(true);

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
      setLoggingOut(false);
    }
  };

  return (
    <AppBar
      ref={navbarRef}
      style={{position: "fixed", zIndex: 1000000}}
      component="nav"
    >
      <Toolbar className="navbar__toolbar inner-wrapper">
        <Box className="navbar__items">
          <NavLink to="/" className="navbar__item">
            {({isActive}) => {
              return (
                <Button
                  className={isActive ? "navbar__item__btn navbar__item__btn--active" : "navbar__item__btn"}
                  disableRipple
                >
                  BLOG
                </Button>
              )
            }}
          </NavLink>
        </Box>

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
          <Box className="navbar__items">
            {MENU_ITEMS_NOAUTH.map((el) => {
              return (
                <NavLink
                  key={el.id}
                  to={el.to}
                  className="navbar__item"
                  state={{from: pathname}}
                >
                  {({isActive}) => {
                    return (
                      <Button
                        key={el.id}
                        className={isActive ? "navbar__item__btn navbar__item__btn--active" : "navbar__item__btn"}
                        disableRipple
                      >
                        {el.title}
                      </Button>
                    )
                  }}
                </NavLink>
              )
            })}
          </Box>
        }

        {/* Items para usuarios autenticados */}
        {isAuth && !loading &&
          <Box className="navbar__items">
            <NavLink
              to="/profile"
              className="navbar__item"
            >
              {({isActive}) => {
                return (
                  <Button
                    className={isActive ? "navbar__item__btn navbar__item__btn--active" : "navbar__item__btn"}
                    disableRipple
                  >
                    <Avatar
                      className="navbar__item__btn__avatar"
                      src={user!.photoURL || ""}
                      alt={user!.displayName}
                    />
                    {user!.displayName.split(" ")[0]}
                  </Button>
                )
              }}
            </NavLink>

            <NavLink
              to="/blog/create"
              className="navbar__item"
            >
              {({isActive}) => {
                return (
                  <Button
                    className={isActive ? "navbar__item__btn navbar__item__btn--active" : "navbar__item__btn"}
                    disableRipple
                  >
                    Create
                  </Button>
                )
              }}
            </NavLink>

            <NavLink to="#" className="navbar__item">
              <Button
                className="navbar__item__btn"
                disabled={loggingOut}
                onClick={logoutHandler}
                disableRipple
              >
                Logout
              </Button>
            </NavLink>
          </Box>
        }
      </Toolbar>

      {/* Barra del mensaje de email no verificado */}
      {isAuth && !user?.emailVerified && showVerificationWarning &&
        <VerificationWarning setShowWarning={setShowVerificationWarning} />
      }

    </AppBar>
  )
};

export default NavBar;