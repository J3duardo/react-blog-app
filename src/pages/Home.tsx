import { useState } from "react";
import { Box, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { BsArrowDown, BsArrowUp, BsFilter } from "react-icons/bs";
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

export type SortBy = "asc" | "desc";

const Home = () => {
  const {user} = useSelector((state: AuthState) => state.auth);

  // Anchor del dropdown del sort
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("desc");

  // Consultar los blogs
  const {blogs, loading} = useFetchBlogs(sortBy);

  // Click handler del menú sort
  const onSortHandler = (orderBy: SortBy) => {
    setSortBy(orderBy);
    setAnchorElement(null);
  };

  return (
    <Box className="home-page" component="section">
      <Box className="home-page__header">
        <Typography className="home-page__main-title" variant="h4">
          Recent Posts
        </Typography>

        {/* Botón del dropdown del menú sort */}
        <Box className="home-page__sort" component="div">
          <Tooltip title="Sort by">
            <span>
              <IconButton
                size="small"
                disabled={loading}
                onClick={(e) => setAnchorElement(e.currentTarget)}
              >
                <BsFilter style={{fontSize: "24px"}} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Dropdown del menú sort */}
        <Menu
          style={{padding: 0}}
          open={!!anchorElement}
          anchorEl={anchorElement}
          disableScrollLock
          onClose={() => setAnchorElement(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >
          <MenuItem
            style={{backgroundColor: sortBy === "desc" ? "lightgrey" : "white"}}
            onClick={() => onSortHandler("desc")}
            >
            <BsArrowDown style={{marginRight: "5px"}} />
            Newest to oldest
          </MenuItem>

          <Divider style={{margin: 0}} />

          <MenuItem
            style={{backgroundColor: sortBy === "asc" ? "lightgrey" : "white"}}
            onClick={() => onSortHandler("asc")}
          >
            <BsArrowUp style={{marginRight: "5px"}} />
            Oldest to newest
          </MenuItem>
        </Menu>
      </Box>

      {loading && (
        <Box className="home-page__blog-grid">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
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