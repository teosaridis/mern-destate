import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
  Textarea,
  Toast,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import data from "../../data/myLinksCategories.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateMyLink() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setimageUploadProgress] = useState(null);
  const [imageUploadError, setimageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const [uploadedUrl, setUploadedUrl] = useState("");

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
            setUploadedUrl(downloadURL);
          });
        }
      );
    } catch (error) {
      setimageUploadError("Image upload failed!");
      setimageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/mylinks/create", {
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
        toast.success("Link created!");
        // navigate(`/mylinks/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong!");
    }
  };

  return (
    <div className="p-3 w-full mx-auto min-h-screen mb-8">
      <h1 className=" text-center text-3xl my-7 font-semibold">
        Create a Link
      </h1>
      <form
        className="mx-auto w-2/3 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
            type="text"
            placeholder="Title..."
            required
            id="titleField"
            className="flex-1"
          />

          <Select
            id="categoryField"
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
          >
            {data.map((linkCats) => (
              <option key={linkCats.catId} value={linkCats.catTitle}>
                {linkCats.catName}
              </option>
            ))}
          </Select>
        </div>
        <Textarea
          maxLength={"100"}
          placeholder="Description..."
          id="descriptionField"
          onChange={(e) => {
            setFormData({ ...formData, content: e.target.value });
          }}
        />

        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            onChange={(e) => {
              setFormData({ ...formData, buttonTitle: e.target.value });
            }}
            type="text"
            placeholder="Button Title..."
            id="buttonTitleField"
            className="flex-1"
            required
          />{" "}
          <TextInput
            onChange={(e) => {
              setFormData({ ...formData, myLink: e.target.value });
            }}
            type="text"
            placeholder="Affiliate Link"
            required
            id="affiliateLinkField"
            className="flex-1"
          />
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-dotted p-3">
          <p className="text-sm absolute -mt-32 bg-primary-content rounded-sm">
            Choose an image...
          </p>
          <div>
            <FileInput
              id="imageField"
              type="button"
              accept="image/*"
              onChange={(e) => {
                setFormData({ ...formData, image: "" });
                setFile(e.target.files[0]);
              }}
            />
            <Button
              className="btn btn-primary capitalize"
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

          <div>
            {imageUploadError && (
              <Alert color={"failure"}>{imageUploadError}</Alert>
            )}
            {file && formData.image && (
              <img
                src={formData.image}
                alt="upload"
                className="w-48 h-36 object-fill"
              />
            )}
          </div>
        </div>

        <Button type="submit" className="w-1/2 self-center btn btn-primary">
          Create Link
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
      <ToastContainer />
    </div>
  );
}
