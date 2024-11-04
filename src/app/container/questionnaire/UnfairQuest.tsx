import { upperFirst } from "lodash";
import moment from "moment";
import React from "react";

function UnfairQuest({ data }: any) {
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
              Q - How long have the unfair practices been happening?
            </span>
            <span className="f-13">Ans -{data?.unfairPractices}</span>
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Where did the unfair practices occur?
              </span>
              <span className="f-13">Ans - {data?.practiceOccur}.</span>
            </div>
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What kind of unfair practices are you experiencing?
              </span>
              Ans -
              {data?.practiceKind?.map((itm: any, i: any) => {
                return (
                  <span key={i} className="f-13">
                    {itm}.
                  </span>
                );
              })}
            </div>
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - If you lost customers, what was the context? (check all that
                apply)
              </span>
              Ans -
              {data?.customerDiversion?.map((itm: any, i: any) => {
                return (
                  <span key={i} className="f-13">
                    {" "}
                    {itm},
                  </span>
                );
              })}
              .
            </div>
          </div>
          {data?.describeDefameStatement && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Briefly describe the statements
              </span>
              <span className="f-13">
                Ans - {data?.describeDefameStatement}
              </span>
            </div>
          )}
          {data?.defamatoryStatement && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - How were the defamatory statements made?
              </span>
              {data?.defamatoryStatement?.map((itm: any, i: any) => {
                return (
                  <span key={i} className="f-13">
                    {itm},
                  </span>
                );
              })}{" "}
            </div>
          )}
          {data?.legalAction && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Do the statements relate to a legal action that resulted in
                a conviction?
                {/* {data?.isIndividual == "individual"
                ? "Please provide the individual details"
                : "Please provide the company details"} */}
              </span>
              <span className="f-13">Ans - {data?.legalAction}</span>
            </div>
          )}
          {data?.statements && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Are the statements false?
              </span>
              <span className="f-13">Ans - {data?.statements}</span>{" "}
            </div>
          )}
          {data?.isCompanyName && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Is your company named in the statement?
              </span>
              <span className="f-13">Ans - {data?.isCompanyName}.</span>
            </div>
          )}
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Were employees poached?
            </span>
            <span className="f-13">Ans - {data?.employeePoached}.</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - How many employees were involved?
            </span>
            <span className="f-13">Ans - {data?.numberOfEmployees}</span>
            <span className="title-questioner f-15  semi-bold d-block">
              Q - What were their positions?
            </span>
            {data?.employeePositions?.map((itm: any, i: any) => {
              return (
                <span key={i} className="f-13">
                  {itm},
                </span>
              );
            })}{" "}
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - What areas did they work in?
            </span>
            {data?.workAreas?.map((itm: any, i: any) => {
              return (
                <span key={i} className="f-13">
                  {itm},
                </span>
              );
            })}{" "}
          </div>
          {data?.dismissalAffected && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Compared to their previous job, did they receive ?
              </span>
              {data?.previousJob?.map((itm: any, i: any) => {
                return (
                  <span key={i} className="f-13">
                    {itm},
                  </span>
                );
              })}{" "}
            </div>
          )}

          {data?.experiencingConfusion && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Are you experiencing confusion between your
                products/services and the competitor's?
              </span>
              <span className="f-13"> Ans - {data?.experiencingConfusion}</span>
            </div>
          )}
          {data?.kindOfConfusion?.length != 0 && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What kind of confusion are you experiencing?
              </span>
              {data?.kindOfConfusion?.map((itm: any, i: any) => {
                return (
                  <span key={i} className="f-13">
                    {itm},
                  </span>
                );
              })}{" "}
            </div>
          )}
          {data?.categoryOfTangible?.length != 0 && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What category of tangible goods are involved?
              </span>
              {data?.categoryOfTangible?.map((itm: any, i: any) => {
                return (
                  <span key={i} className="f-13">
                    {itm},
                  </span>
                );
              })}{" "}
            </div>
          )}
          {data?.similarities?.length != 0 && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What are the similarities?
              </span>
              {data?.similarities?.map((itm: any, i: any) => {
                return (
                  <span key={i} className="f-13">
                    {itm},
                  </span>
                );
              })}{" "}
            </div>
          )}
          {data?.experiencingParasitism && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Are you experiencing parasitism (the competitor benefiting
                unfairly from your investments)?
              </span>
              <span className="f-13">
                {" "}
                Ans - {data?.experiencingParasitism}
              </span>
            </div>
          )}
          {data?.demonstrateInvestments && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Can you demonstrate the investments you've made?
              </span>
              <span className="f-13">
                {" "}
                Ans - {data?.demonstrateInvestments}
              </span>
            </div>
          )}
          {data?.investmentAmount && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Investments you've made Specify the amount (EUR):
              </span>
              <span className="f-13"> Ans - {data?.investmentAmount}</span>
            </div>
          )}
          {data?.competitorViolated && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Has the competitor violated any laws or regulations?
              </span>
              <span className="f-13"> Ans - {data?.competitorViolated}</span>
            </div>
          )}
          {data?.contractWithCompetingCompany && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Do you have a contract with the competing company?
              </span>
              <span className="f-13">
                {" "}
                Ans - {data?.contractWithCompetingCompany}
              </span>
            </div>
          )}
          {data?.typeOfContract && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - What type of contract?
              </span>
              <span className="f-13"> Ans - {data?.typeOfContract}</span>
            </div>
          )}
          {data?.contractIncludeClause && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Does the contract include a non-compete clause?
              </span>
              <span className="f-13"> Ans - {data?.contractIncludeClause}</span>
            </div>
          )}
          {data?.competitiveSituation && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Are you and the competing company in a competitive
                situation?
              </span>
              <span className="f-13"> Ans - {data?.competitiveSituation}</span>
            </div>
          )}
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Is your claim based on ?
            </span>
            <span className="f-13"> Ans - {data?.claimBasedOn}</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Is there an ongoing collective procedure against your company?
            </span>
            <span className="f-13"> Ans - {data?.collectiveProcedure}</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - What is your company's sector of activity?
            </span>
            <span className="f-13"> Ans - {data?.sectorOfActivity}</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q -How many employees does your company have?
            </span>
            <span className="f-13"> Ans - {data?.employeesCompanyHave}</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - What evidence do you have to support your claim?
            </span>
            {data?.evidenceSupport?.map((itm: any, i: any) => {
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
              Q - Have you experienced financial losses?
            </span>
            {data?.financialLosses?.map((itm: any, i: any) => {
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
              Q -Loss of revenue (EUR) ?
            </span>
            <span className="f-13"> Ans - {data?.revenueAmount}</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Loss of gross margin (EUR) ?
            </span>
            <span className="f-13"> Ans - {data?.grossMarginAmount}</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - How many defendants are there?
            </span>
            <span className="f-13"> Ans - {data?.numberOfDefendants}</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - What is the defendant company's sector of activity?
            </span>
            <span className="f-13"> Ans - {data?.defendantActivity}</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - How many employees does the defendant's company have?
            </span>
            <span className="f-13"> Ans - {data?.empDefendantCompanyHave}</span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Is the accused company linked to you by a former employee,
              executive, or partner?
            </span>
            <span className="f-13"> Ans - {data?.isAccusedCompanyLinked}</span>
          </div>
          {data?.profitability && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - How do you rate your business profitability?
              </span>
              <span className="f-13"> Ans - {data?.profitability}</span>
            </div>
          )}

          {data?.stillWorking && (
            <div className="p-3 border-btm-lgt">
              <span className="title-questioner f-15  semi-bold d-block">
                Q - Was the company created while the employee, executive, or
                partner was still working for you?
              </span>
              <span className="f-13"> Ans - {data?.stillWorking}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnfairQuest;
