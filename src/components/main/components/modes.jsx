import React, { useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import './modes.css';
import { useMainStore } from '../../../store/store';
import { useNavigate } from 'react-router-dom';

const ModesComponent = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { main } = useMainStore()
    const navigate = useNavigate()

    return (
        <>
            {isOpen && <div className="sheet-backdrop" onClick={() => setIsOpen(false)}></div>}
                <Sheet
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    snapPoints={[500, 400, 200, 100]}
                    initialSnap={1} 
                    detent="content-height"
                >
                <Sheet.Container className="custom-sheet">
                    <Sheet.Header className='custom-sheet_header'/>
                    <Sheet.Content className="custom-sheet_block">
                        <Sheet.Scroller>
                            <div className="blocks-grid">
                                {main && main.bets && main.bets.map((bet) => (
                                    <div key={bet.id} className="block-bet">
                                        <div className='block-bet-header'>
                                            <img src={bet.image} />
                                            <span>{bet.name}</span>
                                        </div>
                                        <div className='block-bet-info'>
                                            <span className='font-700'>Ставка <span className='font-500'>{bet.bet.coins}</span></span>
                                            <button onClick={() => navigate('/search')}>Играть</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
            </Sheet>
        </>
    );
};

export default ModesComponent;