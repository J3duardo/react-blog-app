import { Box, Skeleton } from "@mui/material";
import "./blogCard.css";

const BlogCardSkeleton = () => {
  return (
    <Box className="blog-card">
      <Box className="blog-card__img-wrapper">
        <Skeleton
          style={{
            width: "100%",
            height: "250px",
            transform: "translateY(0)"
          }}
        />
      </Box>
      <Box className="blog-card__content">
        <Skeleton variant="text" style={{fontSize: "var(--heading-3)"}} />
        <Box style={{display: "flex", alignItems: "center", gap: "10px"}}>
          <Skeleton variant="circular" width={35} height={35} />
          <Skeleton width={"90%"} style={{fontSize: "var(--paragraph)"}} />
        </Box>
        <Box className="blog-card__categories">
          <Skeleton width={"30%"} height={45} />
          <Skeleton width={"30%"} height={45} />
          <Skeleton width={"30%"} height={45} />
        </Box>
        <Skeleton variant="text" style={{fontSize: "var(--paragraph)"}} />
        <Skeleton variant="text" style={{fontSize: "var(--paragraph)"}} />
        <Skeleton variant="text" style={{fontSize: "var(--paragraph)"}} />
        <Skeleton variant="text" style={{fontSize: "var(--paragraph)"}} />
        <Skeleton variant="text" style={{fontSize: "var(--paragraph)"}} />
        <Skeleton variant="text" style={{fontSize: "var(--paragraph)"}} />
      </Box>
    </Box>
  )
};

export default BlogCardSkeleton;