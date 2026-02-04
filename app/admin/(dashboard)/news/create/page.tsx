import { prisma } from "@/lib/prisma";
import NewsForm from "@/components/admin/NewsForm";

export const dynamic = "force-dynamic";

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return categories;
}

export default async function CreateNewsPage() {
  const categories = await getCategories();

  return <NewsForm categories={categories} />;
}
