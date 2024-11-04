import { upperFirst } from "lodash";
import moment from "moment";
import React from "react";

function OverTime({ data }: any) {
  return (
    <div
      className="case-details-pre rounded-lg mt-4"
      style={{ background: "#FFF" }}
    >
      <div
        className="headr-pre p-3 d-flex justify-content-between align-items-center"
        style={{ background: "#A6D5CC", borderRadius: "10px 10px 0 0 " }}
      >
        <h3 className="f-18 semi-bold mb-0">Questioner</h3>
      </div>
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Are you the employer or the employee filing the claim ?
            </span>
            <span className="f-13">
              Ans -{data?.role}
              {/* {data?.role == "directParty"
                ? "I am the person or company directly harmed."
                : data?.role == "leadRepresentative"
                ? "I was harmed, and I'm representing a group with the same issue."
                : data?.role == "authRepresentative"
                ? "I handle legal and financial matters for someone else's claim."
                : "I'm a legal professional or authorized association (per the law of July 1, 1901)."} */}
            </span>
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What is the Total Number of Employees in the Company ?
              </span>
              <span className="f-13">Ans - {data?.years}.</span>
            </div>
            {data?.role == "Employer" && (
              <>
                <div className="p-3 border-btm-lgt">
                  <span className="title-questioner f-15  semi-bold d-block">
                    Q - What is the Employer Age ?
                  </span>
                  <span className="f-13">Ans - {data?.age}.</span>
                </div>

                <div className="p-3 border-btm-lgt">
                  <span className="title-questioner f-15  semi-bold d-block">
                    Q - What is the Monthly Gross Salary (in euros)?
                  </span>
                  <span className="f-13">Ans - {data?.salary}.</span>
                </div>
                <div className="p-3 border-btm-lgt">
                  <span className="title-questioner f-15  semi-bold d-block">
                    Q - What is the Employment Status ?
                  </span>
                  <span className="f-13">Ans - {data?.employmentStatus}.</span>
                </div>
                <div className="p-3 border-btm-lgt">
                  <span className="title-questioner f-15  semi-bold d-block">
                    Q - What is the Work Department ?
                  </span>
                  <span className="f-13">Ans - {data?.workDepartment}.</span>
                </div>
              </>
            )}
            {data?.role == "Employee" && (
              <>
                <div className="p-3 border-btm-lgt">
                  <span className="title-questioner f-15  semi-bold d-block">
                    Q - What is the Department Number (French company
                    headquarters) ?
                  </span>
                  <span className="f-13">Ans - {data?.department}.</span>
                </div>

                <div className="p-3 border-btm-lgt">
                  <span className="title-questioner f-15  semi-bold d-block">
                    Q - What is the Total Number of Employees in the Company ?
                  </span>
                  <span className="f-13">Ans - {data?.years}.</span>
                </div>
              </>
            )}
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - What is Reason for Claim ?
            </span>
            <span className="f-13">Ans - {data?.claimReason}.</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Is there an existing collective agreement or procedure in
              place ?{" "}
              {/* {data?.isIndividual == "individual"
                ? "Please provide the individual details"
                : "Please provide the company details"} */}
            </span>
            <span className="f-13">Ans - {data?.agreement}</span>
          </div>

          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - What is Total Overtime Pay Amount Requested (€) ?
            </span>
            <span className="f-13">Ans - {data?.overtimePay}.</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Is this amount net or gross? ?
            </span>
            <span className="f-13">Ans - {data?.amountType}.</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q -What's the Health Status Before the Claim?
            </span>
            <span className="f-13">
              Ans - {upperFirst(data?.healthStatus)}
              <>
                <span className="title-questioner f-15  semi-bold d-block">
                  Q - What is Work Accident/Declared Unfit ?
                </span>
                <span className="f-13">Ans - {data?.workAccident}.</span>
              </>
            </span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q -What outcome is the employee seeking in this claim ?
            </span>
            <span className="f-13">
              Ans - {upperFirst(data?.outcome)}
              {data?.otherOutcome && (
                <>
                  <span className="title-questioner f-15  semi-bold d-block">
                    Q - What is other outcome is the employee seeking in this
                    claim ?
                  </span>
                  <span className="f-13">Ans - {data?.otherOutcome}.</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverTime;
