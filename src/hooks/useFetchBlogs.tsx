import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DocumentData, DocumentSnapshot, endBefore, FirestoreError, getCountFromServer, getDocs, limit, onSnapshot, orderBy, query, QuerySnapshot, startAfter } from "firebase/firestore";
import { Blog, SortBy } from "../pages/Home";
import { blogsCollection } from "../firebase";
import { setOpen } from "../redux/features/snackbarSlice";
import { generateFirestoreErrorMsg } from "../utils/firebaseErrorMessages";

const limitAmount = 4;

/**
 * Custom hook para cargar y paginar la lista de blogs.
 */
const useFetchBlogs = (
  sortBy: SortBy,
  loadMore: boolean,
  setLoadMore: Dispatch<SetStateAction<boolean>>,
  setLoadingMore: Dispatch<SetStateAction<boolean>>,
  setDocsCount: Dispatch<SetStateAction<number>>,
) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [firstItem, setFirstItem] = useState<DocumentSnapshot<DocumentData> | undefined>();
  const [lastItem, setLastItem] = useState<DocumentSnapshot<DocumentData> | undefined>();
  const [blogs, setBlogs] = useState<Blog[]>([]);


  /**
   * Consultar el número total de posts
   */
  useEffect(() => {
    getCountFromServer(blogsCollection)
    .then((count) => {
      setDocsCount(count.data().count)
    })
    .catch((error: any) => console.log(error.message));
  }, []);


  /**
   * Cargar la primera página de posts.
   */
  useEffect(() => {
    setLoading(true);

    const blogsQuery = query(blogsCollection, orderBy("createdAt", sortBy), limit(limitAmount));

    const unsubscribe = onSnapshot(
      blogsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const blogsList = snapshot.docs.map((doc) => {
          return {...doc.data(), id: doc.id}
        }) as Blog[];

        const firstDoc = snapshot.docs[0];
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];

        setFirstItem(firstDoc);
        setLastItem(lastDoc);
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

  }, []);


  /**
   * Cargar los posts con paginación.
   */
  useEffect(() => {
    if(loadMore) {

      // Retornar sin ejecutar el query si
      // no se proporciona el first o el last item.
      if(!firstItem || !lastItem) {
        setLoadMore(false);
        return setLoadingMore(false);
      };

      // Query para consultar en orden descendente (Newest first).
      const blogsQueryDesc = query(
        blogsCollection,
        orderBy("createdAt", sortBy),
        startAfter(lastItem),
        limit(limitAmount)
      );

      // Query para consultar en orden ascendente (Oldest first).
      const blogsQueryAsc = query(
        blogsCollection,
        orderBy("createdAt", sortBy),
        endBefore(firstItem),
        limit(limitAmount)
      );
        
      setLoadingMore(true);

      // Ejecutar el query.
      getDocs(sortBy === "desc" ? blogsQueryDesc : blogsQueryAsc)
      .then((docsSnapshot) => {
        const firstDoc = docsSnapshot.docs[0];
        const lastDoc = docsSnapshot.docs[docsSnapshot.docs.length - 1];

        setFirstItem(firstDoc);
        setLastItem(lastDoc);
  
        const docs = docsSnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as Blog[];
  
        setBlogs((prev) => [...prev, ...docs]);
  
      })
      .catch((error: FirestoreError) => {
        console.log(error);
        const code = error.code;
        const message = generateFirestoreErrorMsg(code);

        // Mostrar snackbar con el mensaje de error
        dispatch(setOpen({open: true, message}));

      })
      .finally(() => {
        setLoadingMore(false);
        setLoadMore(false);
      });
    };

  }, [loadMore, lastItem, sortBy]);

  return {blogs, setBlogs, loading}
};

export default useFetchBlogs;