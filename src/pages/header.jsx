import React from "react";
import logo from '../assets/magiXearch.jpg';
import '../styles/header-styles.css';

function LoadHeader() {

    const scrollToSection = (index) => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => button.classList.remove('active-header-button'));

        const clickedButton = buttons[index];
        clickedButton.classList.add('active-header-button');

        const scrollPosition = index * 100;
        document.getElementById('body-container').scrollTo({
            top: scrollPosition * window.innerHeight / 100,
            behavior: 'smooth'
        });
    };

    return (
        <header id="header-container">
            <div id="header-logo">
                <img src={logo} />
            </div>

            <nav>
                <button onClick={() => scrollToSection(0)} className="active-header-button">
                    <span className="material-symbols-outlined">home</span>
                    <p>Home</p>
                </button>

                <button onClick={() => scrollToSection(1)}>
                    <span className="material-symbols-outlined">image</span>
                    <p>Images</p>
                </button>

                <button onClick={() => scrollToSection(2)}>
                    <span className="material-symbols-outlined">favorite</span>
                    <p>Favourites</p>
                </button>

                <button onClick={() => scrollToSection(3)}>
                    <span className="material-symbols-outlined">account_circle</span>
                    <p>Profile</p>
                </button>

                <button onClick={() => scrollToSection(4)}>
                    <span className="material-symbols-outlined">info</span>
                    <p>About</p>
                </button>
            </nav>
        </header>
    );
}

export default LoadHeader;