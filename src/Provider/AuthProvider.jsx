import React, { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from '../firebase/firebase.config';
import axios from 'axios';
export const AuthContext = createContext(null)
const auth = getAuth(app)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const googleProvider = new GoogleAuthProvider()

    const newUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const login = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }
    const googleLogin = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }
    const updateUser = (name) => {
        return updateProfile(auth.currentUser, {
            displayName: name
        })
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);

            // get and set token
            if (currentUser) {
                axios.post('http://localhost:5000/jwt', { email: currentUser.email })
                .then(data=>{
                    localStorage.setItem('access-token',data.data.token)
                })
            }else{
                localStorage.removeItem('access-token')
            }

            setLoading(false)
        })
        return () => {
            unsubscribe();
        }
    }, [])

    const logOut = () => {
        return signOut(auth)
    }

    const info = {
        user,
        loading,
        newUser,
        updateUser,
        login,
        googleLogin,
        logOut
    }
    return (
        <AuthContext.Provider value={info}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;