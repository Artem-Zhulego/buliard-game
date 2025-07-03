import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './boxes.css';

import backIcon from '../../assets/back.svg';
import freeBalanceIcon from '../../assets/free-balance.png';
import donatBalanceIcon from '../../assets/donat-balance.png';
import plusBlack from '../../assets/plusBlack.svg';
import timerIcon from '../../assets/timer.svg';

import { useBoxesStore, useShopStore } from '../../store/store';

function Boxes() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { boxes, setSelectBox } = useBoxesStore();
    const { setPage } = useShopStore();

    const webApp = window.Telegram.WebApp;
    const backButton = webApp.BackButton;
    backButton.show();
    backButton.onClick(() => {
        navigate("/main")
    });

    const goToBox = (box) => {
        setSelectBox(box.id);
        navigate("/box");
    }

    return (
        <div className="boxes-container">
            <div className='boxes'>
                <div className='boxes__overlay'></div>
                <div className='boxes__header'>
                    <div className="boxes__header-container">
                        <button className='boxes__header-back' onClick={() => navigate("/main")}>
                            <img className='boxes__header-back__icon' src={backIcon} alt='Back Icon' />
                        </button>
                        <span className='boxes__header-text'>Боксы</span>
                    </div>

                    <div className='boxes__balance'>
                        <div className='boxes__balance-block'>
                            <div className='boxes__balance-item'>
                                <span className='boxes__balance-item-text'>39,999</span>
                                <img className='boxes__balance-item-icon' src={freeBalanceIcon} alt="balance" />
                            </div>
                            <div className='boxes-separator'></div>
                            <div className='boxes__balance-item'>
                                <span className='boxes__balance-item-text'>412</span>
                                <img className='boxes__balance-item-icon' src={donatBalanceIcon} alt="balance" />
                            </div>
                            <div className='boxes__balance-item boxes__balance-add' onClick={() => { setPage("COINS"); navigate("/shop") }}>
                                <img className='boxes__balance-item-icon' src={plusBlack} alt="balance" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='boxes__container'>
                    <div className='boxes__before-content'>
                        <div className='boxes__content'>
                            {boxes && boxes.map((box) => (
                                <div key={box._id} className='boxes__item'>
                                    <div className='boxes__item-header'>
                                        <span className='boxes__item-header-text'>{box.name}</span>
                                    </div>

                                    <div className='boxes__item-kd'>
                                        <span className='boxes__item-kd-text'>
                                            <img className='boxes__item-kd-image' src={timerIcon} alt='timer' />
                                            {box.data.kd === null 
                                                ? `Ожидает открытия` 
                                                    : box.data.kd === 0 
                                                        ? "Готов к открытию"
                                                            : `${Math.floor(box.data.kd / 60000)} мин`
                                            }
                                        </span>
                                        {box.price ? (
                                            <>
                                                <div className='boxes-separator-mini'></div>
                                                <span className={`boxes__item-kd-price ${box.price.donate ? 'color-donat' : 'color-free'}`}>
                                                    {box.price.coins}
                                                    <img className='boxes__item-kd-image' src={box.price.donate ? donatBalanceIcon : freeBalanceIcon} alt='timer' />
                                                </span>
                                            </>
                                        ) : <></>}
                                    </div>

                                    <div className='boxes__item-buttons'>
                                        <button className='boxes__item-button open-button' onClick={() => goToBox(box)}>Открыть</button>
                                        <button onClick={() => { setPage("BOXES"); navigate("/shop") }} className='boxes__item-button'>{box.price ? "Купить" : "Информация"}</button>
                                    </div>
                                    <img className='boxes__item-image' src={box.image} alt={box.name} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Boxes;
