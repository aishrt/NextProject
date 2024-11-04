import { upperFirst } from "lodash";
import moment from "moment";
import React from "react";

function NonCompititionClauseQuest({ data }: any) {
  return (
    <div
      className="case-details-pre rounded-lg mt-4"
      style={{ background: "#FFF" }}
    >
      <div
        className="headr-pre p-3 d-flex justify-content-between al  ign-items-center"
        style={{ background: "#A6D5CC", borderRadius: "10px 10px 0 0 " }}
      >
        <h3 className="f-18 semi-bold mb-0">Questioner</h3>
      </div>
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - In what industry do you primarily operate?
            </span>
            <span className="f-13">Ans -{data?.industrySector}</span>
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - How many employees are working for you?
              </span>
              <span className="f-13">Ans - {data?.numberOfEmployee}.</span>
            </div>
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What was your annual revenue for the previous year?
              </span>
              Ans -<span className="f-13">{data?.totalRevenue}.</span>
            </div>
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - How many months was the non-compete period set for?
              </span>
              Ans -<span className="f-13">{data?.nonCompetePeriod}</span>.
            </div>
          </div>

          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Was there financial compensation in exchange for the
              non-compete agreement?
            </span>
            <span className="f-13">Ans - {data?.compensation}</span>
            {data?.compensation == "yes" && (
              <>
                <span className="title-questioner f-15  semi-bold d-block">
                  Q - Please indicate the percentage of salary that was
                  allocated to it.
                </span>
                <span className="f-13">Ans - {data?.salaryPercentage}</span>
              </>
            )}
          </div>

          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Was the compensation for the non-compete clause part of
              individual contract or a collective bargaining agreement?
            </span>

            <span className="f-13">Ans - {data?.compensationSource}</span>
          </div>

          {data?.legalAction && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - For what reasons was the non-compete clause included in the
                agreement?{" "}
              </span>
              Ans -
              {data?.reasonsForClause?.map((itm: any, i: any) => {
                return (
                  <span className="f-13" key={i}>
                    {" "}
                    {itm},
                  </span>
                );
              })}
            </div>
          )}

          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Which activities are prohibited by the non-compete clause?
            </span>
            Ans -
            {data?.prohibitedActivities?.map((itm: any, i: any) => {
              return (
                <span className="f-13" key={i}>
                  {" "}
                  {itm},
                </span>
              );
            })}
          </div>

          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - In which department or area of the company was the work
              performed?{" "}
            </span>
            <span className="f-13">Ans - {data?.service}.</span>
          </div>

          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - In which industry sector does this non-compete agreement
              apply?
            </span>
            <span className="f-13">Ans - {data?.industrySectorCompany}.</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - What is the geographical scope of the clause? Does the
              geographical restriction apply to:{" "}
            </span>
            Ans -
            {data?.geoGraphical?.map((itm: any, i: any) => {
              return (
                <span className="f-13" key={i}>
                  {" "}
                  {itm},
                </span>
              );
            })}
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - What is the specified radius in kilometers?
            </span>

            <span className="f-13">Ans - {data?.employeeLocation}</span>
          </div>
          {data?.companyLocation && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What is the specified radius in kilometers?
              </span>

              <span className="f-13">Ans - {data?.companyLocation}</span>
            </div>
          )}

          {data?.city && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                To which city or region does the non-compete clause apply?
              </span>
              <span className="f-13"> Ans - {data?.city}</span>
            </div>
          )}
          {data?.departmental && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q -To which departments does the non-compete clause apply?{" "}
              </span>

              <span className="f-13">Ans -{data?.departmental}</span>
            </div>
          )}
          {data?.categoryOfTangible?.length != 0 && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Was it explicitly stated that the non-compete clause would
                remain in effect after the employment relationship ended?
              </span>

              <span className="f-13">Ans -{data?.explicitly}</span>
            </div>
          )}
          {data?.penaltyClause && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Is there a penalty clause attached to the non-competition
                clause?{" "}
              </span>

              <span className="f-13">Ans - {data?.penaltyClause}</span>
            </div>
          )}
          {data?.penaltyAmount && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What is the penalty amount (in months of salary)?
              </span>
              <span className="f-13"> Ans - {data?.penaltyAmount}</span>
            </div>
          )}
          {data?.judicialRequest && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Has a judicial request for the reduction of the penalty
                amount been made?
              </span>
              <span className="f-13"> Ans - {data?.judicialRequest}</span>
            </div>
          )}
          {data?.breach && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Has a breach of the non-compete clause been alleged or
                identified?
              </span>
              <span className="f-13"> Ans - {data?.breach}</span>
            </div>
          )}
          {data?.clauseBelieved && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - How is the clause believed to have been violated?
              </span>
              <span className="f-13"> Ans - {data?.clauseBelieved}</span>
            </div>
          )}
          {data?.newCompany && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What is the name of the new company?
              </span>
              <span className="f-13"> Ans - {data?.newCompany}</span>
            </div>
          )}
          {data?.position && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What is the position at the new company?
              </span>
              <span className="f-13"> Ans - {data?.position}</span>
            </div>
          )}
          {data?.companyCompete && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Does the new employment or business activity directly
                compete with the previous employment?
              </span>
              <span className="f-13"> Ans - {data?.companyCompete}</span>
            </div>
          )}
          {data?.newBusiness && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What is the name of the new business?
              </span>
              <span className="f-13"> Ans - {data?.newBusiness}</span>
            </div>
          )}
          {data?.typeOfBusiness && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What type of business is it?
              </span>
              <span className="f-13"> Ans - {data?.typeOfBusiness}</span>
            </div>
          )}
          {data?.businessCompete && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q -Does this new business directly compete with the previous
                employment?
              </span>
              <span className="f-13"> Ans - {data?.businessCompete}</span>
            </div>
          )}
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - When was the new business started?{" "}
            </span>
            <span className="f-13">
              {" "}
              Ans - {moment(data?.startJob).format("DD-MMM-YYYY")}
            </span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q -What evidence or information can be provided to support the
              claim of a breach of the non-compete clause?
            </span>
            Ans -
            {data?.violationEvidence?.map((itm: any, i: any) => {
              return (
                <span key={i} className="f-13">
                  {" "}
                  {itm},
                </span>
              );
            })}
            .
          </div>
          {data?.nonCompetitionClause?.length != 0 && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - How has the non-competition clause negatively affected you?
              </span>
              Ans -
              {data?.nonCompetitionClause?.map((itm: any, i: any) => {
                return (
                  <span key={i} className="f-13">
                    {" "}
                    {itm},
                  </span>
                );
              })}
            </div>
          )}
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - How has the alleged violation of the non-compete clause
              affected your business?
            </span>
            {data?.allegedViolation?.map((itm: any, i: any) => {
              return (
                <span key={i} className="f-13">
                  {" "}
                  Ans - {itm},
                </span>
              );
            })}
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q -Did you sign any separate confidentiality or non-disclosure
              agreements with the company?
            </span>
            <span className="f-13"> Ans - {data?.agreement}</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Did you try to negotiate the terms of the non-compete clause?
            </span>
            <span className="f-13"> Ans - {data?.negotiate}</span>
            {data?.negotiate == "yes" && (
              <>
                <span className="title-questioner f-15  semi-bold d-block">
                  Q - When ?
                </span>
                Ans -
                {data?.whenNegotiate?.map((itm: any, i: any) => {
                  return (
                    <span key={i} className="f-13">
                      {" "}
                      {itm},
                    </span>
                  );
                })}
              </>
            )}
          </div>
          {data?.numberOfDefendants && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - How many defendants are there?
              </span>
              <span className="f-13"> Ans - {data?.numberOfDefendants}</span>
            </div>
          )}
          {data?.defendantActivity && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What is the defendant company's sector of activity?
              </span>
              <span className="f-13"> Ans - {data?.defendantActivity}</span>
            </div>
          )}
          {data?.otherDetails && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Other Details ?
              </span>
              <span className="f-13"> Ans - {data?.otherDetails}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NonCompititionClauseQuest;
