import {Suspense, lazy, useEffect} from "react";
import {useDispatch} from "react-redux";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {collection, doc, getDoc, setDoc} from "firebase/firestore";
import Spinner from "./components/Spinner";
import GenericSnackbar from "./components/GenericSnackbar";
import ErrorBoundaries from "./components/ErrorBoundaries";
import Layout from "./components/Layout";
import GoToTopBtn from "./components/GoToTopBtn";
import NavBar from "./components/NavBar";
import {UserData, setCurrentUser, setCurrentProfile, logoutUser, setLoading, UserProfile} from "./redux/features/authSlice";
import {auth, db, profilesCollection} from "./firebase";

const HomePage = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/Login"));
const SignupPage = lazy(() => import("./pages/Signup"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const CreateBlogPage = lazy(() => import("./pages/CreateBlog"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Listener de los cambios de autenticación
    auth.onAuthStateChanged(async (user) => {
      if (user){
        dispatch(setLoading(true));

        const userData: UserData = {
          uid: user.uid,
          displayName: user.displayName || "",
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL
        };

        // Actualizar el estado a online
        await setDoc(
          doc(collection(db, "onlineUsers"), user.uid),
          {userId: user.uid, isOnline: true},
          {merge: true}
        );

        // Consultar el perfil del usuario y
        // crear el perfil si no existe
        const profileData: UserProfile = {
          uid: user.uid,
          name: user.displayName!.split(" ")[0],
          lastname: user.displayName!.split(" ")[1],
          email: user.email,
          emailVerified: user.emailVerified,
          avatar: "https://res.cloudinary.com/dzytlqnoi/image/upload/v1615203395/default-user-img_t3xpfj.jpg"
        };
        
        const userProfileDoc = doc(profilesCollection, user.uid);

        // Verificar si ya el perfil existe
        const profile = await getDoc(userProfileDoc);

        // Crear el perfil si no existe
        if (!profile.exists()) {
          await setDoc(userProfileDoc, profileData, {merge: true});
          dispatch(setCurrentProfile(profileData));
          
        } else {
          dispatch(setCurrentProfile(profile.data() as UserProfile));
        };

        dispatch(setCurrentUser(userData));
        dispatch(setLoading(false));

      } else {
        dispatch(logoutUser());
        dispatch(setLoading(false));
      }
    });

    // Listener de los eventos de localStorage
    // para actualizar la data del usuario cuando ésta
    // cambie en otra ventana del navegador.
    window.addEventListener("storage", async (e: StorageEvent) => {
      const key = e.key;
      const newValue = e.newValue;

      // Si el evento actualizó la data del current user
      // reautenticar al usuario actualizar el state global.
      if(key === "currentUser" && newValue) {
        //! No funciona, no actualiza la data en la caché de firebase
        let currentUser = auth.currentUser;
        await currentUser!.reload();

        dispatch(setCurrentUser(JSON.parse(newValue)));
      };

      // Si el evento eliminó la data del current user
      // cerrar la sesión del usuario.
      if(key === "currentUser" && !newValue) {
        dispatch(logoutUser())
      };
    });
  }, []);


  const SuspenseFallback = (
    <Spinner
      containerHeight="100vh"
      spinnerWidth="50px"
      spinnerHeight="50px"
      spinnerColor="black"
    />
  );

  return (
    <BrowserRouter>
      <ErrorBoundaries>
        <NavBar />
        <Suspense fallback={SuspenseFallback}>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/blog/:blogId" element={<BlogDetails />} />
              <Route path="/blog/create" element={<CreateBlogPage />} />
              <Route path="/blog/search" element={<SearchResults />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </Suspense>
        <GenericSnackbar />
        <GoToTopBtn />
      </ErrorBoundaries>
    </BrowserRouter>
  );
};

export default App;
