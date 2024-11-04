import { upperFirst } from "lodash";
import moment from "moment";
import React from "react";
import VexatiousReview from "./VexatiousReview";

function Vexatious({ data }: any) {
  return (
    <>
      <VexatiousReview formData={data} />
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
    //           Q - How old are you ?
    //         </span>
    //         <span className="f-13">Ans -{data?.age}</span>
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What was your gross monthly salary (before taxes) at the
    //             time of your dismissal ?
    //           </span>
    //           <span className="f-13">Ans - {data?.salary}.</span>
    //         </div>
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What was your position in the company ?{" "}
    //           </span>
    //           <span className="f-13">Ans - {data?.position}.</span>
    //         </div>
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - Which department did you work in ?
    //           </span>
    //           <span className="f-13">Ans - {data?.department}.</span>
    //         </div>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How many years did you work at this company ?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.years}.</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What was your health status before the dismissal ?{" "}
    //           {/* {data?.isIndividual == "individual"
    //             ? "Please provide the individual details"
    //             : "Please provide the company details"} */}
    //         </span>
    //         <span className="f-13">Ans - {data?.healthStatus}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Were you declared unfit for work by a doctor before your
    //           dismissal?
    //         </span>
    //         <span className="f-13">Ans - {data?.unfit}.</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How many people worked at the company at the time of your
    //           dismissal ?
    //         </span>
    //         <span className="f-13">Ans - {data?.peopleWorked}.</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What reason did your employer give for your dismissal ?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.employerReason}.</span>
    //         {data?.employerReason == "Other" && (
    //           <span className="f-13">Ans - {data?.otherReason}.</span>
    //         )}
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What events did you experience during your dismissal ?
    //         </span>
    //         <span className="f-13">
    //           Ans - {upperFirst(data?.eventsExperience)}
    //         </span>
    //         {data?.eventsExperience == "Other" && (
    //           <span className="f-13">Ans - {upperFirst(data?.otherEvent)}</span>
    //         )}
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Would you like to request spousal support (alimony) as well ?
    //         </span>
    //         <span className="f-13">
    //           Ans - {upperFirst(data?.spousalSupport)}
    //         </span>
    //       </div>
    //       {data?.dismissalAffected && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - How has your dismissal affected you ?{" "}
    //           </span>
    //           <span className="f-13">
    //             Ans - {data?.dismissalAffected[0]?.label}
    //           </span>
    //         </div>
    //       )}
    //       {data?.evidence && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What evidence do you have to support your claim ?
    //           </span>
    //           <span className="f-13"> Ans - {data?.evidence[0]?.label}</span>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}

export default Vexatious;
