import { useState } from "react";
import { useForm } from "react-hook-form";
import "./index.css";

import { signupUser } from "./api";

const SignupForm = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const handleSignup = async (data) => {
    try {
      setLoading(true);
      const response = await signupUser(data);
      if (!response.ok) {
        throw new Error(response.message);
      }
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(handleSignup)} className="entry-form">
      {error && <h3 className="error">{error}</h3>}
      <label htmlFor="email">Email:</label>
      <input type="email" name="email" {...register("email")} />
      <label htmlFor="password">Password:</label>
      <input type="password" name="password" {...register("password")} />
      <button disabled={loading}>{loading ? "Loading.." : "Sign Up"}</button>
    </form>
  );
};

export default SignupForm;
