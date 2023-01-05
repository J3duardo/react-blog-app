import { Box, Skeleton } from "@mui/material";

const PopularBlogSkeleton = () => {
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--spacing)",
        width: "100%"
      }}
    >
      <Skeleton
        style={{flexShrink: 0, transform: "translateY(0)"}}
        width={120}
        height={100}
      />
      <Box 
        style={{
          display: "flex",
          alignContent: "flex-start",
          flexWrap: "wrap",
          gap: "var(--spacing)",
          width: "100%"
        }}
      >
        <Skeleton
          style={{transform: "translateY(0)"}}
          width={"100%"}
          height={24}
        />
        <Skeleton
          style={{transform: "translateY(0)"}}
          width={"75%"}
          height={16}
        />
      </Box>
    </Box>
  )
};

export default PopularBlogSkeleton;
