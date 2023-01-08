import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { Dispatch as ReduxDispatch } from "@reduxjs/toolkit";
import { AuthError, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { LoginFormFields } from "../pages/Login";
import { SignupFormFields } from "../pages/Signup";
import { generateFirebaseAuthErrorMsg } from "../utils/firebaseErrorMessages";
import { setCurrentUser } from "../redux/features/authSlice";

export interface AuthConfig {
  authMode: "login" | "signup",
  values: LoginFormFields | SignupFormFields,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setBackendError: Dispatch<SetStateAction<string | null>>,
  methods: UseFormReturn<any>,
  dispatch: ReduxDispatch
};

enum FormFields {
  NAME = "name",
  LASTNAME = "lastname",
  EMAIL = "email",
  PASSWORD = "password"
}

/**
 * Funcionalidad para registrar un nuevo usuario
 * o para iniciar sesión de usuario.
 */
export const authHandler = async (config: AuthConfig) => {
  const {authMode, values, setLoading, setBackendError, methods, dispatch} = config;

  // Type guard para verificar si la operación es se login
  const isLoginMode = (values: LoginFormFields | SignupFormFields): values is LoginFormFields => {
    return !Object.keys(values).some(el => el === "name");
  };

  // Type guard para verificar si la operación es de signup
  const isSignupMode = (values: LoginFormFields | SignupFormFields): values is SignupFormFields => {
    return Object.keys(values).some(el => el === "name");
  };

  // Si es login, utilizar la funcionalidad de iniciar sesión
  if (isLoginMode(values)) {
    setLoading(true);
    setBackendError(null);

    try {
      const {email, password} = values;
      await signInWithEmailAndPassword(auth, email, password);
      
    } catch (error: unknown) {
      loginErrorHandler(error, methods, setBackendError);
      
    } finally {
      setLoading(false);
    };
  };

  // Si es signup, utilizar la funcionalidad de registro de usuario
  if (isSignupMode(values)) {
    setLoading(true);
    setBackendError(null);

    try {
      const {name, lastname, email, password} = values;
      const {user} = await createUserWithEmailAndPassword(auth, email, password);
  
      await updateProfile(user, {
        displayName: `${name} ${lastname}`
      });

      // Actualizar los nuevos datos del perfil del usuario en el state global
      const currentUser = JSON.parse(localStorage.getItem("currentUser")!);
      dispatch(setCurrentUser({...currentUser, displayName: name + " " + lastname}));

    } catch (error: unknown) {
      signupErrorHandler(error, methods, setBackendError);

    } finally {
      setLoading(false);
    };
  };
};


/**
 * Obtener la dirección IP del usuario
 */
export const getUserIp = async () => {
  try {
    const res = await fetch("https://api.ipify.org/?format=json");
    const ipData = await res.json() as {ip: string};

    return ipData.ip;
    
  } catch (error: any) {
    console.log(error.message)
  }
}


/**
 * Manejo de errores de inicio de sesión.
 */
function loginErrorHandler(
  error: unknown,
  methods: UseFormReturn<any>,
  setBackendError: Dispatch<SetStateAction<string | null>>
) {
  const authErr = error as AuthError;
  const errMessage = generateFirebaseAuthErrorMsg(authErr.code);

  if (errMessage.includes("email") && errMessage.includes("password")) {
    methods.setError(FormFields.EMAIL, {
      type: "Firebase email error",
      message: errMessage
    });

    return methods.setError(FormFields.PASSWORD, {
      type: "Firebase password error",
      message: errMessage
    });
  };

  if (errMessage.toLowerCase().includes("email")) {
    return methods.setError(FormFields.EMAIL, {
      type: "Firebase email error",
      message: errMessage
    });
  };

  if (errMessage.toLowerCase().includes("password")) {
    return methods.setError(FormFields.PASSWORD, {
      type: "Firebase password error",
      message: errMessage
    });
  };
  
  setBackendError(errMessage);
};


/**
 * Manejo de errores de registro de usuarios.
 */
function signupErrorHandler(
  error: unknown,
  methods: UseFormReturn<any>,
  setBackendError: Dispatch<SetStateAction<string | null>>
) {
  const authErr = error as AuthError;
  const errMessage = generateFirebaseAuthErrorMsg(authErr.code);

  if (errMessage.toLowerCase().includes("email")) {
    return methods.setError(FormFields.EMAIL, {
      type: "Firebase email error",
      message: errMessage
    });
  };

  setBackendError(errMessage);
};