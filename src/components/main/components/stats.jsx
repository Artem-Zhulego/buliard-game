import React, { useState, useEffect } from 'react';
import './stats.css';
import { FaGamepad, FaTrophy, FaTimesCircle, FaChartLine, FaStar } from 'react-icons/fa';
import defaultAvatarIcon from '../../../assets/avatar.png';
import { FlagIcon } from 'react-flag-kit';
import { useUserStore } from '../../../store/store';

const StatsModal = ({ isModalOpen, setIsModalOpen }) => {
    const { user } = useUserStore();
    const [shouldRender, setShouldRender] = useState(isModalOpen);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            setShouldRender(true);
        } else if (shouldRender) {
            setIsClosing(true);
            const timer = setTimeout(() => {
                setShouldRender(false);
                setIsClosing(false);
            }, 400); // Длительность анимации закрытия
            return () => clearTimeout(timer);
        }
    }, [isModalOpen, shouldRender]);

    if (!shouldRender) return null;

    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={`stats-modal ${isClosing ? 'stats-modal--closing' : ''}`} onClick={handleClose}>
            <div className={`stats-modal__content ${isClosing ? 'stats-modal__content--closing' : ''}`}  onClick={e => e.stopPropagation()}>
                <span className="stats-modal__close" onClick={handleClose}>&times;</span>
                <div className="stats-modal__inner">
                    <div className="stats-modal__left">
                        <img src={user?.avatar || defaultAvatarIcon}  alt="Avatar" className="stats-modal__avatar" />
                        <h2 className="stats-modal__nickname">{user.user.username}</h2>
                        <div className="stats-modal__country">
                            <FlagIcon code="PL" size={32} />
                            <span>#181231</span>
                        </div>
                        <div className="stats-modal__rank">
                            <img src={user.rank.image} alt="rank" className="stats-modal__rank-image" />
                            <span className="stats-modal__rank-name">{user.rank.name}</span>
                        </div>
                    </div>
                    <div className="stats-modal__right">
                        <div className="stats-modal__stat">
                            <FaGamepad className="stats-modal__stat-icon" />
                            <div className="stats-modal__stat-info">
                                <span className="stats-modal__stat-number">150</span>
                                <span className="stats-modal__stat-label">Игр сыграно</span>
                            </div>
                        </div>
                        <div className="stats-modal__stat">
                            <FaTrophy className="stats-modal__stat-icon" />
                            <div className="stats-modal__stat-info">
                                <span className="stats-modal__stat-number">75</span>
                                <span className="stats-modal__stat-label">Побед</span>
                            </div>
                        </div>
                        <div className="stats-modal__stat">
                            <FaTimesCircle className="stats-modal__stat-icon" />
                            <div className="stats-modal__stat-info">
                                <span className="stats-modal__stat-number">45</span>
                                <span className="stats-modal__stat-label">Поражений</span>
                            </div>
                        </div>
                        <div className="stats-modal__stat">
                            <FaChartLine className="stats-modal__stat-icon" />
                            <div className="stats-modal__stat-info">
                                <span className="stats-modal__stat-number">50%</span>
                                <span className="stats-modal__stat-label">Процент побед</span>
                            </div>
                        </div>
                        <div className="stats-modal__stat">
                            <FaStar className="stats-modal__stat-icon" />
                            <div className="stats-modal__stat-info">
                                <span className="stats-modal__stat-number">300</span>
                                <span className="stats-modal__stat-label">Максимальный прерыв</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatsModal;
