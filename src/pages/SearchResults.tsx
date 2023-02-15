import { Box, Button, Divider, Typography } from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchResultsSkeleton from "../components/SearchResultsSkeleton";
import CategoryChip from "../components/BlogCard/CategoryChip";
import useSearch from "../hooks/useSearch";
import { LayoutState } from "../redux/store";
import "../styles/searchResults.css";

const SearchResultsPage = () => {
  const navbarHeight = useSelector((state: LayoutState) => state.layout.navbarHeight);

  // Cargar y paginar los resultados de las búsquedas.
  const {
    results,
    isLastPage,
    noResults,
    noTerm,
    loading,
    loadingMore,
    setLoadMore
  } = useSearch();


  // Mostrar spinner o skeleton.
  if(loading) {
    return (
      <Box className="search-results">
        <SearchResultsSkeleton />
        <SearchResultsSkeleton />
        <SearchResultsSkeleton />
      </Box>
    )
  };


  // Redirigir al Home si no hay término de búsqueda.
  if(noTerm && !loading) {
    return <Navigate to="/" replace />
  };

  
  // Mostrar mensaje si no hay resultados de búsqueda.
  if(!loading && noResults) {
    return (
      <Typography variant="h4">
        No results found...
      </Typography>
    );
  };


  return (
    <Box
      style={{minHeight: `calc(100vh - ${navbarHeight}px - 24px)`}}
      className="search-results-wrapper"
    >
      <Box className="search-results">
        {results.map(post => {
          return (
            <Box key={post.id} className="search-results__item">
              <Box style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                <Link className="search-result__title" to={`/blog/${post.id}`}>
                  <Typography key={post.id} variant="h5">
                    {post.title}
                  </Typography>
                </Link>
                <Box className="search-results__categories">
                  {post.categories.slice(0, 3).map((category) => {
                    return <CategoryChip key={category} category={category} />
                  })}
                </Box>
              </Box>
              <Divider style={{width: "100%", margin: "var(--spacing-sm) 0"}} />
              <Typography dangerouslySetInnerHTML={{__html: post.excerpt + " ..."}}/>
            </Box>
          )
        })}

        {loadingMore && 
          <>
            <SearchResultsSkeleton />
            <SearchResultsSkeleton />
            <SearchResultsSkeleton />
          </>
        }
      </Box>

      {!loading &&
        <Button
          className="search-result__load-more"
          disabled={loadingMore || isLastPage}
          onClick={() => setLoadMore(true)}
        >
          {!isLastPage ? "Load more" : "No more results available."}
        </Button>
      }
    </Box>
  );
};

export default SearchResultsPage;