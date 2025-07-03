import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import './box.css'

import freeBalanceIcon from '../../../assets/free-balance.png'
import donatBalanceIcon from '../../../assets/donat-balance.png'

import { useBoxesStore, useShopStore, useUserStore } from '../../../store/store'
import { openCase } from '../../utils/request'

function Box() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { boxes, selectBox } = useBoxesStore()
    const { user } = useUserStore()
    const { setShop } = useShopStore()

    const [isOpening, setIsOpening] = useState(false)
    const [flipped, setFlipped] = useState([false, false, false])
    const [prizes, setPrizes] = useState(null)
    const [currentIndices, setCurrentIndices] = useState([])

    const webApp = window.Telegram.WebApp
    const backButton = webApp.BackButton
    backButton.show()
    backButton.onClick(() => {
        navigate("/main")
    })

    const box = boxes.find(b => b.id === selectBox)

    useEffect(() => {
        if (box) {
            setCurrentIndices(box.categories.map(() => 0))
            const intervalId = setInterval(() => {
                setCurrentIndices(prevIndices => {
                    return prevIndices.map((currentIndex, i) => {
                        const length = box.categories[i].items.length
                        return (currentIndex + 1) % length
                    })
                })
            }, 1000)
            return () => clearInterval(intervalId)
        }
    }, [box])

    if (!box) {
        navigate('/boxes')
        return null
    }

    function handleCardClick(index) {
        if (flipped[index]) return
        setFlipped(prev => {
            const updated = [...prev]
            updated[index] = !updated[index]
            return updated
        })
    }

    const hadleOpen = async () => {
        const response = await openCase(box.id, setShop)
        setIsOpening(true)
        setPrizes(response)
    }

    const classes = {
        1: "box__list-item-cue",
        3: "box__list-item-coins",
        6: "box__list-item-sticker",
        8: "box__list-item-emoji",
        7: "box__list-item-avatars"
    }

    return (
        <div className="box-container">
            <div className="box">
            <div className="box__overlay"></div>
                <div className="box__container">
                    <div className="box__content">
                        {!isOpening && !prizes ? (
                            <div className="box__info">
                                    <div className="box__info-name">
                                    <span className="box__info-name-text">{box.name}</span>
                                </div>
                                    <div className="box__info-image">
                                    <img className="box__info-image-img" src={box.image} alt="Box" />
                                </div>
                            </div>
                        ) : null}
                        {isOpening && prizes ? (
                            <div className="box__cards-wrapper">
                                <div className={`box__card ${flipped[1] ? 'box__card--flipped' : ''} box__card--blue`} onClick={() => handleCardClick(1)}>
                                    <div className="box__card-inner">
                                        <div className="box__card-front">
                                            <span className="box__card-question">?</span>
                                        </div>
                                        <div className="box__card-back">
                                            <span className='box__card-text'>+{prizes.find(obj => obj.type === "coins").amount}</span>
                                            <img className={`box__card-image`} src={prizes.find(obj => obj.type === "coins").image} alt="card" />
                                        </div>
                                    </div>
                                </div>
                                <div className={`box__card ${flipped[2] ? 'box__card--flipped' : ''} box__card--red`} onClick={() => handleCardClick(2)}>
                                    <div className="box__card-inner">
                                        <div className="box__card-front">
                                            <span className="box__card-question">?</span>
                                        </div>
                                        <div className="box__card-back">
                                            <span className='box__card-text'>{prizes.find(obj => obj.type === "item").item.name}</span>
                                            {prizes.find(obj => obj.type === "item").item.category_id == 5 ? (
                                                <div className="box__card-words">
                                                    {prizes.find(obj => obj.type === "item").item.words.map(word => (
                                                        <div key={word} className="box__card-word">
                                                            <span className="box__card-word-text">{word}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <>
                                                    <img className={`box__card-image`} src={prizes.find(obj => obj.type === "item").item.image} alt="card" />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`box__card ${flipped[3] ? 'box__card--flipped' : ''} box__card--pink`} onClick={() => handleCardClick(3)}>
                                    <div className="box__card-inner">
                                        <div className="box__card-front">
                                            <span className="box__card-question">?</span>
                                        </div>
                                        <div className="box__card-back">
                                            <span className='box__card-text'>+{prizes.find(obj => obj.type === "xp").amount}</span>
                                            <div className='box__card-progress'>
                                                <div 
                                                    className="box__card-progress-bar" 
                                                    style={{ 
                                                        width: `${(user.level.xp / (user.level.max - user.level.min)) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        <div className="box__list">
                            <span className="box__list-title">Содержимое кейса</span>
                            <div className="box__list-items">
                                {box.categories.map((category, i) => {
                                    const currentIndex = currentIndices[i] !== undefined ? currentIndices[i] : 0
                                    return (
                                        <div key={category._id} className="box__list-item">
                                            {category.id == 5 ? (
                                                <div className="box__words-item__words">
                                                    {category.items[currentIndex].words.slice(0, 3).map(word => (
                                                        <div key={word} className="box__words-item__word">
                                                            <span className="box__words-item__word-text">{word}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <img className={`box__list-item-image ${classes[category.id]}`} src={category.items[currentIndex].image} alt={category.items[currentIndex].name} />
                                            )}
                                            <span className="box__list-item-name">{t(category.name)}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="box__footer">
                        <div className="box__footer-info">
                            <span className="box__footer-info-item-text">
                                {box.price?.donate ? (
                                    <>
                                        Стоимость открытия:{" "}
                                        <span className={box.price.donate ? 'color-donat' : 'color-free'}>
                                            {box.price.coins}
                                        </span>
                                        <img className="box__footer-info-item-icon" src={box.price.donate ? donatBalanceIcon : freeBalanceIcon} alt="balance" />
                                    </>
                                ) : ""}
                            </span>
                            <div className="box__footer-info-item">
                                <button className="box__footer-info-item-button-open" onClick={() => hadleOpen()} disabled={isOpening}>
                                    <span className="box__footer-info-item-button-open-text">Открыть</span>
                                </button>
                                <button className="box__footer-info-item-button-exit" onClick={() => navigate("/boxes")}>
                                    <span className="box__footer-info-item-button-exit-text">Выйти</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Box