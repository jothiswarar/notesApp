import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig'; // Import the auth instance
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import onAuthStateChanged and signOut functions
import AuthForm from './components/AuthForm'; // Import the AuthForm component
import GoogleSignInButton from './components/GoogleSignInButton'; // Import the GoogleSignInButton component
import NotesApp from './components/NotesApp'; // Import the NotesApp component
import styled from 'styled-components'; // Import styled-components

// Styled components for App.js
const AppContainer = styled.div`
    font-family: 'Inter', sans-serif;
    text-align: center;
    padding: 20px;
    background-color: #f9f9f9;
    min-height: 100vh;
    box-sizing: border-box;
`;

const Title = styled.h1`
    color: #333;
    margin-bottom: 30px;
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: 50px;
    font-size: 1.2em;
    color: #555;
`;

const AuthenticatedContainer = styled.div`
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 30px;
    margin: 20px auto;
    max-width: 700px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    background-color: white;
`;

const WelcomeMessage = styled.p`
    font-size: 1.2em;
    margin-bottom: 20px;
    color: #444;
`;

const UserEmail = styled.span`
    font-weight: bold;
    color: #007bff;
`;

const LogoutButton = styled.button`
    padding: 12px 25px;
    background-color: #dc3545; /* Red for logout */
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    &:hover {
        background-color: #c82333;
    }
    &:active {
        transform: translateY(1px);
    }
`;

const AuthFormsContainer = styled.div`
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 30px;
    margin: 20px auto;
    max-width: 500px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    background-color: white;
`;

const OrSeparator = styled.p`
    margin: 25px 0;
    color: #777;
    font-size: 1.1em;
`;

const NotesPlaceholder = styled.p`
    margin-top: 30px;
    color: #666;
    font-size: 1em;
`;


function App() {
    const [user, setUser] = useState(null); // State to hold the current authenticated user
    const [loading, setLoading] = useState(true); // State to track if authentication state is being loaded

    // useEffect hook to listen for changes in authentication state
    useEffect(() => {
        // onAuthStateChanged returns an unsubscribe function
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Update user state with the current user (or null if logged out)
            setLoading(false); // Set loading to false once the auth state is determined
        });

        // Cleanup function: unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

    // Handles user logout
    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out the current user
            console.log('User logged out successfully!');
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };

    // Show a loading message while authentication state is being determined
    if (loading) {
        return <LoadingMessage>Loading app...</LoadingMessage>;
    }

    return (
        <AppContainer>
            <Title>My Notes App</Title>

            {user ? (
                // If a user is logged in, show their email and a logout button
                <AuthenticatedContainer>
                    <WelcomeMessage>Welcome, <UserEmail>{user.email}</UserEmail>!</WelcomeMessage>
                    <LogoutButton onClick={handleLogout}>
                        Logout
                    </LogoutButton>
                    {/* Render the NotesApp component when a user is authenticated */}
                    <NotesApp user={user} />
                </AuthenticatedContainer>
            ) : (
                // If no user is logged in, show authentication forms
                <AuthFormsContainer>
                    <AuthForm />
                    <OrSeparator>OR</OrSeparator>
                    <GoogleSignInButton />
                </AuthFormsContainer>
            )}
        </AppContainer>
    );
}

export default App;
