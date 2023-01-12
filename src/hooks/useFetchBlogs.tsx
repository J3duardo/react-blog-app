import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DocumentData, onSnapshot, orderBy, query, QuerySnapshot } from "firebase/firestore";
import { Blog } from "../pages/Home";
import { blogsCollection } from "../firebase";
import { setOpen } from "../redux/features/snackbarSlice";
import { arrayOccurrencesCounter } from "../utils/arrayOccurrencesCounter";

/**
 * Custom hook para cargar y paginar la lista de blogs.
 */
const useFetchBlogs = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [trendingCategories, setTrendingCategories] = useState<{[key: string]: number}[]>([]);

  useEffect(() => {
    const blogsQuery = query(blogsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      blogsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const blogsList = snapshot.docs.map((doc) => {
          return {...doc.data(), id: doc.id}
        }) as Blog[];

        // Extraer las categorías de cada post.
        // el resultado es un array bidimensional.
        const allCategoriesArr = snapshot.docs.map((doc) => {
          return doc.get("categories")
        });

        // Concatenar los arrays de categorías en un array de una dimensión.
        const allCategories = allCategoriesArr.reduce((acc: string[], current: string[]) => {
          acc.push(...current);
          return acc;
        }, []);

        // Ordenar las categorías descendetemente por número de ocurrencias
        // y tomar sólo las 5 primeras.
        const sortedCategories = arrayOccurrencesCounter(allCategories).slice(0,5);
        
        setBlogs(blogsList);
        setTrendingCategories(sortedCategories);
        setLoading(false);
      },
      (error) => {
        console.log(error.message);
        dispatch(setOpen({open: true, message: "Error loading blogs."}))
        setLoading(false);
      }
    );

    return () => unsubscribe();

  }, []);

  return {blogs, trendingCategories, loading}
};

export default useFetchBlogs;