import {Suspense, lazy, useEffect} from "react";
import {useDispatch} from "react-redux";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Spinner from "./components/Spinner";
import GenericSnackbar from "./components/GenericSnackbar";
import ErrorBoundaries from "./components/ErrorBoundaries";
import Layout from "./components/Layout";
import {UserData, setCurrentUser, logoutUser, setLoading} from "./redux/features/authSlice";
import {auth} from "./firebase";

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
    auth.onAuthStateChanged((user) => {
      if (user) {
        const userData: UserData = {
          uid: user.uid,
          displayName: user.displayName || "",
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL
        };

        dispatch(setCurrentUser(userData));

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


  return (
    <BrowserRouter>
      <ErrorBoundaries>
        <Suspense
          fallback={
            <Spinner
              containerHeight="100vh"
              spinnerWidth="50px"
              spinnerHeight="50px"
              spinnerColor="black"
            />
          }
        >
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
      </ErrorBoundaries>
    </BrowserRouter>
  );
};

export default App;
