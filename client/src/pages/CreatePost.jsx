import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BlotFormatter from "quill-blot-formatter";
import { useQuill } from "react-quilljs";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setimageUploadProgress] = useState(null);
  const [imageUploadError, setimageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  console.log(formData);

  // *******************************

  const [value, setValue] = useState("");

  const { quill, quillRef, Quill } = useQuill({
    modules: {
      blotFormatter: {},

      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image", "video"],
          ["code-block"],
          ["clean"],
        ],
      },
    },
    formats: [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      "video",
      "code-block",
    ],
  });

  if (Quill && !quill) {
    Quill.register("modules/blotFormatter", BlotFormatter);
  }

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldContents) => {
        let currrentContents = quill.getContents();
        // console.log(currrentContents);
        // console.log(currrentContents.diff(oldContents));

        setFormData({
          ...formData,
          content: quill.root.innerHTML,
        });
      });
    }
  }, [quill, Quill]);

  // ************************************************

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setimageUploadError("Please select an image!");
        return;
      }
      setimageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setimageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setimageUploadError(error);
          // setimageUploadError("Image Upload Failed!");
          setimageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setimageUploadProgress(null);
            setimageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setimageUploadError("Image upload faield!");
      setimageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong!");
    }
  };

  const handleTitleChange = (userTitle) => {
    const newSlug = userTitle
      .toLowerCase() // Convert the title to lowercase
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/[^\w\-]+/g, "") // Remove non-word characters except dashes
      .replace(/\-\-+/g, "-") // Replace multiple consecutive dashes with a single dash
      .replace(/^\-+/, "") // Remove dashes from the beginning
      .replace(/\-+$/, ""); // Remove dashes from the end

    //  setFormData({ ...formData, title: userTitle });
    setFormData({ ...formData, title: newSlug });
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
            // onChange={(e) => {
            //   setFormData({ ...formData, title: e.target.value });
            // }}
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
          >
            <option value={"uncategorized"}>Select a category</option>
            <option value={"javascript"}>JavaScript</option>
            <option value={"react"}>React.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-dotted p-3">
          <FileInput
            type="button"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            className="w-1/4 h-12"
            type="button"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-8 h-8">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        {/* ************************************************** */}
        <div>
          <div ref={quillRef} />
        </div>
        {/* ************************************************** */}
        <Button type="submit" className="w-1/2 self-center">
          Publish
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
