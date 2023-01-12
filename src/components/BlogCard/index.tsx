import { useState } from "react";
import { Box, Typography, Button, IconButton, Divider, Tooltip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import CategoryChip from "./CategoryChip";
import BlogMetadata from "../BlogMetadata";
import ConfirmModal from "../ConfirmModal";
import { Blog } from "../../pages/Home";
import { UserData } from "../../redux/features/authSlice";
import { deleteBlog, DeleteBlogConfig } from "../../utils/blogCrudHandlers";
import "./blogCard.css";

interface Props {
  blog: Blog;
  user: UserData | null
};

const BlogCard = ({blog, user}: Props) => {
  const {id, title, description, author, thumbUrl, categories, createdAt} = blog;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Funcionalidad para eliminar el blog
  const deleteBlogHandler = async () => {
    const config: DeleteBlogConfig = {
      blogData: blog,
      dispatch
    };

    setDeleting(true);

    await deleteBlog(config);

    setDeleting(false);
    setOpenDeleteModal(false);
  };

  return (
    <Box className="blog-card card-shadow">
      <ConfirmModal
        title="Delete this blog?"
        content="This action cannot be undone."
        loading={deleting}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        confirmAction={deleteBlogHandler}
      />

      <Box className="blog-card__img-wrapper">
        <img
          className="blog-card__img"
          src={thumbUrl}
          alt={`${title} thumb`}
        />
      </Box>

      <Box className="blog-card__content" textAlign="left">
        <Box className="blog-card__title-wrapper">
          <Typography className="blog-card__title" variant="h6">
            <Link to={`/blog/${id}`}>{title}</Link>
          </Typography>

          {/* Botones para editar y borrar el post */}
          {/* Sólo se muestran al autor del post */}
          {!!user && user.uid === author.uid &&
            <Box className="blog-card__author-actions">
              <Tooltip title="Edit blog" placement="right">
                <IconButton
                  size="small"
                  disabled={deleting}
                  onClick={() => navigate(`/blog/create?editBlog=${id}`)}
                >
                  <AiOutlineEdit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete blog" placement="right">
                <IconButton
                  size="small"
                  disabled={deleting}
                  onClick={() => setOpenDeleteModal(true)}
                >
                  <AiOutlineDelete />
                </IconButton>
              </Tooltip>
            </Box>
          }
        </Box>

        <Divider style={{margin: "5px 0"}} />
        
        <BlogMetadata
          name={author.displayName}
          avatar={author.photoURL}
          date={createdAt}
        />

        <Divider style={{margin: "5px 0 var(--spacing) 0"}} />

        <Box className="blog-card__categories">
          {categories.slice(0, 3).map(category => {
            return <CategoryChip key={category} category={category}/>
          })}
        </Box>

        <Divider style={{margin: "5px 0"}} />

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