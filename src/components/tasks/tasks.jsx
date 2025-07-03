import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useHistoryStore, useUserStore } from '../../store/store';
import axios from 'axios';

import './tasks.css';

import backIcon from '../../assets/back.svg';
import settingIcon from '../../assets/settingsIcon.svg'
import freeBalanceIcon from '../../assets/free-balance.png';
import taskIcon from '../../assets/taskIcon.png';
import taskIcon2 from '../../assets/taskIcon2.png';

import taskType1 from '../../assets/taskType1.svg';

import taskComp from '../../assets/taskComp.svg';
import taskUncomp from '../../assets/taskUncomp.svg';

function Tasks() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useUserStore()
    
    const webApp = window.Telegram.WebApp;
    const backButton = webApp.BackButton;
    backButton.show();
    backButton.onClick(() => {
        navigate("/main")
    });

    const formatNumber = (num) => { 
        if (isNaN(num)) return '0' 
     
        num = Number(num) 
        return num.toLocaleString('ru-RU') 
    }

    return (
        <div className="tasks-container">
            <div className="tasks">
                <div className="tasks__overlay"></div>
                <div className="tasks_content">

                    <div className="tasks_content-block">
                        <div className="tasks_content-block__header">
                            <button className='tasks__header-back' onClick={() => navigate("/main")}>
                                <img className='tasks__header-back__icon' src={backIcon} alt='Back Icon' />
                            </button>
                            <span className='tasks__header-text-tasks'>Задания</span>
                        </div>

                        <div className="tasks_content-block__body">
                            <div className="tasks_content-block__body__item">
                                <div className="tasks_content-block__body__item__header">
                                    <div className="tasks_content-block__body__item__header-text">
                                        <span className="item__header-title">Ежедневные задания</span>
                                        <span className="item__header-description">Lorem ipsum dolor sit amet consectetur adipiscing elit Ut.</span>
                                    </div>

                                    <div className="tasks_content-block__body__item__header__image-wrapper">
                                        <img className="tasks_content-block__body__item__header__image" src={taskIcon} alt="Daily tasks"/>
                                    </div>
                                </div>

                                <div className="tasks_content-block__body__item__content">
                                    {[...Array(5)].map((_, index) => (
                                        <div key={index} className="content-item">
                                            <div className="item-image-block">
                                                <img className="item-image" src={taskType1} alt="Icon" />
                                            </div>
                                            <div className="item-content">
                                                <div className="item-content-text">
                                                    <span className="item-content-text__title">Lorem ipsum dolor sit amet ipsum dolor</span>
                                                    <span className="item-content-text__description">+10 energy</span>
                                                </div>
                                            </div>
                                            <img className="item-content__icon" src={taskUncomp} alt="Icon" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="tasks_content-block">
                        <div className="tasks_content-block__header">
                            <span className='tasks__header-text-tasks'>
                                {formatNumber(user.balance.free)}
                                <img className='tasks__header-balance__icon' src={freeBalanceIcon} alt='Icon' />
                            </span>

                            <div className='tasks__header-level-tasks'>
                                <span className='tasks__profile-level-text'>Уровень 14</span>
                                <div className='tasks__profile-progress'>
                                    <div className="tasks__profile-progress-bar" style={{ width: `70%` }}></div>
                                </div>
                            </div>

                            <button className='tasks__header-back' onClick={() => navigate("/settings")}>
                                <img className='tasks__header-back__icon' src={settingIcon} alt='Back Icon' />
                            </button>
                        </div>

                        <div className="tasks_content-block__body">
                            <div className="tasks_content-block__body__item">
                                <div className="tasks_content-block__body__item__header">
                                    <div className="tasks_content-block__body__item__header-text">
                                        <span className="item__header-title">Постоянные задания</span>
                                        <span className="item__header-description">Lorem ipsum dolor sit amet consectetur adipiscing elit Ut.</span>
                                    </div>

                                    <div className="tasks_content-block__body__item__header__image-wrapper">
                                        <img className="tasks_content-block__body__item__header__image" src={taskIcon2} alt="Permanent tasks"/>
                                    </div>
                                </div>

                                <div className="tasks_content-block__body__item__content">
                                    {[...Array(5)].map((_, index) => (
                                        <div key={index} className="content-item">
                                            <div className="item-image-block">
                                                <img className="item-image" src={taskType1} alt="Icon" />
                                            </div>
                                            <div className="item-content">
                                                <div className="item-content-text">
                                                    <span className="item-content-text__title">Lorem ipsum dolor sit amet ipsum dolor</span>
                                                    <span className="item-content-text__description">+10 energy</span>
                                                </div>
                                            </div>
                                            
                                            <div className="item-content__icon-block">
                                                <img className="item-content__icon" src={taskComp} alt="Icon" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tasks;