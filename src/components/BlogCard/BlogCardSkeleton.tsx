import { Box, Skeleton } from "@mui/material";
import "./blogCard.css";

const BlogCardSkeleton = () => {
  return (
    <Box className="blog-card">
      <Box className="blog-card__img-wrapper">
        <Skeleton width="100%" height={250}  />
      </Box>
      <Box className="blog-card__content">
        <Skeleton variant="text" style={{fontSize: "var(--heading-3)"}} />
        <Skeleton variant="text" style={{fontSize: "var(--paragraph)"}} />
        <Skeleton variant="text" style={{fontSize: "var(--paragraph)"}} />
        <Box className="blog-card__categories">
          <Skeleton width={"30%"} height={45} />
          <Skeleton width={"30%"} height={45} />
          <Skeleton width={"30%"} height={45} />
        </Box>
        <Skeleton variant="text" style={{fontSize: "var(--paragraph)"}} />
        <Skeleton variant="text" style={{fontSize: "var(--paragraph)"}} />
        <Skeleton variant="text" style={{fontSize: "var(--paragraph)"}} />
        <Skeleton variant="text" style={{fontSize: "var(--paragraph)"}} />
      </Box>
    </Box>
  )
};

export default BlogCardSkeleton;