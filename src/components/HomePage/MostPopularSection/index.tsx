import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import PopularCategories from "./PopularCategories";
import PopularBlog from "./PopularBlog";
import CategorySkeleton from "../CategorySkeleton";
import PopularBlogSkeleton from "./PopularBlogSkeleton";
import useFetchPopularBlogs from "../../../hooks/useFetchPopularBlogs";
import { CategoryObj } from "../../../utils/arrayOccurrencesCounter";

interface Props {
  trendingCategories: CategoryObj[];
  loading: boolean;
};

const MostPopular = ({trendingCategories, loading}: Props) => {
  // Consultar los blogs más populares
  const {loadingPopularBlogs, popularBlogs} = useFetchPopularBlogs();

  return (
    <Box className="home-page__most-popular-section" component="aside">
      <Typography className="home-page__main-title" variant="h4">
        Popular categories
      </Typography>

      {loading && <CategorySkeleton />}
      {!loading && <PopularCategories trendingCategories={trendingCategories} />}

      <Typography className="home-page__main-title" variant="h4">
        Popular blogs
      </Typography>

      {loadingPopularBlogs &&
        <Box className="home-page__popular-blogs">
          <PopularBlogSkeleton />
          <PopularBlogSkeleton />
          <PopularBlogSkeleton />
        </Box>
      }

      {!loadingPopularBlogs &&
        <Box className="home-page__popular-blogs">
          {popularBlogs.map(blog => {
            return (
              <Link
                key={blog.id}
                className="home-page__popular-blogs__link-item"
                to={`/blog/${blog.id}`}
              >
                <PopularBlog blogData={blog} />
              </Link>
            )
          })}
        </Box>
      }
    </Box>
  )
};

export default MostPopular;