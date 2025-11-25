import { NextRequest, NextResponse } from 'next/server';

const MUX_PLAYBACK_ID = 'rPkrPLnjqozMsmWc0202RmP6vsJMmPRTh400013oNIpBxVo';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'mp4';
    
    let muxUrl: string;
    if (format === 'hls') {
      muxUrl = `https://stream.mux.com/${MUX_PLAYBACK_ID}.m3u8`;
    } else {
      muxUrl = `https://stream.mux.com/${MUX_PLAYBACK_ID}.mp4`;
    }

    // Fetch video de la Mux cu streaming
    const response = await fetch(muxUrl, {
      headers: {
        'Accept': format === 'hls' ? 'application/vnd.apple.mpegurl' : 'video/mp4',
        'Range': request.headers.get('range') || undefined,
      },
    });

    if (!response.ok) {
      console.error(`Mux video fetch failed: ${response.status} ${response.statusText}`);
      return new NextResponse('Video not found', { status: response.status });
    }

    // Get content type from Mux response
    const contentType = response.headers.get('content-type') || 
      (format === 'hls' ? 'application/vnd.apple.mpegurl' : 'video/mp4');

    // Get content length for range requests
    const contentLength = response.headers.get('content-length');
    const contentRange = response.headers.get('content-range');

    // Stream video-ul în loc să-l încărcăm complet în memorie
    const videoStream = response.body;
    
    if (!videoStream) {
      return new NextResponse('No video stream', { status: 500 });
    }

    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
    });

    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }
    if (contentRange) {
      headers.set('Content-Range', contentRange);
    }

    // Support for range requests (important for video streaming)
    const range = request.headers.get('range');
    if (range) {
      headers.set('Accept-Ranges', 'bytes');
    }

    return new NextResponse(videoStream, {
      status: range ? 206 : 200,
      headers,
    });
  } catch (error) {
    console.error('Error proxying video:', error);
    return new NextResponse('Error loading video', { status: 500 });
  }
}

