"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import LoadingButton from "@mui/lab/LoadingButton";
import upload from "@/assets/upld.png";
import pack from "@/assets/pack.png";
import plus from "@/assets/pls.png";
import removeIcon from "@/assets/block.png";
import useSnackbar from "@/hooks/useSnackbar";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/Form/InputField";

type ExperienceOrEducation = {
  description: string;
  upload: File | string;
  url?: string;
};

type FormValues = {
  experiences: ExperienceOrEducation[];
  educations: ExperienceOrEducation[];
  achievements: ExperienceOrEducation[];
  aboutMe: string;
};

interface DocUploadComponentProps {
  onFormSubmit: (values: FormValues) => void;
}

export default function DocUploadComponent({ onFormSubmit }: DocUploadComponentProps) {
  const [experiences, setExperiences] = useState<ExperienceOrEducation[]>([{ description: "", upload: "" }]);
  const [educations, setEducations] = useState<ExperienceOrEducation[]>([{ description: "", upload: "" }]);
  const [achievements, setAchievements] = useState<ExperienceOrEducation[]>([{ description: "", upload: "" }]);
  const [aboutMe, setAboutMe] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { openSnackbar } = useSnackbar();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const validateSection = (section: ExperienceOrEducation[], sectionName: string) => {
      section.forEach((entry, index) => {
        if (!entry.description) {
          newErrors[`${sectionName}-${index}-description`] = "Description is required";
        }
        if (!entry.upload) {
          newErrors[`${sectionName}-${index}-upload`] = "Upload is required";
        }
      });
    };

    validateSection(experiences, "experiences");
    validateSection(educations, "educations");
    validateSection(achievements, "achievements");

    if (!aboutMe.trim()) {
      newErrors.aboutMe = "About Me is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddField = (sectionSetter: React.Dispatch<React.SetStateAction<ExperienceOrEducation[]>>) => {
    sectionSetter((prev) => [...prev, { description: "", upload: "" }]);
  };

  const handleRemoveField = (
    index: number,
    section: ExperienceOrEducation[],
    sectionSetter: React.Dispatch<React.SetStateAction<ExperienceOrEducation[]>>
  ) => {
    sectionSetter(section.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    index: number,
    field: keyof ExperienceOrEducation,
    value: string | File,
    section: ExperienceOrEducation[],
    sectionSetter: React.Dispatch<React.SetStateAction<ExperienceOrEducation[]>>
  ) => {
    const updatedSection = section.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    sectionSetter(updatedSection);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      openSnackbar("Please correct the errors in the form", "error");
      return;
    }

    setLoading(true);

    try {
      onFormSubmit({
        experiences,
        educations,
        achievements,
        aboutMe,
      });
    } catch (error) {
      openSnackbar("Failed to upload files, please try again.", "error");
      console.error("File upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderFields = (
    section: ExperienceOrEducation[],
    sectionSetter: React.Dispatch<React.SetStateAction<ExperienceOrEducation[]>>,
    title: string,
    bgColor: string
  ) => (
    <div className={`row experience-dec ${bgColor} w-100 m-auto mt-3`}>
      <div className="col-12 col-md-4">
        <p className="f-14 mb-0 pt-3">{title}</p>
      </div>
      <div className="col-12 col-md-8">
        {section.map((entry, idx) => (
          <div key={idx} className="mb-2">
            <InputField
              label={`Description ${idx + 1}`}
              name={`description-${idx}`}
              startIcon={<Image src={pack} alt="" />}
              className="input-doc"
              placeholder="Description"
              value={entry.description}
              onChange={(e) =>
                handleInputChange(idx, "description", e.target.value, section, sectionSetter)
              }
            />
            {errors[`${title}-${idx}-description`] && (
              <p className="text-danger">{errors[`${title}-${idx}-description`]}</p>
            )}
            <div className="d-flex align-items-center gap-2">
              <input
                type="file"
                accept=".jpeg,.jpg,.png,.pdf" 
                className={section.length > 1 ? "input-doc mt-2 w-90" : "input-doc mt-2 w-100"}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  e.target.files && handleInputChange(idx, "upload", e.target.files[0], section, sectionSetter)
                }
              />
              {errors[`${title}-${idx}-upload`] && (
                <p className="text-danger">{errors[`${title}-${idx}-upload`]}</p>
              )}
              {section.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(idx, section, sectionSetter)}
                  className="ml-2 btn btn-danger bg-transparent p-0 border-0"
                >
                  <Image src={removeIcon} className="remove-icon" height={20} alt="Remove" />
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="add-more-field">
          <p
            className="f-14 mb-0 p-3 rounded-lg bg-white"
            onClick={() => handleAddField(sectionSetter)}
            style={{ cursor: "pointer" }}
          >
            <Image src={plus} className="add-more" alt="" /> Add More
          </p>
        </div>
      </div>
    </div>
  );

  const renderAboutMe = () => (
    <div className="row experience-dec doc-yellow-bg w-100 m-auto mt-3">
      <div className="col-12 col-md-4">
        <p className="f-14 mb-0 pt-3">About Me</p>
      </div>
      <div className="col-12 col-md-8">
        <InputField
          label="About Me"
          name="aboutMe"
          startIcon={<Image src={pack} alt="" />}
          className="input-doc"
          placeholder="About Me"
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
        />
        {errors.aboutMe && <p className="text-danger">{errors.aboutMe}</p>}
      </div>
    </div>
  );

  return (
    <div className="document-upload">
      <form onSubmit={handleSubmit}>
        <div className="div docs-update ml-5">
          {renderFields(experiences, setExperiences, "Experiences", "doc-light-bg")}
          {renderFields(educations, setEducations, "Educations", "doc-pink-bg")}
          {renderFields(achievements, setAchievements, "Achievements", "doc-blue-bg")}
          {renderAboutMe()}
          <div className="col-12 col-md-12 mt-4 text-right">
            <LoadingButton
              loading={loading}
              variant="contained"
              type="submit"
              className="w-100 login-btn"
              size="large"
            >
              <span>Send</span>
            </LoadingButton>
          </div>
        </div>
      </form>
    </div>
  );
}
