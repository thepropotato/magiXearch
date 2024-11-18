import '../styles/profile-styles.css'

import { UserDataContext } from "./context";
import React, { useContext, useState } from "react";

import LoadError from "./errors";
import LoadSuccess from "./success";
import LoadLoading from "./loading";

import profile from '../assets/profile.jpg';

function LoadProfile() {

    // GET THE USER DATA FROM THE CONTEXT
    const { userData } = useContext(UserDataContext);
    const email = userData.mail_id;
    const username = userData.username;

    const [showDelete, setShowDelete] = useState(false);
    const [showLogout, setShowLogout] = useState(false);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleCancel = () => {
        setShowDelete(false);
        setShowLogout(false);
    };

    // DELETE THE USER ACCOUNT
    const deleteAccount = () => {
        setIsLoading(true);
        fetch('https://magixearch.pythonanywhere.com/delete-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setErrorMessage(data.error);
                setShowError(true);
            } else {
                setSuccessMessage(data.success);
                setShowSuccess(true);
            }
        })
        .finally(() => {
            setIsLoading(false);
            window.location.href = '/';
        });
    };

    const handleLogout = () => {
        window.location.href = '/';
    }



    return (
        <div id="profile-container" className="container">

            {showError && <LoadError error_message={errorMessage} onClose={() => setShowError(false)} />}
            {showSuccess && <LoadSuccess success_message={successMessage} onClose={() => setShowSuccess(false)} />}
            
            {isLoading && <LoadLoading />}

            <div id="profile-main">

                <p className="profile-heading">Profile</p>

                <div id="profile-container-wrapper">

                    <div id='profile-main-container'>
                        <div id="primary-details">
                            <div id="profile-picture-wrapper">
                                <img src={ profile } className="profile-picture"/>
                            </div>

                            <h1>@{username}</h1>
                        </div>

                        <div id="secondary-details">
                            <div id='profile-email' className='profile-attribute'>
                                <p>Registered Email</p>
                                <p>{email}</p>
                            </div>
                            <div id='profile-username' className='profile-attribute'>
                                <p>Username</p>
                                <p>{username}</p>
                            </div>
                        </div>

                        <div id='profile-buttons-row'>
                            <button onClick={() => setShowDelete(true)}>Delete Account</button>
                            <button onClick={() => setShowLogout(true)}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>

            {showDelete &&
                <div id="delete-confirmation-wrapper">
                    <div id="delete-confirmation">
                        <p>Are you sure you want to leave us ?</p>
                        <div id="button-row">
                            <button onClick={handleCancel}>Cancel</button>
                            <button onClick={deleteAccount} id="delete-button">Delete Account</button>
                        </div>
                    </div>
                </div>
            }

            {showLogout &&
                <div id="delete-confirmation-wrapper">
                    <div id="delete-confirmation">
                        <p>Are you sure you want to logout of this account ?</p>
                        <div id="button-row">
                            <button onClick={handleCancel}>Cancel</button>
                            <button onClick={handleLogout} id="delete-button">Logout</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default LoadProfile;