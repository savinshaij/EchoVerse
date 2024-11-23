import { createClient } from "@deepgram/sdk";
import { NextResponse } from 'next/server';
// const api = process.env.DEEPGRAM_API_KEY
const deepgramSDK = createClient("3f35239995a88778e599aac7c06bb7e2c19c184f");



export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
   
    if (!file) {
      console.error("No file provided in the request.");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }
    console.log("Processing file upload...");
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("Received file buffer:", buffer.length, "bytes");

    const { result, error } = await deepgramSDK.listen.prerecorded.transcribeFile(
      buffer,
      { model: "nova-2", smart_format: true }
    );

    if (error) {
      console.error("Deepgram Error:", error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log("Transcription result:", result);

    // Extracting transcription text from result
    const transcription = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;

    if (!transcription) {
      console.error("No transcripts found in the result.");
      return NextResponse.json(
        { error: "No transcription results available." },
        { status: 500 }
      );
    }

    console.log("Extracted transcription:", transcription);

    return NextResponse.json(
      { transcription },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json(
      { error: "Failed to transcribe the audio." },
      { status: 500 }
    );
  }
}