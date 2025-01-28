import { auth } from '@/auth';
import ProjectForm from '@/components/SearchForm'
import ProjectCard, { ProjectTypeCard } from '@/components/ProjectCard';
import { sanityFetch, SanityLive } from '@/sanity/lib/live';
import { PROJECTS_QUERY } from '@/sanity/lib/queries';

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string }>

}) {
  const query = (await searchParams).query;
  const params = { search: query || null }

  const session = await auth();
  
  const { data: posts } = await sanityFetch( {query: PROJECTS_QUERY, params} ); 

  return (
    <>
      <section className="main_container">
        <h1 className="heading">
          Les projets de fin de<br />
          Batch
        </h1>
        <p className="sub-heading !max-w-3xl">
          Poste ton projet
        </p>
        <ProjectForm query={query}/>
      </section>
      <section className='section_container'>
        <p className='text-30-semibold'>
          {query ? `Search results for "${query}"` : 'Tous les projets' }
        </p>
        <ul className='mt-7 card_grid'>
          {posts?.length > 0 ? (
            posts.map((post: ProjectTypeCard) => (
              <ProjectCard key={post?._id} post={post}/>
            ))
          ) : (
            <p className='no-results'>Pas de projet trouvé</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
