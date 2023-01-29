import { Dispatch, SetStateAction } from "react";
import { Menu, MenuItem, Divider } from "@mui/material";
import { BiEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";

interface Props {
  anchorElement: HTMLButtonElement | null;
  setAnchorElement: Dispatch<SetStateAction<HTMLButtonElement | null>>
}

const UserActionsDropdown = ({anchorElement, setAnchorElement}: Props) => {
  return (
    <Menu
      style={{padding: 0}}
      open={!!anchorElement}
      anchorEl={anchorElement}
      disableScrollLock
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      onClose={() => setAnchorElement(null)}
    >
      <MenuItem>
        <BiEdit style={{marginRight: "5px"}} />
        Edit
      </MenuItem>

      <Divider style={{margin: 0}} />

      <MenuItem>
        <MdDeleteOutline style={{marginRight: "5px"}} />
        Delete
      </MenuItem>
    </Menu>
  )
};

export default UserActionsDropdown;