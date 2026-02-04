import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export const revalidate = 60; // Revalidate every minute

type LatestNewsItem = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  createdAt: Date;
  category: {
    name: string;
  };
};

async function getFeaturedNews() {
  return await prisma.news.findFirst({
    where: { published: true, coverImage: { not: null } },
    orderBy: { createdAt: "desc" },
    include: { category: true, author: true },
  });
}

async function getLatestNews(excludeId?: string): Promise<LatestNewsItem[]> {
  return (await prisma.news.findMany({
    where: { 
      published: true,
      id: excludeId ? { not: excludeId } : undefined 
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { category: true, author: true },
  })) as LatestNewsItem[];
}

export default async function HomePage() {
  const featuredNews = await getFeaturedNews();
  const latestNews: LatestNewsItem[] = await getLatestNews(featuredNews?.id);

  return (
    <div className="space-y-12">
      {/* Featured News */}
      {featuredNews && (
        <section>
          <Link href={`/medee/${featuredNews.slug}`}>
            <div className="relative rounded-xl overflow-hidden aspect-[2/1] md:aspect-[2.5/1] group cursor-pointer">
              {featuredNews.coverImage && (
                <Image
                  src={featuredNews.coverImage}
                  alt={featuredNews.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full md:w-2/3">
                <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">
                  {featuredNews.category.name}
                </Badge>
                <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4 group-hover:text-blue-200 transition-colors">
                  {featuredNews.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span>{format(new Date(featuredNews.createdAt), "yyyy-MM-dd")}</span>
                  {featuredNews.author?.name && (
                    <>
                      <span>•</span>
                      <span>{featuredNews.author.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Latest News Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6 pl-4 border-l-4 border-blue-600">
          Шинэ мэдээ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map((news) => (
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
                      {format(new Date(news.createdAt), "MM/dd")}
                    </span>
                  </div>
                  <h3 className="font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h3>
                </CardHeader>
              </Card>
            </Link>
          ))}
          {latestNews.length === 0 && !featuredNews && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Мэдээ одоогоор байхгүй байна.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
