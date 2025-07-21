import { Box, Typography, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledPopup = ({ entry, onEdit, onDelete }) => (
  <Box sx={{ p: 1 }}>
    <Typography variant="h6" fontWeight={"bold"} gutterBottom>
      {entry.title}
    </Typography>

    <Typography variant="body1" color="text" gutterBottom>
      {entry.comments}
    </Typography>

    <Typography variant="caption" color="text.secondary" gutterBottom>
      Visited on: {new Date(entry.visitDate).toLocaleDateString()}
    </Typography>

    <Box
      component="img"
      src={entry.image}
      alt={entry.title}
      sx={{
        width: "100%",
        maxHeight: "100%",
        objectFit: "cover",
        borderRadius: 1,
        my: 1,
      }}
    />

    <Box display="flex" justifyContent="center" gap={2}>
      <Button
        size="small"
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={() => onEdit(entry)}
      >
        Edit
      </Button>
      <Button
        size="small"
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => onDelete(entry)}
      >
        Delete
      </Button>
    </Box>
  </Box>
);

export default StyledPopup;
