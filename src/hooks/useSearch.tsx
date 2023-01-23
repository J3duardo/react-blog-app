import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { DocumentData, DocumentSnapshot, FirestoreError, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { Blog } from "../pages/Home";
import { limitAmount } from "../components/NavBar/SearchBar";
import { setOpen } from "../redux/features/snackbarSlice";
import { searchByTitle } from "../utils/blogCrudHandlers";
import { blogsCollection } from "../firebase";
import { generateFirestoreErrorMsg } from "../utils/firebaseErrorMessages";

export interface SearchResults extends Blog {
  excerpt: string;
};

/**
 * Custom hook para buscar y paginar posts por título
 * según el término de búsqueda
 * especificado en el query string.
 */
const useSearch = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResults[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [noResults, setNoResults] = useState(false);
  const [noTerm, setNoTerm] = useState(false);

  const [loadMore, setLoadMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [_firstDoc, setFirstDoc] = useState<DocumentSnapshot<DocumentData> | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot<DocumentData> | null>(null);
  const [isLastPage, setIsLastPage] = useState(false);


  /*--------------------------------------------------*/
  // Determinar si es la ultima página de resultados
  /*--------------------------------------------------*/
  useEffect(() => {
    if(totalResults > results.length) {
      setIsLastPage(false)
    } else {
      setIsLastPage(true)
    }
  }, [results]);
  

  /*----------------------------------------*/
  // Cargar la primera página de resultados
  /*----------------------------------------*/
  useEffect(() => {
    const term = searchParams.get("term");

    if(term) {
      setLoading(true);
      setNoResults(false);
      setNoTerm(false);

      searchByTitle(term, limitAmount)
      .then(({results, firstDoc, lastDoc, count}) => {
        const length = results.length;

        setTotalResults(count);

        if (length > 0) {
          setFirstDoc(firstDoc);
          setLastDoc(lastDoc);

          setResults(() => {
            const posts = results.map(post => {
              return {
                ...post,
                excerpt: post.description.split(" ").slice(0, 50).join(" ")
              }
            }) satisfies SearchResults[]
            return posts;
          });
        } else {
          setNoResults(true);
        };
      })
      .catch((err: Error) => {
        dispatch(setOpen({open: true, message: err.message}));
      })
      .finally(() => {
        setLoading(false);
      });
      
    } else {
      setLoading(false);
      setNoTerm(true)
    }
  }, [searchParams]);


  /*---------------------------------------------*/
  // Cargar las siguientes páginas de resultados
  /*---------------------------------------------*/
  useEffect(() => {
    const term = searchParams.get("term");

    if(!term) {
      return setNoTerm(true);
    };

    if(!lastDoc) {
      return
    };

    const termArr = term.split(" ").map(term => term.toLowerCase());

    const searchMoreQuery = query(
      blogsCollection,
      where("titleArray", "array-contains-any", termArr),
      orderBy("createdAt", "desc"),
      limit(limitAmount),
      startAfter(lastDoc)
    );

    if(loadMore && lastDoc) {
      setLoadingMore(true);

      getDocs(searchMoreQuery)
      .then((snapshot) => {
        const lastItem = snapshot.docs[snapshot.docs.length - 1];
  
        setLastDoc(lastItem);
  
        const docs = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            excerpt: doc.data().description.split(" ").slice(0, 50).join(" ") as string,
            ...doc.data()
          }
        }) as SearchResults[];
  
        setResults((prev) => [...prev, ...docs]);
      })
      .catch((error: FirestoreError) => {
        let msg = error.message;
  
        if(error.code){
          msg = generateFirestoreErrorMsg(error.code);
        };
  
        dispatch(setOpen({open: true, message: msg}));
      })
      .finally(() => {
        setLoadingMore(false);
        setLoadMore(false);
      });
    }
  }, [loadMore, searchParams, lastDoc]);

  return {results, loading, isLastPage, noResults, setLoadMore, loadingMore, noTerm};
};

export default useSearch;