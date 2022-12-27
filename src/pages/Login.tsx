import {useState} from "react";
import {Box, Button, Typography} from "@mui/material";
import {useForm, FormProvider} from "react-hook-form";
import {AiOutlineLogin} from "react-icons/ai";
import {EmailField, PasswordField} from "../components/AuthFormsElements";
import "../styles/loginPage.css";

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
    <Box className="login" component="section">
      <Typography variant="h2" marginBottom="1.5rem">
        Login
      </Typography>
      <FormProvider {...methods}>
        <form
          className="login__form"
          onSubmit={methods.handleSubmit(onSubmitHandler)}
          noValidate
        >
          <EmailField />
          <PasswordField withValidation={false} />
          <Button
            className="login__button"
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
}

export default Login;