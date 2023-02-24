import { Avatar, Box, Button } from "@mui/material";
import { BsPencilSquare } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { UserData } from "../../redux/features/authSlice";

interface Props {
  user: UserData;
  isLoggingOut: boolean;
  logoutHandler: () => Promise<void>
};

const AuthLinks = ({user, isLoggingOut, logoutHandler}: Props) => {
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