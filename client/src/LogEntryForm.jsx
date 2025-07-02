import { useState } from "react";
import { createLogEntry } from "./api";

import "./index.css";

import { useForm } from "react-hook-form";

const LogEntryForm = ({ location, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
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
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
      {error && <h3 className="error">{error}</h3>}
      <label htmlFor="title">Title</label>
      <input type="text" name="title" required {...register("title")} />
      <label htmlFor="comments">Comments</label>
      <textarea name="comments" rows={3} {...register("comments")}></textarea>
      <label htmlFor="image">Image</label>
      <input type="text" name="image" {...register("image")} />
      <label htmlFor="visitDate">Visit Date</label>
      <input type="date" name="visitDate" required {...register("visitDate")} />
      <button disabled={loading}>
        {loading ? "Loading..." : "Create Entry"}
      </button>
    </form>
  );
};

export default LogEntryForm;
