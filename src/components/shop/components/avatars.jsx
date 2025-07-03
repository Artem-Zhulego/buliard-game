import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopStore, useUserStore } from '../../../store/store';
import { buyItem, selectItem, userData } from '../../utils/request';

import './avatars.css';

import freeBalanceIcon from '../../../assets/free-balance.png';
import donateBalanceIcon from '../../../assets/donat-balance.png';

function Avatars({ data }) {
    const { setShop, setPage } = useShopStore();
    const { setUser, user } = useUserStore()
    const navigate = useNavigate();

    const [lastRowIndexes, setLastRowIndexes] = useState([]);

    useEffect(() => {
        const calculateLastRow = () => {
            const container = document.querySelector('.shop__avatars');
            const item = document.querySelector('.shop__avatars-item');
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
        <div className="shop__avatars">
            {data && data.map((avatar, index) => (
                <div key={avatar._id} className={`shop__avatars-item ${lastRowIndexes.includes(index) ? 'last-row' : ''} ${avatar.isSelect ? 'border-pink' : ""}`}>
                    <div className="shop__avatars-item__header">
                        <span className="shop__avatars-item__header-text">{avatar.name}</span>
                    </div>
                    <img className="shop__avatars-image" src={avatar.image} alt={avatar.name} />

                    <div className="shop__avatars-item__buy">
                        <button className={`shop__avatars-item__buy__button ${avatar.isSelect ? 'shop__global-block__selected' : avatar.isBought ? 'shop__global-block__select' : avatar.forPremium ? 'premium' : ''}`} onClick={() => callBackButton(avatar)}>
                            {
                                avatar.isSelect ? 
                                    <span className="shop__global-text__selected">Используется</span>
                                : avatar.isBought ? 
                                    <span className="shop__global-text__select">Использовать</span>
                                : avatar.forPremium ?
                                    <span className="shop__avatars-item__buy__button-text">Для{'\n'}премиум</span>
                                : (
                                    <span className="shop__avatars-item__buy__button-text">
                                        {avatar.price.coins} 
                                        <img className="shop__avatars-item__buy__button-icon" src={avatar.price.donate ? donateBalanceIcon : freeBalanceIcon} alt="balance" />
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

export default Avatars;
