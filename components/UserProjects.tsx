import { client } from "@/sanity/lib/client";
import { PROJECTS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import ProjectForm, { ProjectTypeCard } from "@/components/ProjectCard";

const UserProjects = async ({ id }: { id: string }) => {
  const projects = await client.fetch(PROJECTS_BY_AUTHOR_QUERY, { id });

  return (
    <>
      {projects.length > 0 ? (
        projects.map((project: ProjectTypeCard) => (
          <ProjectForm key={project._id} post={project} />
        ))
      ) : (
        <p className="no-result">No posts yet</p>
      )}
    </>
  );
};
export default UserProjects;