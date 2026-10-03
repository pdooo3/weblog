// app/api/posts/[slug]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';

// تعداد لایک‌ها
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
}

// ثبت لایک
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return NextResponse.json({ error: 'visitorId الزامی است' }, { status: 400 });
}


