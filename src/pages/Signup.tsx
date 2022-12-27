import {useState} from "react";
import {Box, Button, Typography} from "@mui/material";
import {useForm, FormProvider} from "react-hook-form";
import {AiOutlineLogin} from "react-icons/ai";
import {GenericTextField, EmailField, PasswordField, PasswordConfirmField} from "../components/AuthFormsElements";
import "../styles/authForms.css";

export interface SignupFormFields {
  name: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const methods = useForm<SignupFormFields>({mode: "onSubmit"});

  const onSubmitHandler = async (values: SignupFormFields) => {
    const password = methods.getValues("password");
    const passwordConfirm = methods.getValues("passwordConfirm");

    // Verificar si las contraseñas coinciden
    // y emitir un mensaje de error de no ser así.
    if(password !== passwordConfirm) {
      return methods.setError("passwordConfirm", {
        type: "passwordsMismatch",
        message: "Passwords don't match"
      });
    };

    console.log({values});
  };

  return (
    <Box className="authForm" component="section">
      <Typography variant="h2" marginBottom="1.5rem">
        Signup
      </Typography>
      <FormProvider {...methods}>
        <form
          className="authForm__form"
          onSubmit={methods.handleSubmit(onSubmitHandler)}
          noValidate
        >
          <GenericTextField fieldName="name" label="Your name" />
          <GenericTextField fieldName="lastname" label="Your lastname" />
          <EmailField />
          <PasswordField withValidation />
          <PasswordConfirmField />
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