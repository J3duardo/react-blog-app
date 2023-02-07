import {useState, useEffect} from "react";
import {List, ListItem, ListItemText, ListItemIcon} from "@mui/material";
import {AiOutlineCheckCircle} from "react-icons/ai";
import {FaRegTimesCircle} from "react-icons/fa";

interface Props {
  password: string;
};

interface ListItemsProps {
  isValid: boolean;
  text: string;
};

const LIST_ITEMS = {
  lowerCase: "The password must contain at least one lowercase letter",
  upperCase: "The password must contain at least one uppercase letter",
  number: "The password must contain at least one number",
  specialChar: "The password must contain at least one special character",
  length: "The password must contain at least 6 characters"
};

const PasswordvalidationMsg = ({password}: Props) => {
  const [validation, setValidation] = useState({
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasValidLength: false
  });

  useEffect(() => {
    let hasLowerCase = !!password?.match(/[a-z]/);
    let hasUpperCase = !!password?.match(/[A-Z]/);
    let hasNumber = !!password?.match(/[0-9]/);
    let hasSpecialChar = !!password?.match(/[\W_]/);

    setValidation(() => {
      return {
        hasLowerCase,
        hasUpperCase,
        hasNumber,
        hasSpecialChar,
        hasValidLength: password?.length >= 6
      }
    });

  }, [password]);

  const RenderListItem = (props: ListItemsProps) => {
    return (
      <ListItem style={{padding: 0}}>
        <ListItemIcon style={{minWidth: "30px"}}>
          {props.isValid ? <AiOutlineCheckCircle style={{color: "green", fontSize: "1rem"}}/> : <FaRegTimesCircle style={{color: "var(--error)", fontSize: "1rem"}} />}
        </ListItemIcon>
        <ListItemText
          style={{color: props.isValid? "green" : "var(--error)"}}
          primary={props.text}
        />
      </ListItem>
    )
  };

  return (
    <List>
      <RenderListItem text={LIST_ITEMS.lowerCase} isValid={validation.hasLowerCase} />
      <RenderListItem text={LIST_ITEMS.upperCase} isValid={validation.hasUpperCase} />
      <RenderListItem text={LIST_ITEMS.number} isValid={validation.hasNumber} />
      <RenderListItem text={LIST_ITEMS.specialChar} isValid={validation.hasSpecialChar} />
      <RenderListItem text={LIST_ITEMS.length} isValid={validation.hasValidLength} />
    </List>
  )
};

export default PasswordvalidationMsg;