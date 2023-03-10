import { Box, Typography } from "@mui/material";
import { dateFormatter } from "../../utils/dateFormatter";
import { Blog } from "../../pages/Home";

interface Props {
  blogData: Blog;
};

const PopularBlog = ({blogData}: Props) => {
  const {title, author: {displayName}, thumbUrl, createdAt} = blogData;
  const formattedDate = dateFormatter(createdAt);

  return (
    <Box className="sidebar__blog-item">
      <Box className="sidebar__blog-item__img">
        <img src={thumbUrl} alt={title} />
      </Box>
      <Box className="sidebar__blog-item__text">
        <Typography
          className="sidebar__blog-item__title"
          variant="h5"
        >
          {title}
        </Typography>
        <Typography
          className="sidebar__blog-item__author"
          variant="subtitle1"
        >
          By: {displayName.split(" ")[0]}
        </Typography>
      </Box>
    </Box>
  )
};

export default PopularBlog;