export const generateFirebaseErrorMsg = (errorCode: string) => {
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