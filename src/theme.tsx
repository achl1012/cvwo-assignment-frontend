import { createTheme } from '@mui/material/styles';

export const tagColors: { [key: string]: string } = {
    School: '#CDB4DB',
    Work: '#BDE0FE',
    'Interests and Hobbies': '#A8DADC',
    Miscellaneous: '#FFC8DD'
};

export const getTagColor = (tag: string): string => {
    const trimmedTag = tag.trim();
    return tagColors[trimmedTag] || '#808080'; // Default to grey
};

const theme = createTheme({
    palette: {
        primary: {
            main: '#457B9D',
        },
        secondary: {
            main: '#FFFFFF',
        },
    },
});

export default theme;