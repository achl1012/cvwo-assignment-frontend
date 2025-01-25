import Comment from "../types/Comment";

import React from 'react';
import { format } from 'date-fns';
import {
	Box,
	Typography,
    IconButton,
    TextField,
    Button
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'

type CommentItemProps = {
    comment: Comment;
    currentUserId: number | null;
    onDelete: (commentId: number) => void;
    editingCommentId: number | null;
    setEditingCommentId: (id: number | null) => void;
    editingText: string;
    setEditingText: (text: string) => void;
    onUpdate: (commentId: number, newText: string) => void;
};

const CommentItem: React.FC<CommentItemProps> = ({
    comment, 
    currentUserId,
    onDelete,
    editingCommentId,
    setEditingCommentId,
    editingText,
    setEditingText,
    onUpdate 
}) => {
    const isEditing = editingCommentId === comment.id;
    
    return (
        <Box sx={{ position: "relative", padding: 2, borderBottom: 1}}>
            { isEditing ? (
                <>
                    <TextField 
                        fullWidth
                        variant="outlined"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        sx={{ mb : 1 }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1}}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onUpdate(comment.id, editingText)}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setEditingCommentId(null)}
                        >
                            Cancel
                        </Button>
                    </Box>
                </>
            ) : (
                <>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            position: "relative",
                            marginBottom: 1
                        }}
                    >
                        <Typography fontWeight="bold">
                            {comment.user_name}
                        </Typography>
                        <Typography component="span" variant="caption" color="text.secondary">
                            {format(comment.created_at, 'Pp')}
                        </Typography>
                    </Box>

                    <Typography sx={{ textAlign: "left"}}>
                        {comment.text}
                    </Typography>

                    {currentUserId === comment.user_id && (
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1}}>
                            <IconButton
                                onClick={() => {
                                    setEditingCommentId(comment.id);
                                    setEditingText(comment.text);
                                }}
                                color="default"
                                aria-label="edit"
                                sx={{ position: "absolute", bottom: 8, right: 35 }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                                onClick={() => onDelete(comment.id)}
                                color="default"
                                aria-label="delete"
                                sx={{ position: "absolute", bottom: 8, right: 8 }}
                            >
                                <DeleteIcon fontSize="small"/>
                            </IconButton>
                        </Box>
                        
                    )}                          
                </>
            )}
        </Box>
    );
};                      

export default CommentItem