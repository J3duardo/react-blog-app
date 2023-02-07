import {useEffect, useState} from "react";
import {Box, Chip, MenuItem, FormControl, InputLabel, FormHelperText} from "@mui/material";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import { useDispatch } from "react-redux";
import {useFormContext} from "react-hook-form";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import ValidationErrorMsg from "../AuthFormsElements/ValidationErrorMsg";
import { db } from "../../firebase";
import { setOpen } from "../../redux/features/snackbarSlice";

interface Props {
  disabled: boolean;
  updatedCategories: string[];
  editMode: boolean;
};

type Category = {
  category: string,
  categoryId: string
};

export const CategorySelector = ({disabled, updatedCategories, editMode}: Props) => {
  const dispatch = useDispatch();

  // State de las categorías del backend
  const [categoriesSelectValues, setCategoriesSelectValues] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // State de las categorías seleccionadas
  const [categories, setCategories] = useState<string[]>([]);

  const {register, formState: {errors}} = useFormContext();

  const isInvalid = !!errors.categories;


  /*-------------------------------------------------------------------*/
  // Consultar las categorías en la DB si no está en modo edición.
  // Actualizar el state de las categorías cuando está en modo edición.
  /*-------------------------------------------------------------------*/
  useEffect(() => {
    if (editMode) {
      setLoadingCategories(false);
      setCategories(updatedCategories);

    } else {
      // Referencia de la colección de categorías
      const collectionRef = collection(db, "categories");

      // Query para consultar todas las categorías
      const q = query(collectionRef, orderBy("category", "asc"));

      // Ejecutar el query
      getDocs(q)
      .then(snapshot => {
        const docs = snapshot.docs.map(cat => cat.data() as Category);
        setCategoriesSelectValues(docs.map(el => el.category));
      })
      .catch((err: any) => {
        console.log(`Error fetching categories: ${err.message}`);
        dispatch(setOpen({
          open: true,
          message: "Error loading categories, refresh the page and try again."
        }))
      })
      .finally(() => setLoadingCategories(false))
    }
  }, [updatedCategories, editMode]);


  /*------------------------------------------------*/
  // Actualizar el value del selector de categorías
  /*------------------------------------------------*/
  const onChangeHandler = (e: SelectChangeEvent<typeof categories>) => {
    const {value} = e.target;
    setCategories(typeof value === "string" ? value.split(",") : value);
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
        value={categories}
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