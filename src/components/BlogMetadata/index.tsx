import { Box, Avatar, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { BsDot } from "react-icons/bs";
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
      <Typography className="blog-card__metadata__name" variant="body1">
        {name}
      </Typography>
      <BsDot />
      <Typography className="blog-card__metadata__date" variant="subtitle1">
        {dateFormatter(date, "MM/DD/YYYY")}
      </Typography>
    </Box>
  )
}

export default BlogMetadata