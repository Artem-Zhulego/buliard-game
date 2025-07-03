import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectItem, buyItem, userData } from '../../utils/request'
import { useShopStore, useUserStore } from '../../../store/store';

import './words.css';

import freeBalanceIcon from '../../../assets/free-balance.png';
import donateBalanceIcon from '../../../assets/donat-balance.png';

function Words({ data }) {
    const { setShop, setPage } = useShopStore()
    const { user, setUser } = useUserStore()
    const navigate = useNavigate();

    const [lastRowIndexes, setLastRowIndexes] = useState([]);

    useEffect(() => {
        const calculateLastRow = () => {
            const container = document.querySelector('.shop__words');
            const item = document.querySelector('.shop__words-item');
            if (!container || !item) return;

            const itemsInRow = Math.floor(container.offsetWidth / item.offsetWidth) || 1;
            const lastRowStart = Math.ceil(data.length / itemsInRow - 1) * itemsInRow;

            setLastRowIndexes(Array.from({ length: data.length - lastRowStart }, (_, i) => lastRowStart + i));
        };

        calculateLastRow();
        window.addEventListener('resize', calculateLastRow);

        return () => window.removeEventListener('resize', calculateLastRow);
    }, [data]);

    const callBackButton = (item) => {
        if (item.isBought) {
            selectItem(item.id, setShop)
        } else {
            if (item.forPremium) {
                if (!user.premium.have) return setPage("PREMIUM")
            }
            if (item.price.donate) {
                if (item.price.coins > user.balance.donate) return setPage("COINS")
            } else {
                if (item.price.coins > user.balance.free) return setPage("COINS")
            }
            buyItem(item.id, setShop)
            userData('test', setUser)
        }
    }

    return (
        <div className="shop__words">
            {data.map((pack, index) => (
                <div key={pack._id} className={`shop__words-item ${pack.isSelect ? 'border-pink' : ""} ${lastRowIndexes.includes(index) ? 'last-row' : ''}`}>
                    <div className="shop__words-item__header">
                        <span className="shop__words-item__header-text">{pack.name}</span>
                    </div>
                    
                    <div className="shop__words-item__words">
                        {pack.words.map((word) => (
                            <div key={word} className="shop__words-item__word">
                                <span className="shop__words-item__word-text">{word}</span>
                            </div>
                        ))}
                    </div>

                    <button className={`shop__words-item__buy__button ${pack.isSelect ? 'shop__global-block__selected' : pack.isBought ? 'shop__global-block__select' : pack.forPremium ? 'premium' : ''}`} onClick={() => callBackButton(pack)}>
                        {
                            pack.isSelect ? 
                                <span className="shop__global-text__selected">Используется</span>
                            : pack.isBought ? 
                                <span className="shop__global-text__select">Использовать</span>
                            : pack.forPremium ?
                                <span className="shop__words-item__buy__button-text">Для{'\n'}премиум</span>
                            : pack.isBought ?
                                <span className="shop__words-item__buy__button-text">Куплено</span>
                            : (
                                <span className="shop__words-item__buy__button-text">
                                    Купить
                                    <div className="shop-separator-item" />
                                    {pack.price.coins} <img className="shop__words-item__buy__button-icon" src={pack.price.donate ? donateBalanceIcon : freeBalanceIcon} alt="balance" />
                                </span>
                            )
                        }
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Words;
