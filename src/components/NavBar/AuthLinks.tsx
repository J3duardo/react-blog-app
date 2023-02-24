import { Avatar, Box, Button } from "@mui/material";
import { BsPencilSquare } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { UserProfile } from "../../redux/features/authSlice";

interface Props {
  profile: UserProfile;
  isLoggingOut: boolean;
  logoutHandler: () => Promise<void>
};

const AuthLinks = ({profile, isLoggingOut, logoutHandler}: Props) => {
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
                src={profile.avatar}
                alt={`${profile.name} avatar`}
              />
              {profile.name}
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