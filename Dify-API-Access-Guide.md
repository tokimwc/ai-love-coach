# Dify API Access Guide

This document provides a detailed guide on how to access and use Dify’s API for advanced chat applications, including authentication, chat interactions, file uploads, feedback mechanisms, and more.

## Overview
Dify's chat API supports session persistence, allowing applications to maintain conversation history for continuity. This is ideal for building chatbots or customer service tools.

---

## Base URL
```bash
https://api.dify.ai/v1
```

---

## Authentication
- **Method**: API-Key Authentication  
- **Recommendation**: Store the API key on the **server-side** to prevent leakage.  
- **Usage**: Include the API key in the `Authorization` header.

**Header Example:**
```bash
Authorization: Bearer {API_KEY}
```

---

## **POST** `/chat-messages` - Send Chat Message

Send a chat message to the application.

### **Request Body Parameters**
| Name             | Type    | Description                                                                                      |
|------------------|---------|--------------------------------------------------------------------------------------------------|
| `query`          | string  | User input or question content.                                                                  |
| `inputs`         | object  | Variable values defined by the app. Contains key-value pairs for app-specific variables. Default `{}`. |
| `response_mode`  | string  | Supports two modes: `streaming` (recommended) and `blocking`.                                     |
| `user`           | string  | Unique user identifier defined by the developer.                                                 |
| `conversation_id`| string  | To continue an existing conversation, pass the previous conversation ID.                         |
| `files`          | array   | List of files (images) with the following attributes:                                            |
|                  |         | - `type`: Supported type is `image`.                                                              |
|                  |         | - `transfer_method`: `remote_url` for URLs, `local_file` for uploads.                             |
|                  |         | - `url`: Image URL if `remote_url` is used.                                                      |
|                  |         | - `upload_file_id`: File ID if uploaded via the File Upload API.                                  |
| `auto_generate_name` | bool | Auto-generate title. Default is `true`.                                                          |

---

### **Response Types**
1. **Blocking Mode**  
   Returns a `CompletionResponse` object in JSON format.
   
   **Example Response:**
   ```json
   {
     "message_id": "9da23599-e713-473b-982c-4328d4f5c78a",
     "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2",
     "mode": "chat",
     "answer": "The iPhone 13 Pro Max specs are listed here:...",
     "metadata": { 
       "usage": {
         "prompt_tokens": 1033,
         "total_tokens": 1161,
         "total_price": "0.0012890",
         "currency": "USD"
       }
     },
     "created_at": 1705407629
   }
   ```

2. **Streaming Mode**  
   Data is returned in **chunks** through `text/event-stream`. Each chunk starts with `data:` followed by a JSON payload.

   **Streaming Example:**
   ```bash
   data: {"event": "message", "message_id": "663c5084-a254-4040-8ad3-51f2a3c1a77c", "answer": "Hi", "created_at": 1705398420}
   ```

---

## **POST** `/files/upload` - File Upload

Uploads an image file for use in chat interactions.

### **Request Parameters**
- **Content Type**: `multipart/form-data`

| Name  | Type  | Description                                      |
|-------|-------|--------------------------------------------------|
| `file`| File  | The image to upload. Supported formats: PNG, JPG, JPEG, WEBP, GIF. |
| `user`| string| Unique user identifier defined by the developer. |

**Curl Example:**
```bash
curl -X POST 'https://api.dify.ai/v1/files/upload' \
--header 'Authorization: Bearer {API_KEY}' \
--form 'file=@localfile;type=image/png' \
--form 'user=abc-123'
```

**Response Example:**
```json
{
  "id": "72fa9618-8f89-4a37-9b33-7e1178a24a67",
  "name": "example.png",
  "size": 1024,
  "extension": "png",
  "mime_type": "image/png",
  "created_by": "6ad1ab0a-73ff-4ac1-b9e4-cdb312f71f13",
  "created_at": 1577836800
}
```

---

## **POST** `/chat-messages/:task_id/stop` - Stop Message Generation

This endpoint is used to **stop streaming** a message.

### **Path Parameters**
| Name    | Type   | Description                            |
|---------|--------|----------------------------------------|
| `task_id` | string | Task ID obtained from the streaming response. |

**Request Example:**
```bash
curl -X POST 'https://api.dify.ai/v1/chat-messages/:task_id/stop' \
--header 'Authorization: Bearer {API_KEY}' \
--header 'Content-Type: application/json' \
--data-raw '{"user": "abc-123"}'
```

**Response Example:**
```json
{
  "result": "success"
}
```

---

## **POST** `/messages/:message_id/feedbacks` - Message Feedback

End-users can provide **feedback** on responses to improve results.

### **Path Parameters**
| Name        | Type   | Description |
|-------------|--------|-------------|
| `message_id`| string | Unique ID of the message. |

### **Request Body**
| Name  | Type   | Description                          |
|-------|--------|--------------------------------------|
| `rating` | string | Use `like` for upvote, `dislike` for downvote, `null` to revoke. |
| `user`   | string | Unique user identifier.            |

**Curl Example:**
```bash
curl -X POST 'https://api.dify.ai/v1/messages/:message_id/feedbacks' \
--header 'Authorization: Bearer {API_KEY}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "rating": "like",
  "user": "abc-123"
}'
```

**Response Example:**
```json
{
  "result": "success"
}
```

---

## **GET** `/messages/{message_id}/suggested` - Next Suggested Questions

Retrieve **next suggested questions** based on the current message.

### **Path Parameters**
| Name        | Type   | Description           |
|-------------|--------|-----------------------|
| `message_id`| string | The message ID.       |

### **Query Parameters**
| Name  | Type   | Description                          |
|-------|--------|--------------------------------------|
| `user`| string | Unique user identifier.              |

**Request Example:**
```bash
curl --location --request GET 'https://api.dify.ai/v1/messages/{message_id}/suggested?user=abc-123' \
--header 'Authorization: Bearer {API_KEY}' \
--header 'Content-Type: application/json'
```

**Response Example:**
```json
{
  "result": "success",
  "data": [
    "What is the camera resolution?",
    "Does it support 5G?",
    "How long does the battery last?"
  ]
}
```

---

## **GET** `/messages` - Get Conversation History Messages

Fetch chat history in **reverse chronological order** (latest messages first).

### **Query Parameters**
| Name            | Type   | Description                              |
|-----------------|--------|------------------------------------------|
| `conversation_id` | string | Conversation ID.                       |
| `user`          | string | Unique user identifier.                  |
| `first_id`      | string | The first message ID on the current page. Default: `null`. |
| `limit`         | int    | Number of messages to return. Default: `20`. |

**Request Example:**
```bash
curl -X GET 'https://api.dify.ai/v1/messages?user=abc-123&conversation_id=45701982' \
--header 'Authorization: Bearer {API_KEY}'
```

**Response Example:**
```json
{
  "limit": 20,
  "has_more": false,
  "data": [
    {
      "id": "a076a87f-31e5-48dc-b452-0061adbbc922",
      "conversation_id": "cd78daf6-f9e4-4463-9ff2-54257230a0ce",
      "query": "What are the specs of the iPhone 13 Pro?",
      "answer": "The iPhone 13 Pro has a 6.1-inch display...",
      "created_at": 1705569239,
      "feedback": null,
      "retriever_resources": [
        {
          "dataset_name": "iPhone",
          "content": "The iPhone 13 Pro Max was released..."
        }
      ]
    }
  ]
}
```

---

## **GET** `/conversations` - Get Conversations

Retrieve the **list of conversations** for a specific user.

### **Query Parameters**
| Name      | Type   | Description                                   |
|-----------|--------|-----------------------------------------------|
| `user`    | string | Unique user identifier.                       |
| `last_id` | string | ID of the last record on the current page. Default: `null`. |
| `limit`   | int    | Number of conversations to return. Default: `20`. |
| `pinned`  | bool   | Set to `true` to return only pinned conversations. |

**Request Example:**
```bash
curl -X GET 'https://api.dify.ai/v1/conversations?user=abc-123&limit=20' \
--header 'Authorization: Bearer {API_KEY}'
```

**Response Example:**
```json
{
  "limit": 20,
  "has_more": false,
  "data": [
    {
      "id": "10799fb8-64f7-4296-bbf7-b42bfbe0ae54",
      "name": "New chat",
      "inputs": {
        "book": "book",
        "myName": "Lucy"
      },
      "created_at": 1679667915
    }
  ]
}
```

---

## **DELETE** `/conversations/:conversation_id` - Delete Conversation

Deletes a specific conversation by ID.

### **Path Parameters**
| Name             | Type   | Description            |
|------------------|--------|------------------------|
| `conversation_id`| string | ID of the conversation |

**Request Example:**
```bash
curl -X DELETE 'https://api.dify.ai/v1/conversations/:conversation_id' \
--header 'Authorization: Bearer {API_KEY}' \
--header 'Content-Type: application/json' \
--data-raw '{ 
 "user": "abc-123"
}'
```

**Response Example:**
```json
{
  "result": "success"
}
```

---

## **POST** `/conversations/:conversation_id/name` - Rename Conversation

Rename a conversation or let the system generate a name automatically.

### **Request Body Parameters**
| Name           | Type   | Description                                       |
|----------------|--------|---------------------------------------------------|
| `name`         | string | New conversation name. Omit if `auto_generate` is true. |
| `auto_generate`| bool   | Automatically generate the name if set to `true`. Default: `false`. |
| `user`         | string | Unique user identifier.                           |

**Request Example:**
```bash
curl -X POST 'https://api.dify.ai/v1/conversations/:conversation_id/name' \
--header 'Authorization: Bearer {API_KEY}' \
--header 'Content-Type: application/json' \
--data-raw '{ 
 "name": "Tech Talk",
 "user": "abc-123"
}'
```

**Response Example:**
```json
{
  "id": "cd78daf6-f9e4-4463-9ff2-54257230a0ce",
  "name": "Tech Talk",
  "created_at": 1705569238
}
```

---

## **POST** `/audio-to-text` - Speech to Text

Converts audio files into text. Supports several common audio formats.

### **Request Parameters**
| Name  | Type   | Description                                               |
|-------|--------|-----------------------------------------------------------|
| `file`| file   | Audio file to convert (e.g., mp3, mp4, wav). Max 15MB size. |
| `user`| string | Unique user identifier.                                    |

**Request Example:**
```bash
curl -X POST 'https://api.dify.ai/v1/audio-to-text' \
--header 'Authorization: Bearer {API_KEY}' \
--form 'file=@localfile;type=audio/mp3' \
--form 'user=abc-123'
```

**Response Example:**
```json
{
  "text": "Hello, this is the converted text."
}
```

---

## **POST** `/text-to-audio` - Text to Audio

Converts text to audio. You can provide either a `message_id` or raw text content.

### **Request Body Parameters**
| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| `message_id`| string | The message ID for text-to-speech conversion.    |
| `text`      | string | The text to convert to speech.                   |
| `user`      | string | Unique user identifier.                          |

**Request Example:**
```bash
curl -o text-to-audio.mp3 -X POST 'https://api.dify.ai/v1/text-to-audio' \
--header 'Authorization: Bearer {API_KEY}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "message_id": "5ad4cb98-f0c7-4085-b384-88c403be6290",
    "text": "Hello Dify",
    "user": "abc-123"
}'
```

**Response Headers Example:**
```bash
Content-Type: audio/wav
```

---

## **GET** `/parameters` - Get Application Information

Fetch application configuration details, including input parameters and supported features.

### **Query Parameters**
| Name  | Type   | Description                          |
|-------|--------|--------------------------------------|
| `user`| string | Unique user identifier.              |

**Request Example:**
```bash
curl -X GET 'https://api.dify.ai/v1/parameters?user=abc-123'
```

**Response Example:**
```json
{
  "opening_statement": "Hello!",
  "suggested_questions_after_answer": {
      "enabled": true
  },
  "speech_to_text": {
      "enabled": true
  },
  "file_upload": {
      "image": {
          "enabled": false,
          "number_limits": 3
      }
  },
  "system_parameters": {
      "image_file_size_limit": "10"
  }
}
```

---

## **GET** `/meta` - Get Application Meta Information

Retrieve icons of tools used in the application.

### **Query Parameters**
| Name  | Type   | Description                          |
|-------|--------|--------------------------------------|
| `user`| string | Unique user identifier.              |

**Request Example:**
```bash
curl -X GET 'https://api.dify.ai/v1/meta?user=abc-123' \
--header 'Authorization: Bearer {API_KEY}'
```

**Response Example:**
```json
{
  "tool_icons": {
    "dalle2": "https://cloud.dify.ai/console/api/workspaces/current/tool-provider/builtin/dalle/icon",
    "api_tool": {
        "background": "#252525",
        "content": "😁"
    }
  }
}
```
