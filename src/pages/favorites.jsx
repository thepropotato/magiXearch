import React from "react";

function LoadFavorites({ images }) {

    const favoriteImages = images.filter(image => image.favorite === true);

    return (
        
        <div id="home-container" className="container">
                <div id="home-main">

                    <p className="favorites-heading">Favourite Images</p>

                    <div id="images-container-wrapper">
                        <div id="images-container">
                            {favoriteImages.length === 0 && (
                                <div id="fallback-note">
                                    <h2>No images found</h2>
                                </div>
                            )}  

                            {favoriteImages.length !== 0 && favoriteImages.map((image, index) => (
                                <div className="image" key={index}>
                                    <img 
                                        src={image.file_url} 
                                        alt={image.file_name}
                                        key={index}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
    )

}

export default LoadFavorites;