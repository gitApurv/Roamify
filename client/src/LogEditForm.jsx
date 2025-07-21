import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createLogEdit } from "./api";

const LogEditForm = ({ entry, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, setValue, handleSubmit } = useForm();
  setValue("title", entry.title);
  setValue("comments", entry.comments);
  setValue("visitDate", entry.visitDate.split("T")[0]);

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
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD
        }/image/upload`,
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

  const handleLogEdit = async (data) => {
    setLoading(true);
    try {
      data.latitude = entry.latitude;
      data.longitude = entry.longitude;
      await createLogEdit(entry._id, data);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleLogEdit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
      }}
    >
      {error && (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      )}

      <TextField
        label="Title"
        {...register("title")}
        required
        variant="outlined"
      />

      <TextField
        label="Comments"
        {...register("comments")}
        multiline
        rows={3}
        required
        variant="outlined"
      />

      <Button variant="outlined" component="label">
        Upload Image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />
      </Button>

      <TextField
        label="Visit Date"
        type="date"
        {...register("visitDate")}
        required
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Create Entry"
        )}
      </Button>
    </Box>
  );
};

export default LogEditForm;
