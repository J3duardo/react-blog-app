import { Dispatch as ReactDispatch, SetStateAction } from "react";
import { AnyAction, Dispatch as ReduxDispatch } from "@reduxjs/toolkit";
import { AuthError } from "firebase/auth";
import { arrayUnion, collection, deleteDoc, doc, DocumentData, DocumentReference, DocumentSnapshot, FirestoreError, getCountFromServer, getDoc, getDocs, limit, orderBy, Query, query, setDoc, where, writeBatch } from "firebase/firestore";
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

interface SearchPostsPromise {
  results: Blog[];
  firstDoc: DocumentSnapshot<DocumentData>;
  lastDoc: DocumentSnapshot<DocumentData>;
  count: number;
};

interface SearchArgs {
  term: string | null;
  category: string | null;
  limitAmount: number
}

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

  // Transacción para eliminar el post y sus comentarios asociados.
  const batch = writeBatch(db);

  try {
    // Path de las imágenes del blog en el bucket.
    const mainImagePath = `blogs/${author.uid}/${title}/${imageName}`;
    const previewImagePath = `blogs/${author.uid}/${title}/preview-${imageName}`;

    // Referencias de las imágenes del blog.
    const mainImageRef = ref(storage, mainImagePath);
    const previewImageRef = ref(storage, previewImagePath);

    // Referencia del post a eliminar.
    const postRef = doc(db, "blogs", id);

    // Buscar los comentarios asociados al post.
    const commentsQuery = query(collection(db, "blogComments"), where("postId", "==", id));
    const comments = await getDocs(commentsQuery);
    const commentsIds = comments.docs.map(doc => doc.id);

    // Referencias de los comentarios del post.
    const commentsRefs = commentsIds.map((id) => doc(db, "blogComments", id));

    // Referencia de los views del post
    const viewsRef = doc(db, "blogViews", id);

    // Eliminar el post.
    batch.delete(postRef);
    
    // Eliminar los comentarios del post.
    commentsRefs.forEach((commentRef) => {
      batch.delete(commentRef)
    });

    // Eliminar los views del post.
    batch.delete(viewsRef);

    // Ejecutar la transacción de eliminación del post y de sus comentarios.
    await batch.commit();

    // Eliminar las imágenes del post.
    await deleteObject(mainImageRef);
    await deleteObject(previewImageRef);

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
 * Buscar posts por título o por categoría según el término especificado en la URL.
 * Sólo puedes especificar un término de búsqueda: `title` o `category`
 * @param term Título del post a usar como criterio de búsqueda.
 * @param category Categoría a usar como criterio de búsqueda.
 * @param limitAmount Cantidad de resultados a devolver por página.
 */
export const searchPosts = async ({term, category, limitAmount}: SearchArgs): Promise<SearchPostsPromise> => {
  try {
    if (term && category) {
      throw new Error("You can specify onlye one search criteria")
    };

    let searchQuery: Query<DocumentData> | null = null;
    let searchCountQuery: Query<DocumentData> | null = null;

    if (term) {
      const termArr = term.split(" ").map(term => term.toLowerCase());

      searchQuery = query(
        blogsCollection,
        where("titleArray", "array-contains-any", termArr),
        orderBy("createdAt", "desc"),
        limit(limitAmount)
      );

      searchCountQuery = query(
        blogsCollection,
        where("titleArray", "array-contains-any", termArr)
      );
    };

    if (category) {
      searchQuery = query(
        blogsCollection,
        where("categories", "array-contains", category),
        orderBy("createdAt", "desc"),
        limit(limitAmount)
      );

      searchCountQuery = query(
        blogsCollection,
        where("categories", "array-contains", category)
      );
    };


    // Consultar el número total de resultados.
    const resultsCount = await getCountFromServer(searchCountQuery!);

    const docsSnap = await getDocs(searchQuery!);
    const firstDoc = docsSnap.docs[0];
    const lastDoc = docsSnap.docs[docsSnap.docs.length - 1];

    const results = docsSnap.docs.map(doc => {
      return {id: doc.id, ...doc.data()}
    }) as Blog[];

    return {results, firstDoc, lastDoc, count: resultsCount.data().count};

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