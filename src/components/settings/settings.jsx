import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore, useUserStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import i18n from '../../i18n';

import './settings.css';
import Layout from '../Layout';

import backIcon from '../../assets/back.svg';

function Settings() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { settings, setSettings } = useSettingsStore();
    const { user, language, setLanguage } = useUserStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [cueSensitivity, setCueSensitivity] = useState('normal');

    const webApp = window.Telegram.WebApp;
    const backButton = webApp.BackButton;
    backButton.show();
    backButton.onClick(() => {
        navigate("/main")
    });

    const handleCueSensitivity = (value) => {
        setCueSensitivity(value);
    }

    const handleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const getIconLanguage = (name) => {
        try {
            return require(`../../assets/languages/${name}.svg`);
        } catch (e) {
            console.error(`Could not load image for ${name}: `, e);
            return null;
        }
    };

    const changeLanguage = async (lng) => {
        i18n.changeLanguage(lng)
        setLanguage(lng);
        setIsModalOpen(!isModalOpen)
        // webApp.HapticFeedback.notificationOccurred('success')
    };

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'ru', name: 'Русский' },
        { code: 'es', name: 'Español' },
        { code: 'pt', name: 'Português' },
        { code: 'tl', name: 'Tagalog' },
        { code: 'mn', name: 'Монгол' },
    ];


    return (
        <div className="settings-container">
            {isModalOpen && (
                <div className="settings__modal" onClick={() => handleModal()}>
                    <div className='settings__language-select'>
                        {languages.map(lang => (
                            <button key={lang.code} onClick={() => changeLanguage(lang.code)}>
                                <img src={getIconLanguage(lang.code)} alt={lang.name} className="settings__language-icon" />
                                {lang.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="settings">
                <div className='settings__overlay'></div>
                <div className='settings__header'>
                    <button className='settings__header-button-back' onClick={() => navigate("/main")}>
                        <img className='settings__header-button__icon' src={backIcon} alt='Back Icon' />
                    </button>

                    <div className='settings__language'>
                        <img onClick={() => handleModal()} className="settings__language-icon" src={getIconLanguage(language)} alt="Languages" />
                    </div>
                </div>
                
                <div className='settings__blocks'>
                    <div className='settings__blocks-item'>
                        <span className='settings__blocks-item-label'>Общий звук</span>
                        <input type="checkbox" checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} className="settings__blocks-item-checkbox" />
                    </div>
                    <div className='settings__blocks-item'>
                        <span className='settings__blocks-item-label'>Музыка</span>
                        <input type="checkbox" checked={musicEnabled} onChange={() => setMusicEnabled(!musicEnabled)} className="settings__blocks-item-checkbox" />
                    </div>
                    <div className='settings__blocks-item'>
                        <span className='settings__blocks-item-label'>Вибрация</span>
                        <input type="checkbox" checked={vibrationEnabled} onChange={() => setVibrationEnabled(!vibrationEnabled)} className="settings__blocks-item-checkbox" />
                    </div>

                    <div className='settings__blocks-item sensitivity-h'>
                        <span className='settings__blocks-item-label'>Чувствительность кия</span>
                        <div className='settings__cue-sensitivity'>
                            <div className="settings__cue-sensitivity-background"
                                style={{
                                    transform: cueSensitivity === 'slow' ? 'translateX(0%)' :
                                                cueSensitivity === 'normal' ? 'translateX(100%)' :
                                                'translateX(200%)'
                                }}
                            />

                            <button className={`settings__cue-sensitivity-button ${cueSensitivity === 'slow' ? 'active' : ''}`} onClick={() => handleCueSensitivity('slow')}>Медленно</button>
                            <button className={`settings__cue-sensitivity-button ${cueSensitivity === 'normal' ? 'active' : ''}`} onClick={() => handleCueSensitivity('normal')}>Обычно</button>
                            <button className={`settings__cue-sensitivity-button ${cueSensitivity === 'fast' ? 'active' : ''}`} onClick={() => handleCueSensitivity('fast')}>Быстро</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
