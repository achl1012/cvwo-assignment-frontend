import CommentItem from "./CommentItem";
import Comment from "../types/Comment";
import CommentEntry from "./CommentEntry";
import Thread from "../types/Thread";

import React, { useState, useEffect, useRef } from 'react';
import {
	Box,
	Typography,
	Paper,
	List,
	Divider,
} from "@mui/material";

interface CommentListProps {
    selectedThread: Thread | null;
    currentUserId: number | null;
}

const CommentList: React.FC<CommentListProps> = ({ selectedThread, currentUserId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState<string>("");
    const lastCommentIdRef = useRef<number | null>(null); // keep track of the last comment ID

    useEffect(() => {
        if (!selectedThread) {
            return;
        }

        let isMounted = true;
        let intervalId: NodeJS.Timeout | null = null;

        const fetchComments = async () => {
            try {
                const response = await fetch (`http://localhost:8080/comments?threadID=${selectedThread.id}`);
                const data: Comment[] = await response.json();
                if (isMounted) {
                    const validComments = Array.isArray(data) ? data : [];
                    setComments(validComments);
                    lastCommentIdRef.current = 
                        data.length > 0 ? data[data.length - 1].id : null;
                }
            } catch (error) {
                console.error("Failed to fetch comments: ", error)
            }
        };

        fetchComments();

        // Poll for new comments every 5 seconds
        intervalId = setInterval(() => {
            if (lastCommentIdRef.current !== null) {
				fetch(
					`http://localhost:8080/comments?threadID=${selectedThread.id}&lastCommentID=${lastCommentIdRef.current}`
				)
					.then((response) => response.json())
					.then((newComments: Comment[]) => {
						if (
							isMounted &&
							Array.isArray(newComments) &&
							newComments.length > 0
						) {
							setComments((comments) => {
								const updatedComments = [...comments, ...newComments];
								lastCommentIdRef.current =
									updatedComments[updatedComments.length - 1].id;
								return updatedComments;
							});
						}
					})
					.catch((error) => {
						console.error("Failed to fetch new comments:", error);
					});
            }
		}, 5000);

        return () => {
            isMounted = false;
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [selectedThread]);

    // handle comment deletion
    const deleteComment = async (commentId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/comments/${commentId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setComments((prevComments) => 
                    prevComments.filter(comment => comment.id !== commentId)
                );
            } else {
                console.error("Failed to delete comment");
                alert("Failed to delete comment");
            }
        } catch (error) {
            console.error("Failed to delete comment: ", error);
            alert("Failed to delete comment");
        }
    };

    // handle comment update
    const updateComment = async (commentId: number, newText: string) => {
        try {
            const response = await fetch(`http://localhost:8080/comments/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: newText }),
            });

            if (response.ok) {
                setComments((previousComments) => 
                    previousComments.map((comment) => 
                        comment.id === commentId ? {...comment, text: newText} : comment
                    )
                );
                setEditingCommentId(null);
            } else {
                console.error("Failed to update comment");
                alert("Failed to update comment");
            }
        } catch (error) {
            console.error("Failed to update comment: " + error);
            alert("Failed to update comment");
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", borderLeft: 1, borderColor: "white", width: 700 }}>
            {selectedThread && (
                <Paper elevation={2} sx={{ bgcolor: "#457B9D", color: "white", p: 2 }}>
                    <Typography variant="h6">
                        Comments for {selectedThread.name}
                    </Typography>
                </Paper>
            )}

            <Box sx={{ flexGrow: 1, overflowY:"auto", p: 2, backgroundColor: "default"}}>
                {selectedThread ? (
                    comments.length > 0 ? (
                        <List>
                            {comments.map((comment) => (
                                <React.Fragment key={comment.id}>
                                    <CommentItem 
                                        comment={comment}
                                        currentUserId={currentUserId}
                                        onDelete={deleteComment}
                                        editingCommentId={editingCommentId}
                                        setEditingCommentId={setEditingCommentId}
                                        editingText={editingText}
                                        setEditingText={setEditingText}
                                        onUpdate={updateComment}
                                    />
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{ textAlign: "center", mt: 4}}>
                            <Typography color="text.secondary">
                                No comments yet! Why not post one?
                            </Typography>
                        </Box>
                    )
                ) : (
                    <Box sx={{ textAlign: "center", mt: 4}}>
                        <Typography>Select a thread to see comments</Typography>
                    </Box>
                )}
            </Box>

            {selectedThread && (
                <CommentEntry 
                    selectedThread={selectedThread}
                    onNewComment={(comment: Comment) => {
                        lastCommentIdRef.current = comment.id;
                        setComments((previousComments) => [...previousComments, comment]);
                    }}
                />
            )}
        </Box>
    );   
};

export default CommentList