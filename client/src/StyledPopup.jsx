import { Box, Typography, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledPopup = ({ entry, onEdit, onDelete }) => (
  <Box
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
    <Typography
      variant="h6"
      fontWeight="bold"
      color="primary"
      sx={{ wordWrap: "break-word" }}
    >
      {entry.title}
    </Typography>

    {entry.comments && (
      <Typography
        variant="body2"
        sx={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
      >
        {entry.comments}
      </Typography>
    )}

    <Typography variant="caption" color="text.secondary">
      Visited on: {new Date(entry.visitDate).toLocaleDateString()}
    </Typography>

    <Box
      component="img"
      src={entry.image}
      alt={entry.title}
      sx={{
        width: "100%",
        maxHeight: 180,
        objectFit: "cover",
        borderRadius: 2,
        boxShadow: 1,
      }}
    />

    <Box display="flex" justifyContent="space-between" gap={1} mt={1}>
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
