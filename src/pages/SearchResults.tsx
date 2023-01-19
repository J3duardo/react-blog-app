import { useState, useEffect } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import SearchResultsSkeleton from "../components/SearchResultsSkeleton";
import CategoryChip from "../components/BlogCard/CategoryChip";
import { searchByTitle } from "../utils/blogCrudHandlers";
import { setOpen } from "../redux/features/snackbarSlice";
import { Blog } from "./Home";
import "../styles/searchResults.css";

interface SearchResults extends Blog {
  excerpt: string;
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResults[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [noTerm, setNoTerm] = useState(false);
  

  useEffect(() => {
    const term = searchParams.get("term");

    if(term) {
      setLoading(true);
      setNoResults(false);
      setNoTerm(false);

      searchByTitle(term)
      .then((data) => {
        const length = data.length;

        if (length > 0) {
          setResults(() => {
            const posts = data.map(post => {
              return {
                ...post,
                excerpt: post.description.split(" ").slice(0, 50).join(" ")
              }
            });
            return posts;
          });
        } else {
          setNoResults(true);
        };
      })
      .catch((err: Error) => {
        dispatch(setOpen({open: true, message: err.message}));
      })
      .finally(() => {
        setLoading(false);
      });
      
    } else {
      setLoading(false);
      setNoTerm(true)
    }
  }, [searchParams]);


  // Mostrar spinner o skeleton
  if(loading) {
    return (
      <Box className="search-results">
        <SearchResultsSkeleton />
        <SearchResultsSkeleton />
        <SearchResultsSkeleton />
      </Box>
    )
  };


  // Redirigir al Home si no hay término de búsqueda
  if(noTerm && !loading) {
    return <Navigate to="/" replace />
  };

  
  // Mostrar mensaje si no hay resultados de búsqueda
  if(!loading && noResults) {
    return (
      <Typography variant="h4">
        No results found...
      </Typography>
    );
  };


  return (
    <Box className="search-results">
      {results.map(post => {
        return (
          <Box key={post.id} className="search-results__item">
            <Link className="search-result__title" to={`/blog/${post.id}`}>
              <Typography key={post.id} variant="h5">
                {post.title}
              </Typography>
              <Box className="search-results__categories">
                {post.categories.slice(0, 3).map((category) => {
                  return <CategoryChip key={category} category={category} />
                })}
              </Box>
            </Link>
            <Divider style={{width: "100%", margin: "var(--spacing-sm) 0"}} />
            <Typography className="search-result__excerpt" variant="subtitle1">
              {post.excerpt} ...
            </Typography>
          </Box>
        )
      })}
    </Box>
  );
};

export default SearchResults;