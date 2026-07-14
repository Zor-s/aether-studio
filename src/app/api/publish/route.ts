import { NextResponse } from 'next/server';
import { compileLayout } from '@/lib/compiler';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { elements, pageSettings } = body;

    if (!elements || !Array.isArray(elements)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid request: "elements" list is missing or invalid.',
            code: 'INVALID_ELEMENTS',
          },
        },
        { status: 400 }
      );
    }

    if (!pageSettings) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid request: "pageSettings" is missing or invalid.',
            code: 'INVALID_SETTINGS',
          },
        },
        { status: 400 }
      );
    }

    const html = compileLayout(elements, pageSettings);

    return NextResponse.json({
      success: true,
      data: {
        html,
        sizeBytes: Buffer.byteLength(html, 'utf8'),
        timestamp: Date.now(),
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to compile page layout';
    return NextResponse.json(
      {
        success: false,
        error: {
          message: errorMessage,
          code: 'COMPILATION_FAILED',
        },
      },
      { status: 500 }
    );
  }
}
