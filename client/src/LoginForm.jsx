import { useState } from "react";
import { useForm } from "react-hook-form";
import "./index.css";

const LoginForm = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const handleLogin = (data) => {
    try {
      setLoading(true);
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(handleLogin)} className="entry-form">
      {error && <h3 className="error">{error}</h3>}{" "}
      <label htmlFor="email">Email:</label>
      <input type="email" name="email" {...register("email")} />
      <label htmlFor="password">Password:</label>
      <input type="password" name="password" {...register("password")} />
      <button disabled={loading}>{loading ? "Loading.." : "Login"}</button>
    </form>
  );
};

export default LoginForm;
