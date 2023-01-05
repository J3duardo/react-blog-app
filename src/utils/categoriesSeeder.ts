import { collection, setDoc, doc } from "firebase/firestore";
import cryptoRandomString from "crypto-random-string";
import { db } from "../firebase";

const categories = [
  "Technology",
  "Science",
  "Programming",
  "Web Development",
  "Graphic Design",
  "Photography",
  "Home",
  "Health",
  "Sports",
  "Family",
  "Other"
];

/**
 * Agregar las categorías a la base de datos generando sus IDs
 * y agregando éstas como un campo del documento de la categoría.
 */
export const categoriesSeeder = async () => {
  try {
    const collectionRef = collection(db, "categories");

    for await (let cat of categories) {
      const id = cryptoRandomString({length: 20, type: "alphanumeric"});
      setDoc(doc(collectionRef, id), {categoryId: id, category: cat});
    };

  } catch (error: any) {
    console.log(`Error seeding categories: ${error.message}`)
  }
};