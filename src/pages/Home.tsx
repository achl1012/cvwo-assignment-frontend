import Thread from "../types/Thread";
import ThreadList from "../components/ThreadList";
import CommentList from "../components/CommentList";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Divider} from "@mui/material";

const Home: React.FC = () => {
    const { threadId } = useParams<{ threadId: string }>();
    const navigate = useNavigate();
    const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // Fetch current user
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setCurrentUserId(Number(userId));
        } else {
            setCurrentUserId(null);
        }
    }, []);

    // Update the URL if the selected thread changes
    useEffect(() => {
        if (selectedThread !== null) {
            navigate(`/home/${selectedThread}`);
        }
    }, [selectedThread, navigate]);

    const handleThreadSelect = (thread: Thread) => {
        setSelectedThread(thread);
    };

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box sx = {{ width:"350px", borderRight: 5, borderColor: "white", overflowY: "auto"}}>
                <ThreadList 
                    selectedThread={selectedThread} 
                    setSelectedThread={handleThreadSelect} 
                    currentUserId={currentUserId}
                />
            </Box>

            <Divider orientation="vertical" flexItem/>

            <Box sx={{ width: 700, overflowY: "auto" }} >
                <CommentList selectedThread={selectedThread} currentUserId={currentUserId}/>
            </Box>
        </Box>
    );
};

export default Home;