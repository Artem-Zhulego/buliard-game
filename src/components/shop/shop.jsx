import React, { useEffect, useState } from 'react';
import { useShopStore, useUserStore } from '../../store/store';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './shop.css';

import backIcon from '../../assets/back.svg';
import freeBalanceIcon from '../../assets/free-balance.png';
import donatBalanceIcon from '../../assets/donat-balance.png';
import plusBlack from '../../assets/plusBlack.svg';

import Cues from './components/cues';
import Boxes from './components/boxes';
import Words from './components/words';
import Stickers from './components/stickers';
import Coins from './components/coins';
import Premium from './components/premium';
import Avatars from './components/avatars';
import Emotions from './components/emotions'

function Shop() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { shop, setPage, page } = useShopStore();
    const { user } = useUserStore()

    const webApp = window.Telegram.WebApp;
    const backButton = webApp.BackButton;
    backButton.show();
    backButton.onClick(() => {
        navigate("/main")
    });

    return (
        <div className="shop-container">
            <div className='shop'>
                <div className='shop__overlay'></div>
                <div className='shop__header'>
                    <div className="shop__header-container">
                        <button className='shop__header-back' onClick={() => navigate("/main")}>
                            <img className='shop__header-back__icon' src={backIcon} alt='Back Icon' />
                        </button>
                        <span className='shop__header-text'>Магазин</span>
                    </div>
                    
                    <div className="shop__header-container second-container">
                        <div className='shop__balance'>
                            <div className='shop__balance-block'>
                                <div className='shop__balance-item'>
                                    <span className='shop__balance-item-text'>{user.balance.free}</span>
                                    <img className='shop__balance-item-icon' src={freeBalanceIcon} alt="balance" />
                                </div>
                                <div className='shop-separator'></div>
                                <div className='shop__balance-item'>
                                    <span className='shop__balance-item-text'>{user.balance.donate}</span>
                                    <img className='shop__balance-item-icon' src={donatBalanceIcon} alt="balance" />
                                </div>
                                {page !== 'COINS' && (
                                    <div className='shop__balance-item shop__balance-add' onClick={() => setPage("COINS")}>
                                        <img className='shop__balance-item-icon' src={plusBlack} alt="balance" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* <div className="shop__premium">
                            <div className='shop__premium-item'>
                                <span className="shop__premium-text">Премиум</span>
                            </div>

                            <div className="shop-separator"></div>

                            <div className='shop__premium-item-second'>
                                <span className="shop__premium-text-second">Купить{'\n'}сейчас</span>
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className='shop__container'>
                    <div className="shop__categories-container">
                        {Object.keys(shop).map((categoryKey) => (
                            <div key={categoryKey} className={`shop__categories ${categoryKey === page ? 'active' : ''}`} onClick={() => setPage(categoryKey)}>
                                <div className="shop__categories-title">{t(categoryKey)}</div>
                            </div>
                        ))}
                    </div>

                    <div className='shop__content'>
                        {page === 'CUES' && (
                            <Cues data={shop[page]} />
                        )}
                        {page === 'BOXES' && (
                            <Boxes data={shop[page]} />
                        )}
                        {page === 'COLLECTIONS' && (
                            <Words data={shop[page]} />
                        )}
                        {page === 'STICKERS' && (
                            <Stickers data={shop[page]} />
                        )}
                        {page === 'COINS' && (
                            <Coins data={shop[page]} />
                        )}
                        {page === 'PREMIUM' && (
                            <Premium data={shop[page]} />
                        )}
                        {page === 'AVATARS' && (
                            <Avatars data={shop[page]} />
                        )}
                        {page === 'EMOTIONS' && (
                            <Emotions data={shop[page]} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shop;
