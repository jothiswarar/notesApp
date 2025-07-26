
import React from "react";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { auth } from "../firebaseConfig"; // Adjust the path as necessary   
import styled from "styled-components";
const Button = styled.button`
    padding: 10px 20px;
    background-color: #4285F4;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #357ae8;
    }
`;
function GoogleSignInButton() {
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    return (
        <Button onClick={handleGoogleSignIn}>
            Sign in with Google
        </Button>
    );
}

export default GoogleSignInButton;