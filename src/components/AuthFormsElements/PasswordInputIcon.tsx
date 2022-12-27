import { Dispatch, SetStateAction } from "react";
import { InputAdornment } from "@mui/material";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

interface Props {
  passwordVisible: boolean;
  setPasswordVisible: Dispatch<SetStateAction<boolean>>
}

const PasswordInputIcon = ({passwordVisible, setPasswordVisible}: Props) => {
  return (
    <InputAdornment position="end">
      {passwordVisible ?
        <AiOutlineEyeInvisible
          fontSize="25px"
          cursor="pointer"
          onClick={() => setPasswordVisible(false)}
        />
        :
        <AiOutlineEye
          fontSize="25px"
          cursor="pointer"
          onClick={() => setPasswordVisible(true)}
        />
      }
    </InputAdornment>
  )
};

export default PasswordInputIcon;