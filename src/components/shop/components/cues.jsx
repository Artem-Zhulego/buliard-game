import React from 'react';

import './cues.css';

import shopCueArrow from '../../../assets/shopCueArrow.svg'
import freeBalanceIcon from '../../../assets/free-balance.png';
import donateBalanceIcon from '../../../assets/donat-balance.png';
import { selectItem, buyItem, userData } from '../../utils/request'
import { useShopStore, useUserStore } from '../../../store/store';


function Cues({ data }) {
    const { setShop, setPage } = useShopStore()
    const { user, setUser } = useUserStore()

    const renderSegments = (value) => {
        return (
            <div className="segments-container">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className={`segment ${i < value ? 'filled' : ''}`} />
                ))}
            </div>
        )
    }

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
        <div className="cues">
            {data && data.map((cue) => (
                <div key={cue._id} className={`cue-item ${cue.isSelect ? 'border-pink' : ''}`}>
                    <div className='cue-left'>
                        <div className="cue-header">
                            <span className='cue-name'>{cue.name}</span>
                            <div className='cue-level-content'>
                                <span className={`cue-level-text ${cue.level > 1 ? "active" : ""}`}>Уровень {cue.level}</span>
                                {/* {cue.level > 1 && (
                                    <>
                                        <div className='cue-up-block'>
                                            <span className='level-up-text'>12/8</span>
                                        </div>
                                        <img className='level-up-icon' src={shopCueArrow} alt='Arrow' />
                                    </>
                                )} */}
                            </div>
                        </div>

                        <img className='cue-image' src={cue.image} alt={cue.name} />
                    </div>

                    <div className='cue-right'>
                        <div className='cue-stats'>
                            <div className='stat-group'>
                                <span className='stat-label'>Сила</span>
                                {renderSegments(cue.characterization.power)}
                            </div>
                            <div className='stat-group'>
                                <span className='stat-label'>Прицел</span>
                                {renderSegments(cue.characterization.scope)}
                            </div>
                            <div className='stat-group'>
                                <span className='stat-label'>Подкрутка</span>
                                {renderSegments(cue.characterization.spin)}
                            </div>
                        </div>

                        <button className={`cue-button ${cue.isSelect ? 'pink' : cue.isBought ? 'green' : cue.forPremium ? 'premium' : ''}`} onClick={() => callBackButton(cue)}> 
                            {
                                cue.isSelect ? 
                                    <div className='cue-button-block'>
                                        <span className="cue-button-text-update">Используется</span>
                                    </div>
                                : cue.isBought ? 
                                    <div className='cue-button-block'>
                                        <span className="cue-button-text-update">Использовать</span>
                                    </div>
                                : cue.forPremium ?
                                    <span className="cue-button-text-premium">Для{'\n'}премиум</span>
                                : (
                                    <div className='cue-button-block'>
                                        <span>Купить</span>
                                        <span className="cue-button-price buy">
                                            {cue.price.coins}
                                            <img src={cue.price.donate ? donateBalanceIcon : freeBalanceIcon} alt="Free Balance" className="cue-button-icon" />
                                        </span>
                                    </div>
                                )
                            }
                        </button>
                    </div>

                </div>
            ))}
        </div>
    );
}

export default Cues;

// // cue.level > 1 ? 'upgrade' :

// : cue.level > 1 ?
//     <div className='cue-button-block'>
//         <span className="cue-button-text-update">Улучшить</span>
//         <span className="cue-button-price">
//             {cue.price.coins}
//             <img src={cue.price.donate ? donateBalanceIcon : freeBalanceIcon} alt="Free Balance" className="cue-button-icon" />
//         </span>
//     </div>