import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../../store/store';
import axios from 'axios';

import './history.css';

import backIcon from '../../assets/back.svg';
import defaultIcon from '../../assets/avatar.png';
import settingIcon from '../../assets/settingsIcon.svg'
import arrowWin from '../../assets/arrowWin.svg'
import arrowLose from '../../assets/arrowLose.svg'
import inviteIcon from '../../assets/invite.svg'
import premium from '../../assets/premium.svg'

function History() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { history, setHistory } = useHistoryStore()
    
    const webApp = window.Telegram.WebApp;
    const backButton = webApp.BackButton;
    backButton.show();
    backButton.onClick(() => {
        navigate("/main")
    });

    useEffect(() => {
        const fetchData = async () => {
            const response_history = await axios.get(`https://apiv2.exta.dev/api/v1/billiard/user/history`);
            setHistory(response_history.data.data)
        };

        fetchData();
    }, []);

    const winrate = history ? Math.round(history.filter(match => match.type == 1).length / history.length * 100) : 0

    const postfix = (num, end1, end2, end3) => {
        num = num > 20 ? num % 10 : num
        return num === 1 ? end1 : (num > 1 && num < 5 ? end2 : end3)
    }

    function convertUnixTimeToCEST(unixTime) {
        const date = new Date((unixTime * 1000) + 7200000);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
        });
    }

    return (
        <div className='history-container'>
            <div className='history'>
                <div className='history__overlay'></div>
                <div className='history__header'>
                    <div className="history__header-container">
                        <button className='history__header-back' onClick={() => navigate("/main")}>
                            <img className='history__header-back__icon' src={backIcon} alt='Back Icon' />
                        </button>
                        <span className='history__header-text'>История</span>
                    </div>
                    <div className="history__header-container">
                        <span className='history__header-text-winrate_title'>
                            Всего игр: <span className='history__header-text-history__winrate'>{history.length}</span>
                        </span>
                        <span className='history__header-text-winrate_title'>
                            Винрейт: <span className='history__header-text-history__winrate'>{winrate || 0}%</span>
                        </span>
                        <button className='history__header-back' onClick={() => navigate("/settings")}>
                            <img className='history__header-back__icon' src={settingIcon} alt='Back Icon' />
                        </button>
                    </div>
                </div>
                <div className='history__container'>
                    <div className='history__category'>
                        <div className='history__category__list'>
                            {history && history.map((match) => (
                                <div key={match.id} className='history__category__list-item'>
                                    <div className='history__category__list-block'>
                                        <div className='history__category__list-block__start'>
                                            <div className='history__category__list-block__rank'>
                                                <span className={`history__category__list-block__rank-type ${match.type == 1 ? "W" : "L"}`}>{match.type == 1 ? "W" : "L"}</span>
                                            </div>

                                            <div className='history__category__list-block__profile'>
                                                <img src={defaultIcon} className='history__category__list-block__profile-avatar' alt='Avatar' />
                                                <div className='history__category__list-block__nickname'>
                                                    <div className="history__category__list-block__nickname-content">
                                                        <span className='history__category__list-block__nickname-text'>@{match.username}</span>
                                                        {match.type == 2 && <img src={premium} className='history__category__list-block__nickname-premium' alt='Premium' />}
                                                    </div>
                                                    <div className='history__category__list-block__level'>
                                                        <span className='history__category__list-block__level-text'>Уровень {match.level}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='history__category__list-block__info-content'>
                                            <div className="history__category__list-block__info">
                                                <span className='history__category__list-block__result score'>{match.score.team1}:{match.score.team2}</span>

                                                <span className={`history__category__list-block__result pts ${match.type == 1 ? "W" : "L"}`}>
                                                    {match.type == 1 ? (
                                                        <img src={arrowWin} className="history__category__list-block__result-arrow"/>
                                                    ) : (
                                                        <img src={arrowLose} className="history__category__list-block__result-arrow"/>
                                                    )}
                                                    20 pts
                                                </span>

                                                <span className='history__category__list-block__result duration'>Дл: {parseInt(match.time / 60)} {postfix(parseInt(match.time / 60), 'минута', "минуты", "минут")}</span>
                                            </div>

                                            <div className="history__category__list-block__time">
                                                <span className=''>{convertUnixTimeToCEST(match.date)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='history_invite'>
                                        <img src={inviteIcon} className='history_invite-icon' alt='Invite' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;
