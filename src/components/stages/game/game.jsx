import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { BiCommentDetail } from "react-icons/bi";
import { Physics, Debug } from '@react-three/cannon';
import { FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import axios from 'axios';
import './game.css';

import { TABLE_WIDTH, TABLE_HEIGHT } from './utils/constants';
import Table from './components/Table';

import freeCoins from '../../../assets/free-balance.png'
import backIcon from '../../../assets/back.svg';

import { useShopStore, useGameStore, useUserStore } from '../../../store/store';
import useContainerSize from './components/useContainerSize';
import AdjustableCamera from './components/AdjustableCamera';
import socket from '../../utils/game';

export const getBallPosition = async (ballRefs) => {
    const ballPositions = [];
    const whiteBall = {};

    const subscribeToPositions = new Promise((resolve) => {
        let subscriptionCount = 0;

        ballRefs.forEach((ball, index) => {
            const unsubscribe = ball.api.position.subscribe(([x, y, z]) => {
                if (index === 0) {
                    whiteBall.x = x;
                    whiteBall.y = y;
                    whiteBall.z = z;
                } else {
                    ballPositions[index - 1] = { x, y, z };
                }

                subscriptionCount++;

                if (subscriptionCount === ballRefs.length) {
                    resolve();
                    unsubscribe()
                }
            });
        });
    });
    await subscribeToPositions;

    return { ballPositions, whiteBall }
}

export const getPocketPosition = (tableGroup) => {
    const pockets = tableGroup.children.filter(child => child.userData.id === "pocket");
    const pocketsData = pockets.map(pocket => {
        return {
            x: pocket.position.x,
            y: pocket.position.y,
            z: pocket.position.z,
            width: pocket.geometry.parameters.radiusTop
        }
    })

    return pocketsData;
}

function Game() {
    const navigate = useNavigate();
    const { shop } = useShopStore()
    const { games, updateGames } = useGameStore();
    const { user } = useUserStore()

    const [containerRef, { width, height }] = useContainerSize();

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDragging, setIsDragging] = useState(false);
    const [activeButton, setActiveButton] = useState(1)
    const [power, setPower] = useState(1);
    const [inputValue, setInputValue] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [fadeOutInfo, setFadeOutInfo] = useState(false);
    const [showMessage, setShowMessage] = useState('');
    const [showEmotion, setShowEmotion] = useState('');
    const [fadeOutMessage, setFadeOutMessage] = useState(false);

    const initialTouchY = useRef(null);
    const cuePositionRef = useRef(0);
    const cueBlockInnerRef = useRef(null);
    const cueBlockRef = useRef(null);
    const timerRef = useRef(null);
    const tableRef = useRef()

    const zoom = useMemo(() => {
        if (!width || !height) return 1;
        return Math.min(width / TABLE_WIDTH, height / TABLE_HEIGHT) * 0.7;
    }, [width, height]);

    // const webApp = window.Telegram.WebApp;
    // const backButton = webApp.BackButton;
    // backButton.show();
    // backButton.onClick(() => {
    //     navigate("/main")
    // });

    const handleButton = (button) => {
        setActiveButton(button);
        console.log(button)
        // webApp.HapticFeedback.notificationOccurred('success')
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSend = () => {
        console.log('Отправлено сообщение:', inputValue);
        setInputValue('');
    };

    const total_collections = shop.COLLECTIONS.flatMap(collection => collection.words);

    const renderBalls = (balls, left) => {
        const ballElements = [];
        for (let i = 0; i < 7; i++) {
            if (balls[i]) {
                const imgSrc = require(`../../../assets/game/ball/${balls[i]}.png`);
                ballElements.push(
                    <div className="head__opponent-balls-block" key={i}>
                        <img className="head__opponent-balls-block-image" src={imgSrc} alt={`ball-${i}`} />
                    </div>
                );
            } else {
                ballElements.push(
                    <div className="head__opponent-balls-block" key={i}></div>
                );
            }
        }
        return left ? ballElements.reverse() : ballElements;
    };

    const handleCueTouchStart = (e) => {
        if (games.hit || games.block) return;
        setIsDragging(true);
        updateGames("hit", false);
        initialTouchY.current = e.touches[0].clientY;
    };

    const handleCueTouchMove = (e) => {
        if (isDragging && initialTouchY.current !== null) {
            const containerHeight = e.currentTarget.offsetHeight;
            const touch = e.touches[0];
            const deltaY = touch.clientY - initialTouchY.current;
            const movementPercentage = (deltaY / containerHeight) * 100;
            const newPosition = cuePositionRef.current + movementPercentage;
            cuePositionRef.current = Math.max(0, Math.min(90, newPosition));
            initialTouchY.current = touch.clientY;
            setPower(1 + (newPosition / 4));

            if (cueBlockInnerRef.current) {
                cueBlockInnerRef.current.style.top = `${cuePositionRef.current}%`;
                if (cuePositionRef.current > 10) {
                    cueBlockRef.current.style.background = `rgba(0, 0, 0, ${(90 - cuePositionRef.current) / 100})`;
                }
            }
        }
    };

    const handleCueTouchEnd = (e) => {
        if (!isDragging) return
        setIsDragging(false);

        const containerHeight = e.currentTarget.offsetHeight;
        const touch = e.changedTouches[0];
        const deltaY = touch.clientY - initialTouchY.current;
        const movementPercentage = (deltaY / containerHeight) * 100;
        const newPosition = cuePositionRef.current + movementPercentage;

        initialTouchY.current = null;
        if (Math.max(0, Math.min(90, newPosition)) < 10) {
            cuePositionRef.current = 0;
            setPower(1);
            if (cueBlockInnerRef.current) {
                cueBlockInnerRef.current.style.top = '0%';
                cueBlockRef.current.style.background = 'rgba(0, 0, 0, 0.8)';
            }
            return;
        }

        updateGames("current", "bot");
        updateGames("hit", true);
        updateGames("block", true);
        updateGames("count", games.count + 1)
    };

    const currentAIData = async () => {
        if (!games.isMoving && useGameStore.getState().games.current === "bot") {
            const { ballPositions, whiteBall } = await getBallPosition(tableRef.current.getBallRefs());
            const pocketsData = getPocketPosition(tableRef.current.getTableGroup());

            const response = {
                data: {
                    data: {
                        url: "https://mocked-stars-payment-url.com/invoice",
                        invoice_id: "mocked-invoice-id",
                        user_id: "1038855897",
                        item_id: "mocked-item-id",
                        category_id: "mocked-category-id"
                    }
                }
            };

            //const response = await axios.post("https://api.billiards-telegram.xyz/api/v1/billiard/game/AI/hit", {
              //  user_id: "1038855897",
               // balls: ballPositions,
               // x: whiteBall.x,
               // y: whiteBall.y,
               // z: whiteBall.z,
               // holes: pocketsData
            //});

            updateGames("AImove", response.data.data.hit);
        }
    };

    useEffect(() => {
        if (!games.isMoving) {
            cuePositionRef.current = 0;
            setPower(1);

            if (cueBlockInnerRef.current) {
                cueBlockInnerRef.current.style.top = '0%';
                cueBlockRef.current.style.background = 'rgba(0, 0, 0, 0.8)';
            }

            if (games.current === "player") {
                // Логика для игрока
            } else if (games.current === "bot") {
                currentAIData();
            }
        }
    }, [games.isMoving]);

    useEffect(() => {
        if (!games.isMoving && !games.hit) {
            setShowInfo(true);

            const timer = setTimeout(() => {
                setFadeOutInfo(true);
            }, 4500);
            const hideTimer = setTimeout(() => {
                setShowInfo(false);
                setFadeOutInfo(false);
            }, 5000);

            return () => {
                clearTimeout(timer);
                clearTimeout(hideTimer);
            };
        } else if (games.hit) {
            setShowInfo(false);
            setFadeOutInfo(false);
        }
    }, [games.isMoving, games.hit, games.current]);

    const showMsg = (msg) => {
        if (showMessage || showEmotion) return;

        socket.send('reaction', {
            game_id: user.game.data.id,
            user_id: "1038855897",
            message: {
                type: typeof msg === 'string' ? 1 : 2,
                message: typeof msg === 'string' ? msg : msg.image
            },
        })

        setIsModalOpen(false)
        if (typeof msg === 'string') {
            setShowMessage(msg)
        } else {
            setShowEmotion(msg.image)
        }

        const timer = setTimeout(() => {
            setFadeOutMessage(true);
        }, 4500);
        const hideTimer = setTimeout(() => {
            setShowMessage('');
            setShowEmotion('')
            setFadeOutMessage(false);
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            if (!games.isMoving) {
                updateGames("current", games.current === "player" ? "bot" : "player");
                updateGames("block", games.current === "player");
                if (games.current === "player") {
                    currentAIData();
                }
            }
        }, 30000);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [games.current, games.hit]);

    return (
        <div className="game">
            {isModalOpen && (
                <div className="game-modal" onClick={() => setIsModalOpen(false)}>
                    <div className="game-modal__content" onClick={e => e.stopPropagation()}>
                        <div className='game-modal__buttons'>
                            <div className={`game-modal__button__background ${activeButton === 1 ? 'left' : 'right'}`} />
                            <button onClick={() => handleButton(1)} className={`game-modal__button__bet-button ${activeButton === 1 ? 'active' : ''}`}>Фразы</button>
                            <button onClick={() => handleButton(2)} className={`game-modal__button__bet-button ${activeButton === 2 ? 'active' : ''}`}>Эмоции</button>
                        </div>
                        <div className='game-modal__container'>
                            {activeButton === 1 && (
                                <div className="game-modal__words">
                                    {total_collections.map((word, index) => (
                                        <div key={index} className="game-modal__word" onClick={() => showMsg(word)}>
                                            <span className="game-modal__word-text">{word}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeButton === 2 && (
                                <div className="game-modal__emotions">
                                    {shop.EMOTIONS.map((emotion, index) => (
                                        <div key={index} className="game-modal__emotion" onClick={() => showMsg(emotion)}>
                                            <img src={emotion.image} alt={emotion.name} className="game-modal__emotion-image" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {activeButton === 1 && (
                            <div className="game-modal__input-container">
                                <input
                                    type="text"
                                    className={`game-modal__input ${activeButton === 1 ? 'white-color' : 'dark-color'}`}
                                    placeholder="Введите сообщение..."
                                    value={inputValue}
                                    onChange={handleInputChange}
                                />
                                <button className="game-modal__send-button" onClick={handleSend}>
                                    <FaPaperPlane />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="games">
                <div className="games__overlay"></div>
                <div className="chat" onClick={() => setIsModalOpen(!isModalOpen)}>
                    <BiCommentDetail className="chat-icon" />
                </div>
                <div className="head">
                    {/* <button className="head__back" onClick={() => navigate("/main")}>
                        <img className="head__back-icon" src={backIcon} alt="Back Icon" />
                    </button> */}
                    <div className="head__content">
                        <div className="head__opponent">
                            <div className="head__opponent-left">
                                <span className="head__opponent-name">Бот</span>
                                <div className="head__opponent-balls">
                                    {renderBalls(games.balls_bot, true)}
                                </div>
                            </div>
                            <div className="head__player-avatar">
                                {games.current === "bot" && !games.isMoving && (
                                    <svg className="head__player-avatar-border" viewBox="0 0 52 52">
                                        <path className="head__player-avatar-border-bg" d="M26 1 H3 A2 2 0 0 1 1 3 V49 A2 2 0 0 1 3 51 H49 A2 2 0 0 1 51 49 V3 A2 2 0 0 1 49 1 H26" />
                                        <path className="head__player-avatar-border-inner" d="M26 1 H3 A2 2 0 0 1 1 3 V49 A2 2 0 0 1 3 51 H49 A2 2 0 0 1 51 49 V3 A2 2 0 0 1 49 1 H26" />
                                    </svg>
                                )}
                                <img alt="avatar" src="https://billiards-telegram.xyz/assets/avatars/bot.jpg" className="head__player-avatar-image" />
                            </div>
                        </div>

                        <div className="head__prize">
                            <img src={freeCoins} alt="coins" className="head__prize-image" />
                            <span className="head__prize-text">280</span>
                        </div>

                        <div className="head__player">
                            <div className="head__player-info">
                                <div className="head__player-avatar">
                                    {games.current === "player" && !games.isMoving && (
                                        <svg className="head__player-avatar-border" viewBox="0 0 52 52">
                                            <path className="head__player-avatar-border-bg" d="M26 1 H3 A2 2 0 0 1 1 3 V49 A2 2 0 0 1 3 51 H49 A2 2 0 0 1 51 49 V3 A2 2 0 0 1 49 1 H26" />
                                            <path className="head__player-avatar-border-inner" d="M26 1 H3 A2 2 0 0 1 1 3 V49 A2 2 0 0 1 3 51 H49 A2 2 0 0 1 51 49 V3 A2 2 0 0 1 49 1 H26" />
                                        </svg>
                                    )}
                                    <img alt="avatar" src="https://billiards-telegram.xyz/assets/avatars/2.png" className="head__player-avatar-image" />
                                </div>
                                <div className="head__player-right">
                                    <span className="head__player-name">{user?.user?.username ?? "Я"}</span>
                                    <div className="head__player-balls">
                                        {renderBalls(games.balls_player)}
                                    </div>
                                </div>
                            </div>

                            {showMessage && (
                                <div className="head__player-message">
                                    <div className={`head__player-message-container ${fadeOutMessage ? 'fade-out' : ''}`}>
                                        <div className="head__player-message-text">{showMessage}</div>
                                        <span className="head__player-message-pointer"></span>
                                    </div>
                                </div>
                            )}
                            {showEmotion && (
                                <div className="head__player-message emotion">
                                    <div className={`head__player-message-container emotion ${fadeOutMessage ? 'fade-out' : ''}`}>
                                        <img src={showEmotion} alt="message" className="head__player-message-image" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="game-content">
                    {showInfo && (
                        <div className={`game-content__player ${fadeOutInfo ? 'fade-out' : ''}`}>
                            {games.current === "player" ? `Очередь игрока ${user?.user?.username ?? "Никнейм"}` : "Очередь игрока Бот"}
                        </div>
                    )}
                    <div
                        className={`cue-block ${games.isMoving ? 'hide' : ''}`}
                        onTouchStart={handleCueTouchStart}
                        onTouchMove={handleCueTouchMove}
                        onTouchEnd={handleCueTouchEnd}
                    >
                        <div className="cue-block__block">
                            <span></span>
                            <span></span>
                            <span></span>
                            <div className="cue-block__block-bg" ref={cueBlockRef}></div>
                            <div className="cue-block__inner" ref={cueBlockInnerRef}>
                                <img
                                    src="https://billiards-telegram.xyz/assets/cues/2.png"
                                    alt="Кий"
                                    className="cue-block-image"
                                />
                            </div>
                        </div>
                    </div>
                    {/* frameloop="demand" shadows dpr={window.devicePixelRatio} gl={{ antialias: true, powerPreference: "high-performance" }} - высокое
                    frameloop="demand" shadows dpr={Math.min(window.devicePixelRatio, 1.5)} gl={{ antialias: true, powerPreference: "default" }} - среднее
                    frameloop="demand" shadows={false} dpr={1} gl={{ antialias: false, powerPreference: "low-power" }} - низкое */}
                    <div className="game-container" ref={containerRef}>
                        <Canvas frameloop="demand" shadows dpr={window.devicePixelRatio} gl={{ antialias: true, powerPreference: "high-performance" }}>
                            {/* <Stats className='fps' /> */}
                            <AdjustableCamera zoom={zoom} />
                            <ambientLight intensity={0.25} />
                            <directionalLight position={[0, 2, 10]} intensity={0.6} castShadow />
                            <directionalLight position={[0, -2, 10]} intensity={0.6} castShadow />
                            <directionalLight position={[2, 0, 10]} intensity={0.6} castShadow />
                            <directionalLight position={[-2, 0, 10]} intensity={0.6} castShadow />

                            <Physics
                                gravity={[0, 0, -9.81]}
                                defaultContactMaterial={{
                                    friction: 0,
                                    restitution: 0.5,
                                    contactEquationStiffness: 2e7,
                                }}
                                allowSleep={false}
                                broadphase="SAP"
                                step={1 / 60}
                                substep={2}
                                iterations={8}
                                tolerance={0.001}
                            >
                                <Table ref={tableRef} power={power} />
                            </Physics>
                        </Canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Game;