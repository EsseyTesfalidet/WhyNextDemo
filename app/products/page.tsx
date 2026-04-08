import Link from "next/link";

const CATEGORIES = [
  { slug: "electronics", name: "Electronics", count: 12 },
  { slug: "clothing", name: "Clothing", count: 8 },
  { slug: "books", name: "Books", count: 24 },
];

export default function ProductsPage() {
  return (
    <section className="w-full rounded-2xl border border-slate-300 bg-white p-6 shadow-sm xl:min-h-[42rem]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Nested Dynamic Routes
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Products Catalog
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          In React Router, you'd need to configure nested routes in a JS config.
          In Next.js, the folder structure{" "}
          <code className="inline bg-slate-100 px-2 py-1">
            /products/[category]/[id]
          </code>{" "}
          automatically creates these routes.
        </p>
      </div>

      <div className="space-y-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products/${cat.slug}`}
            className="block rounded-lg border border-slate-200 p-4 transition hover:border-blue-400 hover:bg-blue-50"
          >
            <h3 className="font-semibold text-slate-900">{cat.name}</h3>
            <p className="text-sm text-slate-500">{cat.count} products</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-2 rounded-lg bg-amber-50 p-4 text-sm">
        <p className="font-semibold text-amber-900">
          Why Next.js Routing Wins:
        </p>
        <ul className="list-inside space-y-1 text-amber-800">
          <li>✓ File structure = URL structure (no config files)</li>
          <li>✓ Nested folders = nested routes automatically</li>
          <li>✓ TypeScript params validation built-in</li>
          <li>✓ Dynamic segments [category] are type-safe</li>
        </ul>
      </div>
    </section>
  );
}
