import React, { useEffect, useState, useRef } from 'react';
import { useSettingsStore, useUserStore, useNotificationsStore, useShopStore, useBoxesStore, useMainStore } from '../../store/store';
import { Routes, Route, useNavigate, useLocation, Navigate  } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import socket from '../utils/main'

import Main from '../main/main'
import Settings from '../settings/settings'
import History from '../history/history'
import Games from '../games/games'
import Friends from '../friends/friends';
import Stage from '../stages/stage'
import Tasks from '../tasks/tasks'
import Shop from '../shop/shop'
import Boxes from '../boxes/boxes';
import Box from '../boxes/components/box';
import Game from '../stages/game/game'
import Messages from '../messages/messages';
import Search from '../stages/search/search';
import Connect from '../stages/search/connect';

import turnPhoneIcon from '../../assets/turn-phone.png'
import logoLoading from '../../assets/logoBig.png'

import './App.css';

const mockMain = {
  data: {
    data: {
      games: [],
      tournaments: [],
      news: [],
    }
  }
};

const mockUser = {
  data: {
    data: {
      id: 1038855897,
      username: "Ravenswood12",
      first_name: "Test",
      last_name: "",
      level: 5,
      xp: 500,
      coins: 1000,
    }
  }
};

const mockShop = {
  data: {
    data: {
      items: [
        { id: 1, name: "Кий", price: 100 },
        { id: 2, name: "Шар", price: 50 }
      ],
    }
  }
};

const mockBoxes = {
  data: {
    data: {
      boxes: [
        { id: 1, type: "bronze", contents: ["coins", "xp"] },
        { id: 2, type: "silver", contents: ["coins", "item"] }
      ]
    }
  }
};

const mockAvatar = {
  data: {
    success: true
  }
};

const App = () => {
    const { t } = useTranslation()
    const { addSettings, settings } = useSettingsStore()
    const { setUser } = useUserStore()
    const { setNotification } = useNotificationsStore()
    const { setShop } = useShopStore()
    const { setBoxes } = useBoxesStore()
    const { setMain } = useMainStore()
    
    const setupCalled = useRef(false);
    const [isAuthing, setIsAuthing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);
    const webApp = window.Telegram.WebApp;
    const navigate = useNavigate()
    const location = useLocation();
    useEffect(() => {
        document.body.classList.add('landscape');

        return () => {
            document.body.classList.remove('landscape');
        };
    }, []);

    const setupUserData = async () => {
        setLoadProgress(10);
        if (isAuthing || setupCalled.current) return;

        setupCalled.current = true;
        setIsAuthing(true);

        const iframe = document.querySelector('iframe');
        if (iframe) {
             const text = "http://localhost:3000/#tgWebAppData=query_id%3DAAEXdKBMAAAAABd0oEwdJmee%26user%3D%257B%2522id%2522%253A1285583895%252C%2522first_name%2522%253A%2522%25D0%2591%25D0%25BE%25D0%25B3%25D0%25B4%25D0%25B0%25D0%25BD%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522Ravenswood12%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252F670qnsjEyccDxdd7bXeHlT6oWsVsdUzFosg5bz51uak.svg%2522%257D%26auth_date%3D1732633933%26signature%3Dy1KxDP6DNlRmy_U8-sjj0FJbDkXA2LJRmT5FCoy0b4o__ThCtM8Bzg9i7PKciGq4bQa6qsotuUjrWy7TLY24Dw%26hash%3Dba1dfcf24fef8af2a825a7efb933c8e82dc21e7a5cea2f10003fbf0b99f69a45&tgWebAppVersion=7.10&tgWebAppPlatform=web&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23212121%22%2C%22button_color%22%3A%22%238774e1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23aaaaaa%22%2C%22link_color%22%3A%22%238774e1%22%2C%22secondary_bg_color%22%3A%22%23181818%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22header_bg_color%22%3A%22%23212121%22%2C%22accent_text_color%22%3A%22%238774e1%22%2C%22section_bg_color%22%3A%22%23212121%22%2C%22section_header_text_color%22%3A%22%238774e1%22%2C%22subtitle_text_color%22%3A%22%23aaaaaa%22%2C%22destructive_text_color%22%3A%22%23ff595a%22%7D"
             iframe.src = text;
        }

        webApp.setHeaderColor("#5e35b1");
        webApp.expand()
        webApp.enableClosingConfirmation()
        webApp.disableVerticalSwipes()
        webApp.requestFullscreen()

        setLoadProgress(20);

        const [response_main, response_user, response_shop, response_boxes, response_avatar] = await Promise.all([
            Promise.resolve(mockMain),
            Promise.resolve(mockUser),
            Promise.resolve(mockShop),
            Promise.resolve(mockBoxes),
            Promise.resolve(mockAvatar),
        ]);

        console.log("new stage");

        setMain(response_main.data.data)
        setUser(response_user.data.data)
        setShop(response_shop.data.data);
        setBoxes(response_boxes.data.data);

        //socket.connect()

        const websocketHadle = (data) => {
            console.log(data)
        }

        //socket.subscribe('data', websocketHadle)

        try {
            setLoadProgress(100);
            setTimeout(() => {
                setLoading(false);
            }, 2000)
        } catch (error) {
            setLoading(false);
        } finally {
            setIsAuthing(false);
        }
    };
    console.log("useEffect");
    useEffect(() => {
        setupUserData();
    }, []); 

    useEffect(() => {
        const handleOrientationChange = (e) => {
            setIsPortrait(e.matches);
        };
    
        const portraitQuery = window.matchMedia("(orientation: portrait)");
        portraitQuery.addEventListener('change', handleOrientationChange);
        console.log("return");
        return () => {
            portraitQuery.removeEventListener('change', handleOrientationChange);
        };
    }, []);

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="loading-back"></div>
                <img className="loading-logo" src={logoLoading} alt="Logo" />
                {/* <div className="loading-name">BILLIARD <span>ONLINE</span></div> */}
                <div className="loading-bar-container">
                    <div className="loading-bar">
                        <div className="loading-fill" style={{ width: `${loadProgress}%` }}></div>
                    </div>
                </div>
            </div>
        );
    }
    console.log("loading");
    if (isPortrait) {
      const backButton = webApp.BackButton;
      backButton.hide();
      webApp.setHeaderColor("#0A0A0A");

        return (
            <div className="overlay">
                <div className="overlay-block">
                    <img className="overlay-block-image" src={turnPhoneIcon} alt="Turn Phone Icon"></img>
                    <div className="overlay-block-text">Переверни телефон</div>
                </div>
            </div>
        );
    }

  if (location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  return (
      <div className="App">
          <Routes>
              <Route path='/' element={<Main/>}/>
              <Route path='/main' element={<Main/>}/>
              <Route path='/settings' element={<Settings/>}/>
              <Route path='/history' element={<History/>}/>
              {/* <Route path='/games' element={<Games/>}/> */}
              <Route path='/friends' element={<Friends/>}/>
              <Route path='/tasks' element={<Tasks/>}/>
              <Route path='/stage' element={<Stage/>}/>
              <Route path='/game' element={<Game/>}/>
              <Route path='/shop' element={<Shop/>}/>
              <Route path='/messages' element={<Messages/>}/>
              <Route path='/boxes' element={<Boxes/>}/>
              <Route path='/box' element={<Box/>}/>
              <Route path='/search' element={<Search/>}/>
              <Route path='*' element={<Navigate to="/" replace />} />
          </Routes>
      </div>
  );
};

export default App;