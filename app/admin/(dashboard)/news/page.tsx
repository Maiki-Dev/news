import { prisma } from "@/lib/prisma";
import NewsList from "@/components/admin/NewsList";

export const dynamic = "force-dynamic";

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
  return news;
}

export default async function NewsPage() {
  const news = await getNews();

  // Convert Date objects to strings for Client Component
  const formattedNews = news.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  return <NewsList news={formattedNews} />;
}
