import { Box, Skeleton } from "@mui/material";

const CategorySkeleton = () => {
  return (
    <Box className="sidebar__trending-categories">
      <Skeleton width={100} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={100} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={100} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={100} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={100} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={100} height={32} style={{borderRadius: "100px"}} />
    </Box>
  )
};

export default CategorySkeleton;