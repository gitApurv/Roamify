import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PasswordIcon from "@mui/icons-material/Password";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "./api";

const LoginForm = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const response = await loginUser(data);
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
      onSubmit={handleSubmit(handleLogin)}
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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailOutlineIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Password"
        type="password"
        variant="outlined"
        {...register("password")}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PasswordIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
      </Button>
    </Box>
  );
};

export default LoginForm;
