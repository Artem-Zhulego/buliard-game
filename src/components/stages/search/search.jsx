import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../Layout'
import backIcon from '../../../assets/back.svg'
import './search.css'
import axios from 'axios'
import { queueAdd } from '../../utils/request'

function Search() {
    const navigate = useNavigate()
    const [time, setTime] = useState(0)

    useEffect(() => {
        queueAdd('online', 0)
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(prevTime => prevTime + 1)
        }, 1000)
        
        return () => clearInterval(timer)
    }, [])

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60

        const formattedMinutes = String(minutes).padStart(2, '0')
        const formattedSeconds = String(seconds).padStart(2, '0')

        return `${formattedMinutes}:${formattedSeconds}`
    }

    return (
        <Layout>
            <div className='overlay-search'>
                <div className='search'>
                    <div className='search__content'>
                        <div className='search__container'>
                            <span className='search__container-title'>Поиск противника</span>
                            <span className='search__container-description'>{formatTime(time)}</span>
                            <img src="https://billiards-telegram.xyz/assets/search/animation.gif" className="search__content-animation" alt="Animation" />
                        </div>
                    </div>
                    <div className='search__footer'>
                        <span className='search__footer-online'>Онлайн: 22 493</span>
                        <div className='search__footer-information'>
                            <span className='search__footer-information__text font-500'>
                                <span className='font-700'>Интересный факт: </span>
                                картошка очень вкусная, поэтому белорусы ее любят. Попробуйте ее обязательно
                            </span>
                        </div>
                        <button className='search__back-button' onClick={() => navigate("/main")}>
                            <img className='search__back-icon' src={backIcon} alt='Back Icon' />
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Search
