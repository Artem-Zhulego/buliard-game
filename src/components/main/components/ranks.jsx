import React from 'react';
import './ranks.css';
import { useUserStore } from '../../../store/store';

const RanksModal = ({ isModalOpen, setIsModalOpen }) => {
    const { user } = useUserStore()
    const ranks = [
        { id: 1, max: 200, name: "Новичок" },
        { id: 2, max: 400, name: "Начинающий" },
        { id: 3, max: 600, name: "Ученик" },
        { id: 4, max: 900, name: "Любитель" },
        { id: 5, max: 1200, name: "Мастер" },
        { id: 6, max: 1500, name: "Профи" },
        { id: 7, max: 2000, name: "Чемпион" },
        { id: 8, max: 2500, name: "Виртуоз" },
        { id: 9, max: 3000, name: "Эксперт" },
        { id: 10, max: 4000, name: "Магистр" },
        { id: 11, max: 5000, name: "Абсолют" },
        { id: 12, max: Infinity, name: "Шулер" }
    ];  

    if (!isModalOpen) return null;

    return (
        <div className="ranks__modal" onClick={() => setIsModalOpen(false)}>
            <div className="ranks__modal-content" onClick={e => e.stopPropagation()}>
                <span className="ranks__modal-content__close" onClick={() => setIsModalOpen(false)}>&times;</span>
                <div className='ranks__modal-content__header'>
                    <img className='ranks__modal-content__header-icon' src='https://billiards-telegram.xyz/assets/icons/modal-cup.svg' alt="Иконка" />
                    <span className='ranks__modal-content__header-title'>Звания</span>
                </div>
                <div className="ranks__modal-content__blocks">
                    {ranks.map((rank, index) => (
                        <div key={index} className={`ranks__modal-content__block ${user.rank.num === rank.id ? 'border-pink' : ""}`}>
                            <img className='ranks__modal-content__block-image' src={`https://billiards-telegram.xyz/assets/ranks/${rank.id}.png`} alt={rank.id} />
                            <span className='ranks__modal-content__block-name'>{rank.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RanksModal;
