'use client';

import { useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';

type BlackboardState = {
  title: string;
  filePath: string;
  routePattern: string;
  routeExample: string;
  dynamicParams: Array<{ key: string; value: string }>;
  codeLines: string[];
};

type TreeRow = {
  id: string;
  text: string;
  active: boolean;
};

type ParamValue = string | string[] | undefined;

function valueToDisplay(value: ParamValue) {
  if (Array.isArray(value)) {
    return '[' + value.map((part) => '"' + part + '"').join(', ') + ']';
  }
  if (typeof value === 'string') {
    return '"' + value + '"';
  }
  return 'undefined';
}

function useBlackboardState(pathname: string, params: Record<string, ParamValue>): BlackboardState {
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'products' && segments.length >= 3) {
    const category = typeof params.category === 'string' ? params.category : '(category)';
    const id = typeof params.id === 'string' ? params.id : '(id)';

    return {
      title: 'Nested Dynamic Route',
      filePath: 'app/products/[category]/[id]/page.tsx',
      routePattern: '/products/[category]/[id]',
      routeExample: '/products/' + category + '/' + id,
      dynamicParams: [
        { key: 'category', value: valueToDisplay(params.category) },
        { key: 'id', value: valueToDisplay(params.id) }
      ],
      codeLines: [
        'export default function Page({ params }) {',
        '  // params.category and params.id',
        '  return <ProductDetail params={params} />;',
        '}'
      ]
    };
  }

  if (segments[0] === 'products' && segments.length >= 2) {
    const category = typeof params.category === 'string' ? params.category : '(category)';

    return {
      title: 'Dynamic Route',
      filePath: 'app/products/[category]/page.tsx',
      routePattern: '/products/[category]',
      routeExample: '/products/' + category,
      dynamicParams: [{ key: 'category', value: valueToDisplay(params.category) }],
      codeLines: [
        'export default function Page({ params }) {',
        '  // params.category',
        '  return <CategoryPage params={params} />;',
        '}'
      ]
    };
  }

  if (segments[0] === 'docs') {
    return {
      title: 'Optional Catch-All Route',
      filePath: 'app/docs/[[...slug]]/page.tsx',
      routePattern: '/docs/[[...slug]]',
      routeExample: pathname,
      dynamicParams: [{ key: 'slug', value: valueToDisplay(params.slug) }],
      codeLines: [
        'export default function Page({ params }) {',
        '  // params.slug is string[] or undefined',
        '  const path = params.slug?.join("/") ?? "";',
        '}'
      ]
    };
  }

  if (segments[0] === 'terms' && segments.length >= 2) {
    const slug = typeof params.slug === 'string' ? params.slug : '(slug)';

    return {
      title: 'SSG Dynamic Segment',
      filePath: 'app/terms/[slug]/page.tsx',
      routePattern: '/terms/[slug]',
      routeExample: '/terms/' + slug,
      dynamicParams: [{ key: 'slug', value: valueToDisplay(params.slug) }],
      codeLines: [
        'export function generateStaticParams() {',
        '  return [{ slug: "tos" }];',
        '}',
        '// unknown slugs => notFound()'
      ]
    };
  }

  return {
    title: 'Route Blackboard',
    filePath: 'Navigate to /products, /docs, or /terms',
    routePattern: 'Dynamic route examples',
    routeExample: pathname,
    dynamicParams: [],
    codeLines: [
      '// Open a teaching route to see live param updates',
      '// /products/electronics/laptop-1',
      '// /docs/guides/routing/catch-all',
      '// /terms/tos'
    ]
  };
}

function buildRouteTree(pathname: string, params: Record<string, ParamValue>): TreeRow[] {
  const segments = pathname.split('/').filter(Boolean);
  const isProducts = pathname.startsWith('/products');
  const isProductCategory = isProducts && segments.length >= 2;
  const isProductDetail = isProducts && segments.length >= 3;
  const isDocs = pathname.startsWith('/docs');
  const isTerms = pathname.startsWith('/terms');
  const isTermsSlug = isTerms && segments.length >= 2;

  const category = typeof params.category === 'string' ? params.category : undefined;
  const id = typeof params.id === 'string' ? params.id : undefined;

  let slugLabel: string | undefined;
  if (Array.isArray(params.slug)) {
    slugLabel = params.slug.join('/');
  } else if (typeof params.slug === 'string') {
    slugLabel = params.slug;
  }

  const termSlug = typeof params.slug === 'string' ? params.slug : undefined;

  return [
    { id: 'products-root', text: '/products', active: isProducts },
    { id: 'products-category', text: '  |-- ' + (category ?? '[category]'), active: isProductCategory },
    { id: 'products-id', text: '      |-- ' + (id ?? '[id]'), active: isProductDetail },
    { id: 'docs-root', text: '/docs', active: isDocs },
    { id: 'docs-slug', text: '  |-- ' + (slugLabel ?? '[[...slug]]'), active: isDocs },
    { id: 'terms-root', text: '/terms', active: isTerms },
    { id: 'terms-slug', text: '  |-- ' + (termSlug ?? '[slug]'), active: isTermsSlug }
  ];
}

export function RouteBlackboard() {
  const pathname = usePathname();
  const params = useParams();

  if (pathname === '/') {
    return null;
  }

  const typedParams = params as Record<string, ParamValue>;

  const state = useMemo(() => {
    return useBlackboardState(pathname, typedParams);
  }, [pathname, typedParams]);

  const treeRows = useMemo(() => buildRouteTree(pathname, typedParams), [pathname, typedParams]);

  return (
    <aside className="w-full rounded-2xl border border-slate-700 bg-black p-4 text-slate-100 shadow-lg xl:min-h-[42rem] xl:max-h-[calc(100vh-4rem)] xl:overflow-auto">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Live Route Blackboard</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{state.title}</h3>

      <div className="mt-3 space-y-2 rounded-lg border border-slate-900 bg-slate-950/70 p-3 text-xs font-mono opacity-80">
        <p className="text-slate-400">file:</p>
        <p className="text-emerald-300">{state.filePath}</p>
      </div>

      <div className="mt-3 space-y-2 rounded-lg border border-slate-900 bg-slate-950/70 p-3 text-xs font-mono opacity-80">
        <p className="text-slate-400">pattern:</p>
        <p className="text-sky-300">{state.routePattern}</p>
        <p className="text-slate-400">current:</p>
        <p className="text-white">{state.routeExample}</p>
      </div>

      <div className="mt-4 rounded-xl border border-emerald-700 bg-emerald-950/30 p-4 font-mono text-sm shadow-lg shadow-emerald-950/40">
        <p className="text-emerald-300 font-semibold tracking-wide">ROUTE TREE (LIVE)</p>
        <div className="mt-3 space-y-1.5">
          {treeRows.map((row) => (
            <p key={row.id} className={row.active ? 'text-emerald-200 text-base font-bold' : 'text-slate-400'}>
              <span className={"mr-2 " + (row.active ? "text-emerald-300" : "text-slate-500")}>{row.active ? "▶" : "•"}</span>
              {row.text}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-slate-900 bg-slate-950/70 p-3 font-mono text-xs opacity-80">
        <p className="text-slate-400">params</p>
        {state.dynamicParams.length === 0 ? (
          <p className="mt-1 text-slate-500">(no dynamic params on this route)</p>
        ) : (
          <div className="mt-2 space-y-1">
            {state.dynamicParams.map((entry) => (
              <p key={entry.key}>
                <span className="text-amber-300">{entry.key}</span>
                <span className="text-slate-500">: </span>
                <span className="text-white">{entry.value}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
