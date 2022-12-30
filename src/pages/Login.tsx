import {useState} from "react";
import {Box, Button, Typography, Alert} from "@mui/material";
import {useForm, FormProvider} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {AiOutlineLogin} from "react-icons/ai";
import {EmailField, PasswordField} from "../components/AuthFormsElements";
import {LayoutState} from "../redux/store";
import {AuthConfig, authHandler} from "../utils/auth";
import withoutAuthentication from "../HOC/withoutAuthentication";
import "../styles/authForms.css";

export interface LoginFormFields {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {pagePadding} = useSelector((state: LayoutState) => state.layout);

  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<null | string>(null);

  const methods = useForm<LoginFormFields>({mode: "onSubmit"});

  // Funcionalidad para iniciar sesión
  const onSubmitHandler = async (values: LoginFormFields) => {
    const authConfig = {
      authMode: "login",
      values,
      methods,
      navigate,
      setLoading,
      setBackendError,
      dispatch
    } satisfies AuthConfig;

    await authHandler(authConfig);
  };

  return (
    <Box
      paddingTop={pagePadding.top}
      paddingBottom={pagePadding.bottom}
      className="authForm"
      component="section"
    >
      <Typography variant="h2" marginBottom="1.5rem">
        Login
      </Typography>

      {backendError &&
        <Alert
          style={{marginBottom: "1.5rem"}}
          severity="error"
          onClose={() => setBackendError(null)}
        >
          {backendError}
        </Alert>
      }

      <FormProvider {...methods}>
        <form
          className="authForm__form"
          onSubmit={methods.handleSubmit(onSubmitHandler)}
          noValidate
        >
          <EmailField disabled={loading} />
          <PasswordField disabled={loading} />
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

export default withoutAuthentication(Login);