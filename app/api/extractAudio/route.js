import { NextResponse } from 'next/server';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Save the uploaded file to a temporary location
    const tempFilePath = path.join('/tmp', file.name);
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer));

    // Define the path for the extracted audio
    const audioPath = tempFilePath.replace('.mp4', '.mp3');

    // Extract audio using ffmpeg
    return new Promise((resolve, reject) => {
      ffmpeg(tempFilePath)
        .output(audioPath)
        .on('end', () => {
          resolve(
            NextResponse.json({
              audioPath,
            })
          );
        })
        .on('error', (err) => {
          console.error('Error extracting audio:', err);
          reject(
            NextResponse.json(
              { error: 'Failed to extract audio' },
              { status: 500 }
            )
          );
        })
        .run();
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
