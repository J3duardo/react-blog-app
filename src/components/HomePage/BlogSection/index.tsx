import { Box, Skeleton, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import BlogCard from "../../BlogCard";
import BlogCardSkeleton from "../../BlogCard/BlogCardSkeleton";
import { UserData } from "../../../redux/features/authSlice";

type BlogAuthor = Omit<UserData, "email">

export interface Blog {
  id: string;
  title: string;
  categories: string[];
  description: string;
  imageUrl: string;
  thumbUrl: string;
  author: BlogAuthor;
  createdAt: Timestamp
};

interface Props {
  currentUser: UserData | null;
  blogs: Blog[];
  loading: boolean;
};

const BlogSection = ({currentUser, blogs, loading}: Props) => {
  return (
    <Box className="home-page__blog-section" component="article">
      <Typography className="home-page__blogs-title" variant="h4">
        Recent Blogs
      </Typography>

      {loading && (
        <Box className="home-page__blog-grid">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </Box>
      )}

      {!loading &&
        <Box className="home-page__blog-grid">
          {blogs.map(blog => <BlogCard key={blog.id} blog={blog} />)}
        </Box>
      }
    </Box>
  )
};

export default BlogSection;