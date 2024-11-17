import React from "react";
import "../styles/success-styles.css";

function LoadSuccess({success_message, onClose}) {
    return (
        <div id="success-message">
            <span className="material-symbols-outlined">priority_high</span>
            <p>{success_message}</p>
            <span className="material-symbols-outlined" onClick={onClose}>close</span>
        </div>
    );
}

export default LoadSuccess;