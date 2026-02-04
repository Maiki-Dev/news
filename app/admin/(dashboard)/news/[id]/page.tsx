import { prisma } from "@/lib/prisma";
import NewsForm from "@/components/admin/NewsForm";
import { notFound } from "next/navigation";

interface EditNewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

async function getNews(id: string) {
  const news = await prisma.news.findUnique({
    where: { id },
  });
  return news;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return categories;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params;
  const [news, categories] = await Promise.all([
    getNews(id),
    getCategories(),
  ]);

  if (!news) {
    notFound();
  }

  return <NewsForm initialData={news} categories={categories} />;
}
