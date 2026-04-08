import Link from "next/link";
import { notFound } from "next/navigation";

const PRODUCTS: Record<
  string,
  { id: string; name: string; price: number; description: string }[]
> = {
  electronics: [
    {
      id: "laptop-1",
      name: "Pro Laptop",
      price: 1299,
      description: "High-performance computing device",
    },
    {
      id: "phone-1",
      name: "Smart Phone",
      price: 799,
      description: "Latest smartphone with 5G",
    },
    {
      id: "tablet-1",
      name: "Tablet Pro",
      price: 599,
      description: "Portable touch device",
    },
  ],
  clothing: [
    {
      id: "shirt-1",
      name: "Cotton T-Shirt",
      price: 29,
      description: "Comfortable everyday wear",
    },
    {
      id: "jeans-1",
      name: "Premium Jeans",
      price: 79,
      description: "Durable denim pants",
    },
    {
      id: "jacket-1",
      name: "Winter Jacket",
      price: 149,
      description: "Warm weather protection",
    },
  ],
  books: [
    {
      id: "book-1",
      name: "Web Dev Guide",
      price: 39,
      description: "Complete web development handbook",
    },
    {
      id: "book-2",
      name: "React Patterns",
      price: 45,
      description: "Advanced React patterns & practices",
    },
    {
      id: "book-3",
      name: "Next.js Mastery",
      price: 49,
      description: "Deep dive into Next.js framework",
    },
  ],
};

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const products = PRODUCTS[params.category];

  if (!products) {
    notFound();
  }

  const categoryName =
    params.category.charAt(0).toUpperCase() + params.category.slice(1);

  return (
    <section className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <Link href="/products" className="text-blue-700 hover:underline">
          ← Back to Products
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Category: {params.category}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          {categoryName}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Showing {products.length} items in this category
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${params.category}/${product.id}`}
            className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-400 hover:shadow-md"
          >
            <h3 className="font-semibold text-slate-900">{product.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{product.description}</p>
            <p className="mt-2 text-lg font-bold text-blue-700">
              ${product.price}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
