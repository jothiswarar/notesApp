// File Path: src/components/NotesApp.js
// Create this new file inside 'src/components'.

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Import the firestore instance
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp // Import serverTimestamp
} from 'firebase/firestore';
import styled from 'styled-components';

// Styled Components for NotesApp
const NotesAppContainer = styled.div`
    margin-top: 30px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background-color: #fefefe;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
`;

const NoteForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 8px;
    background-color: #f8f8f8;
`;

const FormInput = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1em;
`;

const FormTextarea = styled.textarea`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1em;
    min-height: 80px;
    resize: vertical;
`;

const FormButton = styled.button`
    padding: 10px 15px;
    background-color: #28a745; /* Green for add */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #218838;
    }
`;

const NotesList = styled.ul`
    list-style: none;
    padding: 0;
`;

const NoteItem = styled.li`
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    text-align: left;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
`;

const NoteTitle = styled.h3`
    margin-top: 0;
    margin-bottom: 5px;
    color: #333;
    font-size: 1.2em;
`;

const NoteContent = styled.p`
    color: #555;
    font-size: 0.95em;
    margin-bottom: 10px;
    white-space: pre-wrap; /* Preserves whitespace and line breaks */
`;

const NoteTimestamp = styled.span`
    font-size: 0.8em;
    color: #888;
    margin-bottom: 10px;
`;

const NoteActions = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 10px;
`;

const EditButton = styled.button`
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }
`;

const DeleteButton = styled.button`
    padding: 8px 12px;
    background-color: #dc3545; /* Red for delete */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #c82333;
    }
`;

const NoNotesMessage = styled.p`
    color: #777;
    font-style: italic;
    margin-top: 20px;
`;

function NotesApp({ user }) {
    const [notes, setNotes] = useState([]);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingNoteTitle, setEditingNoteTitle] = useState('');
    const [editingNoteContent, setEditingNoteContent] = useState('');

    // Fetch notes in real-time
    useEffect(() => {
        if (!user) {
            setNotes([]); // Clear notes if user logs out
            return;
        }

        // Create a query to get notes for the current user, ordered by creation time
        // The path is `users/{userId}/notes` to ensure user-specific data
        const notesCollectionRef = collection(db, 'users', user.uid, 'notes');
        const q = query(notesCollectionRef, orderBy('createdAt', 'desc'));

        // Set up a real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(notesData);
        }, (error) => {
            console.error("Error fetching notes: ", error);
        });

        // Clean up the listener when the component unmounts or user changes
        return () => unsubscribe();
    }, [user]); // Re-run effect if user object changes

    // Add a new note
    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNoteTitle.trim() || !newNoteContent.trim() || !user) return;

        try {
            // Add a new document to the 'notes' subcollection of the current user
            await addDoc(collection(db, 'users', user.uid, 'notes'), {
                title: newNoteTitle,
                content: newNoteContent,
                createdAt: serverTimestamp() // Firebase timestamp for ordering
            });
            setNewNoteTitle('');
            setNewNoteContent('');
            console.log('Note added successfully!');
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    // Start editing a note
    const handleEditClick = (note) => {
        setEditingNoteId(note.id);
        setEditingNoteTitle(note.title);
        setEditingNoteContent(note.content);
    };

    // Save edited note
    const handleSaveEdit = async (noteId) => {
        if (!editingNoteTitle.trim() || !editingNoteContent.trim() || !user) return;

        try {
            // Get a reference to the specific note document
            const noteDocRef = doc(db, 'users', user.uid, 'notes', noteId);
            await updateDoc(noteDocRef, {
                title: editingNoteTitle,
                content: editingNoteContent,
                updatedAt: serverTimestamp() // Optional: add an updatedAt timestamp
            });
            setEditingNoteId(null); // Exit editing mode
            setEditingNoteTitle('');
            setEditingNoteContent('');
            console.log('Note updated successfully!');
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setEditingNoteTitle('');
        setEditingNoteContent('');
    };

    // Delete a note
    const handleDeleteNote = async (noteId) => {
        if (!user) return;
        try {
            // Get a reference to the specific note document
            const noteDocRef = doc(db, 'users', user.uid, 'notes', noteId);
            await deleteDoc(noteDocRef);
            console.log('Note deleted successfully!');
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    return (
        <NotesAppContainer>
            <h2>Your Notes</h2>

            <NoteForm onSubmit={handleAddNote}>
                <FormInput
                    type="text"
                    placeholder="Note Title"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    required
                />
                <FormTextarea
                    placeholder="Note Content"
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    required
                />
                <FormButton type="submit">Add Note</FormButton>
            </NoteForm>

            {notes.length === 0 ? (
                <NoNotesMessage>You don't have any notes yet. Add one above!</NoNotesMessage>
            ) : (
                <NotesList>
                    {notes.map((note) => (
                        <NoteItem key={note.id}>
                            {editingNoteId === note.id ? (
                                <>
                                    <FormInput
                                        type="text"
                                        value={editingNoteTitle}
                                        onChange={(e) => setEditingNoteTitle(e.target.value)}
                                    />
                                    <FormTextarea
                                        value={editingNoteContent}
                                        onChange={(e) => setEditingNoteContent(e.target.value)}
                                    />
                                    <NoteActions>
                                        <EditButton onClick={() => handleSaveEdit(note.id)}>Save</EditButton>
                                        <DeleteButton onClick={handleCancelEdit}>Cancel</DeleteButton>
                                    </NoteActions>
                                </>
                            ) : (
                                <>
                                    <NoteTitle>{note.title}</NoteTitle>
                                    <NoteContent>{note.content}</NoteContent>
                                    {note.createdAt && (
                                        <NoteTimestamp>
                                            Created: {new Date(note.createdAt.toDate()).toLocaleString()}
                                        </NoteTimestamp>
                                    )}
                                    {note.updatedAt && (
                                        <NoteTimestamp>
                                            Updated: {new Date(note.updatedAt.toDate()).toLocaleString()}
                                        </NoteTimestamp>
                                    )}
                                    <NoteActions>
                                        <EditButton onClick={() => handleEditClick(note)}>Edit</EditButton>
                                        <DeleteButton onClick={() => handleDeleteNote(note.id)}>Delete</DeleteButton>
                                    </NoteActions>
                                </>
                            )}
                        </NoteItem>
                    ))}
                </NotesList>
            )}
        </NotesAppContainer>
    );
}

export default NotesApp;
