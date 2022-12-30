import { UseFormReturn } from "react-hook-form";
import { BlogFormFields } from "../../pages/CreateBlog";

/**
 * Validar que el campo especificado del formulario no esté vacío.
 * 
 * Es necesario realizar esta validación de forma manual
 * ya que React Hook Form no valida los campos de array
 * que estén vacíos ni los campos de texto donde
 * se haya tipeado sólo espacios en blanco.
 */
export const isEmptyField = (
  methods: UseFormReturn<BlogFormFields, any>,
  field: keyof BlogFormFields,
) => {

  const value = methods.getValues(field) as string | string[];

  // Verificar si los campos de texto están vacíos
  if(typeof value === "string" && value.trim().length === 0) {
    methods.setError(field, {
      type: "required",
      message: `The ${field} is required`
    });
    
    return true;
  };

  // Verificar si el campo de categorías es un array vacío
  if(value.length === 0) {
    methods.setError(field, {
      type: "required",
      message: `The ${field} is required`
    });
    
    return true;
  };

  return false;
};