import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopStore, useUserStore } from '../../../store/store';
import { buyItem, selectItem, userData } from '../../utils/request';

import './emotions.css';

import freeBalanceIcon from '../../../assets/free-balance.png';
import donateBalanceIcon from '../../../assets/donat-balance.png';

function Emotions({ data }) {
    const { setShop, setPage } = useShopStore();
    const { setUser, user } = useUserStore()
    const navigate = useNavigate();

    const [lastRowIndexes, setLastRowIndexes] = useState([]);

    useEffect(() => {
        const calculateLastRow = () => {
            const container = document.querySelector('.shop__emotions');
            const item = document.querySelector('.shop__emotions-item');
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
        <div className="shop__emotions">
            {data && data.map((emoji, index) => (
                <div key={emoji._id} className={`shop__emotions-item ${lastRowIndexes.includes(index) ? 'last-row' : ''} ${emoji.isSelect ? 'border-pink' : ""}`}>
                    <div className="shop__emotions-item__header">
                        <span className="shop__emotions-item__header-text">{emoji.name}</span>
                    </div>
                    <div className="shop__emotions-item__image-container">
                        <img className="shop__emotions-image" src={emoji.image} alt={emoji.name} />
                    </div>

                    <div className="shop__emotions-item__buy">
                        <button className={`shop__emotions-item__buy__button ${emoji.isSelect ? 'shop__global-block__selected' : emoji.isBought ? 'shop__global-block__select' : emoji.forPremium ? 'premium' : ''}`} onClick={() => callBackButton(emoji)}>
                            {
                                emoji.isSelect ? 
                                    <span className="shop__global-text__selected">Используется</span>
                                : emoji.isBought ? 
                                    <span className="shop__global-text__select">Использовать</span>
                                : emoji.forPremium ?
                                    <span className="shop__emotions-item__buy__button-text">Для{'\n'}премиум</span>
                                : (
                                    <span className="shop__emotions-item__buy__button-text">
                                        {emoji.price.coins} 
                                        <img className="shop__emotions-item__buy__button-icon" src={emoji.price.donate ? donateBalanceIcon : freeBalanceIcon} alt="balance" />
                                    </span>
                                )
                            }
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Emotions;
