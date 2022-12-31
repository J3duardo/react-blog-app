import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Typography, Button, Divider, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import { getDownloadURL, ref, StorageError, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { BlogTitleField, CategorySelector, DescriptionField, FileInput } from "../components/CreateBlogFormElements";
import LinearProgressBar from "../components/LinearProgressBar";
import { isEmptyField } from "../components/CreateBlogFormElements/isEmptyField";
import { AuthState, LayoutState } from "../redux/store";
import { generateFirebaseStorageErrorMsg } from "../utils/firebaseErrorMessages";
import { db, storage } from "../firebase";
import { setOpen } from "../redux/features/snackbarSlice";
import withAuthentication from "../HOC/withAuthentication";
import "../styles/createBlogPage.css";

export interface BlogFormFields {
  title: string;
  categories: string[];
  description: string;
  image: File;
};

const CreateBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state: AuthState) => state.auth);
  const {pagePadding} = useSelector((state: LayoutState) => state.layout);
  
  const [image, setImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [backendError, setBackendError] = useState<null | string>(null);

  const methods = useForm<BlogFormFields>({mode: "onSubmit"});


  /*--------------------------------------------*/
  // Generar el preview de la imagen seleccionda
  /*--------------------------------------------*/
  useEffect(() => {    
    if(image) {
      methods.setValue("image", image);
      const objectUrl = URL.createObjectURL(image);
      const imgName = `${user?.uid}-${Date.now()}-${image.name}`;
      setFileName(imgName);
      setFilePreview(objectUrl);
    } else {
      setFilePreview(null);
    };
  }, [image]);


  /*---------------------------------*/
  // Subir la imagen y crear el blog
  // al finalizar la subida
  /*---------------------------------*/
  const onSubmitHandler = async (values: BlogFormFields) => {
    // Verificar si hay campos vacíos
    let isEmpty =
      isEmptyField(methods, "title") ||
      isEmptyField(methods, "categories") ||
      isEmptyField(methods, "description");

    // Si hay campos vacíos, retornar sin ejecutar el proceso
    if(isEmpty) {
      return null;
    };

    setLoading(true);
    setBackendError(null);

    const path = `blogs/${user?.uid}/${values.title}/${Date.now()}-${fileName}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, image!);

    // Monitorear el progreso de la subida,
    // manejar errores generados al subir el archivo
    // y especificar la url del archivo al terminar la subida.
    uploadTask.on("state_changed",
      (snapshot) => {
        setUploadProgress(() => {
          const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
          return Number(progress.toFixed(2));
        });

      },
      (error: StorageError) => {
        const code = error.code;
        const msg = generateFirebaseStorageErrorMsg(code);
        setBackendError(msg);
        setUploadProgress(null);
        setLoading(false);

      },
      async () => {
        try {
          // Obtener la url de la imagen al terminar la subida.
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          const blogData = {
            author: user,
            title: values.title,
            categories: values.categories,
            description: values.description,
            imageUrl: url,
            createdAt: serverTimestamp()
          };

          // Crear el blog en la base de datos
          const res = await addDoc(collection(db, "blogs"), blogData);

          // Mostrar el snackbar al finalizar el proceso
          dispatch(setOpen({open: true, message: "Blog created successfully!"}));
          
          // Navegar a la página del blog
          navigate(`/blog/${res.id}`);
          
        } catch (error: unknown) {
          const storageError = error as StorageError;
          const code = storageError.code;
          const errMsg = generateFirebaseStorageErrorMsg(code);
          setBackendError(errMsg);

        } finally {
          setLoading(false);
          setUploadProgress(null);
        };
      }
    );
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

      {backendError &&
        <Alert
          style={{marginBottom: "1.5rem"}}
          severity="error"
          onClose={() => setBackendError(null)}
        >
          {backendError}
        </Alert>
      }

      <FormProvider {...methods}>
        <form
          className="create-blog__form"
          onSubmit={methods.handleSubmit(onSubmitHandler)}
        >
          <BlogTitleField disabled={loading} />
          <CategorySelector disabled={loading} />
          <DescriptionField disabled={loading} />
          <FileInput
            imagePreview={filePreview}
            setImage={setImage}
            disabled={loading}
          />

          <Divider style={{width: "100%"}} />

          <LinearProgressBar uploadProgress={uploadProgress} />
          
          <Button
            className="create-blog__button"
            variant="outlined"
            type="submit"
            endIcon={<AiOutlinePlus />}
            disabled={loading}
          >
            {!loading && !uploadProgress && "Create blog"}
            {loading && uploadProgress! < 100 && "Uploading blog..."}
            {loading && uploadProgress === 100 && "Finishing upload..."}
          </Button>
        </form>
      </FormProvider>
    </Box>
  )
};

export default withAuthentication(CreateBlog);