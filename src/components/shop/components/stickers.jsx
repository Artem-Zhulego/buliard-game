import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopStore, useUserStore } from '../../../store/store';
import { buyItem, selectItem, userData } from '../../utils/request';

import './stickers.css';

import freeBalanceIcon from '../../../assets/free-balance.png';
import donateBalanceIcon from '../../../assets/donat-balance.png';

function Stickers({ data }) {
    const { setShop, setPage } = useShopStore();
    const { user, setUser } = useUserStore()
    const navigate = useNavigate();

    const [lastRowIndexes, setLastRowIndexes] = useState([]);

    useEffect(() => {
        const calculateLastRow = () => {
            const container = document.querySelector('.shop__stickers');
            const item = document.querySelector('.shop__stickers-item');
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
        <div className="shop__stickers">
            {data && data.map((sticker, index) => (
                <div key={sticker._id} className={`shop__stickers-item ${lastRowIndexes.includes(index) ? 'last-row' : ''} ${sticker.isSelect ? 'border-pink' : ""}`}>
                    <div className="shop__stickers-item__header">
                        <span className="shop__stickers-item__header-text">{sticker.name}</span>
                    </div>
                    <img className="shop__stickers-image" src={sticker.image} alt={sticker.name} />

                    <div className="shop__stickers-item__buy">
                        <button className={`shop__stickers-item__buy__button ${sticker.isSelect ? 'shop__global-block__selected' : sticker.isBought ? 'shop__global-block__select' : sticker.forPremium ? 'premium' : ''}`} onClick={() => callBackButton(sticker)}>
                            {
                                sticker.isSelect ? 
                                    <span className="shop__global-text__selected">Используется</span>
                                : sticker.isBought ? 
                                    <span className="shop__global-text__select">Использовать</span>
                                : sticker.forPremium ?
                                    <span className="shop__stickers-item__buy__button-text">Для{'\n'}премиум</span>
                                : sticker.isBought ?
                                    <span className="shop__stickers-item__buy__button-text">Использовать</span>
                                : (
                                    <span className="shop__stickers-item__buy__button-text">
                                        {sticker.price.coins} 
                                        <img className="shop__stickers-item__buy__button-icon" src={sticker.price.donate ? donateBalanceIcon : freeBalanceIcon} alt="balance" />
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

export default Stickers;
