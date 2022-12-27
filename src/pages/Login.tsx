import {useState} from "react";
import {Box, Button, Typography} from "@mui/material";
import {useForm, FormProvider} from "react-hook-form";
import {AiOutlineLogin} from "react-icons/ai";
import {EmailField, PasswordField} from "../components/AuthFormsElements";
import "../styles/authForms.css";

export interface LoginFormFields {
  email: string;
  password: string;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const methods = useForm<LoginFormFields>({mode: "onSubmit"});

  const onSubmitHandler = async (values: LoginFormFields) => {
    console.log({values});
  };

  return (
    <Box className="authForm" component="section">
      <Typography variant="h2" marginBottom="1.5rem">
        Login
      </Typography>
      <FormProvider {...methods}>
        <form
          className="authForm__form"
          onSubmit={methods.handleSubmit(onSubmitHandler)}
          noValidate
        >
          <EmailField />
          <PasswordField />
          <Button
            className="authForm__button"
            variant="outlined"
            type="submit"
            endIcon={<AiOutlineLogin />}
            disabled={loading}
            fullWidth
          >
            Login
          </Button>
        </form>
      </FormProvider>
    </Box>
  )
};

export default Login;