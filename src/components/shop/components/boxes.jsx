import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './boxes.css';

import freeBalanceIcon from '../../../assets/free-balance.png';
import donateBalanceIcon from '../../../assets/donat-balance.png';

function Boxes({ data }) {
    const navigate = useNavigate();

    const [lastRowIndexes, setLastRowIndexes] = useState([]);

    useEffect(() => {
        const calculateLastRow = () => {
            const container = document.querySelector('.shop__boxes');
            const item = document.querySelector('.shop__box-item');
            if (!container || !item) return;

            const itemsInRow = Math.floor(container.offsetWidth / item.offsetWidth) || 1;
            const lastRowStart = Math.ceil(data.length / itemsInRow - 1) * itemsInRow;

            setLastRowIndexes(Array.from({ length: data.length - lastRowStart }, (_, i) => lastRowStart + i));
        };

        calculateLastRow();
        window.addEventListener('resize', calculateLastRow);

        return () => window.removeEventListener('resize', calculateLastRow);
    }, [data]);

    const buyBox = (box, amount) => {
        if (box.isBought) return navigate("/boxes")
        if (box.forPremium) return navigate('/premium')
        
        return
    }

    return (
        <div className="shop__boxes">
            {data && data.map((box, index) => (
                <div key={box._id} className={`shop__box-item ${lastRowIndexes.includes(index) ? 'last-row' : ''}`}>
                    <div className="shop__box-item__header">
                        <span className="shop__box-item__header-text">{box.name}</span>
                    </div>
                    <img className="shop__box-image" src={box.image} alt={box.name} />

                    <div className="shop__box-item__buy">
                        <button className="shop__box-item__buy__button" onClick={() => buyBox(box, 3)}>
                            {
                                box.forPremium ?
                                    <span className="shop__box-item__buy__button-text">Для{'\n'}премиум</span>
                                : box.isBought ?
                                    <span className="shop__box-item__buy__button-text">Открыть</span>
                                : (
                                    <span className="shop__box-item__buy__button-text">
                                        {box.price.coins} 
                                        <img className="shop__box-item__buy__button-icon" src={box.price.donate ? donateBalanceIcon : freeBalanceIcon} alt="balance" />
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

export default Boxes;
