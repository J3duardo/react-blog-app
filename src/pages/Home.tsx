import { useState, useEffect } from "react";
import { Box, Button, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { BsArrowDown, BsArrowUp, BsFilter } from "react-icons/bs";
import { AuthState, LayoutState } from "../redux/store";
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
  const navbarHeight = useSelector((state: LayoutState) => state.layout.navbarHeight);

  // Anchor del dropdown del sort
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("desc");

  const [loadMore, setLoadMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [docsCount, setDocsCount] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  
  // Consultar los blogs
  const {blogs, setBlogs, loading} = useFetchBlogs(
    sortBy,
    loadMore,
    setLoadMore,
    setLoadingMore,
    setDocsCount
  );


  // Determinar si es la última página de posts
  // para deshabilitar/habilitar el botón de cargar mas.
  useEffect(() => {
    if(blogs.length === docsCount) {
      setIsLastPage(true);
    } else {
      setIsLastPage(false);
    };
  }, [blogs, docsCount]);


  /**
   * Ordenar los posts en el frontend
   * por fecha ascendente o descedente.
   */
  const onSortHandler = (orderBy: SortBy) => {
    if(orderBy === "asc") {
      const sorted = blogs.sort((a, b) => {
        return a.createdAt.toDate().getTime() - b.createdAt.toDate().getTime()
      });

      setBlogs(sorted)
    };

    if(orderBy === "desc") {
      const sorted = blogs.sort((a, b) => {
        return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
      });

      setBlogs(sorted)
    }

    setSortBy(orderBy);
    setAnchorElement(null);
  };

  return (
    <Box
      style={{minHeight: `calc(100vh - ${navbarHeight}px - 24px)`}}
      className="home-page"
      component="section"
    >
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

      {loadingMore &&
        <Box className="home-page__blog-grid">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </Box>
      }

      {!loading &&
        <Button
          className="home-page__load-more-btn"
          disabled={loadingMore || isLastPage}
          onClick={() => {
            setLoadMore(true);
            setLoadingMore(true)
          }}
        >
          {!isLastPage ? "Load more" : "No more posts available."}
        </Button>
      }
    </Box>
  )
};

export default Home;