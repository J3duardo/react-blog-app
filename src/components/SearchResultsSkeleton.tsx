import { Box, Divider, Skeleton } from "@mui/material";

const SearchResultsSkeleton = () => {
  return (
    <Box className="search-results__item">
      <Skeleton variant="text" style={{width: "80%", fontSize: "var(--heading-4)"}} />
      <Divider style={{width: "100%", margin: "var(--spacing-sm) 0"}} />
      <Skeleton variant="text" style={{width: "95%", fontSize: "var(--paragraph)"}} />
      <Skeleton variant="text" style={{width: "90%", fontSize: "var(--paragraph)"}} />
      <Skeleton variant="text" style={{width: "60%", fontSize: "var(--paragraph)"}} />
    </Box>
  )
};

export default SearchResultsSkeleton;