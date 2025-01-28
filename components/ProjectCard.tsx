import { cn, formatDate } from "@/lib/utils"
import { EyeIcon } from "lucide-react"
import Image from "next/image";
import Link from "next/link"
import { Button } from "./ui/button";
import { Author, Project } from "@/sanity/types";
import { Skeleton } from "@/components/ui/skeleton";

export type ProjectTypeCard = Omit<Project, "author"> & { author?: Author}

const ProjectCard = ({ post }: { post: ProjectTypeCard}) => {
  const {
    _createdAt,
    views,
    author,
    title,
    batch,
    description,
    category,
    image,
    _id
  } = post;
  return (
    <li className="project-card group xs:w-[400px] sm:w-full">
      <div className="flex-between gap-5">
        <Link href={`/project/${_id}`}>
          <h3 className="text-26-semibold line-clamp-1">{title}</h3>
        </Link>
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium lg:truncate line-clamp-1">
            {category}
          </p>
        </Link>
      </div>
      <div className="flex-between gap-3 mt-5">
        <Link href={`/project/${_id}`}>
          <p className="project-card_desc line-clamp-1">
            {description}
          </p>
        </Link>
        <Link href={`/?query=${batch?.toLowerCase()}`}>
          <p className="text-16-medium">
            #{batch}
          </p>
        </Link>
      </div>
      <div className="flex-between gap-5"></div>
        <Link href={`/project/${_id}`}>
          <img src={image} alt={title} className="project_card_img mt-2"/>
        </Link>
        <Button className="project-card_btn w-full mt-5" asChild>
          <Link href={`/project/${_id}`}>
            Details
          </Link>
        </Button>
          <div className="flex-between mt-3">
            <p className="project_card_date">
              {formatDate(_createdAt)}
            </p>
            <div className="flex gap-1.5">
              <EyeIcon className="text-primary size-6"/>
              <span className="text-16-medium">{views}</span>
            </div>
          </div>
        <hr className="mt-5"/>
        <div className="flex-between gap-3 mt-3">
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>
          <Link href={`/user/${author?._id}`}>
            <Image
                src={author?.image!}
                alt={author?.name!}
                width={48}
                height={48}
                className="rounded-full"
              />
            </Link>
        </div>
    </li>
  )
}
export const ProjectCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={cn("skeleton", index)}>
        <Skeleton className="project-card_skeleton" />
      </li>
    ))}
  </>
);

export default ProjectCard
