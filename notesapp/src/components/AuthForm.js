
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Import the auth instance
import styled from 'styled-components'; // Import styled-components

// Styled components for AuthForm
const FormContainer = styled.div`
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    max-width: 400px;
    margin: 20px auto;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    background-color: white;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    color: #333;
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
    position: relative; /* Added for icon positioning */
`;

const Label = styled.label`
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
`;

const Input = styled.input`
    width: 100%; /* Changed to 100% */
    padding: 10px;
    padding-right: 60px; /* Added padding to make space for the toggle */
    box-sizing: border-box; /* Ensures padding is included in the width */
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 1em;
`;

const SubmitButton = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }
`;

const ErrorMessage = styled.p`
    color: #dc3545;
    margin-top: 15px;
    font-size: 0.9em;
`;

const ToggleText = styled.p`
    margin-top: 20px;
    font-size: 0.9em;
    color: #555;
`;

const ToggleButton = styled.button`
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
    font-size: 1em;

    &:hover {
        color: #0056b3;
    }
`;

const PasswordToggle = styled.span`
    position: absolute;
    right: 10px; /* Adjusted right position */
    top: 65%; /* Center vertically with input */
    transform: translateY(-50%); /* Adjust for vertical centering */
    cursor: pointer;
    color: blue;
    font-size: 0.9em;
    user-select: none; /* Prevent text selection */
    padding: 5px; /* Added for better click area */
    &:hover {
        color: #333;
    }
`;

function AuthForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
    const [showPassword, setShowPassword] = useState(false); // State for password visibility

    // Handles form submission for both login and signup
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError(null); // Clear any previous errors

        try {
            if (isLogin) {
                // Attempt to sign in an existing user
                await signInWithEmailAndPassword(auth, email, password);
                console.log('User logged in successfully!');
            } else {
                // Attempt to create a new user
                await createUserWithEmailAndPassword(auth, email, password);
                console.log('User signed up successfully!');
            }
        } catch (err) {
            // Catch and display any authentication errors
            console.error('Authentication error:', err.message);
            setError(err.message);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <FormContainer>
            <Title>{isLogin ? 'Login' : 'Sign Up'}</Title>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="email">Email:</Label>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="password">Password:</Label>
                    <Input
                        type={showPassword ? 'text' : 'password'} /* Dynamic type based on state */
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <PasswordToggle onClick={togglePasswordVisibility}>
                        {showPassword ? 'Hide' : 'Show'} {/* Text toggle for simplicity */}
                        {/* You can replace 'Show'/'Hide' with SVG icons (e.g., eye/eye-slash) for a better UX */}
                    </PasswordToggle>
                </FormGroup>
                <SubmitButton type="submit">
                    {isLogin ? 'Login' : 'Sign Up'}
                </SubmitButton>
            </form>
            {error && <ErrorMessage>Error: {error}</ErrorMessage>}
            <ToggleText>
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <ToggleButton onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Sign Up' : 'Login'}
                </ToggleButton>
            </ToggleText>
        </FormContainer>
    );
}

export default AuthForm;
