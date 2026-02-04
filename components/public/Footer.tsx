import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">NEWS.MN</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Монголын болон дэлхий дахины мэдээ мэдээллийг цаг алдалгүй хүргэх мэдээллийн вэб сайт.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Холбоос</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-blue-600">Нүүр хуудас</Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-blue-600">Админ нэвтрэх</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Холбоо барих</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>Улаанбаатар хот, Монгол улс</li>
              <li>info@news.mn</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} News.mn. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </div>
    </footer>
  );
}
