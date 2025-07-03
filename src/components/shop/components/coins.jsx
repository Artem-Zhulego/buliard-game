import React, { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './coins.css';
import { userData } from '../../utils/request';
import { useUserStore } from '../../../store/store';

function Coins({ data }) {
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

    const navigate = useNavigate();
    const normalCoins = data.filter((coin) => !coin.donate);
    const donateCoins = data.filter((coin) => coin.donate);

    const buyItem = (item) => {
        setItem(item);
        setIsModalOpen(!isModalOpen);
    }

    const calculateLastRow = useCallback(() => {
        const container = document.querySelector('.shop__coins-block');
        const item = document.querySelector('.shop__coins-item');
        if (!container || !item) return;

        const itemWidth = item.offsetWidth || 1;
        const itemsInRow = Math.floor(container.offsetWidth / itemWidth) || 1;

        const normalLastRowStart = Math.max(0, Math.ceil(normalCoins.length / itemsInRow - 1) * itemsInRow);

        setLastRowIndexes(Array.from({ length: normalCoins.length - normalLastRowStart }, (_, i) => normalLastRowStart + i));
    }, [data]);

    useEffect(() => {
        calculateLastRow();
        window.addEventListener('resize', calculateLastRow);

        return () => window.removeEventListener('resize', calculateLastRow);
    }, [calculateLastRow]);

    const formatNumber = (num) => { 
        if (isNaN(num)) return '0' 
     
        num = Number(num) 
        return num.toLocaleString('ru-RU') 
    }

    const renderCoinItem = (coin, index) => (
        <div key={coin._id} className={`shop__coins-item ${lastRowIndexes.includes(index) ? 'last-row' : ''}`}>
            <span className="shop__coins-item__header-text">{formatNumber(coin.name)}</span>
            <img className="shop__coins-image" src={coin.image} alt={coin.name} />
            <div className="shop__coins-item__buy">
                <button className="shop__coins-item__buy__button" onClick={() => buyItem(coin)}>
                    <span className="shop__coins-item__buy__button-text">
                        {coin.price.usd}$
                    </span>
                </button>
            </div>
        </div>
    );

    const createInvoice = async () => {

        const response = {
            data: {
                status: "success",
                invoice_id: "inv_1234567890",
                user_id: "1038855897",
                method: "your-payment-method",
                item: {
                item_id: "item123",
                category_id: "category456"
                },
                payment_url: "https://payment-provider.com/pay/inv_1234567890"
            },
            status: 200,
            statusText: "OK",
            headers: {
                "content-type": "application/json"
            },
            config: {}
            };

        //const response = await axios.post('https://api.billiards-telegram.xyz/api/v1/billiard/invoice/create', {
          //  user_id: `1038855897`,
            //method,
            //item: {
              //  item_id: item.id,
                //category_id: item.category_id
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

                        <img className="modal__shop-content__image" src={item.image} alt={item.name} />

                        <span className="modal__shop-content__title">Покупка</span>
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
                    <span className="modal__shop-content__name">Монеты успешно пополнены на ваш баланс</span>

                    <button className="modal__shop-content__button" onClick={() => setIsModalOpenPaid(false)}>Закрыть</button>
                    </div>
                    <Confetti width={width} height={height} numberOfPieces={200} />
                </div>
            )}

            <div className="shop__coins-container">
                <div className="shop__coins-block left">
                    {normalCoins.map((coin, index) => renderCoinItem(coin, index))}
                </div>
                <div className="shop__coins-block right">
                    {donateCoins.map((coin, index) => renderCoinItem(coin, index))}
                </div>
            </div>
        </>
    );
}

export default Coins;
