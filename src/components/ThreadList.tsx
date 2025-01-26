import "../App.css";
import Thread from "../types/Thread";
import ThreadItem from "./ThreadItem";
import AddThread from "./AddThread";
import { getTagColor } from "../theme";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
    Box, 
    List,  
    Typography, 
    TextField, 
    Button, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    Chip,
    Divider, 
} from "@mui/material";

interface ThreadListProps {
    selectedThread: Thread | null;
    setSelectedThread: (thread: Thread) => void;
    currentUserId: number | null;
}

const ThreadList: React.FC<ThreadListProps> = ({ selectedThread, setSelectedThread, currentUserId }) => {
    const { threadId } = useParams<{ threadId: string }>();
    const [threads, setThreads] = useState<Thread[]>([]);
    const [editThreadId, setEditThreadId] = useState<number | null>(null);
    const [editThreadName, setEditThreadName] = useState("");
    const [editThreadTags, setEditThreadTags] = useState<string[]>([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTags, setFilterTags] = useState<string[]>([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    // fetch threads (with optional tag filtering)
    const fetchThreads = async () => {
        try {
            const queryParams = filterTags.length > 0 ? `?tags=${filterTags.join(",")}` : "";
            const response = await fetch(`${apiUrl}/threads${queryParams}`);
            const data: Thread[] = await response.json();
            setThreads(data || []);
        } catch (error) {
            console.error("Failed to fetch threads: ", error);
        }
    };

    // filter threads based on search query
    const filteredThreads = threads.filter((thread) => 
        thread.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    // set selected thread based on URL params
    useEffect(() => {
        if (threadId) {
            const thread = threads.find(
                (thread) => thread.id === parseInt(threadId)
            );
            if (thread) {
                setSelectedThread({ name: thread.name, id: parseInt(threadId), user_id: thread.user_id, tags: thread.tags});
            }
        }
    }, [threadId, threads, setSelectedThread]);

    // fetch thread list
    useEffect(() => {
        fetchThreads();

        const fetchTags = async () => {
            const response = await fetch(`${apiUrl}/tags`);
            if (response.ok) {
                const tags: string[] = await response.json();
                setAvailableTags(tags);
            }
        }

		// fetchThreads();
        fetchTags();
	}, []);

    // refetch threads when filterTags changes
    useEffect(() => {
        fetchThreads();
    }, [filterTags]);


    // add new thread
    const handleAddThread = async (threadName: string, tags: string[]) => {
        const threadData = {
            name: threadName,
            user_id: currentUserId,
            tags: tags.length > 0 ? tags : []
        };

		const response = await fetch(`${apiUrl}/threads`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(threadData),
		});

		if (response.ok) {
			const newThread = await response.json();
			setThreads((previousThreads) => [...previousThreads, newThread]);
            setSelectedThread(newThread);
		}
	};

    // delete thread
    const handleDeleteThread = async (threadId: number) => {
        const response = await fetch(`${apiUrl}/threads/${threadId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            setThreads(threads.filter((thread) => thread.id !== threadId));
        }
    }

    // open edit dialog
    const handleEditThread = (threadId: number, currentName: string, currentTags: string[]) => {
        setEditThreadId(threadId);
        setEditThreadName(currentName);
        setEditThreadTags(currentTags);
        setIsEditDialogOpen(true);
    }

    // save edited thread
    const handleSaveEditedThread = async (threadId: number, newName: string, newTags: string[]) => {
        try {
            const response = await fetch(`${apiUrl}/threads/${threadId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, tags: newTags }),
            });
    
            if (response.ok) {
                setThreads((previousThreads) => 
                    previousThreads.map((thread) => 
                        thread.id === threadId 
                            ? {...thread, name: newName, tags: newTags} 
                            : thread
                    )
                );
    
                setIsEditDialogOpen(false);
                setEditThreadId(null);
                setEditThreadName("");
                setEditThreadTags([]);
            } else {
                console.error("Failed to update thread");
                alert("Failed to update thread")
            }
        } catch (error) {
            console.error("Failled to update thread: ", error);
            alert("Failed to update thread")
        }
    };



    return (
        <Box 
            key={selectedThread?.id} 
            sx={{ 
                display: "flex", 
                flexDirection: "column", 
                height: "100%", 
                borderRight: 1, 
                borderColor: "divider", 
                bgcolor: "background.paper",
                maxWidth: "350px",
                overflowWrap: "break-word"
            }}
        >
            <Box sx={{ bgcolor: "primary.main", p: 2}}>
                <Typography variant="h6" color="white">
                    Threads
                </Typography>
            </Box>

            <TextField
                    variant="outlined"
                    placeholder="Search threads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mt: 2, mx: 2 }}
                    size="small"
            />

            <Autocomplete 
                multiple
                options={availableTags}
                value={filterTags}
                onChange={(event, value) => setFilterTags(value)}
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
                renderInput={(params) => <TextField {...params} label="Filter by Tags" variant="outlined" size="small"/>}
                sx={{ my: 2, mx: 2 }}
            />

            <Divider sx={{ my: 1 }}/>
          
            <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1, width: 330 }}>
                {threads.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        No threads added yet. Start by creating a new thread!
                    </Typography>
                ) : filteredThreads.length > 0 ? (
                    <List>
                        {filteredThreads.map((thread) => (
                            <ThreadItem 
                                key={thread.id}
                                thread={thread}
                                isSelected={parseInt(threadId || "") === thread.id}
                                currentUserId={currentUserId}
                                onSelect={setSelectedThread}
                                onEdit={handleEditThread}
                                onDelete={handleDeleteThread}
                            />
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        No threads found
                    </Typography>
                )}               
            </Box>

            <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
                <DialogTitle>Edit Thread</DialogTitle>
                <DialogContent sx={{ minWidth: 300, pt: 2 }}>
                    <TextField 
                        autoFocus
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        label="Thread Name"
                        value={editThreadName}
                        onChange={(e) => setEditThreadName(e.target.value)}
                    />

                    <Autocomplete 
                        multiple
                        options={availableTags}
                        value={editThreadTags}
                        onChange={(event, value) => setEditThreadTags(value)}
                        renderTags={(value, getTagProps) => 
                            value.map((option, index) => (
                                <Chip 
                                    label={option}
                                    {...getTagProps({ index })}
                                    style={{ backgroundColor: getTagColor(option) }}
                                    size="small"
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Tags" variant="outlined" size="small" />
                        )}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ mb: 1 }}>
                    <Button onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={() => {
                            if (editThreadId !== null) {
                                handleSaveEditedThread(editThreadId, editThreadName, editThreadTags);
                            }
                        }}
                    >                      
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Divider sx={{ my: 1 }}/>

            <AddThread availableTags={availableTags} onAddThread={handleAddThread}/>
        </Box>
    );
};

export default ThreadList;