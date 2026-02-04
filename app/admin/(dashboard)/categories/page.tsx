import { prisma } from "@/lib/prisma";
import CategoryList from "@/components/admin/CategoryList";

export const dynamic = "force-dynamic";

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { news: true },
      },
    },
  });
  return categories;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return <CategoryList categories={categories} />;
}
