import {useEffect, useState} from "react";
import {Box, Chip, MenuItem, FormControl, InputLabel, FormHelperText} from "@mui/material";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {useFormContext} from "react-hook-form";
import ValidationErrorMsg from "../AuthFormsElements/ValidationErrorMsg";
import useCategories from "../../hooks/useCategories";

interface Props {
  disabled: boolean;
  updatedCategories: string[];
  editMode: boolean;
};

export const CategorySelector = ({disabled, updatedCategories, editMode}: Props) => {
  // State de las categorías del backend
  const [categoriesSelectValues, setCategoriesSelectValues] = useState<string[]>([]);

  // State de las categorías seleccionadas
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Cargar las categorías de la base de datos
  const {categories, loadingCategories} = useCategories();

  const {register, formState: {errors}} = useFormContext();
  const isInvalid = !!errors.categories;


  /*-------------------------------------------------------------------*/
  // Consultar las categorías en la DB si no está en modo edición.
  // Actualizar el state de las categorías cuando está en modo edición.
  /*-------------------------------------------------------------------*/
  useEffect(() => {
    if (editMode) {
      setSelectedCategories(updatedCategories);

    } else {
      setCategoriesSelectValues(categories)
    }
  }, [updatedCategories, categories, editMode]);


  /*------------------------------------------------*/
  // Actualizar el value del selector de categorías
  /*------------------------------------------------*/
  const onChangeHandler = (e: SelectChangeEvent<typeof selectedCategories>) => {
    const {value} = e.target;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  };


  return (
    <FormControl fullWidth>
      <InputLabel
        style={{color: isInvalid ? "var(--error)" : "grey"}}
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
        value={selectedCategories}
        disabled={disabled || loadingCategories}
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
                  if (disabled) return null;
                  setSelectedCategories((prev) => {
                    return [...prev].filter(el => el !== category)
                  })
                }}
              />
            ))}
          </Box>
        )}
        {...register("categories", {
          onChange: (e: SelectChangeEvent<typeof selectedCategories>) => onChangeHandler(e),
          required: {value: true, message: "You must select at least one category"}
        })}
      >
        {categoriesSelectValues.map((category) => (
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