import { useState } from "react";
import { Avatar, Box, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { logoutUser, UserData } from "../../redux/features/authSlice";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

interface Props {
  user: UserData;
};

const AuthLinks = ({user}: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    <Box className="navbar__items__links">
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
              startIcon={<BsPencilSquare />}
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
          disabled={isLoggingOut}
          onClick={logoutHandler}
          disableRipple
        >
          Logout
        </Button>
      </NavLink>
    </Box>
  )
};

export default AuthLinks;