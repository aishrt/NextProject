import { upperFirst } from "lodash";
import moment from "moment";
import React from "react";
import DismissalReview from "./dismissalReview";

function DismissalQuest({ data }: any) {
  return (
    <>
      <DismissalReview data={data} />
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
    //           Q - Is this a constructive dismissal or a termination?
    //         </span>
    //         <span className="f-13">Ans -{data?.situation}</span>
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is your date of birth?{" "}
    //         </span>
    //         <span className="f-13">
    //           Ans - {moment(data?.dateOfBirth).format("DD-MMM-YYYY")}.
    //         </span>
    //       </div>

    //       {data?.noticePeriod && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - Was there a notice period in the agreement?{" "}
    //             {/* {data?.isIndividual == "individual"
    //             ? "Please provide the individual details"
    //             : "Please provide the company details"} */}
    //           </span>
    //           <span className="f-13">Ans -{data?.noticePeriod}.</span>{" "}
    //         </div>
    //       )}

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How old are you?
    //         </span>
    //         <span className="f-13">Ans -{data?.age}.</span>{" "}
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is your gross monthly salary?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.salary}.</span>
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is your employment status?
    //         </span>
    //         Ans - {data?.employment}
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is your length of service in the company?
    //         </span>
    //         <span className="f-13">
    //           Ans - {data?.service}
    //           {data?.service == "more" && (
    //             <>
    //               <span className="title-questioner f-15  semi-bold d-block">
    //                 Q - How many years of service do you have?{" "}
    //               </span>
    //               <span className="f-13">Ans - {data?.serviceYears}.</span>
    //             </>
    //           )}
    //         </span>
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - When did you start this position?
    //         </span>
    //         <span className="f-13">
    //           Ans - {moment(data?.startPosition).format("DD-MMM-YYYY")}
    //         </span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Which department did you work in?
    //         </span>
    //         <span className="f-13">Ans - {data?.department}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is the company&apos;s industry sector?
    //         </span>
    //         <span className="f-13">Ans - {data?.industry}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How many employees are there in the company?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.employees}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is the date of the dismissal notification?{" "}
    //         </span>
    //         <span className="f-13">
    //           Ans - {moment(data?.notificationDate).format("DD-MMM-YYYY")}
    //         </span>
    //       </div>
    //       {data?.dismissalReason && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What is the reason for the dismissal?{" "}
    //           </span>
    //           <span className="f-13">Ans - {data?.dismissalReason}</span>
    //         </div>
    //       )}
    //       {data?.warning && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - Did you receive a warning before the dismissal?{" "}
    //           </span>
    //           <span className="f-13">Ans - {data?.warning}</span>
    //         </div>
    //       )}
    //       {data?.meetings && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - Were there disciplinary meetings before the dismissal?{" "}
    //           </span>
    //           <span className="f-13">Ans - {data?.meetings}</span>

    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What is the date of the constructive dismissal?{" "}
    //           </span>

    //           <span className="f-13">
    //             Ans - {moment(data?.constructiveDate).format("DD-MMM-YYYY")}
    //           </span>
    //         </div>
    //       )}
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What are the reasons for the constructive dismissal?{" "}
    //         </span>
    //         <span className="f-13">
    //           Ans -
    //           {data?.constructiveReason?.map((itm: any) => {
    //             return <>{itm},</>;
    //           })}
    //           .
    //         </span>
    //         {data?.constructiveReason?.includes("Other") && (
    //           <>
    //             <span className="title-questioner f-15  semi-bold d-block">
    //               Other reasons:
    //             </span>
    //             <span className="f-13"> {data?.otherConstructive}</span>
    //           </>
    //         )}
    //       </div>
    //       {data?.endingIssue && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - Did they tell you about this issue before ending the
    //             contract?
    //           </span>
    //           <span className="f-13">Ans - {data?.endingIssue}</span>
    //         </div>
    //       )}
    //       {data?.obligations && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - Were you repeatedly accused of failing to meet obligations
    //             (for example, late payments or not meeting deadlines
    //             consistently) ?{" "}
    //           </span>
    //           <span className="f-13">Ans - {data?.obligations}</span>
    //           {data?.obligations == "yes" && (
    //             <>
    //               <span className="title-questioner f-15  semi-bold d-block">
    //                 Q - Please describe the failures they accused you
    //               </span>
    //               <span className="f-13">Ans - {data?.accused}</span>
    //             </>
    //           )}
    //         </div>
    //       )}
    //       {data?.breachCited && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - How serious was the breach cited at the time of termination?
    //           </span>
    //           <span className="f-13">Ans - {data?.breachCited}</span>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}

export default DismissalQuest;
