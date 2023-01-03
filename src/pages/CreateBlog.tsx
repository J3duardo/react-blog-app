import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Typography, Button, Divider, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";
import { deleteObject, getDownloadURL, ref, StorageError, uploadBytes, uploadBytesResumable, UploadTask } from "firebase/storage";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { BlogTitleField, CategorySelector, DescriptionField, FileInput } from "../components/CreateBlogFormElements";
import LinearProgressBar from "../components/LinearProgressBar";
import { isEmptyField } from "../components/CreateBlogFormElements/isEmptyField";
import { AuthState, LayoutState } from "../redux/store";
import { generateFirebaseStorageErrorMsg } from "../utils/firebaseErrorMessages";
import { blogsCollection, storage } from "../firebase";
import { setOpen } from "../redux/features/snackbarSlice";
import withAuthentication from "../HOC/withAuthentication";
import { imageResizer } from "../utils/imgResizer";
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
  
  const [currentUploadTask, setCurrentUploadTask] = useState<UploadTask | null>(null);
  const [image, setImage] = useState<File | null>(null);
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
      setFilePreview(objectUrl);
    } else {
      setFilePreview(null);
    };
  }, [image]);


  /*---------------------------------*/
  // Cancelar la subida de la imagen
  /*---------------------------------*/
  const cancelUploadHandler = () => {
    if(currentUploadTask) {
      currentUploadTask.cancel();
      setLoading(false);
      setUploadProgress(null);
    }
  };


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

    // Permitir imágenes de máximo 10MB
    if(image!.size > 10 * 1024 * 1024) {
      return methods.setError("image", {
        type: "imageSize",
        message: "The image size must be less than 10MB"
      });
    };

    setLoading(true);
    setBackendError(null);

    // Generar el nombre base de la imagen.
    // Limpiar los espacios vacíos y la palabra "preview" del nombre original.
    const imageName = `${Date.now()}-${image?.name.replaceAll(" ", "-").replaceAll("preview", "").toLowerCase()}`;

    // Paths de la imagen principal y del thumbnail
    const mainImagePath = `blogs/${user?.uid}/${values.title}/${imageName}`;
    const previewImagePath = `blogs/${user?.uid}/${values.title}/preview-${imageName}`;

    // Referencias del storage de la imagen y el thumbnail
    const mainImageStorageRef = ref(storage, mainImagePath);
    const previewImageStorageRef = ref(storage, previewImagePath);

    // Generar el thumbnail de la imagen (versión de 600x600 px de la imagen principal)
    const thumbnail = await imageResizer(image!);

    // Crear el task de upload de la imagen principal
    const uploadTask = uploadBytesResumable(mainImageStorageRef, image!);

    // Almacenar la tarea de subida en el state
    // para poder cancelarla desde el cancel handler.
    setCurrentUploadTask(uploadTask);

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
        window.scrollTo({top: 0, behavior: "smooth"});

        // Eliminar el thumbnail en caso de error
        deleteObject(previewImageStorageRef);
      },
      async () => {
        try {
          // Subir el thumbnail al bucket
          const thumbnailUpload = await uploadBytes(previewImageStorageRef, thumbnail);

          // Obtener la url de la imagen al terminar la subida.
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          // Obtener la url del thumbnail
          const thumbUrl = await getDownloadURL(thumbnailUpload.ref);

          // Autor del blog excluyendo el email
          const blogAuthor = {...user};
          delete blogAuthor.email;

          const blogData = {
            author: blogAuthor,
            title: values.title,
            categories: values.categories,
            description: values.description,
            imageUrl: url,
            thumbUrl,
            imageName,
            createdAt: serverTimestamp()
          };

          // Crear el blog en la base de datos
          const res = await addDoc(blogsCollection, blogData);

          // Mostrar el snackbar al finalizar el proceso
          dispatch(setOpen({open: true, message: "Blog created successfully!"}));
          
          // Navegar a la página del blog
          navigate(`/blog/${res.id}`);
          
        } catch (error: unknown) {
          const storageError = error as StorageError;
          const code = storageError.code;
          const errMsg = generateFirebaseStorageErrorMsg(code);
          setBackendError(errMsg);

          // Eliminar la imagen principal y el thumbnail
          // en caso de error al crear el documento en la base de datos.
          deleteObject(mainImageStorageRef);
          deleteObject(previewImageStorageRef);

        } finally {
          setLoading(false);
          setUploadProgress(null);
          window.scrollTo({top: 0, behavior: "smooth"});
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
          
          <Box style={{display: "flex", gap: "var(--spacing)"}}>
            <Button
              className="create-blog__button"
              variant="outlined"
              type="submit"
              endIcon={<AiOutlinePlus />}
              disabled={loading}
            >
              {!loading && !uploadProgress && "Create blog"}
              {loading && uploadProgress! < 100 && "Uploading blog..."}
              {loading && uploadProgress === 100 && "Finishing..."}
            </Button>
            <Button
              style={{display: uploadProgress && uploadProgress < 100 ? "flex" : "none"}}
              className="create-blog__button"
              variant="outlined"
              color="error"
              type="button"
              endIcon={<TiCancel />}
              onClick={cancelUploadHandler}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  )
};

export default withAuthentication(CreateBlog);