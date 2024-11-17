import './global-styles.css';
import LoadLogin from './pages/login';
import LoadHome from './pages/home';
import LoadHero from './pages/hero';
import LoadHeader from './pages/header';

import { useContext, useEffect, useState } from 'react';
import { UserDataContext } from './pages/context';
import LoadProfile from './pages/profile';
import LoadAbout from './pages/about';

function LoadMagiXearch() {
    const { setUserData } = useContext(UserDataContext);
    const [angle, setAngle] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setAngle(prevAngle => (prevAngle + 1) % 360);
        }, 10);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const container = document.getElementById('body-container');
            if (container) {
                const scrollPosition = container.scrollTop;
                const sectionHeight = container.clientHeight;
    
                if (scrollPosition >= 0 && scrollPosition < sectionHeight * 0.5) {
                    document.title = 'Home | MagiXearch';
                } else if (scrollPosition >= sectionHeight * 0.5 && scrollPosition < sectionHeight * 1.5) {
                    document.title = 'Images | MagiXearch';
                } else if (scrollPosition >= sectionHeight * 1.5 && scrollPosition < sectionHeight * 2.5) {
                    document.title = 'Favourites | MagiXearch';
                } else if (scrollPosition >= sectionHeight * 2.5 && scrollPosition < sectionHeight * 3.5) {
                    document.title = 'Profile | MagiXearch';
                } else if (scrollPosition >= sectionHeight * 3.5) {
                    document.title = 'About | MagiXearch';
                }
            }
        };
    
        const container = document.getElementById('body-container');
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
    
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);
    
    

    return (
        <div id='main-container'>
            {isLoggedIn && (
                <LoadHeader />
            )}
            {!isLoggedIn ? (
                <LoadLogin onLoginSuccess={(data) => {
                    setIsLoggedIn(true);
                    setUserData(data);
                }} />
            ) : (
                <div id='body-container' style={{ background: `linear-gradient(${angle}deg, #31511E, #F6FCDF)`, height: '100vh', overflowY: 'scroll' }}>
                    <LoadHero />
                    <LoadHome />
                    <LoadProfile />
                    <LoadAbout />   
                </div>
            )}
        </div>
    );
}

export default LoadMagiXearch;