import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import axios from 'axios';

import './premium.css';

import markIcon from '../../../assets/mark.svg';
import freeBalanceIcon from '../../../assets/free-balance.png';
import donateBalanceIcon from '../../../assets/donat-balance.png';
import { userData } from '../../utils/request';
import { useUserStore } from '../../../store/store';

function Premium({ data }) {
    const navigate = useNavigate();
    const webApp = window.Telegram.WebApp;
    const [item, setItem] = useState(null);
    const [method, setMethod] = useState('stars');
    const [order, setOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenPay, setIsModalOpenPay] = useState(false);
    const [isModalOpenPaid, setIsModalOpenPaid] = useState(false);
    const [lastRowIndexes, setLastRowIndexes] = useState([]);
    const { width, height } = useWindowSize();
    const { setUser } = useUserStore()

    useEffect(() => {
        const calculateLastRow = () => {
            const container = document.querySelector('.shop__subscription');
            const item = document.querySelector('.shop__subscription-item');
            if (!container || !item) return;

            const itemsInRow = Math.floor(container.offsetWidth / item.offsetWidth) || 1;
            const lastRowStart = Math.ceil(data.length / itemsInRow - 1) * itemsInRow;

            setLastRowIndexes(Array.from({ length: data.length - lastRowStart }, (_, i) => lastRowStart + i));
        };

        calculateLastRow();
        window.addEventListener('resize', calculateLastRow);

        return () => window.removeEventListener('resize', calculateLastRow);
    }, [data]);

    const selectItem = (item) => {
        setItem(item);
        setIsModalOpen(!isModalOpen);
    }

    const createInvoice = async () => {

        const response = {
            data: {
                data: {
                    url: method === "stars"
                        ? "https://mocked-stars-payment-url.com/invoice"
                        : "https://mocked-card-payment-url.com/invoice",
                    invoice_id: "mocked-invoice-id",
                    user_id: "1038855897",
                    item_id: item.id,
                    category_id: item.category_id
                }
            }
        };

        //const response = await axios.post('https://api.billiards-telegram.xyz/api/v1/billiard/invoice/create', {
          //  user_id: `1038855897`,
           // method,
            //item: {
             //   item_id: item.id,
              //  category_id: item.category_id
            //}
        //});

        if (method === "stars") {
            webApp.openInvoice(response.data.data.url, (status) => {
                if (status === "paid") {
                    setIsModalOpenPay(false)
                    setIsModalOpen(false)
                    setIsModalOpenPaid(true)
                    userData("test", setUser)
                }
            });
        } else if (method === "card") {
            window.open(response.data.data.url, '_blank');
            setOrder(response.data.data);
            setIsModalOpenPay(true);
            setIsModalOpen(false);
        }
    }

    return (
        <>
            {isModalOpen && (
                <div className="modal__shop" onClick={() => setIsModalOpen(false)}>
                    <div className="modal__shop-content" onClick={e => e.stopPropagation()}>
                        <span className="modal__shop-content__close" onClick={() => setIsModalOpen(false)}>&times;</span>

                        <img className="modal__shop-content__image" src="https://billiards-telegram.xyz/assets/payment/stars.png" alt={item.name} />

                        <span className="modal__shop-content__title">Подписка</span>
                        <span className="modal__shop-content__name">{item.name}</span>

                        <div className='modal__shop-content-methods'>
                            <div className={`modal__shop-content-methods__item ${method === "stars" ? 'method-active' : ""}`} onClick={() => setMethod('stars')}>
                                <img src="https://billiards-telegram.xyz/assets/payment/stars2.png" alt="Stars" />
                                <span>Stars</span>
                            </div>
                            <div className={`modal__shop-content-methods__item ${method === "card" ? 'method-active' : ""}`} onClick={() => setMethod('card')}>
                                <img src="https://billiards-telegram.xyz/assets/payment/card2.png" alt="Card" />
                                <span>Card</span>
                            </div>
                        </div>

                        <button className="modal__shop-content__button" onClick={() => createInvoice()}>
                            Оплатить
                        </button>
                    </div>
                </div>

            )}
            {isModalOpenPay && (
                <div className="modal__shop" onClick={() => setIsModalOpenPay(false)}>
                    <div className="modal__shop-content" onClick={e => e.stopPropagation()}>
                        <span className="modal__shop-content__close" onClick={() => setIsModalOpenPay(false)}>&times;</span>

                        <div className="modal__shop-content__loading">
                            <div className="modal__shop-content__loading-spinner"></div>
                        </div>

                        <span className="modal__shop-content__title">Ожидание оплаты</span>
                        <span className="modal__shop-content__name">Нажмите на кнопку ниже, чтобы перейти к оплате</span>

                        <button className="modal__shop-content__button" onClick={() => window.open(order.url, '_blank')}>
                            Перейти
                        </button>
                    </div>
                </div>

            )}
            {isModalOpenPaid && (
                    <div className="modal__shop" onClick={() => setIsModalOpenPaid(false)}>
                    <div className="modal__shop-content" onClick={(e) => e.stopPropagation()} >
                    <span className="modal__shop-content__close" onClick={() => setIsModalOpenPaid(false)}>&times;</span>

                    <span className="modal__shop-content__title">Оплата прошла!</span>
                    <span className="modal__shop-content__name">Подписка выдана на ваш аккаунт</span>

                    <button className="modal__shop-content__button" onClick={() => setIsModalOpenPaid(false)}>Закрыть</button>
                    </div>
                    <Confetti width={width} height={height} numberOfPieces={200} />
                </div>
            )}
            <div className="shop__subscription">
                {data && data.map((sub, index) => (
                    <div key={sub._id} className={`shop__subscription-item ${lastRowIndexes.includes(index) ? 'last-row' : ''}`} onClick={() => selectItem(sub)}>
                        <div className="shop__subscription-item__header">
                            <span className="shop__subscription-item__header-text">{sub.name}</span>
                        </div>
                        <div className="shop__premium-item__advantages">
                            {sub && sub.advantages.map((advantage, index) => (
                                <div key={index} className="shop__premium-item__advantage">
                                    <img className="shop__premium-item__advantage-icon" src={markIcon} alt="mark" />
                                    <span className="shop__premium-item__advantage-text">{advantage}</span>
                                </div>
                            ))}
                        </div>

                        <div className="shop__subscription-item__buy">
                            <button className="shop__subscription-item__buy__button">
                                <span className="shop__subscription-item__buy__button-text">
                                    {sub.price.usd}$
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Premium;
