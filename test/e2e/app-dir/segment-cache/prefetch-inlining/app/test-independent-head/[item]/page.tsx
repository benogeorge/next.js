import { Suspense } from 'react'

// The page uses runtime prefetching. The page content doesn't depend on
// the [item] param — only the metadata does. The metadata also accesses
// searchParams, which means the head depends on runtime data and must be
// fetched via a runtime prefetch. This means two routes like /a and /b
// have identical segment data but different metadata (head).
export const unstable_instant = {
  prefetch: 'runtime',
  samples: [{ searchParams: { q: null } }],
}

export async function generateStaticParams() {
  return [{ item: 'a' }, { item: 'b' }]
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ item: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { item } = await params
  const { q } = await searchParams
  return { title: `Item: ${item}${q ? ` (q=${q})` : ''}` }
}

async function PageContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return (
    <p id="page-independent-head">Independent head page (q: {q ?? 'none'})</p>
  )
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PageContent searchParams={searchParams} />
    </Suspense>
  )
}
