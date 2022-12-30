/**
 * Generar mensajes de error de autenticación de firebase
 * a partir del código del error.
 */
export const generateFirebaseAuthErrorMsg = (errorCode: string) => {
  console.log({errorCode});
  let errMessage: string;

  switch(errorCode) {
    case "auth/email-already-in-use":
    case "auth/email-already-exists":
      errMessage = "The email is already used by another account.";
      break;
    case "auth/internal-error":
      errMessage = "Internal server error. Try again later.";
      break;
    case "auth/invalid-email":
    case "auth/invalid-password":
    case "auth/wrong-password":
      errMessage = "Wrong email or password.";
      break;
    case "auth/user-not-found":
      errMessage = "User not found or deleted.";
      break;
    case "auth/too-many-requests":
      errMessage = "Too many failed attempts. Try again later.";
      break;
    case "auth/user-disabled":
      errMessage = "The user account was disabled by an administrator."
      break;
    default:
      errMessage = "There was an unknown error. Try again later."
  };

  return errMessage;
};


/**
 * Generar mensajes de error de storage de firebase
 * a partir del código del error.
 */
export const generateFirebaseStorageErrorMsg = (errorCode: string) => {
  console.log({errorCode});

  let errMessage: string;

  switch(errorCode) {
    case "storage/object-not-found":
      errMessage = "Image not found or deleted."
      break;
    case "storage/bucket-not-found":
      errMessage = "Storage bucket not found or not properly configured."
      break;
    case "storage/unauthenticated":
      errMessage = "Unauthorized. Please, log in to your account and try again."
      break;
    case "storage/unauthorized":
      errMessage = "You are not authorized to perform the desired action."
      break;
    case "storage/retry-limit-exceeded":
      errMessage = "Too many attempts. Try again later."
      break;
    case "storage/canceled":
      errMessage = "The user cancelled the operation."
      break;
    case "storage/server-file-wrong-size":
      errMessage = "The file does not match the size of the file received by the server. Try again."
      break;
    default:
      errMessage = "An unknown error occurred. Try again later."
  };

  return errMessage;
};