import { upperFirst } from "lodash";
import moment from "moment";
import React from "react";
import SuddenTerminationReview from "./SuddenTerminationReview";

function SuddenTermination({ data }: any) {
  return (
    <>
      <SuddenTerminationReview formData={data} />
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
    //           Q - How long did you work together ?
    //         </span>
    //         <span className="f-13">Ans -{data?.duration}</span>
    //         <div className="p-3 border-btm-lgt">
    //           {data?.relationTerminated && (
    //             <>
    //               <span className="title-questioner f-15  semi-bold d-block">
    //                 Q - How was the relationship ended ?
    //               </span>
    //               <span className="f-13">
    //                 Ans -{" "}
    //                 <span className="f-13">
    //                   {data?.relationTerminated?.map((itm: any) => {
    //                     return <> {itm}, </>;
    //                   })}
    //                   .
    //                 </span>{" "}
    //               </span>
    //             </>
    //           )}
    //           {data?.relationTerminated?.includes("Other") && (
    //             <span className="f-13">Ans - {data?.otherTerminated}.</span>
    //           )}
    //         </div>
    //       </div>
    //       {data?.contract && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What type of contractual agreement did you have with the
    //             other party?
    //           </span>
    //           <span className="f-13">
    //             Ans -
    //             {data?.contract?.map((itm: any) => {
    //               return <> {itm}, </>;
    //             })}
    //             .
    //           </span>
    //         </div>
    //       )}
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Was there a notice period in the agreement?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.noticePeriod}</span>
    //         {data?.noticePeriod == "yes" && (
    //           <>
    //             <span className="title-questioner f-15  semi-bold d-block">
    //               Q - What was the notice period duration?{" "}
    //             </span>
    //             <span className="f-13">
    //               Ans - {data?.noticeDuration} Months
    //             </span>
    //           </>
    //         )}
    //       </div>

    //       {data?.factors && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - Were there any unique factors in your business relationship?
    //           </span>
    //           <span className="f-13">
    //             Ans -
    //             {data?.factors?.map((itm: any) => {
    //               return <> {itm}, </>;
    //             })}
    //             .
    //           </span>{" "}
    //         </div>
    //       )}
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What would have been a fair notice period in your opinion?{" "}
    //         </span>
    //         <span className="f-13">Ans - {data?.noticePeriod}.</span>
    //       </div>
    //       {data?.financial && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - Can you provide details about your financial interactions
    //             with the other party?
    //           </span>
    //           Ans -
    //           {data?.financial?.map((itm: any, i: any) => {
    //             return (
    //               <>
    //                 {itm?.name && itm?.amount && (
    //                   <span key={i} className="f-13">
    //                     <div>
    //                       Name:{itm?.name || "--"} | Amount:
    //                       {itm?.amount || "--"}
    //                     </div>
    //                   </span>
    //                 )}
    //               </>
    //             );
    //           })}
    //         </div>
    //       )}
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Can your accountant provide proof of the financial damage this
    //           has caused?
    //         </span>
    //         <span className="f-13">
    //           Ans - {data?.financialDamage}
    //           {data?.otherOutcome && (
    //             <>
    //               <span className="title-questioner f-15  semi-bold d-block">
    //                 Q - What is your current business situation?{" "}
    //               </span>
    //               <span className="f-13">Ans - {data?.currentSituation}.</span>
    //               {data?.currentSituation == "Other" && (
    //                 <span className="f-13">Ans - {data?.otherSituation}.</span>
    //               )}
    //             </>
    //           )}
    //         </span>
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What industry is your business in?
    //         </span>
    //         <span className="f-13">Ans - {data?.industry}</span>
    //         {data?.industry == "Other" && (
    //           <span className="f-13">Ans - {data?.otherIndustry}</span>
    //         )}
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What the current market conditions in your industry ?
    //         </span>
    //         <span className="f-13">Ans - {data?.marketCondition}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Are there any ongoing collective proceedings against you as a
    //           result of the other party&apos;s actions (for example, bankruptcy
    //           or creditor agreements)?
    //         </span>
    //         <span className="f-13">Ans - {data?.collective}</span>
    //         {data?.collective == "yes" && (
    //           <span className="f-13">Ans - {data?.proceedings}</span>
    //         )}
    //       </div>
    //       {data?.courtType && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What is the Include the name and location of the court
    //             handling the proceedings ?
    //           </span>
    //           <span className="f-13">Ans - {data?.courtType}</span>
    //         </div>
    //       )}
    //       {data?.courtName && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What is the Court Name ?
    //           </span>
    //           <span className="f-13">Ans - {data?.courtName}</span>
    //         </div>
    //       )}
    //       {data?.courtLocation && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What is the Court Location ?
    //           </span>
    //           <span className="f-13">Ans - {data?.courtLocation}</span>
    //           data?.courtLocation{" "}
    //         </div>
    //       )}
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How much notice, if any, did they give you before terminating
    //           the contract?
    //         </span>
    //         <span className="f-13">Ans - {data?.notice}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Did they accuse you of doing something wrong to justify
    //           terminating the contract with little or no notice?
    //         </span>
    //         <span className="f-13">Ans - {data?.somethingWrong}</span>
    //         {data?.somethingWrong == "yes" && (
    //           <>
    //             <span className="title-questioner f-15  semi-bold d-block">
    //               Q - What did they say you did wrong?
    //             </span>
    //             {data?.whatDidWrong?.map((itm: any, i: any) => {
    //               return (
    //                 <span key={i} className="f-13">
    //                   Ans - {itm?.label}
    //                 </span>
    //               );
    //             })}
    //             {data?.whatDidWrong?.includes("other") && (
    //               <span className="f-13">Ans - {data?.otherReason}</span>
    //             )}
    //           </>
    //         )}
    //       </div>
    //       {data?.issuesInvolve && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What the issues involve ?
    //           </span>
    //           <span className="f-13">Ans - {data?.issuesInvolve}</span>
    //           {(data?.issuesInvolve == "contract" ||
    //             data?.issuesInvolve == "both") &&
    //             data?.somethingWrong == "yes" && (
    //               <>
    //                 <span className="title-questioner f-15  semi-bold d-block">
    //                   Q - Which part of the contract did they say you broke?
    //                 </span>
    //                 <span className="f-13">Ans - {data?.contractBroke}</span>
    //               </>
    //             )}
    //         </div>
    //       )}
    //       {data?.endingIssue && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - Did they tell you about this issue before ending the
    //             contract?
    //           </span>
    //           <span className="f-13">Ans - {data?.endingIssue}</span>
    //         </div>
    //       )}
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

export default SuddenTermination;
