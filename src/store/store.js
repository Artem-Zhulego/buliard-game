import { create } from 'zustand'

const useUserStore = create((set) => ({
    user: null,
    language: "ru",
    setUser: (obj) => set((state) => ({ user: obj })),
    setLanguage: (string) => set((state) => ({ language: string }))
}))

const useMainStore = create((set) => ({
    main: [],
    setMain: (data) => set(state => ({ main: data })),
    updateMain: (data) => set(state => ({ main: { ...state.main, ...data } }))
}));

const useSettingsStore = create((set) => ({
    settings: {
        sounds: true,
        vibrations: true,
    },
    setSettings: (settings) => set((state) => ({ settings })),
    addSettings: (obj) => set((state) => ({ settings: obj }))
}))

const useGameStore = create((set, get) => ({
    games: {
        ready: false,
        start: false,
        current: "player",
        balls_player: [],
        balls_bot: [],
        hit: false,
        isMoving: false,
        AImove: null,
        block: false,
        pocket: false,
        count: 0,
        isScored: false
    },
    setGames: (games) => set((state) => ({ games })),
    updateGames: (key, value) => set((state) => ({ games: { ...state.games, [key]: value } })),
    addBall: (target, id) => set((state) => {
        const key = `balls_${target}`;
        const updatedBalls = [...(state.games[key] || []), id];
        return { games: { ...state.games, [key]: updatedBalls } };
    }),
    getCurrentPlayer: () => get().games.current,
}))

const useCache = create((set) => ({
    stage: 1,
    setData: (key, value) => set((state) => ({ [`${key}`]: value }))
}))

const useHistoryStore = create((set) => ({
    history: [],
    date_update: null,
    setUpdate: (date_update) => set({ date_update }),
    setHistory: (data) => set(state => ({ history: data }))
}))

const useNotificationsStore = create((set) => ({
    notification: null,
    notification_update: null,
    setNotification: (data) => set(state => ({ notification: data })),
    setNotificationUpdate: (date) => set(state => ({ notification_update: date }))
}));

const useShopStore = create((set) => ({
    shop: [],
    page: "CUES",
    setShop: (data) => set(state => ({ shop: data })),
    setPage: (page) => set(state => ({ page }))
}));

const useBoxesStore = create((set) => ({
    boxes: [],
    selectBox: null,
    setBoxes: (data) => set(state => ({ boxes: data })),
    setSelectBox: (integer) => set(state => ({ selectBox: integer }))
}));

export { useUserStore, useSettingsStore, useGameStore, useCache, useHistoryStore, useNotificationsStore, useShopStore, useBoxesStore, useMainStore }