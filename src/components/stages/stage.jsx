import React, { useEffect, useState, useRef } from 'react';

import Search from './search/search'
// import Game from './game/game'
import End from './end/end'

import { useCache } from '../../store/store';

function Content(){
    const { stage } = useCache()

    // return (
    //     stage === 1 ? <Search /> 
    //         : stage === 2 ? <Game /> 
    //             : stage === 3 ? <End /> 
    //     : <></>
    // )
}

export default Content