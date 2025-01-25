import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Autocomplete,
    Chip,
  } from "@mui/material";
import { getTagColor } from "../theme";

interface AddThreadProps {
    availableTags: string[];
    onAddThread: (threadName: string, tags: string[]) => void;
}

const AddThread: React.FC<AddThreadProps> = ({ availableTags, onAddThread}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newThreadName, setNewThreadName] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleOpen = () => setIsOpen(true);

    const handleClose = () => {
        setIsOpen(false);
        setNewThreadName("");
        setSelectedTags([]);
    }

    const handleSave = () => {
        onAddThread(newThreadName, selectedTags);
        handleClose();
    }

    return (
        <Box>
            <Button variant="contained" color="primary" onClick={handleOpen} sx={{ my: 2 }}>
                Add New Thread
            </Button>

            <Dialog open={isOpen} onClose={handleClose}>
                <DialogTitle sx={{ mt: 1, fontSize: 22, fontWeight: 'bold', textAlign: 'center', borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                    Add a new thread
                </DialogTitle>
                <DialogContent sx={{ width: 400, pt: 2 }}>
                    <TextField 
                        label="Thread Name"
                        variant="outlined"
                        fullWidth
                        value={newThreadName}
                        onChange={(e) => setNewThreadName(e.target.value)}
                        margin="normal"
                        size="small"
                    />
                    
                    <Autocomplete 
                        multiple
                        options={availableTags}
                        value={selectedTags}
                        onChange={(event, value) => setSelectedTags(value)}
                        renderTags={(value, getTagProps) => 
                            value.map((option, index) => (
                                <Chip 
                                    label={option} 
                                    {...getTagProps({ index })} 
                                    style={{ backgroundColor: getTagColor(option)}}
                                    size="small"
                                />
                            ))
                        }
                        renderInput={(params) => <TextField {...params} label="Tags" variant="outlined" size="small" />}
                        sx={{ mb: 2, mt: 1 }}
                    />
                </DialogContent>

                <DialogActions sx={{ mb: 1 }}>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        disabled={!newThreadName.trim()}                   
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddThread;