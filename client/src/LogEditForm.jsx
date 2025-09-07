import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createLogEdit } from "./api";

const LogEditForm = ({ entry, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, setValue, handleSubmit, watch } = useForm({
    defaultValues: {
      title: entry?.title || "",
      comments: entry?.comments || "",
      visitDate: entry?.visitDate ? entry.visitDate.split("T")[0] : "",
      image: entry?.image || "",
    },
  });

  const imageUrl = watch("image");

  const handleImageUpload = async (image) => {
    setError("");

    if (!image) {
      setError("Please select an Image");
      return;
    }

    if (image.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(image.type)) {
      setError("Image must be a JPEG, PNG or JPG");
      return;
    }

    try {
      setLoading(true);
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
      setValue("image", jsonRes.secure_url);
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
      setError(error.message || "Error updating entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleLogEdit)}
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
        Edit Travel Log
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
        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            alt="Uploaded Image"
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
          "Save Changes"
        )}
      </Button>
    </Box>
  );
};

export default LogEditForm;
