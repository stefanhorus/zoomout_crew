import { NextRequest, NextResponse } from 'next/server';

const MUX_VIDEO_ID = 'rPkrPLnjqozMsmWc0202RmP6vsJMmPRTh400013oNIpBxVo';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'mp4';
    
    let muxUrl: string;
    if (format === 'hls') {
      muxUrl = `https://stream.mux.com/${MUX_VIDEO_ID}.m3u8`;
    } else {
      muxUrl = `https://stream.mux.com/${MUX_VIDEO_ID}.mp4`;
    }

    // Fetch video de la Mux
    const response = await fetch(muxUrl, {
      headers: {
        'Accept': format === 'hls' ? 'application/vnd.apple.mpegurl' : 'video/mp4',
      },
    });

    if (!response.ok) {
      return new NextResponse('Video not found', { status: 404 });
    }

    // Returnează video-ul cu headers corecte
    const videoBuffer = await response.arrayBuffer();
    
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': format === 'hls' ? 'application/vnd.apple.mpegurl' : 'video/mp4',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });
  } catch (error) {
    console.error('Error proxying video:', error);
    return new NextResponse('Error loading video', { status: 500 });
  }
}

