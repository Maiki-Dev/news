import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { Prisma } from "@prisma/client";

const newsSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  categoryId: z.string().min(1),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const published = searchParams.get("published");

  try {
    const whereClause: Prisma.NewsWhereInput = {};
    if (categoryId) whereClause.categoryId = categoryId;
    if (published) whereClause.published = published === "true";

    const news = await prisma.news.findMany({
      where: whereClause,
      include: {
        category: true,
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(news);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, categoryId, coverImage, published } = newsSchema.parse(body);

    let slug = slugify(title, { lower: true, strict: true });
    
    // Check for unique slug
    let uniqueSlug = slug;
    let count = 1;
    while (await prisma.news.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }
    slug = uniqueSlug;

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        categoryId,
        coverImage,
        published,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
}
