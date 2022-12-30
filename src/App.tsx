import {Suspense, lazy, useEffect} from "react";
import {useDispatch} from "react-redux";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from "./components/NavBar";
import Spinner from "./components/Spinner";
import GenericSnackbar from "./components/GenericSnackbar";
import {UserData, setCurrentUser, logoutUser, setLoading} from "./redux/features/authSlice";
import {auth} from "./firebase";

const HomePage = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/Login"));
const SignupPage = lazy(() => import("./pages/Signup"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const CreateBlogPage = lazy(() => import("./pages/CreateBlog"));
const AboutPage = lazy(() => import("./pages/About"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
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
  }, []);

  return (
    <BrowserRouter>
      <NavBar />
      <Suspense fallback={
        <Spinner 
          containerHeight="100vh"
          spinnerWidth="50px"
          spinnerHeight="50px"
          spinnerColor="black"
        />}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/blog/:blogId" element={<BlogDetails />} />
          <Route path="/blog/create" element={<CreateBlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <GenericSnackbar />
    </BrowserRouter>
  );
};

export default App;
