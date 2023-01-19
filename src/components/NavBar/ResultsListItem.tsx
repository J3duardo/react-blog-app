import { Dispatch, SetStateAction } from "react";
import { Box, ListItem, ListItemAvatar, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SearchResult } from "./SearchBar";

interface Props {
  post: SearchResult;
  setHideListOnClick: Dispatch<SetStateAction<boolean>>
};

const ResultsListItem = ({post, setHideListOnClick}: Props) => {
  const navigate = useNavigate();

  return (
    <ListItem
      key={post.id}
      className="navbar__searchbar__results__list-item"
      onClick={() => {
        navigate(`/blog/${post.id}`);
        setHideListOnClick(true);
      }}
    >
      <ListItemAvatar>
        <Avatar variant="square" src={post.thumbUrl} />
      </ListItemAvatar>
      <Box
        className="navbar__searchbar__results__list-item-text overflow-ellipsis"
      >
        <Typography variant="body1" color="black">
          {post.title}
        </Typography>
        <Typography variant="subtitle1" color="grey">
          {post.description}
        </Typography>
      </Box>
    </ListItem>
  )
};

export default ResultsListItem;