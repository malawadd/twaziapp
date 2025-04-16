
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#a3e636',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid black',
          fontWeight: '800',
          fontSize: 16,
          fontFamily: 'monospace',
          color: 'black',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          style={{
            backgroundColor: 'white',
            padding: '2px',
            border: '2px solid black',
            boxShadow: '2px 2px 0 black',
            borderRadius: '2px',
          }}
        >
          <path d="M4 4h7v7H4z" />
          <path d="M9 9l11 11" />
          <path d="M15 15v5h5" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
