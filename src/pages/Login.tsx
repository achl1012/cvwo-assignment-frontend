import React, { useState, FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Link, Card, CardContent } from "@mui/material";

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });
    
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("userId", data.id);
                localStorage.setItem("userName", username);
                navigate("/home");
            } else {
                alert("Login failed");
            }
        } catch (error) {
            console.error("Login error: " + error)
            alert("An error occurred during login.")
        }
	};

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

    return (
        <Container maxWidth="sm">
            <Box display="flex" justifyContent="center" alignItems="center" maxHeight="100vh">
                <Card sx={{ width: '100%', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
                            Log In
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
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Log In
                            </Button>
                        </Box>
                        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                            Don't have an account?{" "}
                            <Link href="/create-user" underline="hover">
                                Create one
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );


};

export default Login;