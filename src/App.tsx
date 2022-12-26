import {Suspense, lazy} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import Spinner from "./components/Spinner";

const HomePage = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/Login"));
const SignupPage = lazy(() => import("./pages/Signup"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const CreateBlogPage = lazy(() => import("./pages/CreateBlog"));
const AboutPage = lazy(() => import("./pages/About"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

const App = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnHover={true}
        pauseOnFocusLoss={true}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/blog/:blogId" element={<BlogDetails />} />
          <Route path="/blog/create" element={<CreateBlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
