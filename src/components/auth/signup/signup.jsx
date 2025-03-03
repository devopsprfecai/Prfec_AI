
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '@styles/auth/login.css';
import { auth } from '@firebase';  // Firebase auth import
import { getAuth, signInWithEmailLink } from 'firebase/auth';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import validator from 'email-validator';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [isLinkSent, setIsLinkSent] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

useEffect(() => {
        const handleSignIn = async () => {
            if (window.location.search) {
                const queryParams = new URLSearchParams(window.location.search);
                const emailFromQuery = queryParams.get('email');
                const oobCode = queryParams.get('oobCode');

                if (emailFromQuery && oobCode) {
                    try {
                        const auth = getAuth();
                        setLoading(true);

                        // Firebase requires the email to be saved in localStorage for link sign-in
                        localStorage.setItem('emailForSignIn', emailFromQuery);

                        await signInWithEmailLink(auth, emailFromQuery, window.location.href);
                        console.log('User signed in successfully');
                        router.push('/'); // Redirect after successful sign-in
                    } catch (error) {
                        console.error('Error signing in:', error.message, error.code);
                        setGeneralError('Authentication failed. Please try again.');
                    } finally {
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                    console.error('Error: Missing email or oobCode in URL.');
                }
            } else {
                setLoading(false);
            }
        };

        handleSignIn();
    }, [router]);
    

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError('');
        setGeneralError('');
    };

    const validateEmail = (email) => {
        if (!validator.validate(email)) {
            return { valid: false, error: 'Invalid email format. Please use a proper email address.' };
        }

        const disposableEmailProviders = ['mailinator.com', 'guerrillamail.com', 'tempmail.com'];
        const emailDomain = email.split('@')[1];
        if (disposableEmailProviders.includes(emailDomain)) {
            return { valid: false, error: 'Disposable email addresses are not allowed. Please use a valid email address.' };
        }

        return { valid: true };
    };

    const storeUserData = async (email, method) => {
        // Extract the first name from the email
        const firstName = email.split('@')[0];
    
        try {
            // Store the data in the Firebase Realtime Database
            await axios.put(`https://prfecai-auth-default-rtdb.firebaseio.com/usersData/${firstName}.json`, {
                email,
                firstName,
                method,
            });
            console.log('User data stored successfully');
        } catch (error) {
            console.error('Error storing user data:', error);
            setGeneralError('Failed to store user data. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setEmailError('Email is required.');
            return;
        }

        const validation = validateEmail(email);
        if (!validation.valid) {
            setEmailError(validation.error);
            return;
        }

        try {
            const actionCodeSettings = {
                url: `${window.location.origin}/login?email=${encodeURIComponent(email)}`,
                handleCodeInApp: true,
            };
            console.log(actionCodeSettings)

            // Call the backend to send the sign-in link
            await axios.post('https://prfecai-backend-592134571427.us-central1.run.app/api/sendSignInEmail', {
                email,
                link: actionCodeSettings.url,
            });

            setIsLinkSent(true);
            await storeUserData(email, 'email');
        } catch (error) {
            console.error('Error sending link:', error);
            setGeneralError('Failed to send the verification link. Please try again.');
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const email = user.email;

        // Store user data in Firebase
        await storeUserData(email, 'google');

        router.push('/');
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        setGeneralError('Failed to sign in with Google. Please try again.');
    }
    };

    // if (loading) return <div>Loading...</div>;

    return (
        <div className="login">
            <div className="login-container">
                <div className="login-heading">
                    <h1>Signup</h1>
                    {generalError && <div className="error-message">{generalError}</div>}
                </div>
                {isLinkSent ? (
                    <div className="success-message">
                        ✅ A verification link has been sent to <strong>{email}</strong>. Please check your inbox.
                    </div>
                ) : (
                    <form className="form" onSubmit={handleSubmit}>
                        <Box component="div" noValidate autoComplete="off" className="email" sx={{color:"var(--p-color)"}}>
                        <TextField
                            id="outlined-email"
                            label="Enter your Email"
                            variant="outlined"
                            className="custom-text-field"
                            error={!!emailError}
                            helperText={emailError}
                            value={email}
                            onChange={handleEmailChange}
                            sx={{ 
                                color: "var(--p-color)", 
                                "& .MuiInputBase-input": { color: "var(--p-color)" },  // Input text color
                                "& .MuiInputLabel-root": { color: "var(--p-color)" },  // Label color
                                "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "var(--p-color)" }, // Border color
                                "&:hover fieldset": { borderColor: "var(--p-color)" }, // Hover border
                                "&.Mui-focused fieldset": { borderColor: "var(--p-color)" } // Focused border
                                }
                            }}
                            InputLabelProps={{ style: { color: "var(--p-color)" } }}  // Label color
                            InputProps={{ style: { color: "var(--p-color)" } }} // Input text color
                            />

                        </Box>
                        <div className="login-button">
                            <button className="login-btn" type="submit">Continue with Email</button>
                        </div>
                        <div className="google-auth" style={{width: "100%", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center",gap:"1.5rem"}}>
                    {/* <h3 style={{ fontSize: "15px", fontFamily: "var(--p-font)", textAlign: "center", paddingTop: "14px", fontWeight:"400" }}>OR</h3> */}
                    <div className='google-signin'>
                        <button className="login-with-google-btn" onClick={handleGoogleSignIn}>
                            Continue with Google
                        </button>
                    </div>
                </div>
                    </form>
                )}

                <p className="signup-terms">
                    By signing up, you agree to our <Link href="https://prfec.ai/terms-of-service">Terms of services</Link> and <Link href="https://prfec.ai/privacy-policy">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
};

export default Login;
