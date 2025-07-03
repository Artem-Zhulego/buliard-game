import React from 'react';
import { useNavigate } from 'react-router-dom';
import './inGame.css';
import { useUserStore } from '../../../store/store';
import axios from 'axios';

const ModesComponent = ({ isModalOpen, setIsModalOpen }) => {
    const { user } = useUserStore();
    const navigate = useNavigate();

    if (!isModalOpen) return null;

    const players = user?.game?.data?.players || [];
    const me = players.find(player => player.id === user?.id) || players[0] || {};
    const opponent = players.find(player => player.id !== user?.id) || players[1] || {};

    const joinGame = () => {
        navigate(`/connect`);
    };

    const leaveGame = async () => {
        setIsModalOpen(false);
        
        //await axios.post('https://api.billiards-telegram.xyz/api/v1/billiard/game/leave', {
            //user_id: user.id,
            //game_id: user.game.data.id
        //})
    };

    return (
        <div className="inGameModal">
            <div className="inGameModal__content">
                <div className="inGameModal__header">
                    <span className="inGameModal__title">У вас есть активный матч!</span>
                </div>
                <div className="inGameModal__players">
                    <div className="inGameModal__player inGameModal__player--me">
                        <img src={me.avatar} alt={me.username} className="inGameModal__avatar" />
                        <div className="inGameModal__username">{me.username}</div>
                    </div>
                    <span className="inGameModal__versus">VS</span>
                    <div className="inGameModal__player inGameModal__player--opponent">
                        {opponent.avatar ? (
                            <img src={opponent.avatar} alt={opponent.username} className="inGameModal__avatar" />
                        ) : (
                            <div className="inGameModal__avatarPlaceholder">?</div>
                        )}
                        <div className="inGameModal__username">{opponent.username || 'Ожидание...'}</div>
                    </div>
                </div>
                <div className="inGameModal__buttons">
                    <button className="inGameModal__button inGameModal__button--join" onClick={() => joinGame()}>
                        Подключиться
                    </button>
                    <button className="inGameModal__button inGameModal__button--leave" onClick={() => leaveGame()}>
                        Покинуть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModesComponent;
