import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './main.css';
import Layout from '../Layout';

import ModesComponent from './components/modes';
import InGameComponent from './components/inGame'

import tasksIcon from '../../assets/tasks.png';
import friendsIcon from '../../assets/friends.png';
import historyIcon from '../../assets/history.png';
import refferalsIcon from '../../assets/refferals.png';
import settingsIcon from '../../assets/settings.png';
import shopIcon from '../../assets/shop.png';
import boxesIcon from '../../assets/boxes.png';

import { useMainStore, useUserStore } from "../../store/store"

function Main() {
    console.log("start Main");

    const navigate = useNavigate();
    const { main, updateMain } = useMainStore();
    const { user } = useUserStore()

    const [isSelectMode, setSelectMode] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);
    const [activeType, setActiveType] = useState('training');
    const [inGameModalOpen, setInGameModalOpen] = useState(user?.game?.inGame)

    const [isIframeFullscreen, setIsIframeFullscreen] = useState(false);

    const webApp = window.Telegram.WebApp;
    const backButton = webApp.BackButton;
    backButton.hide();

    const handleModeClick = (clickedId) => {
        if (isDisabled) return;
        setIsDisabled(true);

        const currentModes = main.modes;
        const clickedMode = currentModes.find((mode) => mode.id === clickedId);
        
        if (clickedMode && clickedMode.position === 0) {
            if (clickedMode.disabled) {
                setIsDisabled(false);
                return
            }
            startGame(clickedId, clickedMode);
            return
        }

        const updatedModes = currentModes.map((mode) => ({
            ...mode,
            position: (mode.position + (clickedMode.position === 2 || clickedMode.position === 3 ? 1 : -1) + 4) % 4,
        }));

        console.log("middle Main");

        updateMain({ modes: updatedModes });
        setActiveType(clickedId);

        if (clickedMode.position === 2) {
            setTimeout(() => {
                const newModes = updatedModes.map((mode) => ({
                    ...mode,
                    position: (mode.position + 1) % 4,
                }));
                updateMain({ modes: newModes });
            }, 300);

            setTimeout(() => {
                setIsDisabled(false);
            }, 800);
        } else {
            setTimeout(() => {
                setIsDisabled(false);
            }, 500);
        }
    };

    const getPosition = (position) => {
        switch (position) {
            case 0: return { x: "0%", y: "50%" };
            case 1: return { x: "-80%", y: "-40%" };
            case 2: return { x: "0%", y: "-130%" };
            case 3: return { x: "80%", y: "-40%" };
            default: return { x: 0, y: 0 };
        }
    };

    console.log("startGame");

    const startGame = async (id, data) => {
        navigate(data.callback);
        setIsDisabled(false)
    }

    return (
        <Layout>
            <main className={`main ${isIframeFullscreen ? 'iframe-fullscreen-active' : ''}`}>
                {isSelectMode && (
                    <ModesComponent />
                )}
                {inGameModalOpen &&  (
                    <InGameComponent isModalOpen={inGameModalOpen} setIsModalOpen={setInGameModalOpen} />
                )}
                <div className="main__left-panel">
                    <div className="main__panel-item main__panel-item--tasks" onClick={() => navigate("/tasks")}>
                        <img className="main__panel-item-icon" src={tasksIcon} alt="Tasks" />
                        <span className="main__panel-item-text">Задания</span>
                    </div>
                    <div className="main__panel-item main__panel-item--boxes" onClick={() => navigate("/boxes")}>
                        <img className="main__panel-item-icon" src={boxesIcon} alt="Boxes" />
                        <span className="main__panel-item-text">Боксы</span>
                    </div>
                    <div className="main__panel-item main__panel-item--friends" onClick={() => navigate("/shop")}>
                        <img className="main__panel-item-icon" src={shopIcon} alt="Friends" />
                        <span className="main__panel-item-text">Магазин</span>
                    </div>
                </div>

                <div className="main__center-panel">
                    <div className={`main__mode-container ${isIframeFullscreen ? 'fullscreen' : ''}`}>
                        <iframe
                            src="https://artemzhulego.github.io/Billiard-Build"
                            className="game-iframe"
                            title="Billiard Game"
                        ></iframe>
                    </div>

                    {!isIframeFullscreen && (
                        <button
                            onClick={() => setIsIframeFullscreen(true)}
                            className="fullscreen-enter-btn"
                        >
                            Expand Game
                        </button>
                    )}
                </div>

                <div className="main__right-panel">
                    <div className="main__panel-item main__panel-item--friends" onClick={() => navigate("/friends")}>
                        <img className="main__panel-item-icon" src={friendsIcon} alt="Friends" />
                        <span className="main__panel-item-text">Друзья</span>
                    </div>
                    <div className="main__panel-item main__panel-item--history" onClick={() => navigate("/history")}>
                        <img className="main__panel-item-icon" src={historyIcon} alt="History" />
                        <span className="main__panel-item-text">История</span>
                    </div>
                    <div className="main__panel-item main__panel-item--referrals" onClick={() => navigate("/messages")}>
                        <img className="main__panel-item-icon" src={refferalsIcon} alt="Referrals" />
                        <span className="main__panel-item-text">Чаты</span>
                    </div>
                </div>
            </main>
            
            {isIframeFullscreen && (
                <button
                    onClick={() => setIsIframeFullscreen(false)}
                    className="fullscreen-exit-btn"
                >
                    Back
                </button>
            )}
        </Layout>
    );
}

export default Main;
