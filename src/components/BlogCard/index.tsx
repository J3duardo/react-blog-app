import { Box, Typography, Chip, Button } from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Blog } from "../HomePage/BlogSection";
import "./blogCard.css";

interface Props {
  blog: Blog;
};

const BlogCard = ({blog}: Props) => {
  const {id, title, description, author, thumbUrl, createdAt, categories} = blog;
  const blogDate = dayjs(createdAt.toDate()).format("MM/DD/YYYY - hh:mm a");

  const navigate = useNavigate();

  return (
    <Box className="blog-card card-shadow">
      <Box className="blog-card__img-wrapper">
        <img
          className="blog-card__img"
          src={thumbUrl}
          alt={`${title} thumb`}
        />
      </Box>

      <Box className="blog-card__content" textAlign="left">
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <Typography>
          By: {author.displayName}
        </Typography>
        <Typography style={{marginBottom: "var(--spacing)"}} variant="subtitle1">
          {blogDate}
        </Typography>

        <Box className="blog-card__categories">
          {categories.slice(0, 3).map(category => {
            return (
              <Chip
                key={category}
                variant="filled"
                label={category}
                size="small"
                color="primary"
              />
            )
          })}
        </Box>

        <Box className="blog-card__description">
          <Box className="blog-card__description-overlay" />
          <Typography variant="body2">
            {description}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/blog/${id}`)}
        >
          Read more...
        </Button>
      </Box>
    </Box>
  )
};

export default BlogCard;