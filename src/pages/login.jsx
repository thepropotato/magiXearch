import React, { useEffect, useState } from "react";
import "../styles/login-styles.css";

import logo from "../assets/magiXearch.jpg";

import LoadError from "./errors";
import LoadSuccess from "./success";
import LoadLoading from "./loading";

function LoadLogin( { onLoginSuccess } ) {
    const [angle, setAngle] = useState(0);
    const [openedSection, setOpenedSection] = useState(1);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [verificationStarted, setVerificationStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showVerifyForgotPassword, setShowVerifyForgotPassword] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)

    // ADD MOTION TO THE BACKGROUND
    useEffect(() => {
        const interval = setInterval(() => {
            setAngle(prevAngle => (prevAngle + 1) % 360);
        }, 10);
        return () => clearInterval(interval);
    }, []);

    // CHANGE THE BACKGROUND COLOR OF THE SELECTED SECTION
    useEffect(() => {
        const sections = document.querySelectorAll('#login-menu > button');
        sections.forEach((section, index) => {
            if (index + 1 === openedSection) {
                section.style.backgroundColor = '#1A1A19';
            } else {
                section.style.backgroundColor = '';
            }
        });
    }, [openedSection]);

    // TRIGGER THE LOGIN ENDPOINT
    const login = (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        setIsLoading(true);

        fetch('http://magixearch.pythonanywhere.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json())
        .then(response => {
            if (response.error) {
                setErrorMessage(response.error);
                setShowError(true);
            } else {
                setShowError(false);
                setSuccessMessage('Login successful.');
                setShowSuccess(true);
                onLoginSuccess(response);
            }
        }).finally(() => setIsLoading(false));
    };

    // TRIGGER THE SIGNUP ENDPOINT
    const startSignup = (event) => {
        event.preventDefault();
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setShowError(true);
            return;
        }

        const data = {
            email: email,
            password: password,
            username: username
        };

        localStorage.setItem('signup-data', JSON.stringify(data));
        setIsLoading(true);

        fetch('http://magixearch.pythonanywhere.com/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(response => {
            if (response.error) {
                setErrorMessage(response.error);
                setShowError(true);
            } else {
                setShowError(false);
                setVerificationStarted(true);
                localStorage.setItem('signup-otp', response);
                setSuccessMessage('Verification code sent to your email.');
                setShowSuccess(true);
            }
        }).finally(() => setIsLoading(false));
    };

    // VERIFY THE OTP AND COMPLETE THE SIGNUP
    const finishSignup = (event) => {
        event.preventDefault();
        const otp = document.getElementById('signup-otp').value;

        if (otp !== localStorage.getItem('signup-otp')) {
            setErrorMessage('Invalid OTP entered, Try again.');
            setShowError(true);
        } else {
            const data = localStorage.getItem('signup-data');
            const parsedData = JSON.parse(data);
            const { email, password, username } = parsedData;

            fetch('http://magixearch.pythonanywhere.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password, username: username })
            })
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    setErrorMessage(response.error);
                    setShowError(true);
                    if (response.error.includes('exists')) {
                        scrollTo(1);
                        setTimeout(() => setVerificationStarted(false), 1000);
                    }
                } else {
                    setShowError(false);
                    setSuccessMessage(`Signed up as ${username}. Login to continue.`);
                    setShowSuccess(true);
                    scrollTo(1);
                }
            });

            localStorage.removeItem('signup-data');
            localStorage.removeItem('signup-otp');
        }
    };

    // SCROLL TO THE SELECTED SECTION
    const scrollTo = (section) => {
        const element = document.querySelector(`#login-main > form:nth-of-type(${section})`);
        element.querySelectorAll('input').forEach(input => input.value = '');
        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        setOpenedSection(section);
    };

    // START THE FORGOT PASSWORD VERIFICATION
    const startForgotPasswordVerification = (event) => {
        event.preventDefault();

        const email = document.getElementById('forgot-password-email').value;

        localStorage.setItem('forgot-password-email', email);
        setIsLoading(true);

        fetch('http://magixearch.pythonanywhere.com/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(response => {
            if (response.error) {
                setErrorMessage(response.error);
                setShowError(true);
            } else {
                setShowError(false);
                setShowVerifyForgotPassword(true);
                localStorage.setItem('forgot-password-otp', response);
                setSuccessMessage('Verification code sent to your email.');
                setShowSuccess(true);

                const element = document.querySelector(`#login-main > form`);
                element.querySelectorAll('input').forEach(input => input.value = '');
            }
        }).finally(() => setIsLoading(false));
    }

    // FINISH THE FORGOT PASSWORD VERIFICATION 
    const finishForgotPasswordVerification = (event) => {
        event.preventDefault();

        const otp = document.getElementById('forgot-password-otp').value;

        if (otp !== localStorage.getItem('forgot-password-otp')) {
            setErrorMessage('Invalid OTP entered, Try again.');
            setShowError(true);
        } else {
            setShowChangePassword(true)
            const element = document.querySelector(`#login-main > form`);
            element.querySelectorAll('input').forEach(input => input.value = '');
        }
    }

    // CHANGE THE PASSWORD
    const changePassword = (event) => {
        event.preventDefault();

        const password = document.getElementById('change-password').value;
        const confirmPassword = document.getElementById('change-confirm-password').value;

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setShowError(true);
            return;
        }        

        const email = localStorage.getItem('forgot-password-email');

        fetch('http://magixearch.pythonanywhere.com/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json())
        .then(response => {
            if (response.error) {
                setErrorMessage(response.error);
                setShowError(true);
            } else {
                setShowError(false);
                setSuccessMessage(`Password changed. Login to continue.`);
                setShowSuccess(true);
                setShowForgotPassword(false);
            }
        });

        localStorage.removeItem('forgot-password-email');
        localStorage.removeItem('forgot-password-otp');

    }

    return (
        <div id="login-container" className="container">
            {isLoading && <LoadLoading />}
            <div id="logo">
                <img src={logo} alt="magiXearch logo" />
            </div>

            <div id="login-wrapper" style={{ background: `linear-gradient(${angle}deg, #31511E, #F6FCDF)` }}>
                <div></div>

                {showError && <LoadError error_message={errorMessage} onClose={() => setShowError(false)} />}
                {showSuccess && <LoadSuccess success_message={successMessage} onClose={() => setShowSuccess(false)} />}

                <div id="login-main">
                    
                    {!showForgotPassword && (
                        <form id="login" onSubmit={login}>
                            <div id="login-title" className="title">MAGI<span>X</span>EARCH</div>
                            <div className="input-wrapper">
                                <input id="login-email" className="text-input" type="email" required placeholder="" />
                                <label htmlFor="login-email" className="label">Email</label>
                            </div>
                            <div className="input-wrapper">
                                <input id="login-password" className="text-input" type="password" required placeholder=""/>
                                <label htmlFor="login-password" className="label">Password</label>
                            </div>
                            <button id="login-button" type="submit">LOGIN</button>
                            <p className="link" onClick={() => setShowForgotPassword(true)}>Forgot password ?</p>
                        </form>
                    )}

                    {showForgotPassword && (
                        <>
                            {!showVerifyForgotPassword ? (
                                <form id="forgot-password" onSubmit={startForgotPasswordVerification}>
                                    <div id="login-title" className="title">MAGI<span>X</span>EARCH</div>
                                    <div className="input-wrapper">
                                        <input
                                            id="forgot-password-email"
                                            className="text-input"
                                            type="email"
                                            required
                                            placeholder=""
                                        />
                                        <label htmlFor="forgot-password-email" className="label">Registered Email</label>
                                    </div>
                                    <button id="forgot-password-button" type="submit">SEND VERIFICATION CODE</button>
                                    <p
                                        id="go-back"
                                        onClick={() => setShowForgotPassword(false)}
                                    >
                                        <span className="material-symbols-outlined">arrow_back</span> Back
                                    </p>
                                </form>
                            ) : (
                                <>
                                    {!showChangePassword ? (
                                        <form id="forgot-password" onSubmit={finishForgotPasswordVerification}>
                                            <div id="login-title" className="title">MAGI<span>X</span>EARCH</div>
                                            <div className="input-wrapper">
                                                <input
                                                    id="forgot-password-otp"
                                                    className="text-input"
                                                    type="text"
                                                    required
                                                    placeholder=""
                                                />
                                                <label htmlFor="forgot-password-otp" className="label">OTP</label>
                                            </div>
                                            <button id="forgot-password-button" type="submit">VERIFY</button>
                                            <p
                                                id="go-back"
                                                onClick={() => setShowForgotPassword(false)}
                                            >
                                                <span className="material-symbols-outlined">arrow_back</span> Back
                                            </p>
                                        </form>
                                    ) : (
                                        <form id="forgot-password" onSubmit={changePassword}>
                                            <div id="login-title" className="title">MAGI<span>X</span>EARCH</div>

                                            <div className="input-wrapper">
                                                <input id="change-password" className="text-input" type="password" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" minLength="8" title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number." placeholder=""/>
                                                <label htmlFor="change-password" className="label">Password</label>
                                            </div>
                                            <div className="input-wrapper">
                                                <input id="change-confirm-password" className="text-input" type="password" required placeholder=""/>
                                                <label htmlFor="change-confirm-password" className="label">Confirm password</label>
                                            </div>

                                            <button id="signup-button" type="submit">CHANGE PASSWORD</button>
                                        </form>
                                    )}
                                </>
                            )}
                        </>
                    )}


                    {!verificationStarted && (
                        <form id="signup" onSubmit={startSignup}>
                            <div id="login-title" className="title">MAGI<span>X</span>EARCH</div>
                            <div className="input-wrapper">
                                <input id="signup-username" className="text-input" type="text" required placeholder=""/>
                                <label htmlFor="signup-username" className="label">Username</label>
                            </div>
                            <div className="input-wrapper">
                                <input id="signup-email" className="text-input" type="email" required  placeholder=""/>
                                <label htmlFor="signup-email" className="label">Email</label>
                            </div>
                            <div className="input-wrapper">
                                <input id="signup-password" className="text-input" type="password" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" minLength="8" title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number." placeholder=""/>
                                <label htmlFor="signup-password" className="label">Password</label>
                            </div>
                            <div className="input-wrapper">
                                <input id="signup-confirm-password" className="text-input" type="password" required placeholder=""/>
                                <label htmlFor="signup-confirm-password" className="label">Confirm password</label>
                            </div>
                            <button id="signup-button" type="submit">JOIN MAGIXEARCH</button>
                        </form>
                    )}

                    {verificationStarted && (
                        <form id="signup" onSubmit={finishSignup}>
                            <div id="login-title" className="title">MAGI<span>X</span>EARCH</div>
                            <div className="input-wrapper">
                                <input id="signup-otp" className="text-input" required placeholder=""/>
                                <label htmlFor="signup-otp" className="label">Enter the OTP</label>
                            </div>
                            <button id="signup-button" type="submit">VERIFY</button>
                        </form>
                    )}
                </div>

                <div id="login-menu">
                    <p onClick={() => scrollTo(1)}>Login</p>
                    <button id="open-login" onClick={() => scrollTo(1)}></button>
                    <button id="open-signup" onClick={() => scrollTo(2)}></button>
                    <p onClick={() => scrollTo(2)}>Sign up</p>
                </div>
            </div>
        </div>
    );
}

export default LoadLogin;