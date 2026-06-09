import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: decodeURIComponent(key),
    })
    const response = await s3.send(command)
    const bytes = await response.Body?.transformToByteArray()
    if (!bytes) return NextResponse.json({ error: 'not found' }, { status: 404 })

    // Normaliza para um Uint8Array respaldado por ArrayBuffer (não SharedArrayBuffer),
    // que é o que BodyInit aceita.
    const body = new Uint8Array(bytes)

    return new NextResponse(body, {
      headers: {
        'Content-Type': response.ContentType ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: 'failed to fetch from R2' }, { status: 500 })
  }
}
