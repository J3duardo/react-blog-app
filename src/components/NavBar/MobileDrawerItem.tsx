import { ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { IconType } from "react-icons/lib";

interface Props {
  Icon: IconType;
  text: string;
  path: string;
  disabled?: boolean;
  onClick?: () => void;
};

const MobileDrawerItem = ({Icon, text, path, disabled, onClick}: Props) => {
  return (
    <>
      <ListItem disablePadding>
        <NavLink
          style={{width: "100%", color: "inherit", textDecoration: "none"}}
          to={path}
          onClick={(e) => path === "#" && e.preventDefault()}
        >
          {({isActive}) => {
            return (
              <ListItemButton
                style={{
                  backgroundColor: (isActive && path !== "#") ? "rgba(0,0,0,0.1)" : "transparent"
                }}
                disabled={disabled}
                onClick={() => onClick?.()}
              >
                <ListItemIcon>
                  <Icon style={{width: "var(--heading-4)", height: "var(--heading-4)"}} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      style={{fontWeight: (isActive && path !== "#") ? 700 : 400}}
                      variant="body1"
                    >
                      {text}
                    </Typography>
                  }
                />
              </ListItemButton>
            )
          }}
        </NavLink>
      </ListItem>
      <Divider />
    </>
  )
};

export default MobileDrawerItem;