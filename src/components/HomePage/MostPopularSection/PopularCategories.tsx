import { Avatar, Box, Chip } from "@mui/material";
import { GiStarFormation } from "react-icons/gi";
import { CategoryObj } from "../../../utils/arrayOccurrencesCounter";

interface Props {
  trendingCategories: CategoryObj[];
}

const PopularCategories = ({trendingCategories}: Props) => {
  return (
    <Box className="home-page__trending-categories">
      {trendingCategories.map((category) => {
        const categoryName = Object.keys(category)[0];

        return (
          <Chip
            key={categoryName}
            clickable
            color="primary"
            variant="outlined"
            size="medium"
            label={categoryName}
            avatar={<Avatar><GiStarFormation /></Avatar>}
          />
        )
      })}
    </Box>
  )
};

export default PopularCategories;