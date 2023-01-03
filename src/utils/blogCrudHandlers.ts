import { AnyAction, Dispatch as ReduxDispatch } from "@reduxjs/toolkit";
import { AuthError } from "firebase/auth";
import { deleteDoc, doc, FirestoreError } from "firebase/firestore";
import { deleteObject, ref, StorageError } from "firebase/storage";
import { db, storage } from "../firebase";
import { generateFirebaseAuthErrorMsg, generateFirebaseStorageErrorMsg, generateFirestoreErrorMsg } from "./firebaseErrorMessages";
import { setOpen } from "../redux/features/snackbarSlice";
import { Blog } from "../components/HomePage/BlogSection";

export interface DeleteBlogConfig {
  blogData: Blog;
  dispatch: ReduxDispatch<AnyAction>;
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