import Link from "next/link";
import { notFound } from "next/navigation";

const PRODUCTS: Record<
  string,
  Record<
    string,
    { name: string; price: number; description: string; details: string[] }
  >
> = {
  electronics: {
    "laptop-1": {
      name: "Pro Laptop",
      price: 1299,
      description: "High-performance computing device",
      details: [
        "16GB RAM",
        "512GB SSD",
        "Intel i7 Processor",
        "Ultra-thin design",
        "15-hour battery",
      ],
    },
    "phone-1": {
      name: "Smart Phone",
      price: 799,
      description: "Latest smartphone with 5G",
      details: [
        '6.7" AMOLED Display',
        "5G Connectivity",
        "48MP Camera",
        "120Hz Refresh",
        "All-day battery",
      ],
    },
    "tablet-1": {
      name: "Tablet Pro",
      price: 599,
      description: "Portable touch device",
      details: [
        '11" Liquid Retina Display',
        "M1 Chip",
        "Apple Pencil Support",
        "All-day battery",
        "Lightweight",
      ],
    },
  },
  clothing: {
    "shirt-1": {
      name: "Cotton T-Shirt",
      price: 29,
      description: "Comfortable everyday wear",
      details: [
        "100% Organic Cotton",
        "Available in 5 colors",
        "Machine washable",
        "Soft textile",
        "Sizes XS-XL",
      ],
    },
    "jeans-1": {
      name: "Premium Jeans",
      price: 79,
      description: "Durable denim pants",
      details: [
        "Heavy-duty denim",
        "Fade-resistant",
        "Multiple pockets",
        "Stretch fit",
        "Sizes 28-42",
      ],
    },
    "jacket-1": {
      name: "Winter Jacket",
      price: 149,
      description: "Warm weather protection",
      details: [
        "Insulated lining",
        "Water-resistant",
        "Multiple pockets",
        "Adjustable cuffs",
        "Sizes XS-XXL",
      ],
    },
  },
  books: {
    "book-1": {
      name: "Web Dev Guide",
      price: 39,
      description: "Complete web development handbook",
      details: [
        "452 pages",
        "HTML, CSS, JavaScript",
        "Real-world examples",
        "Practice exercises",
        "Digital + Print",
      ],
    },
    "book-2": {
      name: "React Patterns",
      price: 45,
      description: "Advanced React patterns & practices",
      details: [
        "380 pages",
        "Hooks & Context",
        "Performance optimization",
        "Testing strategies",
        "Code samples included",
      ],
    },
    "book-3": {
      name: "Next.js Mastery",
      price: 49,
      description: "Deep dive into Next.js framework",
      details: [
        "520 pages",
        "SSR, SSG, ISR",
        "API Routes",
        "Middleware",
        "Real project walkthrough",
      ],
    },
  },
};

export default function ProductDetailPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  const product = PRODUCTS[params.category]?.[params.id];

  if (!product) {
    notFound();
  }

  return (
    <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <Link
          href={`/products/${params.category}`}
          className="text-blue-700 hover:underline"
        >
          ← Back to {params.category}
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          {params.category} / {params.id}
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">
          {product.name}
        </h2>
        <p className="mt-1 text-2xl font-bold text-blue-700">
          ${product.price}
        </p>
      </div>

      <p className="text-base text-slate-700">{product.description}</p>

      <div className="mt-6 space-y-2">
        <h3 className="font-semibold text-slate-900">Features:</h3>
        <ul className="space-y-1">
          {product.details.map((detail, i) => (
            <li key={i} className="text-sm text-slate-700">
              • {detail}
            </li>
          ))}
        </ul>
      </div>

      <button className="mt-6 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700">
        Add to Cart
      </button>

      <div className="mt-8 space-y-2 rounded-lg bg-green-50 p-4 text-sm">
        <p className="font-semibold text-green-900">
          Deeply Nested Dynamic Routes:
        </p>
        <p className="text-green-800">
          This page uses{" "}
          <code className="inline bg-green-100 px-2 py-1">
            /products/[category]/[id]/page.tsx
          </code>
        </p>
        <p className="mt-2 text-green-800">
          In React Router, handling multiple nested params requires careful
          setup and often leads to prop-drilling. Next.js gives you the params
          object automatically with full type checking. Scale to any depth—your
          folder structure is your router!
        </p>
      </div>
    </section>
  );
}
