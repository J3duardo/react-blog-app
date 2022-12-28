import {useState} from "react";
import {Box, Button, Typography, Alert} from "@mui/material";
import {useForm, FormProvider} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {AiOutlineLogin} from "react-icons/ai";
import {AuthError, signInWithEmailAndPassword} from "firebase/auth";
import {EmailField, PasswordField} from "../components/AuthFormsElements";
import {generateFirebaseErrorMsg} from "../utils/firebaseErrorMessages";
import {auth} from "../firebase";
import {LayoutState} from "../redux/store";
import "../styles/authForms.css";

export interface LoginFormFields {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const {navbarHeight} = useSelector((state: LayoutState) => state.layout);

  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<null | string>(null);

  const methods = useForm<LoginFormFields>({mode: "onSubmit"});

  // Funcionalidad para iniciar sesión
  const onSubmitHandler = async (values: LoginFormFields) => {
    const {email, password} = values;

    setLoading(true);
    setBackendError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/", {replace: true});

    } catch (error: unknown) {
      const authErr = error as AuthError;
      const errMessage = generateFirebaseErrorMsg(authErr.code);

      if (errMessage.includes("email") && errMessage.includes("password")) {
        methods.setError("email", {
          type: "Firebase email error",
          message: errMessage
        });

        return methods.setError("password", {
          type: "Firebase password error",
          message: errMessage
        });
      };

      if (errMessage.toLowerCase().includes("email")) {
        return methods.setError("email", {
          type: "Firebase email error",
          message: errMessage
        });
      };

      if (errMessage.toLowerCase().includes("password")) {
        return methods.setError("password", {
          type: "Firebase password error",
          message: errMessage
        });
      };
      
      setBackendError(errMessage);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      paddingTop={`calc(${navbarHeight}px + 1rem)`}
      paddingBottom={`calc(${navbarHeight}px + 1rem)`}
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

export default Login;