import Thread from '../types/Thread';
import { getTagColor } from '../theme';

import React, { useState } from 'react';
import { 
    ListItem, 
    ListItemButton, 
    ListItemText,  
    IconButton, 
    Menu, 
    MenuItem,
    Box,
    Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface ThreadItemProps {
    thread: Thread;
    isSelected: boolean;
    currentUserId: number | null;
    onSelect: (thread: Thread) => void;
    onEdit: (threadId: number, threadName: string, threadTags: string[]) => void;
    onDelete: (threadId: number) => void;
};

const ThreadItem: React.FC<ThreadItemProps> = ({
    thread,
    isSelected,
    currentUserId,
    onSelect,
    onEdit,
    onDelete
}) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // open menu
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // close menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    return (
        <ListItem key={thread.id} disablePadding>
            <ListItemButton 
                selected={isSelected}
                onClick={() => onSelect(thread)}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Box
                        sx={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%'
                        }}
                    >
                        <ListItemText primary={thread.name}/>
                        {currentUserId === thread.user_id && (
                            <IconButton
                                edge="end"
                                onClick={handleMenuOpen}
                                sx={{ ml: 1 }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        )}
                    </Box>
                    <Box sx={{mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1}}>
                        {thread.tags && thread.tags.length > 0 && thread.tags.map((tag, index) => (
                            <Chip 
                                key={index} 
                                label={tag} 
                                size="small" 
                                style={{ backgroundColor: getTagColor(tag) }}
                            />
                        ))}
                    </Box>
                </Box>
            </ListItemButton>
            
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
            >
                <MenuItem
                    onClick = {() => {
                        onEdit(thread.id, thread.name, thread.tags || []);
                        handleMenuClose();
                    }}
                >
                    <EditIcon fontSize="small" sx={{ mr: 1 }}/>
                    Edit
                </MenuItem>
                <MenuItem 
                    onClick={() => {
                        onDelete(thread.id);
                        handleMenuClose();
                    }}
                >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }}/>
                    Delete
                </MenuItem>
            </Menu>
                                
        </ListItem>
    )

}

export default ThreadItem;