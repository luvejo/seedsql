import { dehydrate, useQuery } from 'react-query'
import { queryClient, getSeeds } from '@/graphql/api'
import Link from 'next/link'

export async function getServerSideProps() {
  await queryClient.prefetchQuery('seeds', () => getSeeds())
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default function Home() {
  const { data } = useQuery('seeds', () => getSeeds())

  if (!data?.seeds) {
    return <div>404 - No seeds found.</div>
  }

  return (
    <section className="grid grid-cols-2 gap-5 ">
      {data?.seeds.map((seed) => (
        <article
          className="p-5 border flex flex-col bg-gray-100 rounded"
          key={seed.slug}
        >
          <Link href={`/seeds/${seed.slug}`}>
            <a className="inline-block">
              <h2 className="text-xl font-bold ">{seed.name}</h2>
            </a>
          </Link>

          {/* Don't do this without proper sanitization: */}
          <section className="grow">
            <div
              className="mt-2 line-clamp-2 "
              dangerouslySetInnerHTML={{ __html: seed.description }}
            />
          </section>

          <section className="flex justify-end mt-2">
            <Link href={`/seeds/${seed.slug}`}>
              <a className="underline">See details</a>
            </Link>
          </section>
        </article>
      ))}
    </section>
  )
}
