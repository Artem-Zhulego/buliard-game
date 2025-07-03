import axios from "axios";
const base_url = '';

export const selectItem = async (item_id, setShop) => {
    await axios.post(`${base_url}/api/v1/billiard/shop/item/select`, {
        user_id: "1038855897",
        item_id
    });

    const response = await axios.post(`${base_url}/api/v1/billiard/shop/list`, {
        user_id: "1038855897"
    });
    setShop(response.data.data);
};

export const buyItem = async (item_id, setShop) => {
    await axios.post(`${base_url}/api/v1/billiard/shop/item/buy`, {
        user_id: "1038855897",
        item_id
    });

    const response = await axios.post(`${base_url}/api/v1/billiard/shop/list`, {
        user_id: "1038855897"
    });
    setShop(response.data.data);
};

export const openCase = async (box_id, setShop) => {
    const response = await axios.post(`${base_url}/api/v1/billiard/boxes/open`, {
        user_id: "1038855897",
        box_id
    });

    return response.data.data
};

export const userData = async (init_data, setUser) => {
    const response = await axios.post(`${base_url}/api/v1/billiard/user/data`, {
        user_id: "1038855897",
        init_data
    });

    setUser(response.data.data)
};

export const queueAdd = async (mode, bet) => {
    await axios.post(`${base_url}/api/v1/billiard/game/queue`, {
        user_id: "1038855897",
        mode,
        bet
    });
};