import Comment from "../types/Comment";
import Thread from "../types/Thread";

import React, { useState, KeyboardEvent } from 'react';
import { Box, TextField, Button } from "@mui/material";

interface CommentEntryProps {
    selectedThread: Thread;
    onNewComment: (comment: Comment) => void;
}

const CommentEntry: React.FC<CommentEntryProps> = ({ selectedThread, onNewComment}) => {
    const [text, setText] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;

    const handlePostComment = async () => {
        const userId = localStorage.getItem("userId");
        const userName = localStorage.getItem("userName");

        if (!userId || !userName || !text.trim()) {
            alert("User information or comment body is missing")
            return;
        }

        try {
			const response = await fetch(`${apiUrl}/comments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					thread_id: selectedThread.id,
					user_id: parseInt(userId),
					text,
				}),
			});

            if (response.ok) {
                const comment = await response.json();
                console.log("Response: ", comment);
                onNewComment({
                    id: comment.id,
                    thread_id: selectedThread.id,
                    user_id: parseInt(userId),
                    user_name: userName,
                    text: text,
                    created_at: new Date(comment.created_at)
                });
                setText("");
            } else {
                alert("Failed to post comment")
            }
        } catch (error) {
            console.error("Error posting comment: ", error);
            alert("An error occurred while posting the comment");
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            handlePostComment();
            event.preventDefault();
        }
    };

    return (
        <Box 
            sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderTop: 1,
                borderColor: "divider",
                bgcolor: "background.paper"
            }}
        >
            <TextField 
                fullWidth
                variant="outlined"
                placeholder="Type a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                multiline
                maxRows={3}
                sx={{ mr: 2 }}
            />

            <Button variant="contained" color="primary" onClick={handlePostComment} disabled={!text.trim()}>
                Post
            </Button>
        </Box>
    );
};

export default CommentEntry;