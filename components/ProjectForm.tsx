"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch, updatePitch } from "@/lib/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectFormProps {
  initialValues?: {
    title: string;
    batch: string;
    description: string;
    category: string;
    depot: string;
    link: string;
    pitch: string;
  };
  isEditMode?: boolean;
  projectId?: string;
}
const ProjectForm: React.FC<ProjectFormProps> = ({
  initialValues,
  isEditMode = false,
  projectId,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState(initialValues?.pitch || "");
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        depot: formData.get("depot") as string,
        batch: formData.get("batch") as string,
      };
  
      // Valide les données
      await formSchema.parseAsync({ ...formValues, pitch });
  
      let result;
      if (isEditMode && projectId) {
        // Ajoute le troisième argument `pitch` ici
        result = await updatePitch(projectId, formData, pitch);
      } else {
        result = await createPitch(prevState, formData, pitch);
      }
  
      if (result.status == "SUCCESS") {
        toast({
          title: "Succès",
          description: isEditMode
            ? "Ton projet a bien été mis à jour"
            : "Ton projet a bien été créé",
        });
  
        router.push(`/project/${result._id}`);
      }
  
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
  
        setErrors(fieldErrors as unknown as Record<string, string>);
  
        toast({
          title: "Erreur",
          description: "Merci de vérifier les informations soumises",
          variant: "destructive",
        });
  
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }
  
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est arrivée",
        variant: "destructive",
      });
  
      return {
        ...prevState,
        error: "Une erreur inattendue est arrivée",
        status: "ERROR",
      };
    }
  };
  

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="project-form">
      <div>
        <label htmlFor="title" className="project-form_label">
          Titre
        </label>
        <Input
          id="title"
          name="title"
          className="project-form_input"
          required
          placeholder="Titre du projet"
          defaultValue={initialValues?.title || ""}
        />
        {errors.title && <p className="project-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="batch" className="project-form_label">
          Ton Batch
        </label>
        <Input
          id="batch"
          name="batch"
          className="project-form_input"
          required
          placeholder="Ton Batch"
          defaultValue={initialValues?.batch || ""}
        />
        {errors.batch && <p className="project-form_error">{errors.batch}</p>}
      </div>

      <div>
        <label htmlFor="description" className="project-form_label">
          Slogan
        </label>
        <Textarea
          id="description"
          name="description"
          className="project-form_textarea"
          required
          placeholder="Slogan de ton projet"
          defaultValue={initialValues?.description || ""}
        />
        {errors.description && (
          <p className="project-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="project-form_label">
          Catégorie
        </label>
        <Select
          name="category"
          defaultValue={initialValues?.category || ""}
        >
          <SelectTrigger className="project-form_select">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Dev">Dev</SelectItem>
            <SelectItem value="Data Analyst">Data Analyst</SelectItem>
            <SelectItem value="Data Scientist">Data Scientist</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="project-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="depot" className="project-form_label">
          Lien du dépôt Github
        </label>
        <Input
          id="depot"
          name="depot"
          className="project-form_input"
          required
          placeholder="Lien du dépôt Github"
          defaultValue={initialValues?.depot || ""}
        />
        {errors.depot && <p className="project-form_error">{errors.depot}</p>}
      </div>

      <div>
        <label htmlFor="link" className="project-form_label">
          Lien de l'image
        </label>
        <Input
          id="link"
          name="link"
          className="project-form_input"
          required
          placeholder="Lien de l'image de ton projet"
          defaultValue={initialValues?.link || ""}
        />
        {errors.link && <p className="project-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="project-form_label">
          Description
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Description de ton projet",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className="project-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="project-form_btn text-white"
        disabled={isPending}
      >
        {isPending
          ? "Envoi en cours..."
          : isEditMode
          ? "Mettre à jour le projet"
          : "Créer ton projet"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default ProjectForm;
