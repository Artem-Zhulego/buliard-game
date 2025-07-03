import React from 'react';

import Header from './header/header';
import Footer from './footer/footer';
import Notification from './notification/notification';

import { useGameStore } from '../store/store';

function Layout({children}) {
    const { games } = useGameStore();

    return (
        <>
            <Header />
            <Notification />
            {children}
            {/* {!games.ready && (
                <Footer/>
            )} */}
        </>
    );
}

export default Layout;