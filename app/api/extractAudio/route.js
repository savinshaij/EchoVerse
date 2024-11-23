import { NextResponse } from 'next/server';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export async function POST(req) {
  try {
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;

    // Initialize FFmpeg WASM
    const ffmpeg = createFFmpeg({ log: true });

    // Load FFmpeg core
    try {
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }
    } catch (loadError) {
      console.error('Error loading FFmpeg:', loadError);
      return NextResponse.json(
        { error: 'Failed to load FFmpeg library.' },
        { status: 500 }
      );
    }

    // Write file to FFmpeg's virtual filesystem
    try {
      ffmpeg.FS('writeFile', fileName, await fetchFile(fileBuffer));
    } catch (fsError) {
      console.error('Error writing file to virtual FS:', fsError);
      return NextResponse.json(
        { error: 'Failed to write file to virtual filesystem.' },
        { status: 500 }
      );
    }

    // Define output filename
    const outputFileName = fileName.replace(/\.[^/.]+$/, '.mp3');

    // Run FFmpeg command to extract audio
    try {
      await ffmpeg.run('-i', fileName, outputFileName);
    } catch (runError) {
      console.error('Error during FFmpeg processing:', runError);
      return NextResponse.json(
        { error: 'Failed to process video file.' },
        { status: 500 }
      );
    }

    // Read the output audio file
    let data;
    try {
      data = ffmpeg.FS('readFile', outputFileName);
    } catch (readError) {
      console.error('Error reading output file:', readError);
      return NextResponse.json(
        { error: 'Failed to read output file.' },
        { status: 500 }
      );
    }

    // Convert the Uint8Array to a buffer
    const audioBuffer = Buffer.from(data);

    // Respond with the audio file as a base64 encoded string
    const audioBase64 = audioBuffer.toString('base64');
    return NextResponse.json(
      { audio: audioBase64, format: 'mp3' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during processing.' },
      { status: 500 }
    );
  }
}
