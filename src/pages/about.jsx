import React from "react";
import '../styles/about-styles.css'

import venu from '../assets/Venu.jpg'
import manoj from '../assets/Manoj.jpg'
import lakshman from '../assets/Lakshman.jpg'
import akash from '../assets/Akash.jpg'

function LoadAbout() {
    return (
        <div id="about-container" className="container">

            <div id="about-main">
                <p className="about-heading">About Us</p>

                <div id="about-container-wrapper">

                    <div id="about-container-main">

                        <div className="description-container">
                            <p>Magixearch is designed to simplify your life. In brief, it addresses the need for description or content-based image searches when users struggle to find specific images due to excessive scrolling.</p>
                            
                            <div>
                                <h2>The Motivation</h2>
                                <p>The inspiration, like many great ideas, stemmed from personal experience. One day, we uploaded a group photo to Google Photos. Two years later, we wanted to find it for something, but endless scrolling led us past it and even to photos of our parents’ wedding. We missed it entirely. This wasn’t the first time, and likely not for you either. We saw the need for a description-based image search in storage applications, and that’s how "Magixearch" was born.</p>
                            </div>

                            <div>
                                <h2>The Usage</h2>
                                <p>Using this tool is straightforward. Here's how to get started:</p>
                                1. Log in or sign up for Magixearch.<br />
                                2. Upload an image.<br />
                                3. The AI will create a description for you, which you can modify if needed.<br />
                                4. Save the image.<br />
                                5. That's it.<br />
                                <p>Even after 20 years, when you know what you're looking for, simply type in the description and find your image instantly.</p>
                            </div>

                        </div>

                        <div className="creators-container">
                            <div className="creator-card">
                                <div className="info">
                                    <img src={venu} onClick={() => window.location.href = 'https://venupulagam.vercel.app'}/>
                                    <h3>VENU PULAGAM</h3>
                                </div>

                                <div className="icons">
                                    <a href="https://www.linkedin.com/in/venu-pulagam-a17042289/" target="_blank"><i className="fa-brands fa-linkedin"></i></a>
                                    <a href="https://github.com/thepropotato" target="_blank"><i className="fa-brands fa-github"></i></a>
                                    <a href="https://www.instagram.com/venupulagam/" target="_blank"><i className="fa-brands fa-instagram"></i></a>
                                    <a href="mailto:notvenupulagam@gmail.com"><i className="fa-solid fa-envelope"></i></a>
                                </div>
                            </div>

                            <div className="creator-card">
                                <div className="info">
                                    <img src={manoj}/>
                                    <h3>MANOJ ADDALA</h3>
                                </div>

                                <div className="icons">
                                    <a href="https://www.linkedin.com/in/venkata-siva-manoj-addala-62939a307"><i className="fa-brands fa-linkedin"></i></a>
                                    <a href="https://github.com/VenkataSivaManojAddala" target="_blank"><i className="fa-brands fa-github"></i></a>
                                    <a href="https://www.instagram.com/venkata_siva_manoj_addala"><i className="fa-brands fa-instagram"></i></a>
                                    <a href="mailto:addalavsm@gmail.com"><i className="fa-solid fa-envelope"></i></a>
                                </div>
                            </div>

                            <div className="creator-card">
                                <div className="info">
                                    <img src={lakshman}/>
                                    <h3>VELAGA LAKSHMAN</h3>
                                </div>

                                <div className="icons">
                                    <a href="https://www.linkedin.com/in/velaga-lakshman-8921b4302/" target="_blank"><i className="fa-brands fa-linkedin"></i></a>
                                    <a href="https://github.com/Velagalakshman" target="_blank"><i className="fa-brands fa-github"></i></a>
                                    <a href="https://www.instagram.com/v__lakshman" target="_blank"><i className="fa-brands fa-instagram"></i></a>
                                    <a href="mailto:velagalakshman15@gmail.com"><i className="fa-solid fa-envelope"></i></a>
                                </div>
                            </div>

                            <div className="creator-card">
                                <div className="info">
                                    <img src={akash}/>
                                    <h3>KAMUJU AKASH</h3>
                                </div>

                                <div className="icons">
                                    <a href="https://www.linkedin.com/in/akash-kamuju-b022b62b7/" target="_blank"><i className="fa-brands fa-linkedin"></i></a>
                                    <a href="https://github.com/KAMUJUAKASH" target="_blank"><i className="fa-brands fa-github"></i></a>
                                    <a href="https://www.instagram.com/i_akash_120" target="_blank"><i className="fa-brands fa-instagram"></i></a>
                                    <a href="mailto:akashkamuju02@gmail.com"><i className="fa-solid fa-envelope"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default LoadAbout;