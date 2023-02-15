import { useEffect } from "react";
import { Box } from "@mui/material";
import { useQuill } from "react-quilljs";
import { useFormContext } from "react-hook-form";
import ValidationErrorMsg from "../AuthFormsElements/ValidationErrorMsg";
import { BlogFormFields } from "../../pages/CreateBlog";
import "./blogContentField.css";

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered"}, { list: "bullet" }],
    [{ header: [2, 3, 4, 5, 6, false] }],
    ["clean"]
  ],
};

interface Props {
  defaultValue: string | undefined;
};

const BlogContentField = ({defaultValue}: Props) => {
  const { quill, quillRef } = useQuill({modules, placeholder: "Write something awesome..."});
  const { register, setValue, formState: {errors} } = useFormContext<BlogFormFields>();
  
  const isInvalid = !!errors.content;


  useEffect(() => {
    if (defaultValue && quill) {
      setValue("content", defaultValue);
      quill.clipboard.dangerouslyPasteHTML(defaultValue);
    };
  }, [defaultValue, quill]);


  useEffect(() => {
    if (!quill) {
      return
    };

    register(
      "content",
      {
        required: {value: true, message: "The content cannot be empty"},
        minLength: {value: 50, message: "Provide at least 100 characters"}
      }
    );

    quill.on("text-change", () => {
      const htmlContent = quill.root.innerHTML;
      setValue("content", htmlContent);
    });
  }, [quill]);

  return (
    <Box className="create-blog__content">
      <Box ref={quillRef} component="div"/>
      {isInvalid &&
        <ValidationErrorMsg errorMsg={errors.content!.message as string} />
      }
    </Box>
  );
};

export default BlogContentField;