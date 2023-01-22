import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DocumentData, DocumentSnapshot, endBefore, FirestoreError, getCountFromServer, getDocs, limit, orderBy, Query, query, startAfter } from "firebase/firestore";
import { Blog, SortBy } from "../pages/Home";
import { blogsCollection } from "../firebase";
import { setOpen } from "../redux/features/snackbarSlice";
import { generateFirestoreErrorMsg } from "../utils/firebaseErrorMessages";

const limitAmount = 4;

/**
 * Query para consultar las siguientes páginas de posts
 * en el orden especificado.
 * @param sort Orden cronológico en el que se van a consultar los posts (asc | desc)
 * @param firstItem Primer documento del resultado del query.
 * @param lastItem Último documento del resultado del query.
 */
const POSTS_QUERY = (
  sort: SortBy,
  firstItem: DocumentSnapshot<DocumentData>,
  lastItem: DocumentSnapshot<DocumentData>
) => {
  let blogsQuery: Query<DocumentData>;

  if(sort === "desc") {
    blogsQuery = query(
      blogsCollection,
      orderBy("createdAt", "desc"),
      startAfter(lastItem),
      limit(limitAmount)
    );
  } else {
    blogsQuery = query(
      blogsCollection,
      orderBy("createdAt", "asc"),
      endBefore(firstItem),
      limit(limitAmount)
    );
  };

  return blogsQuery;
};

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
    const blogsQuery = query(blogsCollection, orderBy("createdAt", sortBy), limit(limitAmount));

    getDocs(blogsQuery)
    .then((data) => {
      const posts = data.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as Blog[];

      const firstDoc = data.docs[0];
      const lastDoc = data.docs[data.docs.length - 1];

      setFirstItem(firstDoc);
      setLastItem(lastDoc);
      setBlogs(posts);
    })
    .catch((error: FirestoreError) => {
      console.log(error.message);
      dispatch(setOpen({open: true, message: "Error loading blogs."}))
    })
    .finally(() => {
      setLoading(false);
    });

  }, []);


  /**
   * Cargar las siguientes páginas de posts
   * al clickear el botón de cargar más.
   */
  useEffect(() => {
    if(loadMore) {
      // Retornar sin ejecutar el query si
      // no se proporciona el first o el last item.
      if(!firstItem || !lastItem) {
        setLoadMore(false);
        return setLoadingMore(false);
      };

      // Generar el query para consultar los posts en el orden especificado.
      const postsQuery = POSTS_QUERY(sortBy, firstItem, lastItem);
        
      setLoadingMore(true);

      // Ejecutar el query.
      getDocs(postsQuery)
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
  
        // Si el orden es descendente, agregar los siguientes posts debajo en el timeline,
        // si el orden es ascendente, agregarlos encima.
        if(sortBy === "desc") {
          setBlogs((prev) => [...prev, ...docs])
        } else {
          setBlogs((prev) => [...docs, ...prev])
        };
  
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