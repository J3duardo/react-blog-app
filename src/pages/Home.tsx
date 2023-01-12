import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { AuthState } from "../redux/store";
import BlogCard from "../components/BlogCard";
import BlogCardSkeleton from "../components/BlogCard/BlogCardSkeleton";
import useFetchBlogs from "../hooks/useFetchBlogs";
import { UserData } from "../redux/features/authSlice";
import { Timestamp } from "firebase/firestore";
import "../styles/homePage.css";

type BlogAuthor = Omit<UserData, "email">

export interface Blog {
  id: string;
  title: string;
  categories: string[];
  description: string;
  imageUrl: string;
  thumbUrl: string;
  author: BlogAuthor;
  imageName: string;
  createdAt: Timestamp
};

const Home = () => {
  const {user} = useSelector((state: AuthState) => state.auth);

  const {blogs, loading} = useFetchBlogs();

  return (
    <Box className="home-page" component="section">
      <Typography className="home-page__main-title" variant="h4">
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
          {blogs.map(blog => <BlogCard key={blog.id} blog={blog} user={user} />)}
        </Box>
      }
    </Box>
  )
};

export default Home;