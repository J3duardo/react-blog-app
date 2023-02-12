import { Chip } from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
  category: string;
};

const CategoryChip = ({category}: Props) => {
  return (
    <Link
      style={{textDecoration: "none"}}
      to={`/blog/search?category=${category}`}
    >
      <Chip
        style={{cursor: "pointer"}}
        variant="filled"
        label={category}
        size="small"
        color="primary"
        component="span"
      />
    </Link>
  )
};

export default CategoryChip;