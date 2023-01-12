import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { Blog } from "../pages/Home";
import { blogsCollection, db } from "../firebase";

type BlogsViews = {
  blogId: string,
  views: number
}

/**
 * Custom hook para consultar los blogs más populares.
 * Los blogs más populares son los blogs con la mayor cantidad de views.
 * Los views se determinan por la dirección IP del usuario visitante o logueado.
 */
const useFetchPopularBlogs = () => {
  const [loadingPopularBlogs, setLoadingPopularBlogs] = useState(true);
  const [popularBlogsCount, setPopularBlogsCount] = useState<BlogsViews[]>([]);
  const [popularBlogs, setPopularBlogs] = useState<Blog[]>([]);


  /*---------------------------------------------*/
  // Consultar las ids de los blogs más populares
  /*---------------------------------------------*/
  useEffect(() => {
    // Query para consultar la colección de blog views ordenando por número de views
    const q = query(collection(db, "blogViews"), orderBy("viewsCount", "desc"), limit(3));

    // Ejecutar el query y extraer las IDs de los bologs más vistos
    // y sus respectivas cantidades de views.
    getDocs(q)
    .then(querySnapshot => {
      const docs = querySnapshot.docs.map(doc => {
        return {blogId: doc.data().blogId, views: doc.data().viewsCount};
      }) as BlogsViews[];
      return docs;
    })
    .then(data => {
      setPopularBlogsCount(data)
    })
    .catch((err: any) => {
      console.log(err.message)
    });
  }, []);


  /*--------------------------------------------------------------------------*/
  // Consultar los blogs correspondientes a las IDs de los blogs más populares
  /*--------------------------------------------------------------------------*/
  useEffect(() => {
    if(popularBlogsCount.length > 0) {
      // Extraer las ids de los blogs más populares
      const popularBlogsIds = popularBlogsCount.map(el => el.blogId) as string[];

      // Query para consultar los blogs correspondientes a las ids.
      // El keyword __name__ es el path del documento en Firestore.
      const q = query(blogsCollection, where("__name__", "in", popularBlogsIds));

      // Ejecutar el query.
      getDocs(q)
      .then(snapshot => {
        return snapshot.docs.map((doc) => {
          return {id: doc.id, ...doc.data()}
        }) as Blog[];
      })
      .then(blogs => {
        setPopularBlogs(blogs)
      })
      .catch((err: any) => {
        console.log(err.message)
      })
      .finally(() => setLoadingPopularBlogs(false));
    };

  }, [popularBlogsCount]);

  return {loadingPopularBlogs, popularBlogs}
};

export default useFetchPopularBlogs;