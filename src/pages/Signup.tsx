import {useState} from "react";
import {Box, Button, Typography, Alert} from "@mui/material";
import {useSelector, useDispatch} from "react-redux";
import {useForm, FormProvider} from "react-hook-form";
import {useNavigate, useLocation} from "react-router-dom";
import {AiOutlineLogin} from "react-icons/ai";
import {GenericTextField, EmailField, PasswordField, PasswordConfirmField} from "../components/AuthFormsElements";
import {LayoutState} from "../redux/store";
import {AuthConfig, authHandler} from "../utils/auth";
import withoutAuthentication from "../HOC/withoutAuthentication";
import "../styles/authForms.css";

export interface SignupFormFields {
  name: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const Signup = () => {
  const {pagePadding} = useSelector((state: LayoutState) => state.layout);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {state} = useLocation();

  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<null | string>(null);
  
  const methods = useForm<SignupFormFields>({mode: "onSubmit"});

  // Funcionalidad para registrar al usuario
  const onSubmitHandler = async (values: SignupFormFields) => {
    const newPassword = methods.getValues("password");
    const passwordConfirm = methods.getValues("passwordConfirm");

    // Verificar si las contraseñas coinciden
    // y emitir un mensaje de error de no ser así.
    if(newPassword !== passwordConfirm) {
      return methods.setError("passwordConfirm", {
        type: "passwordsMismatch",
        message: "Passwords don't match"
      });
    };

    const authConfig = {
      authMode: "signup",
      values,
      methods,
      setLoading,
      setBackendError,
      dispatch
    } satisfies AuthConfig;

    await authHandler(authConfig);

    // Redirigir a la página anterior (si aplica)
    // o al home, en su defecto.
    if(state) {
      navigate(state.from, {replace: true})
    } else {
      navigate("/", {replace: true})
    };
  };

  return (
    <Box
      paddingTop={pagePadding.top}
      paddingBottom={pagePadding.bottom}
      className="authForm"
      component="section"
    >
      <Typography variant="h2" marginBottom="1.5rem">
        Signup
      </Typography>

      {backendError &&
        <Alert
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
          <GenericTextField fieldName="name" label="Your name" disabled={loading} />
          <GenericTextField fieldName="lastname" label="Your lastname" disabled={loading} />
          <EmailField disabled={loading} />
          <PasswordField disabled={loading} withValidation />
          <PasswordConfirmField disabled={loading} />
          <Button
            className="authForm__button"
            variant="outlined"
            type="submit"
            endIcon={<AiOutlineLogin />}
            disabled={loading}
            fullWidth
            
          >
            Signup
          </Button>
        </form>
      </FormProvider>
    </Box>
  )
};

export default withoutAuthentication(Signup);