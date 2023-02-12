import { Box, Skeleton } from "@mui/material";

const CategorySkeleton = () => {
  return (
    <Box className="sidebar__tags">
      <Skeleton width={100} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={90} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={75} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={80} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={90} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={65} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={75} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={90} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={90} height={32} style={{borderRadius: "100px"}} />
      <Skeleton width={50} height={32} style={{borderRadius: "100px"}} />
    </Box>
  )
};

export default CategorySkeleton;