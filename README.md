# 🎱 **Billiards Telegram API Documentation**  

Welcome to the **Billiards Telegram API** documentation! Good luck Bogdan <3

---

## 📚 **Base URL**  
```
https://api.billiards-telegram.xyz/
```

### ⚠️ **Headers**  
Every request must include the following header:  
- **`x-init-data`**: Contains Telegram's `initData`.

### 🚨 **Error Codes**  
| **Code** | **Description** |
|---------|-----------------|
| **201** | `Initdata not found`: Header `x-init-data` is missing. |
| **202** | `Required parameters missing in initData`: `initData` object is incorrect. |
| **203** | `Invalid hash`: Attempt to manipulate request data. |
| **204** | `Server error`: Internal server error. |

---

# 🌐 **Main Handling**

## 1️⃣ **Get Main info** 
**[GET] `/api/v1/billiard/main/list`**  

**Response:**  
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "modes": [
            {
                "id": "string",
                "label": "string",
                "position": number,
                "disabled": boolean
            }
        ],
        "bets": [
            {
                "id": number,
                "name": "string",
                "image": "string (URL)",
                "bet": {
                    "donate": boolean,
                    "coins": number,
                    "win": number
                }
            }
        ]
    }
}
```

--- 

# 🧑‍💻 **User Handling**

## 1️⃣ **Get User Data**  
**[POST] `/api/v1/billiard/user/data`**  

**Request Body:**  
```json
{
    "user_id": "string",
    "init_data": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id` or `init_data`.

**Response:**  
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "id": "string",
        "user": {
            "id": int,
            "first_name": "string",
            "username": "string",
            "language_code": "string",
            "is_premium": boolean,
            "avatar": "string || null"
        },
        "premium": {
            "have": boolean,
            "expires": "Number"
        },
        "balance": {
            "donate": "Number",
            "free": "Number"
        },
        "level": {
            "num": "Number",
            "xp": "Number",
            "min": "Number",
            "max": "Number"
        },        
        "rank": {
            "num": "Number",
            "name": "Number",
            "image": "string"
        },
        "game": {
            "inGame": boolean,
            "data": "Object"
        }
    }
}
```

---

## 2️⃣ **Update User Avatar**  
**[POST] `/api/v1/billiard/user/avatar`**  

**Request Body:**  
```json
{
    "user_id": "string",
    "avatar": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id` or `avatar`.  
- **101**: `User not found`: User not in the database.

**Response:**  
```json
{
    "status": "success",
    "code": 200
}
```

---

## 3️⃣ **Update User Language**  
**[POST] `/api/v1/billiard/user/language`**  

**Request Body:**  
```json
{
    "user_id": "string",
    "language": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id` or `language`.  
- **101**: `User not found`: User not in the database.

---

# 🤝 **Friend Handling**

## 1️⃣ **Get Friend List**  
**[POST] `/api/v1/billiard/friends/list`**  

**Request Body:**  
```json
{
    "user_id": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id`.

**Response:**  
```json
{
    "user_id": "string",
    "friends": [],
    "pedding": []
}
```

---

## 2️⃣ **Add Friend**  
**[POST] `/api/v1/billiard/friends/add`**  

**Request Body:**  
```json
{
    "user_id": "string",
    "friend_id": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id` or `friend_id`.  
- **101**: `Request already sent`: Friend request already sent.  
- **102**: `User already in friends`: User is already a friend.  
- **103**: `User not found`: Friend not found.  
- **104**: `Error send request`: Failed to send friend request.

**Response:**  
```json
{
    "user_id": "string",
    "friends": [],
    "pedding": []
}
```

---

## 3️⃣ **Delete Friend**  
**[POST] `/api/v1/billiard/friends/delete`**  

**Request Body:**  
```json
{
    "user_id": "string",
    "friend_id": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id` or `friend_id`.

**Response:**  
```json
{
    "user_id": "string",
    "friends": [],
    "pedding": []
}
```

---

## 4️⃣ **Invite Friend**  
**[POST] `/api/v1/billiard/friends/invite`**  

**Request Body:**  
```json
{
    "user_id": "string",
    "username": "string",
    "friend_id": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id`, `friend_id`, or `username`.  
- **101**: `Friend not found`: Friend not in the database.  
- **102**: `Error send request`: Failed to send friend request.

**Response:**  
```json
{
    "status": "success",
    "code": 200
}
```

---

## 5️⃣ **Search Friends**  
**[POST] `/api/v1/billiard/friends/search`**  

**Request Body:**  
```json
{
    "name": "string"
}
```

**Error Codes:**  
- **101**: `Incorrect body`: `name` field is missing.

**Response:**  
```json
{
    "status": "success",
    "code": 200,
    "data": [
        {
            "id": int,
            "first_name": "string",
            "username": "string",
            "language_code": "string",
            "is_premium": boolean,
            "avatar": "string || null"
        }
    ]
}
```

---

# 💬 **Message Handling**

## 1️⃣ **Get Messages**  
**[POST] `/api/v1/billiard/messages/list`**  

**Request Body:**  
```json
{
    "user_id": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id`.  
- **101**: `User not found`: User not in the database.  
- **102**: `User not found`: User not in the database. 

**Response:**  
```json
{
    "status": "success",
    "code": 200,
    "data": [
        {
            "id": "string",
            "name": "string",
            "avatar": "string",
            "preview": "string",
            "data": {
                "read": "boolean",
                "count": "number"
            },
            "messages": [
                {
                    "message_id": "string",
                    "name": "string",
                    "avatar": "string",
                    "content": "string",
                    "isMe": "boolean",
                    "date": "number"
                }
            ],
            "date_last_message": "number" || null
        }
    ]
}
```

---

## 2️⃣ **Send Message**  
**[POST] `/api/v1/billiard/messages/send`**  

**Request Body:**  
```json
{
    "user_id": "string",
    "friend_id": "string",
    "message": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id`, `friend_id`, or `message`.

**Response:**  
```json
{
    "status": "success",
    "code": 200
}
```

---

## 3️⃣ **Read Message**  
**[POST] `/api/v1/billiard/messages/read`**  

**Request Body:**  
```json
{
    "user_id": "string",
    "message_id": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id` or `message_id`.

**Response:**  
```json
{
    "status": "success",
    "code": 200
}
```

---

# 🧺 **Shop Handling**

## 1️⃣ **Get Shop List**  
**[POST] `/api/v1/billiard/shop/list`**  

**Request Body:**  
```json
{
    "user_id": "string"
}
```

**Error Codes:**  
- **100**: `Bad request`: Missing `user_id`.

**Response:**  
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "<категория>": [
            {
                "_id": "string",
                "id": number,
                "name": "string",
                "level": number,
                "category_id": number,
                "forPremium": boolean,
                "donate": boolean,
                "price": {
                    "coins": number,
                    "donate": boolean,
                    "rub": number,
                    "usd": number,
                    "stars": number
                },
                "image": "string (URL)",
                "characterization": {
                    "power": number,
                    "scope": number,
                    "spin": number
                },
                "items": [number],
                "words": ["string"],
                "advantages": ["string"],
                "period": number,
                "isBought": boolean,
                "isSelect": boolean
            }
        ]
    }
}
```

---

## 2️⃣ **Shop Buy Item**  
**[POST] `/api/v1/billiard/shop/item/buy`**  

**Request Body:**  
```json
{
    "user_id": "string",
    "item_id": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id` or `item_id`.  
- **101**: `User not found`: User not in the database.
- **404**: `Item not found`: Item not in the database.
- **400**: `Item already bought`: Item already bought in user.

**Response:**  
```json
{
    "status": "success",
    "code": 200
}
```

---

## 3️⃣ **Shop Select Item**  
**[POST] `/api/v1/billiard/shop/item/select`**  

**Request Body:**  
```json
{
    "user_id": "string",
    "item_id": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id` or `item_id`.  
- **404**: `Item not found`: Item not in the database.

**Response:**  
```json
{
    "status": "success",
    "code": 200
}
```

---

# 🎮 **Game Handling**

## 1️⃣ **Add Queue User**  
**[POST] `/api/v1/billiard/game/queue`**  

**Request Body:**  
```json
{
    "user_id": "string",
    "mode": "string",
    "bet": "string" || "Number"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id` or `mode`.

**Response:**  
```json
{
    "status": "success", 
    "code": 200
}
```

---

## 2️⃣ **AI Hit**
**[POST] `/api/v1/billiard/game/AI/hit`**

**Request Body:**  
```json
{
    "user_id": "string",
    "balls": "Object",
    "x": "Number",
    "y": "Number",
    "z": "Number"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id`, `balls`, `x`, `y`, or `z`.

**Response:**  
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "game": {
            "id": "Number",
        },
        "hit": {
            "x": "Number",
            "y": "Number",
            "z": "Number",
            "power": "Number"
        }
    }
}
```

---

## 3️⃣ **Game data**  
**[POST] `/api/v1/billiard/game/data`**  

**Request Body:**  
```json
{
    "user_id": "string",
    "game_id": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id` or `game_id`.
- **101**: `Game not found`: API not found game in database.

**Response:**  
```json
{
    "status": "success", 
    "code": 200,
    "data": { 
            "id",
            "players": [
                {
                    "id": "string",
                    "username": "string",
                    "avatar": "string",
                    "isPremium": "boolean",
                    "level": {
                        "num": "Number",
                        "xp": "Number",
                        "min": "Number",
                        "max": "Number"
                    },        
                    "rank": "Number",
                    "inventory": {
                        "cue": "string" || null,
                        "sticker": "string" || null
                    },
                }
            ],
            "game": {
                "mode": "string",
                "hitting_now": "string",
                "data": {
                    "balls": "Object",
                    "holes": "Object",
                    "white_ball": {
                        "x": "Number",
                        "y": "Number",
                        "z": "Number"
                    },
                    "scored_balls": "Object",
                },
                "date_start": "Number",
                "date_over": "Number" || null,
            }
    }
}
```

---

# 📦 **Boxes Handling**

## 1️⃣ **Get Boxes List**
**[POST] `/api/v1/billiard/boxes/list`**

**Request Body:**  
```json
{
    "user_id": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id`.

**Response:**  
```json
{
    "status": "success",
    "code": 200,
    "data": [
        {
            "_id": "string",
            "id": "number",
            "name": "string",
            "item": "number",
            "image": "string (URL)",
            "price": {
                "coins": "number",
                "donate": "boolean"
            },
            "forPremium": "boolean",
            "items": ["number"],
            "data": {
                "count": "number",
                "kd": "number"
            }
        }
    ]
}
```

---

## 2️⃣ **Open Box**
**[POST] `/api/v1/billiard/boxes/open`**

**Request Body:**  
```json
{
    "user_id": "string",
    "box_id": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id` or `box_id`.
- **404**: `Not found`: Box not found.
- **101**: `Box unavailable`: User dont have this box.
- **102**: `Box error`: Box contains no items.
- **103**: `Box error`: Selected item not found.
- **500**: `System error`: Internal server error.

**Response:**  
```json
{
    "status": "success",
    "code": 200,
    "data": [
        {
            "type": "string",
            "amount": "number",
            "image": "string"
        },
        {
            "type": "string",
            "amount": "number"
        },
        {
            "type": "string",
            "item_id": "number",
            "item": {
                "id": "number",
                "name": "string",
                "category_id": "number",
                "image": "string",
                "price": {
                    "coins": "number",
                    "donate": "Boolean"
                }
            }
        }
    ]
}
```

---

# 🧾 **Invoice Handling**

## 1️⃣ **Create Invoice**
**[POST] `/api/v1/billiard/invoice/create`**

**Request Body:**  
```json
{
    "user_id": "string",
    "method": "string",
    "item": {
        "item_id": "number",
        "category_id": "number"
    }
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id`, `method`, or `item`.  
- **101**: `Invalid method`: Only 2 methods allowed - `card` & `stars`.  
- **404**: `User or item not found`: User or item not found in database.
- **500**: `Error while creating invoice`: Systematic error.

**Response Method "Card":**  
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "id": "string",
        "amount": "number",
        "currency": "string",
        "url": "String (url)"
    }
}
```
**Response Method "Stars":**  
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "url": "string (url)"
    }
}
```

---

## 2️⃣ **Get Invoice Status**
**[GET] `/api/v1/billiard/invoice/status`**

**Request Body:**  
```json
{
    "user_id": "string",
    "order_id": "string"
}
```

**Error Codes:**  
- **400**: `Bad request`: Missing `user_id` or `order_id`.  
- **404**: `Invoice not found`: Invoice not in the database.
- **204**: `System error`: The error is specified in `message`.
- **205**: `System error`: Parse error.
- **206**: `System error`: Unknown response code.
- **207**: `Response error`: Connect Timeout.
- **208**: `Response or system error`: Unknown error.

### 💰 **Status Codes**  
| **Code** | **Status** |
|---------|-----------------|
| **200** | Invoice paid |
| **201** | Invoice in process |
| **202** | Invoice expired |
| **203** | Invoice hold |

**Response:**  
```json
{
    "status": "success",
    "code": 200,
    "data": {
        "id": "string",
        "amount": "number",
        "currency": "string",
        "status": "string"
    }
}
```
