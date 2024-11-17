import React from "react";
import "../styles/errors-styles.css";

function LoadError({error_message, onClose}) {
    return (
        <div id="error-message">
            <span className="material-symbols-outlined">priority_high</span>
            <p>{error_message}</p>
            <span className="material-symbols-outlined" onClick={onClose}>close</span>
        </div>
    );
}

export default LoadError;