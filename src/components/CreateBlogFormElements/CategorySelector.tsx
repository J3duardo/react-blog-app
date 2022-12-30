import {useState} from "react";
import {Box, Chip, MenuItem, FormControl, InputLabel, FormHelperText} from "@mui/material";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {useFormContext} from "react-hook-form";
import ValidationErrorMsg from "../AuthFormsElements/ValidationErrorMsg";

// Generar las categorías de prueba
const TEST_CATEGORIES = (amount: number) => {
  const emptyArr = Array(amount);
  const categoryArr: string[] = [];

  for(let i = 0; i < emptyArr.length; i++) {
    categoryArr.push(`Category ${i+1}`)
  };
  
  return categoryArr;
};

export const CategorySelector = () => {
  const [categories, setCategories] = useState<string[]>([]);

  const {register, formState: {errors}} = useFormContext();

  const isInvalid = !!errors.categories;

  const onChangeHandler = (e: SelectChangeEvent<typeof categories>) => {
    const {value} = e.target;
    setCategories(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel
        style={{color: isInvalid ? "var(--mui-error)" : "grey"}}
        id="categories-selector"
      >
        Select categories
      </InputLabel>
      <Select
        multiple
        fullWidth
        className={`form__field ${isInvalid && "form__field--invalid"}`}
        variant="filled"
        label="Select categories"
        labelId="categories-selector"
        value={categories}
        MenuProps={{
          style: {width: "100%", maxHeight: "250px"}
        }}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((category) => (
              <Chip
                key={category}
                style={{position: "relative", zIndex: 100000}}
                label={category}
                onDelete={() => {
                  setCategories(prev => {
                    return [...prev].filter(el => el !== category)
                  })
                }}
              />
            ))}
          </Box>
        )}
        {...register("categories", {
          onChange: (e: SelectChangeEvent<typeof categories>) => onChangeHandler(e),
          required: {value: true, message: "You must select at least one category"}
        })}
      >
        {TEST_CATEGORIES(12).map((category) => (
          <MenuItem
            key={category}
            value={category}
          >
            {category}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>
        {isInvalid && <ValidationErrorMsg errorMsg={errors.categories!.message as string} />}
      </FormHelperText>
    </FormControl>
  )
};