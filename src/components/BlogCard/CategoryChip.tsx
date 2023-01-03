import { Chip } from "@mui/material";

interface Props {
  category: string;
};

const CategoryChip = ({category}: Props) => {
  return (
    <Chip
      variant="filled"
      label={category}
      size="small"
      color="primary"
    />
  )
};

export default CategoryChip;