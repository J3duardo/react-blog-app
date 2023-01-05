import { Box, Typography } from "@mui/material";
import { dateFormatter } from "../../../utils/dateFormatter";
import { Blog } from "../BlogSection";

interface Props {
  blogData: Blog;
};

const PopularBlog = ({blogData}: Props) => {
  const {title, thumbUrl, createdAt} = blogData;
  const formattedDate = dateFormatter(createdAt);

  return (
    <Box className="popular-blog__blog-item">
      <Box className="popular-blog__blog-item__img">
        <img src={thumbUrl} alt={title} />
      </Box>
      <Box className="popular-blog__blog-item__text">
        <Typography variant="h5">
          {title}
        </Typography>
        <Typography variant="subtitle1">
          {formattedDate}
        </Typography>
      </Box>
    </Box>
  )
};

export default PopularBlog;