import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import BlogSection from "../components/HomePage/BlogSection";
import MostPopular from "../components/HomePage/MostPopularSection";
import { AuthState, LayoutState } from "../redux/store";
import useFetchBlogs from "../hooks/useFetchBlogs";
import "../styles/homePage.css";

const Home = () => {
  const {user} = useSelector((state: AuthState) => state.auth);
  const {pagePadding: {top, bottom}} = useSelector((state: LayoutState) => state.layout);

  const {blogs, trendingCategories, loading} = useFetchBlogs();

  return (
    <Box
      style={{paddingTop: top, paddingBottom: bottom}}
      className="home-page inner-wrapper"
      component="main"
    >
      <Box className="home-page__main-section" component="section">
        <BlogSection
          currentUser={user}
          blogs={blogs}
          loading={loading}
        />
        <MostPopular 
          loading={loading}
          testBlogs={blogs.slice(0,3)}
          trendingCategories={trendingCategories}
        />
      </Box>
    </Box>
  )
};

export default Home;