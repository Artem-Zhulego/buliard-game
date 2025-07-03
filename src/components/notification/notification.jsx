import React, { useEffect, useState } from 'react';
import { useNotificationsStore } from '../../store/store';
import './notification.css';

const Notification = () => {
    const { notification, setNotification } = useNotificationsStore();
    const [timeLeft, setTimeLeft] = useState(10);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setTimeLeft(10);
            setVisible(true);

            const timerInterval = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 0) {
                        clearInterval(timerInterval);
                        setTimeout(() => setNotification(null), 1000);
                        setVisible(false)
                        return 10;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            setTimeout(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 300);

            return () => {
                clearInterval(timerInterval);
            };
        }
    }, [notification]);

    const closeMessage = () => {
        setTimeLeft(10);
        setVisible(false)
        setTimeout(() => setNotification(null), 1000);
    }

    return (
        <div className={`notification ${visible === true ? 'show' : 'hide'}`}>
            {notification && notification.type === "invite" && (
                <div className="notification__invite">
                    <span className='notification__invite-title'>
                        {notification.friend.username} приглашает вас в игру
                    </span>
                    <div className='notification__invite-buttons'>
                        <button className='notification__invite-button-cancel'>Отмена</button>
                        <button className='notification__invite-button-join'>Вступить</button>
                    </div>
                    <div className='notification__invite-timer'>
                        <div style={{ width: `${timeLeft * 10}%` }} className="notification__invite-timer-bar"></div>
                    </div>
                </div>
            )}

            {notification && notification.type === "message" && (
                <div className="notification__message" onClick={() => closeMessage()}>
                    <div className="notification__user">
                        <img className="notification__user-avatar" src="https://avatars.steamstatic.com/bb3ef3a7103423dbfe4947ad72c6a43a84b53fa9_full.jpg" alt="avatar" />
                        <div className="notification__user-content">
                            <span className="notification__user-friend">{notification.friend.username}</span>
                            <span className="notification__user-description">Новое сообщение</span>
                        </div>
                    </div>

                    <div className='notification__message-content'>
                        <span className="notification__message-content-text">{notification.message.content}</span>
                    </div>

                    <div className="notification__info-timer">
                        <div style={{ width: `${timeLeft * 10}%` }} className="notification__info-timer-bar"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notification;