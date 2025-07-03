import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './friends.css';

import backIcon from '../../assets/back.svg';
import searchIcon from '../../assets/search.svg';
import defaultIcon from '../../assets/avatar.png';
import rank1 from '../../assets/ranks/rank1.png';
import deleteIcon from '../../assets/delete.svg'
import inviteIcon from '../../assets/invite.svg'
import messageIcon from '../../assets/message.svg'
import lineBlock from '../../assets/lineBlock.svg'
import copyLink from '../../assets/copyLink.svg'
import { useUserStore } from '../../store/store';

function Friends() {
    const { t } = useTranslation();
    const { user } = useUserStore()
    const [friends, setFriends] = useState([
        { id: '1', username: "Никнейм", level: 1, progress: 60, status: "online"},
        { id: '1', username: "Никнейм", level: 1, progress: 60, status: "online"},
        { id: '1', username: "Никнейм", level: 1, progress: 60, status: "online"},
        { id: '1', username: "test", level: 1, progress: 60, status: "online"},
        { id: '1', username: "Никнейм", level: 1, progress: 60, status: "offline"},
        { id: '1', username: "Никнейм", level: 1, progress: 60, status: "online"},
        { id: '1', username: "Никнейм", level: 1, progress: 60, status: "offline"},
        { id: '1', username: "Никнейм", level: 1, progress: 60, status: "offline"},
        { id: '1', username: "Никнейм", level: 1, progress: 60, status: "offline"},
    ]);
    const [searchQuery, setSearchQuery] = useState('');

    const searchFriends = searchQuery ? friends.filter(friend => friend.username.toLowerCase().includes(searchQuery.toLowerCase())) : [];

    const sortFriends = (searchQuery ? searchFriends : friends).reduce((acc, friend) => {
        const status = friend.status;
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(friend);
        return acc;
    }, {});

    const sortedFriends = Object.keys(sortFriends).map(status => ({
        status,
        friends: sortFriends[status]
    }));

    const navigate = useNavigate();
    const webApp = window.Telegram.WebApp;
    const backButton = webApp.BackButton;
    backButton.show();
    backButton.onClick(() => {
        navigate("/main")
    });
    
    return (
        <div className="friends-container">
            <div className='friends'>
                <div className='friends__overlay'></div>
                <div className='friends__header'>
                    <button className='friends__header-back' onClick={() => navigate("/main")}>
                        <img className='friends__header-back__icon' src={backIcon} alt='Back Icon' />
                    </button>
                    <div className="friends__header-search-block">
                        <div className='friends__header-icon'>
                            <img className='friends__header-icon__icon' src={searchIcon} alt='Search Icon' />
                        </div>
                        <div className='friends__header-search'>
                            <input
                                className='friends__header-search__input'
                                placeholder='Поиск друзей по юзернейму'
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='friends__container'>
                    <div className='friends__categories'>
                        {sortedFriends.length > 0 ? (
                            sortedFriends.map(list => (
                                <div className="friends__category">
                                    <span className='friends__category__title'>{list.status}</span>
                                    <div className='friends__category__list'>
                                        {list.friends.map((friend) => (
                                            <div key={friend.id} className='friends__category__list-item'>
                                                <div className='friends__category__list-block'>
                                                    <img src={lineBlock} className="friends__category__list-block_line"/>
                                                    <div className='friends__category__list-block__rank'>
                                                        <img className='friends__category__list-block__rank-icon' src={rank1} alt='Rank Icon' />
                                                    </div>
                                                    <div className='friends__category__list-block__profile'>
                                                        <img src={defaultIcon} className='friends__category__list-block__profile-avatar' alt='Avatar' />
                                                        <div className='friends__category__list-block__details'>
                                                            <span className='friends__category__list-block__nickname'>@{friend.username}</span>
                                                            <div className='friends__category__list-block__level'>
                                                                <span className='friends__category__list-block__level-text'>⚡️{friend.level}</span>
                                                                <div className='friends__category__list-block__progress'>
                                                                    <div
                                                                        className='friends__category__list-block__progress-bar'
                                                                        style={{ width: `${friend.progress}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className={`friends__category__list-block__status ${friend.status === "online" ? "online" : ""}`}>{friend.status}</span>
                                                </div>
                                                <div className='friends__category__list-block__actions'>
                                                    <button className='friends__category__list-block__action'>
                                                        <img className="friends__category__list-block__action-image" src={messageIcon}></img>
                                                    </button>
                                                    <button className='friends__category__list-block__action'>
                                                        <img className="friends__category__list-block__action-image" src={inviteIcon}></img>
                                                    </button>
                                                    <button className='friends__category__list-block__action'>
                                                        <img className="friends__category__list-block__action-image" src={deleteIcon}></img>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='friends__category__no_friends'>
                                <span className='friends__category__no_friends_title'>Здесь пока ничего нет</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className='friends__footer'>
                    <span className='friends__footer-text'>Приглашай друзей и получай бонусы за каждого</span>
                    <div className='friends__footer-buttons'>
                        <button className='friends__footer-copy' onClick={() => webApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(`https://t.me/billiards_online_bot?start=r_${user.id}`)}`)}>
                            <img className="friends__footer-copy-icon" src={copyLink} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Friends;
