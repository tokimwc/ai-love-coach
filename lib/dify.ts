import axios from 'axios';

const DIFY_API_KEY = process.env.NEXT_PUBLIC_DIFY_API_KEY;
const DIFY_API_URL = 'https://api.dify.ai/v1';

export const difyClient = axios.create({
  baseURL: DIFY_API_URL,
  headers: {
    'Authorization': `Bearer ${DIFY_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const sendMessage = async (message: string, userProfile: any) => {
  try {
    const response = await difyClient.post('/chat-messages', {
      query: message,
      user: userProfile.id,
      inputs: {
        name: userProfile.name,
        age: userProfile.age,
        gender: userProfile.gender,
        bio: userProfile.bio,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message to Dify:', error);
    throw error;
  }
};