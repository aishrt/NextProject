import { upperFirst } from "lodash";
import moment from "moment";
import React from "react";
import HarassmentReview from "./harassmentReview";
function HarassmentQuest({ data }: any) {
  return (
    <>
      <HarassmentReview formData={data} />
    </>
    // <div
    //   className="case-details-pre rounded-lg mt-4"
    //   style={{ background: "#FFF" }}
    // >
    //   <div
    //     className="headr-pre p-3 d-flex justify-content-between align-items-center"
    //     style={{ background: "#A6D5CC", borderRadius: "10px 10px 0 0 " }}
    //   >
    //     <h3 className="f-18 semi-bold mb-0">Questioner</h3>
    //   </div>
    //   <div className="pre-card-details">
    //     <div className="pi-card-inner rounded">
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is your age?{" "}
    //         </span>
    //         <span className="f-13">Ans -{data?.age}</span>
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is your gross monthly salary (€)?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.salary}.</span>
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q -What is your job title?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.jobTitle}.</span>
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Which department do you work in?{" "}
    //         </span>
    //         <span className="f-13">Ans -{data?.department}.</span>{" "}
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How many years have you worked for the company?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.years}.</span>
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What amount are you initially requesting for compensation (€)?{" "}
    //         </span>
    //         Ans - {data?.amount}
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How was your health before the incidents?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.health}</span>
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Have you ever been declared unfit for work by a doctor?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.unfit}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Which department do you work in?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.workDepartment}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How many employees are in your department?
    //         </span>
    //         <span className="f-13">Ans - {data?.employees}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What reason did your employer give for any actions taken
    //           against you?
    //         </span>
    //         <span className="f-13">Ans - {data?.reason}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Who committed the harassment?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.committed}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Does the harasser have a special relationship with the
    //           employer?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.splRelationship}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Elements of Moral Harassment?{" "}
    //         </span>
    //         <span className="f-13">
    //           Ans -{" "}
    //           {data?.splRelationship?.map((itm: any) => {
    //             return <>{itm},</>;
    //           })}
    //           .
    //         </span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Evidence you have ?
    //         </span>
    //         <span className="f-13">
    //           Ans -{" "}
    //           {data?.evidenceTypes?.map((itm: any) => {
    //             return <>{itm},</>;
    //           })}
    //           .
    //           {data?.otherEvidence == "yes" && (
    //             <span className="title-questioner f-15  semi-bold d-block">
    //               {data?.otherSpecify}
    //             </span>
    //           )}
    //         </span>

    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Was the employer informed of the alleged facts?{" "}
    //         </span>

    //         <span className="f-13">Ans - {data?.alleged}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What are applicable damages?{" "}
    //         </span>
    //         <span className="f-13">
    //           Ans -
    //           {data?.damages?.map((itm: any) => {
    //             return <>{itm},</>;
    //           })}
    //           .
    //         </span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What actions has your employer taken to address the situation?
    //         </span>
    //         <span className="f-13">Ans - {data?.situation}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Were you repeatedly accused of failing to meet obligations
    //           (for example, late payments or not meeting deadlines consistently)
    //           ?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.obligations}</span>
    //         {data?.obligations == "yes" && (
    //           <>
    //             <span className="title-questioner f-15  semi-bold d-block">
    //               Q - Please describe the failures they accused you
    //             </span>
    //             <span className="f-13">Ans - {data?.accused}</span>
    //           </>
    //         )}
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How serious was the breach cited at the time of termination?
    //         </span>
    //         <span className="f-13">Ans - {data?.breachCited}</span>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default HarassmentQuest;
