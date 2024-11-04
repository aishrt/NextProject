import AboutYourself from "@/app/client/harassment-form/_HarassmentForms/AboutYourself";
import Damages from "@/app/client/harassment-form/_HarassmentForms/Damages";
import Employer from "@/app/client/harassment-form/_HarassmentForms/Employer";
import EmployerAction from "@/app/client/harassment-form/_HarassmentForms/EmployerAction";
import Evidence from "@/app/client/harassment-form/_HarassmentForms/Evidence";
import GeneralInfo from "@/app/client/harassment-form/_HarassmentForms/GeneralInfo";
import Health from "@/app/client/harassment-form/_HarassmentForms/Health";
import MoralElements from "@/app/client/harassment-form/_HarassmentForms/MoralElements";
import React from "react";

function HarassmentReview({ formData }: any) {
  return (
    <>
      <AboutYourself data={formData} hide={true} />
      <Health data={formData} hide={true} />
      <Employer data={formData} hide={true} />
      <GeneralInfo data={formData} hide={true} />
      <MoralElements data={formData} hide={true} />
      <Evidence data={formData} hide={true} />
      <Damages data={formData} hide={true} />
      <EmployerAction data={formData} hide={true} />
    </>
  );
}

export default HarassmentReview;
