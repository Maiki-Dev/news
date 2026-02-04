import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Metadata } from "next";

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

async function getNews(slug: string) {
  return await prisma.news.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
    },
  });
}

async function getRelatedNews(categoryId: string, currentNewsId: string) {
  return await prisma.news.findMany({
    where: {
      categoryId,
      published: true,
      id: { not: currentNewsId },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { category: true },
  });
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNews(slug);
  
  if (!news) {
    return {
      title: "Мэдээ олдсонгүй",
    };
  }

  return {
    title: news.title,
    description: news.content.substring(0, 160).replace(/<[^>]*>/g, ""),
    openGraph: {
      title: news.title,
      description: news.content.substring(0, 160).replace(/<[^>]*>/g, ""),
      images: news.coverImage ? [news.coverImage] : [],
      type: "article",
      publishedTime: news.createdAt.toISOString(),
      authors: news.author?.name ? [news.author.name] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news || !news.published) {
    notFound();
  }

  const relatedNews = await getRelatedNews(news.categoryId, news.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <article className="lg:col-span-2 space-y-8">
        <div className="space-y-4">
          <Badge className="bg-blue-600 hover:bg-blue-700">
            {news.category.name}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {news.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-4">
            <span>{format(new Date(news.createdAt), "yyyy-MM-dd HH:mm")}</span>
            {news.author?.name && (
              <>
                <span>•</span>
                <span>{news.author.name}</span>
              </>
            )}
          </div>
        </div>

        {news.coverImage && (
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src={news.coverImage}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </article>

      <aside className="space-y-8">
        <div>
          <h3 className="text-xl font-bold mb-6 pb-2 border-b">
            Холбоотой мэдээ
          </h3>
          <div className="flex flex-col gap-6">
            {relatedNews.map((item) => (
              <Link key={item.id} href={`/medee/${item.slug}`} className="group">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {item.coverImage && (
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <h4 className="font-semibold line-clamp-3 text-sm group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.createdAt), "yyyy-MM-dd")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {relatedNews.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Холбоотой мэдээ олдсонгүй.
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
