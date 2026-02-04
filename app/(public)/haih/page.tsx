import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Search as SearchIcon } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{
    q: string;
  }>;
}

export const dynamic = "force-dynamic";

async function searchNews(query: string) {
  if (!query) return [];
  
  return await prisma.news.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || "";
  const results = await searchNews(query);

  return (
    <div className="space-y-8">
      <div className="border-b pb-8">
        <h1 className="text-3xl font-bold mb-4">Хайлтын үр дүн</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <SearchIcon className="h-5 w-5" />
          <span>
            &quot;{query}&quot; түлхүүр үгээр {results.length} мэдээ олдлоо.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((news) => (
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
        {results.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Таны хайсан илэрц олдсонгүй.
          </div>
        )}
      </div>
    </div>
  );
}
