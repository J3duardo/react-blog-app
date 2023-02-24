import { Box, Button } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

const MENU_ITEMS_NOAUTH = [
  {id: 4, title: "Login", to: "/login"},
  {id: 5, title: "Signup", to: "/signup"}
];

const NoAuthLinks = () => {
  const {pathname} = useLocation();

  return (
    <Box className="navbar__items__links">
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
                  style={{
                    backgroundColor: el.title === "Signup" ? "var(--secondary)" : "transparent"
                  }}
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
  )
};

export default NoAuthLinks;