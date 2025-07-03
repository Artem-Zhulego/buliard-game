// Messages.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import './messages.css';

function Messages() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [dialogs, setDialogs] = useState([
        {
            id: 1,
            name: "Хомяк",
            avatar: "https://avatars.steamstatic.com/9e98f7eea001a22f92c3ac348ac381ee4b7a4fd5_full.jpg",
            preview: "привет, как дела, пойдешь играть?",
            read: true,
            unreadCount: 0,
            messages: [
                { id: 127124, name: "Ебанный хомяк", avatar: "https://avatars.steamstatic.com/9e98f7eea001a22f92c3ac348ac381ee4b7a4fd5_full.jpg", date: 1736207220, isMe: false, content: 'Привет' },
                { id: 127124, name: "Ебанный хомяк", avatar: "https://avatars.steamstatic.com/9e98f7eea001a22f92c3ac348ac381ee4b7a4fd5_full.jpg", date: 1736207220, isMe: false, content: 'Привет' },
                { id: 215321, name: "Exta", avatar: "https://avatars.steamstatic.com/3ebf227ba441d4059cecf1b23f0c3c32ccfdcfdf_full.jpg", date: 1736211550, isMe: true, content: 'Привет' },
                { id: 215321, name: "Exta", avatar: "https://avatars.steamstatic.com/3ebf227ba441d4059cecf1b23f0c3c32ccfdcfdf_full.jpg", date: 1736703428, isMe: true, content: 'Привет' },
                { id: 215321, name: "Exta", avatar: "https://avatars.steamstatic.com/3ebf227ba441d4059cecf1b23f0c3c32ccfdcfdf_full.jpg", date: 1736703428, isMe: true, content: 'Привет' }
            ]
        },
        {
            id: 2,
            name: "Жаренный бульбао",
            avatar: "https://avatars.steamstatic.com/9b59a019b585aefee973b54b38bb51bf7658eb29_full.jpg",
            preview: "В компы пойдешь?",
            read: false,
            unreadCount: 1,
            messages: [
                { id: 127125, name: "Жаренный бульбао", avatar: "https://avatars.steamstatic.com/9b59a019b585aefee973b54b38bb51bf7658eb29_full.jpg", date: 1736207220, isMe: false, content: 'В компы пойдешь?' },
                { id: 215322, name: "Exta", avatar: "https://avatars.steamstatic.com/3ebf227ba441d4059cecf1b23f0c3c32ccfdcfdf_full.jpg", date: 1736211550, isMe: true, content: 'Не, я работаю' }
            ]
        },
        {
            id: 3,
            name: "Хомяк",
            avatar: "https://avatars.steamstatic.com/9e98f7eea001a22f92c3ac348ac381ee4b7a4fd5_full.jpg",
            preview: "привет, как дела, пойдешь играть?",
            read: true,
            unreadCount: 0,
            messages: [
                { id: 127124, name: "Ебанный хомяк", avatar: "https://avatars.steamstatic.com/9e98f7eea001a22f92c3ac348ac381ee4b7a4fd5_full.jpg", date: 1736207220, isMe: false, content: 'Привет' },
                { id: 215321, name: "Exta", avatar: "https://avatars.steamstatic.com/3ebf227ba441d4059cecf1b23f0c3c32ccfdcfdf_full.jpg", date: 1736211550, isMe: true, content: 'Привет' }
            ]
        },
        {
            id: 4,
            name: "Жаренный бульбао",
            avatar: "https://avatars.steamstatic.com/9b59a019b585aefee973b54b38bb51bf7658eb29_full.jpg",
            preview: "В компы пойдешь?",
            read: false,
            unreadCount: 1,
            messages: [
                { id: 127125, name: "Жаренный бульбао", avatar: "https://avatars.steamstatic.com/9b59a019b585aefee973b54b38bb51bf7658eb29_full.jpg", date: 1736207220, isMe: false, content: 'В компы пойдешь?' },
                { id: 215322, name: "Exta", avatar: "https://avatars.steamstatic.com/3ebf227ba441d4059cecf1b23f0c3c32ccfdcfdf_full.jpg", date: 1736211550, isMe: true, content: 'Не, я работаю' }
            ]
        },
        {
            id: 5,
            name: "Хомяк",
            avatar: "https://avatars.steamstatic.com/9e98f7eea001a22f92c3ac348ac381ee4b7a4fd5_full.jpg",
            preview: "привет, как дела, пойдешь играть?",
            read: true,
            unreadCount: 0,
            messages: [
                { id: 127124, name: "Ебанный хомяк", avatar: "https://avatars.steamstatic.com/9e98f7eea001a22f92c3ac348ac381ee4b7a4fd5_full.jpg", date: 1736207220, isMe: false, content: 'Привет' },
                { id: 215321, name: "Exta", avatar: "https://avatars.steamstatic.com/3ebf227ba441d4059cecf1b23f0c3c32ccfdcfdf_full.jpg", date: 1736211550, isMe: true, content: 'Привет' }
            ]
        },
        {
            id: 6,
            name: "Жаренный бульбао",
            avatar: "https://avatars.steamstatic.com/9b59a019b585aefee973b54b38bb51bf7658eb29_full.jpg",
            preview: "В компы пойдешь?",
            read: false,
            unreadCount: 1,
            messages: [
                { id: 127125, name: "Жаренный бульбао", avatar: "https://avatars.steamstatic.com/9b59a019b585aefee973b54b38bb51bf7658eb29_full.jpg", date: 1736207220, isMe: false, content: 'В компы пойдешь?' },
                { id: 215322, name: "Exta", avatar: "https://avatars.steamstatic.com/3ebf227ba441d4059cecf1b23f0c3c32ccfdcfdf_full.jpg", date: 1736211550, isMe: true, content: 'Не, я работаю' }
            ]
        }
    ]);
    const [currentDialog, setCurrentDialog] = useState(dialogs[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newMessage, setNewMessage] = useState('');

    const [modal, setModal] = useState(true);
    const [openDialogList, setOpenDialogList] = useState(true);

    const webApp = window.Telegram.WebApp;
    const backButton = webApp.BackButton;
    backButton.show();
    backButton.onClick(() => {
        navigate("/main");
    });

    const selectDialog = (dialog) => {
        setCurrentDialog(dialog);
        setDialogs(prevDialogs => prevDialogs.map(d => d.id === dialog.id ? { ...d, read: true, unreadCount: 0 } : d));
    };

    const formatDateMessage = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isSameDay = (date1, date2) => {
        const d1 = new Date(date1 * 1000);
        const d2 = new Date(date2 * 1000);
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const formatDateHeader = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredDialogs = dialogs.filter(dialog =>
        dialog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dialog.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const timestamp = Math.floor(Date.now() / 1000);
        const newMsg = {
            id: Date.now(),
            name: "Exta",
            avatar: currentDialog.avatar,
            date: timestamp,
            isMe: true,
            content: newMessage.trim()
        };

        const updatedDialogs = dialogs.map(dialog => {
            if (dialog.id === currentDialog.id) {
                return {
                    ...dialog,
                    messages: [...dialog.messages, newMsg],
                    preview: newMessage.trim(),
                    read: true,
                    unreadCount: 0
                };
            }
            return dialog;
        });

        setDialogs(updatedDialogs);
        setCurrentDialog({
            ...currentDialog,
            messages: [...currentDialog.messages, newMsg],
            preview: newMessage.trim(),
            read: true,
            unreadCount: 0
        });
        setNewMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    useEffect(() => {
        const handleClick = (e) => {
            if (openDialogList && !e.target.closest('.messages__dialogs') && !e.target.closest('.messages__back-button')) {
                setOpenDialogList(false);

                setTimeout(() => {
                    setModal(false);
                }, 200);
            }

        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [openDialogList]);

    const openDialogs = () => {
        setModal(true);
        setTimeout(() => {
            setOpenDialogList(true);
        }, 10)
    }

    const closeDialogs = () => {
        setTimeout(() => {
            setOpenDialogList(false);
            setTimeout(() => {
                setModal(false);
            }, 200)
        }, 100)
    }

    useEffect(() => {
        const messages = document.querySelector('.messages__content');
        messages.scrollTop = messages.scrollHeight;
    }, [currentDialog]);

    return (
        <div className="messages">
            <div className="messages__container">
                {modal && (
                    <div className="messages__dialogs-list">
                        <div className={`messages__dialogs ${openDialogList ? 'open' : ''}`}>
                            <div className="messages__dialogs-search">
                                <button className="messages__back-button" onClick={() => navigate("/main")}>
                                    <FaArrowLeft />
                                </button>

                                <input type="text" placeholder="Поиск..." value={searchQuery} onChange={handleSearch} className="messages__search-input" />
                            </div>
                            <div className='messages__dialog-items'>
                                {filteredDialogs.map(dialog => {
                                    const lastMessage = dialog.messages[dialog.messages.length - 1];
                                    const formattedDate = formatDateMessage(lastMessage.date);
                                    return (
                                        <div key={dialog.id} className={`messages__dialog-item ${currentDialog.id === dialog.id ? 'active' : ''}`} onClick={() => { selectDialog(dialog); closeDialogs() }}>
                                            <img src={dialog.avatar} alt={dialog.name} className="messages__dialog-avatar" />
                                            <div className="messages__dialog-info">
                                                <div className="messages__dialog-name">{dialog.name}</div>
                                                <div className="messages__dialog-details">
                                                    <div className="messages__dialog-preview">{dialog.preview}</div>
                                                    {!dialog.read && dialog.unreadCount > 0 ? (
                                                        <div className="messages__unread-badge">{dialog.unreadCount}</div>
                                                    ) : (
                                                        <div className="messages__dialog-date">{formattedDate}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <div className={`messages__view ${openDialogList ? 'messages__view-hide' : ''}`}>
                    <div className="messages__header">
                        <button className="messages__back-button" onClick={() => openDialogs()}>☰</button>
                        <div className='messages__header-user'>
                            <img src={currentDialog.avatar} alt={currentDialog.name} className="messages__header-avatar" />
                            <span className="messages__header-name">{currentDialog.name}</span>
                        </div>
                    </div>
                    <div className="messages__content">
                        {currentDialog.messages.map((message, index) => {
                            const showDateHeader = index === 0 || !isSameDay(currentDialog.messages[index - 1].date, message.date);
                            return [
                                showDateHeader && (
                                    <div className="messages__date-header" key={`date-${message.date}`}>
                                        {formatDateHeader(message.date)}
                                    </div>
                                ),
                                (
                                    <div className={`messages__message-item ${message.isMe ? 'messages__message-item--me' : 'messages__message-item--them'}`} key={message.id}>
                                        <div className="messages__message-body">
                                            <div className="messages__message-text">{message.content}</div>
                                            <div className="messages__message-date">{formatDateMessage(message.date)}</div>
                                        </div>
                                    </div>
                                )
                            ];
                        })}
                    </div>
                    <div className="messages__input-container">
                        <input
                            type="text"
                            placeholder="Введите сообщение..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="messages__input"
                        />
                        <button className="messages__send-button" onClick={handleSendMessage}>
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Messages;
