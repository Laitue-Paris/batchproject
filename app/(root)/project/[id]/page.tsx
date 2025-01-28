import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { PLAYLIST_BY_BATCH_QUERY, PROJECT_BY_ID_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import markdownit from "markdown-it";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import ProjectCard, { ProjectTypeCard } from "@/components/ProjectCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

const md = markdownit()

export const expermiental_ppr = true;

const page = async ({params}: {params: Promise<{ id:string}>,}) => {
  const id = (await params).id
  const post = await client.fetch(PROJECT_BY_ID_QUERY, {id}); 
  const session = await auth();
  if(!post) return notFound();
  const editorPosts = await client.fetch(PLAYLIST_BY_BATCH_QUERY, { batch: post?.batch, id: id })
  const isAuthor = session?.id == post.author._id;
  const parsedContent = md.render(post?.pitch || "")
  return (
    <>
      <section className="main_container !min-h-[230px]">
        <div className="tag">
          {formatDate(post?._createdAt)}
        </div>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post?.description}</p>
        {isAuthor ? (
          <Link
          href={`/project/${id}/edit`}>
            <Button
              className="mt-4 !bg-secondary">            
            Edit
            </Button></Link>
        ) : ("")
        }
        
      </section>
      
      <section className="section_container">
        <img
          src={post.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />
        
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author.username}
                </p>
              </div>
            </Link>
            <div className="flex flex-col items-center">
              <p>Lien du Dépot :</p>
              <Link href={`${post?.depot}`} target="blank">
                <FaGithub size={32} />
              </Link>
            </div>
            <Link href={`/?query=${post.batch?.toLowerCase()}`}>
              <p className="category-tag !bg-primary">Batch : #{post.batch}</p>
            </Link>
            <Link href={`/?query=${post.category?.toLowerCase()}`}>
              <p className="category-tag">{post.category}</p>
            </Link>
          </div>
          <hr className="divider" />
          <h3 className="text-30-bold">Pitch Details</h3>
            { parsedContent ? ( 
              <article 
                className="prose m-w-4xl font-work-sans break-all"
                dangerouslySetInnerHTML={{__html: parsedContent}}
              />
            ): (
              <p className="no-result">
                Pas de pitch pour ce projet
              </p>
            )}
        </div>
        <hr className="divider" />
        {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Les autres projets du batch <b>#{post?.batch}</b></p>
            <div className="flex justify-center mt-7">
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {editorPosts.map((post: ProjectTypeCard, i: number) => (
                    <CarouselItem key={i}>
                      <ProjectCard key={i} post={post} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        )}
        <Suspense fallback={<Skeleton className="view-skeleton"/>}>
            <View id={id}/>
        </Suspense>
      </section>
    </>
  )
}

export default page