import React from "react";
import '../styles/hero-styles.css'

function LoadHero() {

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
        <div id="hero-container" className="container">  

            <div id="hero-borders"></div>

            <div id="hero-main"> 
                <div className="title" id="hero-title">MAGI<span>X</span>EARCH</div>
                <div className="quote">
                    <span>E</span><span>V</span><span>O</span><span>L</span><span>U</span><span>T</span><span>I</span><span>O</span><span>N</span>
                    <span> </span>
                    <span>I</span><span>S</span>
                    <span> </span>
                    <span>T</span><span>H</span><span>E</span>
                    <span> </span>
                    <span>N</span><span>E</span><span>W</span>
                    <span> </span>
                    <span>R</span><span>E</span><span>V</span><span>O</span><span>L</span><span>U</span><span>T</span><span>I</span><span>O</span><span>N</span>
                </div>
            </div>

            <div className="buttons">
                <button onClick={() => scrollToSection(1)}>Upload an image</button>
                <button onClick={() => scrollToSection(4)}>Learn more</button>
            </div>
        </div>
    );
}

export default LoadHero;