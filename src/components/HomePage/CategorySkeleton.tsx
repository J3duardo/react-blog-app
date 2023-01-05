import { Box, Skeleton } from "@mui/material";

const CategorySkeleton = () => {
  return (
    <Box className="home-page__trending-categories">
      <Skeleton width={100} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={100} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={100} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={100} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={100} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={100} height={32} style={{borderRadius: "100px"}} />
    </Box>
  )
}

export default CategorySkeleton;