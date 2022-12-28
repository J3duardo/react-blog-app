import {NavLink} from "react-router-dom";
import {AppBar, Toolbar, Button, Box} from "@mui/material";
import "./navBar.css";

const MENU_ITEMS__LEFT = [
  {id: 1, title: "Home", to: "/"},
  {id: 2, title: "Create", to: "/create"},
  {id: 3, title: "About", to: "/about"},
];

const MENU_ITEMS__RIGHT = [
  {id: 4, title: "Login", to: "/login"},
  {id: 5, title: "Signup", to: "/signup"}
];

const NavBar = () => {
  return (
    <AppBar component="nav" position="fixed">
      <Toolbar className="navbar__toolbar inner-wrapper">
        <Box className="navbar__items">
          {MENU_ITEMS__LEFT.map((el) => {
            return (
              <NavLink
                key={el.id}
                to={el.to}
                className="navbar__item"
              >
                {({isActive}) => {
                  return (
                    <Button
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
        <Box className="navbar__items">
          {MENU_ITEMS__RIGHT.map((el) => {
            return (
              <NavLink
                key={el.id}
                to={el.to}
                className="navbar__item"
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
      </Toolbar>
    </AppBar>
  )
}

export default NavBar