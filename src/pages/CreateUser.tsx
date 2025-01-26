import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Link, Card, CardContent } from "@mui/material";


const CreateUser: React.FC = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

		try {
			const response = await fetch(`${apiUrl}/users`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username }),
			});

			if (response.ok) {
				navigate("/");
			} else {
				alert("Account creation failed");
			}
		} catch (error) {
			console.error("Account creation error:", error);
			alert("An error occurred during account creation.");
		}
	};

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

    return (
        <Container maxWidth="sm">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Card sx={{ width: '100%', boxShadow: 3}}>
                    <CardContent>
                        <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
                            Create Account
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField 
                                label="Username"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={username}
                                onChange={handleUsernameChange}
                                required
                            />
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                Create Account
                            </Button>
                        </Box>                       
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );

};

export default CreateUser;