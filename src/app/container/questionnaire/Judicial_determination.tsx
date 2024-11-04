import { upperFirst } from "lodash";
import moment from "moment";
import React from "react";
import Judicial_determinationReview from "./Judicial_determinationReview";

function Judicial_determination({ data }: any) {
  return (
    <>
      <Judicial_determinationReview formData={data} />
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
    //           Q - What is Initial Contract Effective Date ?
    //         </span>
    //         <span className="f-13">
    //           Ans -{moment(data?.contractDate).format("DD-MMM-YYYY")}{" "}
    //           {/* {data?.role == "directParty"
    //             ? "I am the person or company directly harmed."
    //             : data?.role == "leadRepresentative"
    //             ? "I was harmed, and I'm representing a group with the same issue."
    //             : data?.role == "authRepresentative"
    //             ? "I handle legal and financial matters for someone else's claim."
    //             : "I'm a legal professional or authorized association (per the law of July 1, 1901)."} */}
    //         </span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is Initial Contract Duration (Years) Initial Contract
    //           Duration ?
    //         </span>
    //         <span className="f-13">Ans - {data?.contractDuration}.</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is Initial Annual Rent Amount (€) ?{" "}
    //           {/* {data?.isIndividual == "individual"
    //             ? "Please provide the individual details"
    //             : "Please provide the company details"} */}
    //         </span>
    //         <span className="f-13">{data?.initialRent}</span>
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is Last Updated Annual Rent Amount (€) ?
    //         </span>
    //         <span className="f-13">Ans - {data?.lastRentNature}.</span>
    //       </div>

    //       {/* {data?.legalSupport == "yes" && (
    //         <>
    //           <div className="p-3 border-btm-lgt">
    //             <span className="title-questioner f-15  semi-bold d-block">
    //               Q - What is the type of organization?
    //             </span>
    //             <span className="f-13">
    //               Ans - {upperFirst(data?.legalSupportType)}.
    //             </span>
    //           </div>

    //           <div className="p-3 border-btm-lgt">
    //             <span className="title-questioner f-15  semi-bold d-block">
    //               Q - What is the name of legal representation for your case?
    //             </span>
    //             <span className="f-13">
    //               Ans - {upperFirst(data?.legalSupportName)}.
    //             </span>
    //           </div>
    //         </>
    //       )} */}
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Is Silent Renewals?
    //         </span>
    //         <span className="f-13">
    //           Ans - {upperFirst(data?.silentRenewal)}
    //           {data?.silentRenewal == "yes" && (
    //             <>
    //               <span className="title-questioner f-15  semi-bold d-block">
    //                 Q - What is the Number of Renewals Before Dispute ?
    //               </span>
    //               <span className="f-13">Ans - 200.</span>
    //               <span className="title-questioner f-15  semi-bold d-block">
    //                 Q -What is the Effective Date of Renewal Request/Offer ?
    //               </span>
    //               <span className="f-13">
    //                 Ans - {moment(data?.renewalDate).format("DD-MMM-YYYY")}.
    //               </span>
    //             </>
    //           )}
    //         </span>
    //       </div>
    //       {/* {data?.legalInsurance == "yes" && ( */}
    //       <>
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q -What is Nature of Last Updated Rent
    //           </span>
    //           <span className="f-13">
    //             Ans - {upperFirst(data?.lastRentNature)}.
    //           </span>
    //         </div>

    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What is the policy number of the legal insurance?
    //           </span>
    //           <span className="f-13">Ans - {data?.policyNumber}.</span>
    //         </div>
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What is the protection coverage for the legal insurance?
    //           </span>
    //           <span className="f-13">Ans - {data?.coverage}.</span>
    //         </div>
    //       </>
    //       {/* )} */}

    //       {/* {data?.role !== "directParty" && (
    //         <>
    //           <div className="p-3 border-btm-lgt">
    //             <span className="title-questioner f-15  semi-bold d-block">
    //               Q - Do any of the represented individuals include your married
    //               spouse and/or minor children under your parental authority?
    //             </span>
    //             <span className="f-13">
    //               Ans - {upperFirst(data?.groupInfo?.isSpouse)}
    //             </span>
    //           </div>

    //           {data?.groupInfo?.isSpouse == "yes" && (
    //             <>
    //               <div className="p-3 border-btm-lgt">
    //                 <span className="title-questioner f-15  semi-bold d-block">
    //                   Q - Please provide the represented individuals details?
    //                 </span>
    //                 <span className="f-13">
    //                   Ans -
    //                   {data &&
    //                     data.groupInfo?.personData.map((i, index) => (
    //                       <div key={index}>
    //                         <span className="semi-bold">
    //                           {" "}
    //                           Person {index + 1}{" "}
    //                         </span>

    //                         <ul>
    //                           <li>
    //                             <span className="f-13">Name: {i?.name}</span>
    //                           </li>

    //                           <li>
    //                             <span className="f-13">
    //                               Surname: {i?.surname}
    //                             </span>
    //                           </li>

    //                           <li>
    //                             <span className="f-13">
    //                               DOB: {moment(i?.dob).format("DD-MM-YYYY")}
    //                             </span>
    //                           </li>
    //                         </ul>
    //                       </div>
    //                     ))}
    //                 </span>
    //               </div>
    //             </>
    //           )}

    //           <div className="p-3 border-btm-lgt">
    //             <span className="title-questioner f-15  semi-bold d-block">
    //               Q - Did others choose you as their representative?
    //             </span>

    //             <span className="f-13">
    //               Ans - {upperFirst(data?.groupInfo?.isRepresentative)}
    //             </span>
    //           </div>

    //           {data?.groupInfo?.isRepresentative == "yes" && (
    //             <>
    //               <div className="p-3 border-btm-lgt">
    //                 <span className="title-questioner f-15  semi-bold d-block">
    //                   Q9 - Please provide the representative details?
    //                 </span>
    //                 <span className="f-13">
    //                   Ans -
    //                   <ul>
    //                     <li>
    //                       <span className="f-13">
    //                         Name: {upperFirst(data?.groupInfo?.first_name)}
    //                       </span>
    //                     </li>

    //                     <li>
    //                       <span className="f-13">
    //                         Lastname: {upperFirst(data?.groupInfo?.last_name)}
    //                       </span>
    //                     </li>

    //                     <li>
    //                       <span className="f-13">
    //                         Email:{" "}
    //                         {upperFirst(data?.groupInfo?.representative_email)}
    //                       </span>
    //                     </li>

    //                     <li>
    //                       <span className="f-13">
    //                         Phone No.:{" "}
    //                         {upperFirst(
    //                           data?.groupInfo?.representative_phone_no
    //                         )}
    //                       </span>
    //                     </li>

    //                     <li>
    //                       <span className="f-13">
    //                         Address:{" "}
    //                         {upperFirst(
    //                           data?.groupInfo?.representativeLocation
    //                         )}
    //                       </span>
    //                     </li>
    //                   </ul>
    //                 </span>
    //               </div>
    //             </>
    //           )}
    //         </>
    //       )} */}

    //       <div className="p-3 border-btm-lgt">
    //         <span className="semi-bold">
    //           Business Details & Lease Clauses :
    //         </span>

    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is the Business Activity Sector ?
    //         </span>
    //         <span className="f-13">
    //           Ans - {upperFirst(data?.businessActivity)}
    //         </span>

    //         <div>
    //           <span className="semi-bold">Favorable Clauses :</span>
    //           <ul>
    //             {data?.favorableClause?.map((itm: any, i: any) => {
    //               return (
    //                 <li key={i}>
    //                   <span className="f-13">{itm}</span>
    //                 </li>
    //               );
    //             })}
    //           </ul>
    //         </div>
    //         <div>
    //           <ul>
    //             <li>
    //               <span className="f-13">
    //                 {upperFirst(data?.businessActivity)} Activity.:{" "}
    //                 {upperFirst(data?.specificActivity)}
    //               </span>
    //             </li>
    //           </ul>
    //         </div>
    //         {data?.opposing == "company" && (
    //           <div>
    //             <span className="semi-bold">Company Details:</span>
    //             <ul>
    //               <li>
    //                 <span className="f-13">
    //                   Registration No.:{" "}
    //                   {upperFirst(data?.opposingCompany?.reg_no)}
    //                 </span>
    //               </li>

    //               <li>
    //                 <span className="f-13">
    //                   Company name:{" "}
    //                   {upperFirst(data?.opposingCompany?.companyName) ?? "NA"}
    //                 </span>
    //               </li>

    //               <li>
    //                 <span className="f-13">
    //                   Address:{" "}
    //                   {upperFirst(data?.opposingCompany?.address) ?? "NA"}
    //                 </span>
    //               </li>

    //               <li>
    //                 <span className="f-13">
    //                   Legal representative:{" "}
    //                   {upperFirst(data?.opposingCompany?.legal) ?? "NA"}
    //                 </span>
    //               </li>
    //               <li>
    //                 <span className="f-13">
    //                   Contact name:{" "}
    //                   {upperFirst(data?.opposingCompany?.contact_name) ?? "NA"}
    //                 </span>
    //               </li>

    //               <li>
    //                 <span className="f-13">
    //                   Contact email:{" "}
    //                   {upperFirst(data?.opposingCompany?.contact_email) ?? "NA"}
    //                 </span>
    //               </li>

    //               <li>
    //                 <span className="f-13">
    //                   Phone no.:{" "}
    //                   {upperFirst(data?.opposingCompany?.phone_no) ?? "NA"}
    //                 </span>
    //               </li>
    //             </ul>
    //           </div>
    //         )}
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is the initial status of claim?
    //         </span>

    //         <span className="f-13">
    //           Ans -{" "}
    //           {/* {initialStatus == "not_taken"
    //             ? "I have not taken any steps yet"
    //             : initialStatus == "amicable_claim"
    //             ? "I have initiated an amicable claim"
    //             : initialStatus == "first_instance"
    //             ? "I have obtained a first-instance decision"
    //             : "I am involved in an appeal procedure"} */}
    //         </span>
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Could you please provide the lawyer details?
    //         </span>

    //         <span className="f-13">
    //           Ans -
    //           <ul>
    //             <li>
    //               <span className="f-13">
    //                Name:{" "}
    //                 {upperFirst(data?.lawyer?.name) ?? "NA"}
    //               </span>
    //             </li>

    //             <li>
    //               <span className="f-13">
    //                 Email: {upperFirst(data?.lawyer?.email) ?? "NA"}
    //               </span>
    //             </li>

    //             <li>
    //               <span className="f-13">
    //                 Phone no.:{" "}
    //                 {upperFirst(data?.lawyer?.phoneNumber) ?? "NA"}
    //               </span>
    //             </li>

    //           </ul>
    //         </span>
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is the case category?
    //         </span>

    //         <span className="f-13">
    //           Ans - {upperFirst(data?.category) ?? "NA"}
    //         </span>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Judicial_determination;
