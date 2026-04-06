import Link from "next/link";

const DOCS_STRUCTURE = {
  "": { title: "Documentation Home", content: "Welcome to the documentation." },
  "getting-started": {
    title: "Getting Started",
    content: "Learn the basics of our platform.",
  },
  "getting-started/installation": {
    title: "Installation",
    content: "Step-by-step installation guide.",
  },
  "getting-started/configuration": {
    title: "Configuration",
    content: "How to configure your setup.",
  },
  guides: { title: "Guides", content: "In-depth guides for advanced topics." },
  "guides/routing": {
    title: "Routing Guide",
    content: "Everything about Next.js routing.",
  },
  "guides/routing/dynamic-routes": {
    title: "Dynamic Routes",
    content: "Learn about dynamic [params] in routes.",
  },
  "guides/routing/catch-all": {
    title: "Catch-All Routes",
    content: "Flexible routes with [...slug] patterns.",
  },
  api: { title: "API Reference", content: "Complete API documentation." },
  "api/endpoints": {
    title: "Endpoints",
    content: "List of all available endpoints.",
  },
  faq: {
    title: "Frequently Asked Questions",
    content: "Answers to common questions.",
  },
};

export default function DocsPage({ params }: { params: { slug?: string[] } }) {
  const path = params.slug?.join("/") ?? "";
  const doc = DOCS_STRUCTURE[path as keyof typeof DOCS_STRUCTURE];

  if (!doc) {
    return (
      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Documentation Not Found
        </h2>
        <p className="mt-2 text-slate-600">
          The page{" "}
          <code className="inline bg-slate-100 px-2 py-1">/docs/{path}</code>{" "}
          doesn't exist.
        </p>
        <Link
          href="/docs"
          className="mt-4 inline-block text-blue-700 hover:underline"
        >
          ← Back to Documentation
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-4">
      {/* Sidebar */}
      <aside className="space-y-2 rounded-2xl border border-slate-300 bg-white p-4 lg:col-span-1">
        <h3 className="font-semibold text-slate-900">Documentation Pages</h3>
        <nav className="space-y-1 text-sm">
          {Object.entries(DOCS_STRUCTURE).map(([docPath, docData]) => (
            <Link
              key={docPath}
              href={docPath === "" ? "/docs" : `/docs/${docPath}`}
              className={`block rounded px-3 py-2 transition ${
                path === docPath
                  ? "bg-blue-100 font-semibold text-blue-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {docData.title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="space-y-6 lg:col-span-3">
        <article className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {path ? `/docs/${path}` : "/docs"}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {doc.title}
          </h2>
          <p className="mt-4 text-base text-slate-700">{doc.content}</p>

          {path && (
            <Link
              href="/docs"
              className="mt-6 inline-block text-blue-700 hover:underline"
            >
              ← Back to Documentation Home
            </Link>
          )}
        </article>

        <article className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <p className="font-semibold text-amber-900">
            Catch-All Routes Magic:
          </p>
          <p className="mt-2 text-sm text-amber-800">
            This page uses{" "}
            <code className="inline bg-amber-100 px-2 py-1">
              /docs/[[...slug]]/page.tsx
            </code>
          </p>
          <ul className="mt-3 space-y-1 text-sm text-amber-800">
            <li>
              ✓ <code className="inline bg-amber-100 px-2 py-1">/docs</code> →
              slug = undefined
            </li>
            <li>
              ✓{" "}
              <code className="inline bg-amber-100 px-2 py-1">
                /docs/guides
              </code>{" "}
              → slug = ['guides']
            </li>
            <li>
              ✓{" "}
              <code className="inline bg-amber-100 px-2 py-1">
                /docs/guides/routing
              </code>{" "}
              → slug = ['guides', 'routing']
            </li>
            <li>
              ✓{" "}
              <code className="inline bg-amber-100 px-2 py-1">
                /docs/guides/routing/catch-all
              </code>{" "}
              → slug = ['guides', 'routing', 'catch-all']
            </li>
          </ul>
          <p className="mt-3 text-sm text-amber-800">
            In React Router, handling arbitrary nesting depths requires special
            handling or nested route configs. Next.js makes it trivial with{" "}
            <code className="inline bg-amber-100 px-2 py-1">[[...slug]]</code>{" "}
            syntax!
          </p>
        </article>
      </main>
    </section>
  );
}
