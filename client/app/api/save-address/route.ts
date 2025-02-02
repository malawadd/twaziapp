import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const { address } = await req.json();

  const cookie = serialize('walletAddress', address || '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: address ? 60 * 60 * 24 : 0,
  });

  const response = NextResponse.json({ message: address ? 'Address saved!' : 'Address cleared!' });
  response.headers.set('Set-Cookie', cookie);
  return response;
}
