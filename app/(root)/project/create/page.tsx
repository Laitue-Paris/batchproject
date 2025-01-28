import { auth } from "@/auth";
import ProjectForm from "@/components/ProjectForm"
import { redirect } from "next/navigation";

const page = async () => {

  const session = await auth();

  if (!session) redirect("/");

  return (
    <>
      <section className="main_container !min-h-[230px]">
        <h1 className="heading">Créer ton projet</h1>
      </section>

      <ProjectForm />
    </>
  )
}

export default page
