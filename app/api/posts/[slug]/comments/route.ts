// app/api/posts/[slug]/comments/route.ts
import { NextResponse } from 'next/server';


export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { author, content } = body;

    if (!author || !content) {
      return NextResponse.json(
        { error: 'نام و متن دیدگاه الزامی است.' },
        { status: 400 }
      );
    }


  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت دیدگاه در دیتابیس' },
      { status: 500 }
    );
  }
}
