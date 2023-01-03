import { useState, useEffect } from "react";
import { doc, FirestoreError, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { Blog } from "../components/HomePage/BlogSection";
import { blogsCollection } from "../firebase";
import { generateFirestoreErrorMsg } from "../utils/firebaseErrorMessages";
import { setOpen } from "../redux/features/snackbarSlice";

interface Props {
  blogId: string | null;
}

/**
 * Cargar el blog mediante la ID especificada en la url
 * para llenar los campos del formulario de edición. 
 */
const useBlogDefaultValues = ({blogId}: Props) => {
  const dispatch = useDispatch();

  const [values, setValues] = useState<Blog | null>(null);
  const [loadingValues, setLoadingValues] = useState(false);

  useEffect(() => {
    if(blogId) {
      getDocData(blogId);
    };
    
    async function getDocData (blogId: string) {
      try {
        setLoadingValues(true);

        if(!blogId.match(/[A-Za-z0-9]{20}/)) {
          throw new Error("Invalid blog id")
        };

        const docRef = doc(blogsCollection, blogId);
        const docSnapshot = await getDoc(docRef);
        const docData = docSnapshot.data() as Blog;

        if(!docData) {
          throw new Error("Blog not found or deleted")
        };

        setValues(docData);

      } catch (error: any) {
        let msg: string = error.message;

        const isFirestoreError = (err: object): err is FirestoreError => {
          return Object.keys(err).includes("code");
        };

        if(isFirestoreError(error)) {
          const errInstance = error as FirestoreError;
          const code = errInstance.code;
          msg = generateFirestoreErrorMsg(code);
        };

        dispatch(setOpen({open: true, message: msg}));

      } finally {
        setLoadingValues(false)
      }
    };

  }, [blogId]);

  return {
    values,
    loadingValues
  }
};

export default useBlogDefaultValues;