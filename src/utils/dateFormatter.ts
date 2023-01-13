import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

/**
 * Formatear la fecha generada por Firebase.
 * @param date Representación `Timestamp` de la fecha generada por Firebase.
 * @param format String opcional para formatear la fecha.
 */
export const dateFormatter = (date: Timestamp, format = "MM/DD/YYYY - h:mm a") => {
  return dayjs(date.toDate()).format(format);
};