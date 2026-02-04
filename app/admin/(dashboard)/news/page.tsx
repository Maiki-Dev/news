import { prisma } from "@/lib/prisma";
import NewsList from "@/components/admin/NewsList";

export const dynamic = "force-dynamic";

type AdminNewsItem = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: {
    name: string;
  };
  author: {
    name: string | null;
  };
};

async function getNews() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      author: {
        select: { name: true },
      },
    },
  });
  return news as AdminNewsItem[];
}

export default async function NewsPage() {
  const news: AdminNewsItem[] = await getNews();

  // Convert Date objects to strings for Client Component
  const formattedNews = news.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  return <NewsList news={formattedNews} />;
}
