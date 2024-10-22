import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const userProfile = await request.json()

  try {
    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `ユーザーのプロフィール情報: 名前=${userProfile.name}, 年齢=${userProfile.age}, 性別=${userProfile.gender}, 自己紹介=${userProfile.bio}`,
        user: 'unique_user_id', // 必要に応じてユーザー識別子を設定
        inputs: {
            user_profile: JSON.stringify(userProfile) // ここがミソ！
        }
      })
    });

    if (!response.ok) {
      throw new Error('Dify APIへのリクエストが失敗しました。');
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Dify API送信エラー:', error);
    return NextResponse.json({ success: false, message: 'Dify APIへの送信に失敗しました。' }, { status: 500 });
  }
}
