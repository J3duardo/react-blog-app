import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DocumentData, onSnapshot, orderBy, query, QuerySnapshot } from "firebase/firestore";
import { Blog, SortBy } from "../pages/Home";
import { blogsCollection } from "../firebase";
import { setOpen } from "../redux/features/snackbarSlice";

/**
 * Custom hook para cargar y paginar la lista de blogs.
 */
const useFetchBlogs = (sortBy: SortBy) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const blogsQuery = query(blogsCollection, orderBy("createdAt", sortBy));

    const unsubscribe = onSnapshot(
      blogsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const blogsList = snapshot.docs.map((doc) => {
          return {...doc.data(), id: doc.id}
        }) as Blog[];
        
        setBlogs(blogsList);
        setLoading(false);
      },
      (error) => {
        console.log(error.message);
        dispatch(setOpen({open: true, message: "Error loading blogs."}))
        setLoading(false);
      }
    );

    return () => unsubscribe();

  }, [sortBy]);

  return {blogs, loading}
};

export default useFetchBlogs;