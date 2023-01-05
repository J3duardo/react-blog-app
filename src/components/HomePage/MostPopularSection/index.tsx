import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import PopularCategories from "./PopularCategories";
import CategorySkeleton from "../CategorySkeleton";
import PopularBlogSkeleton from "./PopularBlogSkeleton";
import { Blog } from "../BlogSection";
import { CategoryObj } from "../../../utils/arrayOccurrencesCounter";
import PopularBlog from "./PopularBlog";

interface Props {
  trendingCategories: CategoryObj[];
  testBlogs: Blog[];
  loading: boolean;
};

const MostPopular = ({trendingCategories, testBlogs, loading}: Props) => {
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

      {loading &&
        <Box className="home-page__popular-blogs">
          <PopularBlogSkeleton />
          <PopularBlogSkeleton />
          <PopularBlogSkeleton />
        </Box>
      }

      {!loading &&
        <Box className="home-page__popular-blogs">
          {testBlogs.map(blog => {
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