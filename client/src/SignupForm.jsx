import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "./index.css";

import { signupUser } from "./api";

const SignupForm = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const handleSignup = async (data) => {
    setLoading(true);
    try {
      const response = await signupUser(data);
      if (!response.ok) {
        throw new Error(response.message);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleSignup)}
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
        label="Email"
        type="email"
        variant="outlined"
        {...register("email")}
        required
      />

      <TextField
        label="Password"
        type="password"
        variant="outlined"
        {...register("password")}
        required
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
      </Button>
    </Box>
  );
};

export default SignupForm;
