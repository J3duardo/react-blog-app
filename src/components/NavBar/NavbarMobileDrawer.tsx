import {Dispatch, SetStateAction} from "react";
import {Drawer, Box, List, ListItem, ListItemButton, Avatar, Typography, ListItemIcon, ListItemText, Divider} from "@mui/material";
import {NavLink} from "react-router-dom";
import {AiOutlineHome, AiOutlineLogin, AiOutlineUser} from "react-icons/ai";
import {BsPencilSquare} from "react-icons/bs";
import {RiLogoutCircleLine} from "react-icons/ri";
import MobileDrawerItem from "./MobileDrawerItem";
import {UserProfile} from "../../redux/features/authSlice";

const MENU_ITEMS_NOAUTH = [
  {id: 1, title: "Login", to: "/login", Icon: AiOutlineLogin},
  {id: 2, title: "Signup", to: "/signup", Icon: AiOutlineUser}
];

interface Props {
  profile: UserProfile | null;
  open: boolean;
  navbarHeight: number;
  isLoggingOut: boolean;
  logoutHandler: () => Promise<void>
  setOpen: Dispatch<SetStateAction<boolean>>
};

const NavbarMobileDrawer = ({profile, open, navbarHeight, isLoggingOut, logoutHandler, setOpen}: Props) => {
  return (
    <Drawer
      className="navbar__items__drawer"
      anchor="left"
      open={open}
      onClose={() => setOpen(false)}
    >
      <Box
        style={{paddingTop: `${navbarHeight}px`}}
        className="navbar__mobile-drawer__content"
        component="nav"
      >
        <List>
          <>
            <MobileDrawerItem
              Icon={AiOutlineHome}
              text="My Blog"
              path="/"
            />

            {!profile &&
              MENU_ITEMS_NOAUTH.map((item) => (
                <MobileDrawerItem
                  key={item.id}
                  Icon={item.Icon}
                  text={item.title}
                  path={item.to}
                />
              ))
            }

            {profile &&
              <>
                <ListItem disablePadding>
                  <NavLink
                    style={{width: "100%", color: "inherit", textDecoration: "none"}}
                    to={`/profile`}
                  >
                    {({isActive}) => (
                      <ListItemButton
                        style={{backgroundColor: isActive ? "rgba(0,0,0,0.1)" : "transparent"}}
                      >
                        <ListItemIcon>
                          <Avatar
                            className="navbar__item__btn__avatar"
                            src={profile.avatar}
                            alt={`${profile.name} avatar`}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              style={{fontWeight: isActive ? 700 : 400}}
                              variant="body1"
                            >
                              {profile.name}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    )}
                  </NavLink>
                </ListItem>

                <Divider />

                <MobileDrawerItem
                  Icon={BsPencilSquare}
                  text="Create"
                  path="/blog/create"
                />
                
                <MobileDrawerItem
                  Icon={RiLogoutCircleLine}
                  text="Logout"
                  path="#"
                  onClick={() => logoutHandler()}
                />
              </>
            }
          </>
        </List>
      </Box>
    </Drawer>
  )
};

export default NavbarMobileDrawer;