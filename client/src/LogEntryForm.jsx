import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createLogEntry } from "./api";

const LogEntryForm = ({ location, onClose, loggedIn }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const { register, setValue, handleSubmit } = useForm();

  const handleImageUpload = async (image) => {
    setLoading(true);

    if (!image) {
      setError("Please select an Image");
      setLoading(false);
      return;
    }

    if (image.size > 1024 * 1024 * 10) {
      setError("Image size must be less than 10MB");
      setLoading(false);
      return;
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(image.type)) {
      setError("Image must be a JPEG, PNG or JPG");
      setLoading(false);
      return;
    }

    try {
      setPreviewImage(URL.createObjectURL(image));

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
      console.log("Uploaded URL:", url);

      setValue("image", url);
    } catch (err) {
      setError("Error uploading Image");
    } finally {
      setLoading(false);
    }
  };

  const handleLogEntry = async (data) => {
    setLoading(true);
    try {
      if (!loggedIn) {
        throw new Error("Unauthorized: Please Login First");
      }
      if (!data.image) {
        throw new Error("Please select an Image");
      }
      data.latitude = location.latitude;
      data.longitude = location.longitude;
      await createLogEntry(data);
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
      onSubmit={handleSubmit(handleLogEntry)}
      sx={{
        maxWidth: 320,
        maxHeight: 400,
        overflowY: "auto",
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
        Add Travel Log
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Title"
        {...register("title")}
        required
        variant="outlined"
        fullWidth
      />

      <TextField
        label="Comments"
        {...register("comments")}
        multiline
        rows={2}
        required
        variant="outlined"
        disabled={loading}
        fullWidth
      />

      <Box>
        {previewImage && (
          <Box
            component="img"
            src={previewImage}
            alt="Preview"
            sx={{
              width: "100%",
              maxHeight: 200,
              objectFit: "cover",
              borderRadius: 2,
              boxShadow: 1,
            }}
          />
        )}
        <Button variant="outlined" component="label" disabled={loading}>
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />
        </Button>
      </Box>

      <TextField
        label="Visit Date"
        type="date"
        {...register("visitDate")}
        required
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        disabled={loading}
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ py: 1.2, fontWeight: "bold", textTransform: "none" }}
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

export default LogEntryForm;
