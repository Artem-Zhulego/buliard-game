import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { useShopStore, useUserStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';

import defaultAvatarIcon from '../../assets/avatar.png';
import rank1Icon from '../../assets/ranks/rank1.png';
import freeBalanceIcon from '../../assets/free-balance.png';
import donatBalanceIcon from '../../assets/donat-balance.png';
import plusBlack from '../../assets/plusBlack.svg';
import RanksModal from '../../components/main/components/ranks'

import './header.css';
import StatsModal from '../main/components/stats';

function Header() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { setPage } = useShopStore();
    const { user } = useUserStore()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenStats, setIsModalOpenStats] = useState(false);

    return (
        <header className="header">
            {isModalOpen && (
                <RanksModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            )}
            {isModalOpenStats && (
                <StatsModal isModalOpen={isModalOpenStats} setIsModalOpen={setIsModalOpenStats} />
            )}
            <div className='header__info'>
                <div className='header__profile' onClick={() => setIsModalOpenStats(true)}>
                    <img src={user?.avatar || defaultAvatarIcon}  className='header__profile-avatar' alt='Avatar'></img>
                    <div className='header__profile-details'>
                        <span className='header__profile-nickname'>{user?.username || "@никнейм"}</span>
                        <div className='header__profile-level'>
                            <span className='header__profile-level-text'>{user ? user.level.num : "1"}</span>
                            <div className='header__profile-progress'>
                                <div 
                                    className="header__profile-progress-bar" 
                                    style={{ 
                                        width: `${(user.level.xp / (user.level.max - user.level.min)) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='header__rank' onClick={() => setIsModalOpen(true)}>
                    <img className='header__rank-icon' src={user?.rank?.image || defaultAvatarIcon} alt='Rank Icon'></img>
                    <span className='header__rank-text'>{user?.rank?.name || "Random nickname"}</span>
                </div>
            </div>
            <div className='header__balance'>
                <div className='header__balance-block'>
                    <div className='header__balance-item'>
                        <span className='header__balance-item-text'>{user?.balance?.free || "0"}</span>
                        <img className='header__balance-item-icon' src={freeBalanceIcon} alt="balance" />
                    </div>
                    <div className='header__balance-separator'></div>
                    <div className='header__balance-item'>
                        <span className='header__balance-item-text'>{user?.balance?.donate || "0"}</span>
                        <img className='header__balance-item-icon' src={donatBalanceIcon} alt="balance" />
                    </div>
                    <div className='header__balance-separator'></div>
                    <div className='header__balance-item header__balance-add' onClick={() => {setPage("COINS"); navigate("/shop")}}>
                        <img className='header__balance-item-icon' src={plusBlack} alt="balance" />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
