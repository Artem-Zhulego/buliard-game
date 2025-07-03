import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';

import clothPng from '../../../../assets/game/table/Vector.png';
import bordureLeftPng from '../../../../assets/game/table/bordureLeft.png';
import bordureLeftDotPng from '../../../../assets/game/table/bordureLeftDot.png';
import bordureRightPng from '../../../../assets/game/table/bordureRight.png';
import bordureRightDotPng from '../../../../assets/game/table/bordureRightDot.png';
import bordureUpDownPng from '../../../../assets/game/table/bordureUpDown.png';
import bordureUpDownDotPng from '../../../../assets/game/table/bordureUpDownDot.png';
import hole from '../../../../assets/game/table/hole.png';
import centerHolePng from '../../../../assets/game/table/CenterHole.png';
import OtherHole from '../../../../assets/game/table/OtherHole.png';
// import otherHolePng1 from '../../../../assets/game/table/OtherHole1.png';
// import otherHolePng2 from '../../../../assets/game/table/OtherHole2.png';
// import bordureBlue from '../../../../assets/game/table/bordureBlue.png';
// import bordureUpLeft from '../../../../assets/game/table/bordureUpLeft.png';
// import bordureUpRight from '../../../../assets/game/table/bordureUpRight.png';

import whiteTexture from '../../../../assets/game/ball/0.png';
import ball1 from '../../../../assets/game/ball/1.png';
import ball2 from '../../../../assets/game/ball/2.png';
import ball3 from '../../../../assets/game/ball/3.png';
import ball4 from '../../../../assets/game/ball/4.png';
import ball5 from '../../../../assets/game/ball/5.png';
import ball6 from '../../../../assets/game/ball/6.png';
import ball7 from '../../../../assets/game/ball/7.png';
import ball8 from '../../../../assets/game/ball/8.png';
import ball9 from '../../../../assets/game/ball/9.png';
import ball10 from '../../../../assets/game/ball/10.png';
import ball11 from '../../../../assets/game/ball/11.png';
import ball12 from '../../../../assets/game/ball/12.png';
import ball13 from '../../../../assets/game/ball/13.png';
import ball14 from '../../../../assets/game/ball/14.png';
import ball15 from '../../../../assets/game/ball/15.png';

export function useTableTextures() {
    return useLoader(TextureLoader, [
        clothPng,
        bordureLeftPng,
        bordureRightPng,
        bordureUpDownPng,
        hole,
        centerHolePng,
        OtherHole,
        bordureLeftDotPng,
        bordureRightDotPng,
        bordureUpDownDotPng
    ]);
}

export function useBallTextures() {
    return useLoader(TextureLoader, [
        whiteTexture,
        ball1,
        ball2,
        ball3,
        ball4,
        ball5,
        ball6,
        ball7,
        ball8,
        ball9,
        ball10,
        ball11,
        ball12,
        ball13,
        ball14,
        ball15
    ]);
}