import React, { useContext, useEffect, useState } from "react";
import '../styles/home-styles.css'

import LoadError from "./errors";
import LoadSuccess from "./success";
import LoadLoading from "./loading";

import LoadFavorites from "./favorites";
import LoadProfile from "./profile";

import { UserDataContext } from "./context";
import LoadAbout from "./about";

function LoadHome() {

    // SETTING THE VARIABLES FROM THE CONTEXT PROVIDER
    const { userData } = useContext(UserDataContext);

    const email = userData.mail_id;
    const [images, setImages] = useState(JSON.parse(userData.stored_images));

    // -------------------------------------------------------------------------------

    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);  
    const [showPopup, setShowPopup] = useState(false); 

    const [showDetails, setShowDetails] = useState(false);
    const [clickedImage, setClickedImage] = useState(null);
    const [clickedImageIndex, setClickedImageIndex] = useState(null);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    
    const [showDelete, setShowDelete] = useState(false);

    // COPY THE URL OF THE IMAGE TO THE CLIPBOARD
    const copyURL = () => {
        navigator.clipboard.writeText(clickedImage.file_url)
        .then(() => {
            setSuccessMessage('URL copied to clipboard');
            setShowSuccess(true);
        })
        .catch(err => {
            console.error("Failed to copy URL: ", err);
        });
    }

    // OPEN THE FILE UPLOAD DIALOG WHEN THE "UPLOAD" BUTTON IS CLICKED
    const handleButtonClick = () => {
        document.getElementById('fileInput').click();
    };

    // OPEN A POPUP WHEN THE "UPLOAD IMAGE" BUTTON IS CLICKED
    const handleFileSelection = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
        
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        
            setShowPopup(true);
        
            const formData = new FormData();
            formData.append('image', file);
        
            generateDescription(formData);
        } else {
            alert('No file selected');
        }
    };    
    
    // GENERATE THE DESCRIPTION OF THE IMAGE
    const generateDescription = (formData) => {
        setIsLoading(true);
        fetch('https://magixearch.pythonanywhere.com/generate-description', {
            method: 'POST',
            body: formData, // Send the FormData object which contains the file
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setErrorMessage(data.error);
                setShowError(true);
            } else {
                document.getElementById('generated-description').innerText = data.success;
                setSuccessMessage('Description generated successfully');
                setShowSuccess(true);
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    };
    
    // UPLOAD THE IMAGE AND STORE THE BASE64 STRING IN THE DATABASE
    const handleUpload = async () => {
        if (!selectedFile) return;
    
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
            const base64Image = reader.result.split(',')[1];
            
            const originalFilename = selectedFile.name;
    
            const formData = {
                image: base64Image,
                email: email,
                filename: originalFilename,
                description: document.getElementById('generated-description').innerText,
            };
    
            try {
                setIsLoading(true);
                const response = await fetch('https://magixearch.pythonanywhere.com/upload-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    if (data.error) {
                        setErrorMessage(data.error);
                        setShowError(true);
                    } else {
                        setSuccessMessage('Image uploaded successfully');
                        setShowSuccess(true);

                        getImages();
                    }
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
            setIsLoading(false);
            setShowPopup(false);
            setSelectedFile(null);
            setImagePreview(null);
        };
    };
    
    // CLOSE THE POPUP WHEN THE CANCEL BUTTON IS CLICKED
    const handleCancel = () => {
        setShowPopup(false); 
        setSelectedFile(null);
        setImagePreview(null); 

        if (showDelete === false) {
            setShowDetails(false);
            setClickedImage(null);
            setClickedImageIndex(null);
        }

        setShowDelete(false);
    };

    // FETCH THE USER'S IMAGES FROM THE DATABASE
    const getImages = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('https://magixearch.pythonanywhere.com/fetch-images', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.error) {
                    setErrorMessage(data.error);
                    setShowError(true);
                } else {
                    setImages(data.success);
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
        setIsLoading(false);
    }
    
    // SHOW THE DETAILS OF A CLICKED IMAGE
    const handleImageClick = (index) => {
        setShowDetails(true);
        setClickedImage(images[index]);
        setClickedImageIndex(index);
    }

    // DELETE AN IMAGE AND UPDATE THE DATABASE
    const deleteImage = async (index) => {
        try {
            setIsLoading(true);
            const response = await fetch('https://magixearch.pythonanywhere.com/delete-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, file_index: index })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.error) {
                    setErrorMessage(data.error);
                    setShowError(true);
                } else {
                    setImages(data.success);
                }
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
        setIsLoading(false);
        setShowDetails(false);
        setClickedImage(null);
        setClickedImageIndex(null);
    }

    // ADD OR REMOVE AN IMAGE FROM FAVOURITES
    const favoriteImage = async (index) => {

        if (images[index].favorite === true) {
            images[index].favorite = false;
        } else if (images[index].favorite === false) {
            images[index].favorite = true;
        }


        try {
            const response = await fetch('https://magixearch.pythonanywhere.com/manage-favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, file_index: index })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.error) {
                    setErrorMessage(data.error);
                    setShowError(true);
                    images[index].favorite = false;
                } else {
                    setImages(data.success);
                }
            }
        } catch (error) {
        }
    }

    // DOWNLOAD THE CLICKED IMAGE
    const downloadImage = async () => {
        const link = document.createElement('a');
        link.href = clickedImage.file_url;
        link.download = clickedImage.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };    

    // UPDATE THE DESCRIPTION OF AN IMAGE
    const updateDescription = async () => {

        const newDescription = document.getElementById('generated-description').innerText;

        const response = await fetch('https://magixearch.pythonanywhere.com/update-description', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, file_index: clickedImageIndex, description: newDescription })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.error) {
                setErrorMessage(data.error);
                setShowError(true);
            } else {
                setImages(data.success);
                setSuccessMessage('Description updated successfully');
                setShowSuccess(true);
            }
        }
    }

    const [searchTerm, setSearchTerm] = useState('');

    const searchResults = images.filter(image => {
        if (searchTerm === '') {
            return false;
        } else {
            return image.description.toLowerCase().includes(searchTerm.toLowerCase());
        }
        }).map(image => {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlightedDescription = image.description.replace(regex, (match) => {
            return `<span class="highlight">${match}</span>`;
        });
    
        return { ...image, highlightedDescription };
    }); 

    // SHOW THE DETAILS OF THE CLICKED SEARCH RESULT
    const showDetailedSearchResult = (file_url) => {
        const index = images.findIndex(image => image.file_url === file_url);
        handleImageClick(index);

        setSearchTerm('');
    }
    
    return (

        <div>
            <div id="home-container" className="container">

                {showError && <LoadError error_message={errorMessage} onClose={() => setShowError(false)} />}
                {showSuccess && <LoadSuccess success_message={successMessage} onClose={() => setShowSuccess(false)} />}

                {isLoading && <LoadLoading />}

                <div id="home-main">
                    <div id="options-row">
                        <div id="search-bar">
                            <input type="text" placeholder="Search for an image" 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <span className="material-symbols-outlined" id="search-icon">search</span>
                            <input 
                                type="file" 
                                id="fileInput" 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                                onChange={handleFileSelection}
                            />

                            {(searchResults.length !== 0) && (
                                <div id="search-results">
                                    {searchResults.map((image, index) => (
                                        <div className="search-result" key={index} onClick={() => showDetailedSearchResult(image.file_url)}>
                                            <div id="search-result-image-wrapper">
                                                <img src={image.file_url} />
                                            </div>
                                            <p dangerouslySetInnerHTML={{ __html: image.highlightedDescription }} />

                                            <hr />
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                        </div>
                        <button id="upload" onClick={handleButtonClick} className="material-symbols-outlined">upload</button>
                    </div>

                    <div id="images-container-wrapper">

                        <div id="images-container">

                            {images.length === 0 && (
                                <div id="fallback-note">
                                    <h2>No images found</h2>
                                </div>
                            )}  

                            {images.length !== 0 && images.map((image, index) => (
                                <div className="image" key={index}>
                                    <img 
                                        src={image.file_url}
                                        alt={image.file_name}
                                        key={index}
                                        onClick={() => handleImageClick(index)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {showPopup && selectedFile && (
                    <div id="file-upload-dialog">
                        <div id="selected-image-container">
                            <h2>Image <button className="material-symbols-outlined" onClick={handleCancel}>close</button></h2>
                            <div id="selected-image-wrapper">
                                <img src={imagePreview} alt="Selected preview" />
                            </div>
                        </div>

                        <div id="selected-description-container">
                            <h2>Description</h2>
                            <p id="generated-description" contentEditable></p>
                            <div id="button-row">
                                <button onClick={handleCancel}>Cancel</button>
                                <button onClick={handleUpload} id="upload-file">Upload</button>
                            </div>
                        </div>
                    </div>
                )}

                {showDetails &&
                    <div id="file-details-dialog">
                        <div id="selected-image-container">
                            <h2>Image <button className="material-symbols-outlined" onClick={handleCancel}>close</button></h2>
                            <div id="selected-image-wrapper">
                                <img src={clickedImage.file_url} alt="Image preview" />
                            </div>
                        </div>

                        <div id="selected-description-container">
                            <h2>Description</h2>
                            <p id="generated-description" contentEditable>{clickedImage.description}</p>
                            <div id="button-row">
                                <button className="material-symbols-outlined" onClick={() => setShowDelete(true)}>delete</button>
                                <button className="material-symbols-outlined" onClick={copyURL}>share</button>
                                
                                {images[clickedImageIndex].favorite === true ?
                                    <button className="material-symbols-outlined favorite" onClick={() => favoriteImage(clickedImageIndex)}>favorite</button>
                                    :
                                    <button className="material-symbols-outlined" onClick={() => favoriteImage(clickedImageIndex)}>favorite_border</button>
                                }
                                <button className="material-symbols-outlined" onClick={updateDescription}>save</button>
                                <button className="material-symbols-outlined" onClick={downloadImage}>download</button>
                            </div>
                        </div>

                        {showDelete &&
                            <div id="delete-confirmation-wrapper">
                                <div id="delete-confirmation">
                                    <p>Are you sure you want to delete this image ? This action can not be reverted.</p>
                                    <div id="button-row">
                                        <button onClick={handleCancel}>Cancel</button>
                                        <button onClick={() => {deleteImage(clickedImageIndex); setShowDelete(false)}} id="delete-button">Delete</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>

            <LoadFavorites images={images} />
        </div>
    );
}

export default LoadHome;    