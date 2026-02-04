import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import type { Prisma } from "@prisma/client";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

async function getCategory(slug: string) {
  return await prisma.category.findUnique({
    where: { slug },
  });
}

type NewsWithCategory = Prisma.NewsGetPayload<{ include: { category: true } }>;

async function getNewsByCategory(categoryId: string) {
  return await prisma.news.findMany({
    where: { categoryId, published: true },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const newsList: NewsWithCategory[] = await getNewsByCategory(category.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <span className="text-muted-foreground">{newsList.length} мэдээ</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsList.map((news) => (
          <Link key={news.id} href={`/medee/${news.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow group">
              <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                {news.coverImage ? (
                  <Image
                    src={news.coverImage}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Зураггүй
                  </div>
                )}
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {news.category.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(news.createdAt), "yyyy-MM-dd")}
                  </span>
                </div>
                <h3 className="font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {news.title}
                </h3>
              </CardHeader>
            </Card>
          </Link>
        ))}
        {newsList.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Энэ ангилалд мэдээ байхгүй байна.
          </div>
        )}
      </div>
    </div>
  );
}
