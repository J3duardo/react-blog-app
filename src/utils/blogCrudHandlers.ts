import { AnyAction, Dispatch as ReduxDispatch } from "@reduxjs/toolkit";
import { AuthError } from "firebase/auth";
import { deleteDoc, doc, DocumentData, DocumentReference, FirestoreError, getDoc, setDoc } from "firebase/firestore";
import { deleteObject, ref, StorageError } from "firebase/storage";
import { db, storage } from "../firebase";
import { setOpen } from "../redux/features/snackbarSlice";
import { Blog } from "../components/HomePage/BlogSection";
import { getUserIp } from "./auth";
import { generateFirebaseAuthErrorMsg, generateFirebaseStorageErrorMsg, generateFirestoreErrorMsg } from "./firebaseErrorMessages";

export interface DeleteBlogConfig {
  blogData: Blog;
  dispatch: ReduxDispatch<AnyAction>;
};

/**
 * Consultar la data del blog y actualizar el contador de views.
 * @param blogRef Referencia del documento de Firebase del blog a consultar.
 * @param viewsRef Referencia del documento de Firebase de los views del blog a consultar.
 * @returns Data del blog y número de views.
 */
export const getBlogData = async (
  blogRef: DocumentReference<DocumentData>,
  viewsRef: DocumentReference<DocumentData>
) => {
  // Consultar la data del blog
  const blogSnapshot = await getDoc(blogRef);

  // Consultar los views del blog
  const viewsSnapshot = await getDoc(viewsRef);

  // Retornar con error si el blog no existe
  if(!blogSnapshot.exists()) {
    throw new Error("Blog not found or deleted")
  };

  // Extraer la data del blog
  const blogData = {id: blogSnapshot.id, ...blogSnapshot.data()} as Blog;

  // Consultar la IP del usuario
  const ip = await getUserIp();
  let currentViewsIps: string[] = [];
  let currentViewsCount: number = 0;

  // Verificar si ya existe la colección de views del blog
  if(viewsSnapshot.exists()) {
    currentViewsIps = viewsSnapshot.data().views as string[];
    currentViewsCount = currentViewsIps.length;
  };

  // Si la IP actual no está en los views del blog, agregarla.
  if(ip && !currentViewsIps.includes(ip)) {
    currentViewsIps.push(ip);

    await setDoc(
      viewsRef,
      {
        blogId: blogSnapshot.id,
        views: currentViewsIps,
        viewsCount: currentViewsIps.length
      },
      {merge: true}
    );
  };

  return {
    blogData,
    currentViewsCount
  };
};


/**
 * Eliminar un blog
 */
export const deleteBlog = async ({blogData, dispatch}: DeleteBlogConfig) => {
  const {id, author, title, imageName} = blogData;

  try {
    // Path de las imágenes del blog en el bucket
    const mainImagePath = `blogs/${author.uid}/${title}/${imageName}`;
    const previewImagePath = `blogs/${author.uid}/${title}/preview-${imageName}`;

    // Referencias de las imágenes del blog
    const mainImageRef = ref(storage, mainImagePath);
    const previewImageRef = ref(storage, previewImagePath);

    // Eliminar las imágenes
    await deleteObject(mainImageRef);
    await deleteObject(previewImageRef);

    // Eliminar el documento del blog en la DB
    await deleteDoc(doc(db, "blogs", id));

    dispatch(setOpen({open: true, message: "Blog deleted successfully"}));
    
  } catch (error: any) {
    let err: StorageError | AuthError | FirestoreError;
    let message: string;

    if(error.message.includes("storage")) {
      err = error as StorageError;
      message = generateFirebaseStorageErrorMsg(err.code);

      // Eliminar el documento de la DB
      deleteDoc(doc(db, "blogs", id));

    } else if (error.message.includes("auth")) {
      err = error as AuthError;
      message = generateFirebaseAuthErrorMsg(err.code);
      
      // Eliminar el documento de la DB
      deleteDoc(doc(db, "blogs", id));
      
    } else {
      err = error as FirestoreError;
      message = generateFirestoreErrorMsg(err.code);

      // Eliminar el documento de la DB
      deleteDoc(doc(db, "blogs", id));
    };
    
    dispatch(setOpen({open: true, message}));

  };
};