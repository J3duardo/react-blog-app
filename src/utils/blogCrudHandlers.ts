import { Dispatch as ReactDispatch, SetStateAction } from "react";
import { AnyAction, Dispatch as ReduxDispatch } from "@reduxjs/toolkit";
import { AuthError } from "firebase/auth";
import { arrayUnion, deleteDoc, doc, DocumentData, DocumentReference, FirestoreError, getDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import { deleteObject, ref, StorageError } from "firebase/storage";
import { blogsCollection, db, storage } from "../firebase";
import { setOpen } from "../redux/features/snackbarSlice";
import { Blog } from "../pages/Home";
import { getUserIp } from "./auth";
import { generateFirebaseAuthErrorMsg, generateFirebaseStorageErrorMsg, generateFirestoreErrorMsg } from "./firebaseErrorMessages";

export interface DeleteBlogConfig {
  blogData: Blog;
  dispatch: ReduxDispatch<AnyAction>
};

export interface BlogViews {
  blogId: string;
  views: string[];
};

/**
 * Actualizar el contador de views del blog especificado.
 * @param blogRef Referencia del documento de Firebase del blog a consultar.
 * @param viewsRef Referencia del documento de Firebase de los views del blog a consultar.
 * @returns Data del blog y número de views.
 */
export const updateBlogViews = async (
  blogRef: DocumentReference<DocumentData>,
  viewsRef: DocumentReference<DocumentData>,
  setBlogViews: ReactDispatch<SetStateAction<number>>,
  setError: ReactDispatch<SetStateAction<string | null>>
) => {
  try {
    // Consultar la IP del usuario
    const ip = await getUserIp();
  
    // Retornar si hubo error al consultar la IP del usuario
    if(!ip) {
      throw new Error("Unknown error");
    };
  
    // Agregar la ip al array de IPs del blogView si no está presente
    await  setDoc(
      viewsRef,
      {
        blogId: blogRef.id,
        views: arrayUnion(ip),
        // viewsCount: increment(1)
      },
      {merge: true}
    );

    // Actualizar el contador del blogView con el length actualizado del array de IPs
    const ref = doc(db, "blogViews", blogRef.id);
    const viewsDoc = await getDoc(ref);
    const currentViews = viewsDoc.get("views") as string[];

    await setDoc(viewsRef, {viewsCount: currentViews.length}, {merge: true});
    setBlogViews(currentViews.length);
    
  } catch (error: unknown) {
    console.log("Error updating views counter", error);
    const err = error as FirestoreError;
    const msg = generateFirestoreErrorMsg(err.code);
    setError(msg);
  }
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


/**
 * Buscar posts por título especificando el término de búsqueda.
 * @param term Término de búsqueda de los posts.
 */
export const searchByTitle = async (term: string): Promise<Blog[]> => {
  try {
    const termArr = term.split(" ").map(term => term.toLowerCase());

    const searchQuery = query(
      blogsCollection,
      where("titleArray", "array-contains-any", termArr),
      orderBy("createdAt", "desc")
    );

    const docsSnap = await getDocs(searchQuery);

    const results = docsSnap.docs.map(doc => {
      return {id: doc.id, ...doc.data()}
    }) as Blog[];

    return results;

  } catch (error: any) {
    console.log(`Error searching posts`, error);

    let message: string = error.message;
    const err = error as FirestoreError;

    if(err.code) {
      message = generateFirestoreErrorMsg(err.code);
    };

    throw new Error(message);
  }
};