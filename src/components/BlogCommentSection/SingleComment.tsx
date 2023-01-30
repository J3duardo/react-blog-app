import { useState } from "react";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { BsChevronDown, BsDot } from "react-icons/bs";
import UserActionsDropdown from "./UserActionsDropdown";
import { CommentContent } from "./index";
import { UserData } from "../../redux/features/authSlice";
import { dateFormatter } from "../../utils/dateFormatter";

interface Props {
  data: CommentContent;
  currentUser: UserData | null;
};

const SingleComment = ({data, currentUser}: Props) => {
  const {id, comment, user: {userId, avatar, name}, createdAt} = data;

  const [loading, setLoading] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);

  return (
    <Box
      style={{opacity: loading ? 0.5 : 1}}
      className="blog-comment__single-comment card-shadow"
      component="article"
    >
      {/* Mostrar el dropdown de editar y borrar si es el autor del comentario */}
      {currentUser?.uid === userId &&
        <Box className="blog-comment__user-actions">
          <IconButton
            size="small"
            onClick={(e) => setAnchorElement(e.currentTarget)}
          >
            <BsChevronDown />
          </IconButton>
        </Box>
      }

      {/* Dropdown de editar y borrar comentario */}
      <UserActionsDropdown
        commentId={id}
        loading={loading}
        setLoading={setLoading}
        anchorElement={anchorElement}
        setAnchorElement={setAnchorElement}
      />

      <Avatar
        className="blog-comment__single-comment__avatar"
        src={avatar || ""}
      />

      <Box className="blog-comment__single-comment__content">
        <Box className="blog-comment__single-comment__metadata">
          <Typography
            className="blog-comment__single-comment__username"
            variant="body1"
          >
            {name}
          </Typography>

          <BsDot />
          
          <Typography
            className="blog-comment__single-comment__date"
            variant="subtitle1"
          >
            {dateFormatter(createdAt)}
          </Typography>
        </Box>

        <Box className="blog-comment__single-comment__text">
          <Typography variant="subtitle1">
            {comment}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
};

export default SingleComment;