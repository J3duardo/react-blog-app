import {useState} from "react";
import {Box, Button, Typography, Alert} from "@mui/material";
import {useSelector} from "react-redux";
import {useForm, FormProvider} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {AiOutlineLogin} from "react-icons/ai";
import {createUserWithEmailAndPassword, updateProfile, AuthError} from "firebase/auth";
import {GenericTextField, EmailField, PasswordField, PasswordConfirmField} from "../components/AuthFormsElements";
import {auth} from "../firebase";
import {generateFirebaseErrorMsg} from "../utils/firebaseErrorMessages";
import {LayoutState} from "../redux/store";
import "../styles/authForms.css";

export interface SignupFormFields {
  name: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const Signup = () => {
  const {navbarHeight} = useSelector((state: LayoutState) => state.layout);
  const navigate = useNavigate();

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

    setLoading(true);
    setBackendError(null);

    try {
      const {name, lastname, email, password} = values;
      const {user} = await createUserWithEmailAndPassword(auth, email, password);
  
      await updateProfile(user, {
        displayName: `${name} ${lastname}`
      });

      navigate("/", {replace: true});

    } catch (error: unknown) {
      const authErr = error as AuthError;
      const errMessage = generateFirebaseErrorMsg(authErr.code);

      if (errMessage.toLowerCase().includes("email")) {
        return methods.setError("email", {
          type: "Firebase email error",
          message: errMessage
        });
      };

      setBackendError(errMessage);

    } finally {
      setLoading(false);
    };
  };

  return (
    <Box
      paddingTop={`calc(${navbarHeight}px + 1rem)`}
      paddingBottom={`calc(${navbarHeight}px + 1rem)`}
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

export default Signup;