import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";

const newsSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  categoryId: z.string().min(1),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await prisma.news.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!news) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, content, categoryId, coverImage, published } = newsSchema.parse(body);

    // If title changed, update slug
    const currentNews = await prisma.news.findUnique({ where: { id } });
    let slug = currentNews?.slug;

    if (currentNews?.title !== title) {
      slug = slugify(title, { lower: true, strict: true });
      let uniqueSlug = slug;
      let count = 1;
      while (await prisma.news.findFirst({ where: { slug: uniqueSlug, NOT: { id } } })) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      }
      slug = uniqueSlug;
    }

    const news = await prisma.news.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        categoryId,
        coverImage,
        published,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
