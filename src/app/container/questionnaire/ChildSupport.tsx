import { upperFirst } from "lodash";
import moment from "moment";
import React from "react";
import ChildReview from "./childReview";

function ChildSupport({ data }: any) {
  return (
    <>
      <ChildReview data={data} />
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
    //           Q - What's your role in this request ?
    //         </span>
    //         <span className="f-13">Ans -{data?.role}</span>
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What is your Total Monthly Income (€) ?
    //           </span>
    //           <span className="f-13">Ans - {data?.monthlyIncome}.</span>
    //         </div>
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What is your Total Monthly Expenses (€) ?
    //           </span>
    //           <span className="f-13">Ans - {data?.monthlyExpenses}.</span>
    //         </div>
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - How many other children are you financially responsible for
    //             ?
    //           </span>
    //           <span className="f-13">Ans - {data?.children}.</span>
    //         </div>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is Other Parent's Monthly Income (€)?
    //         </span>
    //         <span className="f-13">Ans - {data?.otherMonthlyIncome}.</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is Other Parent's Monthly Expenses (€)?
    //           {/* {data?.isIndividual == "individual"
    //             ? "Please provide the individual details"
    //             : "Please provide the company details"} */}
    //         </span>
    //         <span className="f-13">Ans - {data?.otherMonthlyExpenses}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How many other children are is other parent financially
    //           responsible for ?
    //         </span>
    //         <span className="f-13">Ans - {data?.otherChildren}.</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is Proposed Amount (€) ?
    //         </span>
    //         <span className="f-13">Ans - {data?.proposedAmount || "NA"}.</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is Estimated Educational Expenses per child ?
    //         </span>
    //         <span className="f-13">Ans - {data?.educational}.</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Any additional relevant information ?
    //         </span>
    //         <span className="f-13">Ans - {upperFirst(data?.describe)}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Would you like to request spousal support (alimony) as well ?
    //         </span>
    //         <span className="f-13">
    //           Ans - {upperFirst(data?.spousalSupport)}
    //         </span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Which best describes you? ?
    //         </span>
    //         <span className="f-13">Ans - {upperFirst(data?.describe)}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How long were you married (in years) ?
    //         </span>
    //         <span className="f-13">Ans - {upperFirst(data?.describe)}</span>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default ChildSupport;
