import { useState, useEffect } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import { BlogTitleField, CategorySelector, DescriptionField, FileInput } from "../components/CreateBlogFormElements";
import { LayoutState } from "../redux/store";
import "../styles/createBlogPage.css";

interface BlogFormFields {
  title: string;
  tags: string[];
  categories: string[];
  description: string;
  image?: Blob;
};

const CreateBlog = () => {
  const navigate = useNavigate();
  const {pagePadding} = useSelector((state: LayoutState) => state.layout);
  
  const [image, setImage] = useState<Blob | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<null | string>(null);

  const methods = useForm<BlogFormFields>({mode: "onSubmit"});

  /*--------------------------------------------*/
  // Generar el preview de la imagen seleccionda
  /*--------------------------------------------*/
  useEffect(() => {    
    if(image) {
      methods.setValue("image", image);
      const objectUrl = URL.createObjectURL(image);
      setFilePreview(objectUrl);
    } else {
      setFilePreview(null);
    };

  }, [image]);

  const onSubmitHandler = (values: BlogFormFields) => {
    const title = methods.getValues("title");
    const categories = methods.getValues("categories");
    const description = methods.getValues("description");
    let isInvalid = false;

    // Retornar error de validación
    // si el campo de título sólo contiene espacios
    if(title.trim().length === 0) {
      methods.setError("title", {
        type: "required",
        message: "The title is required"
      });
      
      isInvalid = true;
    };
    
    // Retornar error de validación
    // si el array de categorías está vacío
    if(categories.length === 0) {
      methods.setError("categories", {
        type: "required"
      });

      isInvalid = true;
    };
    
    // Retornar error de validación
    // si el campo de descripción sólo contiene espacios
    if(description.trim().length === 0) {
      methods.setError("description", {
        type: "required",
        message: "The description is required"
      });

      isInvalid = true;
    };

    if(isInvalid) return methods;
    
    console.log({values});
  };


  return (
    <Box
      className="create-blog"
      component="section"
      paddingTop={pagePadding.top}
      paddingBottom={pagePadding.bottom}
    >
      <Typography variant="h3" marginBottom="1.5rem">
        Create Blog
      </Typography>
      <FormProvider {...methods}>
        <form
          className="create-blog__form"
          onSubmit={methods.handleSubmit(onSubmitHandler)}
        >
          <BlogTitleField disabled={loading} />
          <CategorySelector />
          <DescriptionField disabled={loading} />
          <FileInput imagePreview={filePreview} setImage={setImage} />

          <Divider style={{width: "100%"}} />
          
          <Button
            className="create-blog__button"
            variant="outlined"
            type="submit"
            endIcon={<AiOutlinePlus />}
            disabled={loading}
          >
            Create Blog
          </Button>
        </form>
      </FormProvider>
    </Box>
  )
};

export default CreateBlog;