import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { createLogEntry } from "./api";
import "./index.css";

const LogEntryForm = ({ location, onClose, loggedIn }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, setValue, handleSubmit } = useForm();

  const handleImageUpload = async (image) => {
    setLoading(true);

    if (image == undefined) {
      setError("Please select an Image");
      setLoading(false);
      return;
    }

    if (image.size > 1024 * 1024 * 10) {
      setError("Image size must be less than 10MB");
      setLoading(false);
      return;
    }

    if (
      image.type !== "image/jpeg" &&
      image.type !== "image/png" &&
      image.type !== "image/jpg"
    ) {
      setError("Image must be a JPEG, PNG or JPG");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "Roamify");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhzhsopzh/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) throw new Error();

      const jsonRes = await res.json();
      const url = jsonRes.secure_url;
      console.log(url);
      setValue("image", url);
    } catch (err) {
      setError("Error uploading Image");
    } finally {
      setLoading(false);
    }
  };

  const handleLogEntry = async (data) => {
    try {
      if (!loggedIn) {
        throw new Error("Unauthorized: Please Login First");
      }
      setLoading(true);
      data.latitude = location.latitude;
      data.longitude = location.longitude;
      await createLogEntry(data);
      onClose();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogEntry)} className="entry-form">
      {error && <h3 className="error">{error}</h3>}
      <label htmlFor="title">Title</label>
      <input type="text" name="title" required {...register("title")} />
      <label htmlFor="comments">Comments</label>
      <textarea name="comments" rows={3} {...register("comments")}></textarea>
      <label htmlFor="image">Image</label>
      <input
        type="file"
        accept="image/*"
        name="image"
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />
      <label htmlFor="visitDate">Visit Date</label>
      <input type="date" name="visitDate" required {...register("visitDate")} />
      <button disabled={loading}>
        {loading ? "Loading..." : "Create Entry"}
      </button>
    </form>
  );
};

export default LogEntryForm;
