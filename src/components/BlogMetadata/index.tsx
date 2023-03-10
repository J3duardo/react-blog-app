import { Box, Avatar, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { dateFormatter } from "../../utils/dateFormatter";
import "./blogMetadata.css";

interface Props {
  avatar: string | null;
  name: string;
  date: Timestamp;
};

const BlogMetadata = ({avatar, name, date}: Props) => {
  return (
    <Box className="blog-card__metadata">
      <Avatar
        className="blog-card__metadata__avatar"
        src={avatar || ""}
        alt={name}
      />
      <Box className="blog-card__metadata__text">
        <Typography
          className="blog-card__metadata__name"
          variant="body1"
        >
          {name}
        </Typography>
        <Typography
          className="blog-card__metadata__date"
          variant="subtitle1"
          title={dateFormatter(date, "MM/DD/YYYY - hh:mm a")}
        >
          {dateFormatter(date, "MM/DD/YYYY")}
        </Typography>
      </Box>
    </Box>
  )
}

export default BlogMetadata