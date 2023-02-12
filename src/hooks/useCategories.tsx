import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { setOpen } from "../redux/features/snackbarSlice";
import { db } from "../firebase";

export type Category = {
  category: string,
  categoryId: string
};

/**
 * Custom hook para consultar las categorías disponibles en la base de datos.
 */
const useCategories = () => {
  const dispatch = useDispatch();

  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    // Referencia de la colección de categorías
    const collectionRef = collection(db, "categories");

    // Query para consultar todas las categorías
    const q = query(collectionRef, orderBy("category", "asc"));

    // Ejecutar el query
    getDocs(q)
    .then(snapshot => {
      const docs = snapshot.docs.map(cat => cat.data() as Category);
      setCategories(docs.map(el => el.category));
    })
    .catch((err: any) => {
      console.log(`Error fetching categories: ${err.message}`);
      dispatch(setOpen({
        open: true,
        message: "Error loading categories, refresh the page and try again."
      }))
    })
    .finally(() => setLoadingCategories(false))
  }, []);

  return {
    loadingCategories,
    categories,
    setCategories
  };
};

export default useCategories;