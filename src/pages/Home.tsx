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
      style={{
        minHeight: `calc(100vh - ${navbarHeight}px - 24px)`,
        paddingBottom: sortBy === "desc" ? 0 : "var(--spacing-lg)"
      }}
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

      {/* Loader de la primera página de posts */}
      {loading && (
        <Box className="home-page__blog-grid">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </Box>
      )}

      {/* Grid de los posts */}
      {!loading &&
        <Box className="home-page__blog-grid">
          {blogs.map(blog => {
            return (
              <BlogCard
                key={blog.id}
                blog={blog}
                user={user}
                setBlogs={setBlogs}
              />
            )
          })}
        </Box>
      }

      {/*
        Loader para indicar la carga de los siguientes posts.
        Si se ordenan descendentemente, aparece debajo de los posts y encima del botón.
        Si se ordenan ascendentemente, aparece encima de los posts y debajo del botón.
      */}
      {loadingMore &&
        <Box
          style={{order: sortBy === "desc" ? 30 : 16}}
          className="home-page__blog-grid"
        >
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </Box>
      }

      {/*
        Botón para cargar más posts.
        Si se ordenan descendentemente, se muestra debajo de los posts y debajo del loader.
        Si se ordenan ascendentemente, se muestra encima de los posts y encima del loader.
      */}
      {!loading &&
        <Button
          style={{
            marginTop: sortBy === "desc" ? "auto" : "0",
            order: sortBy === "desc" ? 31 : 15
          }}
          className="home-page__load-more-btn"
          disabled={loadingMore || isLastPage}
          onClick={() => {
            setLoadMore(true);
            setLoadingMore(true)
          }}
        >
          {!isLastPage ? "Load older posts" : "No more posts available."}
        </Button>
      }
    </Box>
  )
};

export default Home;