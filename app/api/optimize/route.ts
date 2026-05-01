import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Use sharp to optimize and convert to webp
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toBuffer();

    return new NextResponse(optimizedBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Content-Length': optimizedBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Optimization error:', error);
    return NextResponse.json({ error: 'Failed to optimize image' }, { status: 500 });
  }
}
