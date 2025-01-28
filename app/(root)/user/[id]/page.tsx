"user client"
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY, BATCHES_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link"
import UserProjects from "@/components/UserProjects";
import { Suspense } from "react";
import { ProjectCardSkeleton} from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";


export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();
  const batches: { batch: string }[] = await client.fetch(BATCHES_BY_AUTHOR_QUERY, { id });
  
  const uniqueBatchAuthors: string[] = [...new Set(batches.map((batch) => batch.batch))];


  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();
  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>

          <Image
            src={user.image}
            alt={user.name}
            width={220}
            height={220}
            className="profile_image"
          />

          <p className="text-30-extrabold mt-7 text-center">
            <Link href={`https://github.com/${user?.username}`}>
              @{user?.username}
            </Link>
          </p>
          <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
          <h3 className="mt-3 text-center ">Batch :</h3>
          <div className="flex gap-5">
            {uniqueBatchAuthors.length > 0 ? (
              uniqueBatchAuthors.map((batch: string, i: number) => (
                <Button className="bg-black text-white" key={i}>
                  <Link href={`/?query=${batch?.toLowerCase()}`}>
                    {batch}
                  </Link>
                </Button>
              ))
            ) : (
              <p className="no-result">No posts yet</p>
            )}
          </div>
        </div>
          
        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">
            {session?.id === id ? "Ton projet" : "Tes projets"} Projets
          </p>
          <ul className="card_grid-sm">
            <Suspense fallback={<ProjectCardSkeleton />}>
              <UserProjects id={id} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Page;