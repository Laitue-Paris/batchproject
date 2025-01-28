import ProjectForm from "@/components/ProjectForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PROJECT_BY_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";

const page =  async ({ params }: { params: { id: string } }) => {
  const session = await auth();
  if (!session) redirect("/");
  const id = (await params).id
  const post = await client.fetch(PROJECT_BY_ID_QUERY, {id}); 
  if (session.id != post.author._id) redirect("/");

  return (
      <>
        <section className="main_container !min-h-[230px]">
          <h1 className="heading">Modification de ${post.title}</h1>
        </section>
        <ProjectForm
          initialValues={{
            title: post.title,
            batch: post.batch,
            description: post.description,
            category: post.category,
            depot: post.depot,
            link: post.image,
            pitch: post.pitch,
          }}
          isEditMode={true}
          projectId={id}
        />
      </>

  );
};

export default page;
