"use client";

import React from "react";
import "../../../client/client.css";
import { Link } from "@mui/material";
import { Cases } from "@/types/Cases";
import { upperFirst } from "lodash";
import moment from "moment";

export const Questioner = ({
  role,
  data,
}: {
  role: string;
  data: Cases | undefined;
}) => {
  console.log(data);
  const initialStatus = data?.proceduralStatus?.initialStatus;
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
        <Link
          className="f-14 dark"
          href={`/${role}/questionnaire?id=${data?._id}`}
        >
          View more
        </Link>
      </div>
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q 1 - What is your role or status in relation to the claim or
              issue at hand?
            </span>
            <span className="f-13">
              Ans -{" "}
              {data?.role == "directParty"
                ? "I am the person or company directly harmed."
                : data?.role == "leadRepresentative"
                ? "I was harmed, and I'm representing a group with the same issue."
                : data?.role == "authRepresentative"
                ? "I handle legal and financial matters for someone else's claim."
                : "I'm a legal professional or authorized association (per the law of July 1, 1901)."}
            </span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q 2 - Are you seeking to build a case as an individual or as a
              representative of a company?
            </span>
            <span className="f-13">
              Ans - {upperFirst(data?.isIndividual)}.
            </span>
          </div>
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q 3 -{" "}
              {data?.isIndividual == "individual"
                ? "Please provide the individual details"
                : "Please provide the company details"}
            </span>
            <span className="f-13">
              Ans -
              {data?.isIndividual == "individual" ? (
                <ul>
                  <li>
                    <span className="f-13">
                      Firstname: {data?.individualData?.firstName}
                    </span>
                  </li>

                  <li>
                    <span className="f-13">
                      Lastname: {data?.individualData?.lastName}
                    </span>
                  </li>
                  <li>
                    <span className="f-13">
                      Email: {data?.individualData?.email}
                    </span>
                  </li>

                  <li>
                    <span className="f-13">
                      Phone No.: {data?.individualData?.phone}
                    </span>
                  </li>

                  <li>
                    <span className="f-13">
                      Address: {data?.individualData?.address}
                    </span>
                  </li>
                </ul>
              ) : (
                <>
                  {!data?.companyData?.directDetails ? (
                    <ul>
                      <li>
                        <span className="f-13">
                          Registeration no.: {data?.companyData?.reg_no}
                        </span>
                      </li>
                      <li>
                        <span className="f-13">
                          Company name: {data?.companyData?.companyName}
                        </span>
                      </li>

                      <li>
                        <span className="f-13">
                          Address: {data?.companyData?.address}
                        </span>
                      </li>

                      <li>
                        <span className="f-13">
                          Legal Representative:{" "}
                          {data?.companyData?.legalRepresentative}
                        </span>
                      </li>
                      <li>
                        <span className="f-13">
                          Phone No.: {data?.companyData?.phone_number}
                        </span>
                      </li>

                      <li>
                        <span className="f-13">
                          Address: {data?.companyData?.address}
                        </span>
                      </li>
                    </ul>
                  ) : (
                    <ul>
                      <li>
                        <span className="f-13">
                          Direct Phone:{" "}
                          {data?.companyData?.directDetails?.directPhone}
                        </span>
                      </li>

                      <li>
                        <span className="f-13">
                          Direct Email:{" "}
                          {data?.companyData?.directDetails?.directEmail}
                        </span>
                      </li>
                    </ul>
                  )}
                </>
              )}
              .
            </span>
          </div>

          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q 4 - Do you currently have legal representation for your case?
            </span>
            <span className="f-13">
              Ans - {upperFirst(data?.legalSupport)}.
            </span>
          </div>

          {/* {data?.legalSupport == "yes" && (
            <>
              <div className="p-3 border-btm-lgt">
                <span className="title-questioner f-15  semi-bold d-block">
                  Q - What is the type of organization?
                </span>
                <span className="f-13">
                  Ans - {upperFirst(data?.legalSupportType)}.
                </span>
              </div>

              <div className="p-3 border-btm-lgt">
                <span className="title-questioner f-15  semi-bold d-block">
                  Q - What is the name of legal representation for your case?"
                </span>
                <span className="f-13">
                  Ans - {upperFirst(data?.legalSupportName)}.
                </span>
              </div>
            </>
          )}
          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Do you have any legal insurance or protection coverage?
            </span>
            <span className="f-13">
              Ans - {upperFirst(data?.legalInsurance)}.
            </span>
          </div>
          {data?.legalInsurance == "yes" && (
            <>
              <div className="p-3 border-btm-lgt">
                <span className="title-questioner f-15  semi-bold d-block">
                  Q - Could you please provide the name of the legal insurance
                  provider?
                </span>
                <span className="f-13">
                  Ans - {upperFirst(data?.insuranceProvider)}.
                </span>
              </div>

              <div className="p-3 border-btm-lgt">
                <span className="title-questioner f-15  semi-bold d-block">
                  Q - What is the policy number of the legal insurance?
                </span>
                <span className="f-13">Ans - {data?.policyNumber}.</span>
              </div>
              <div className="p-3 border-btm-lgt">
                <span className="title-questioner f-15  semi-bold d-block">
                  Q - What is the protection coverage for the legal insurance?
                </span>
                <span className="f-13">Ans - {data?.coverage}.</span>
              </div>
            </>
          )}

          {data?.role !== "directParty" && (
            <>
              <div className="p-3 border-btm-lgt">
                <span className="title-questioner f-15  semi-bold d-block">
                  Q - Do any of the represented individuals include your married
                  spouse and/or minor children under your parental authority?
                </span>
                <span className="f-13">
                  Ans - {upperFirst(data?.groupInfo?.isSpouse)}
                </span>
              </div>

              {data?.groupInfo?.isSpouse == "yes" && (
                <>
                  <div className="p-3 border-btm-lgt">
                    <span className="title-questioner f-15  semi-bold d-block">
                      Q - Please provide the represented individuals details?
                    </span>
                    <span className="f-13">
                      Ans -
                      {data &&
                        data.groupInfo?.personData.map((i, index) => (
                          <div key={index}>
                            <span className="semi-bold">
                              {" "}
                              Person {index + 1}{" "}
                            </span>

                            <ul>
                              <li>
                                <span className="f-13">Name: {i?.name}</span>
                              </li>

                              <li>
                                <span className="f-13">
                                  Surname: {i?.surname}
                                </span>
                              </li>

                              <li>
                                <span className="f-13">
                                  DOB: {moment(i?.dob).format("DD-MM-YYYY")}
                                </span>
                              </li>
                            </ul>
                          </div>
                        ))}
                    </span>
                  </div>
                </>
              )}

              <div className="p-3 border-btm-lgt">
                <span className="title-questioner f-15  semi-bold d-block">
                  Q - Did others choose you as their representative?
                </span>

                <span className="f-13">
                  Ans - {upperFirst(data?.groupInfo?.isRepresentative)}
                </span>
              </div>

              {data?.groupInfo?.isRepresentative == "yes" && (
                <>
                  <div className="p-3 border-btm-lgt">
                    <span className="title-questioner f-15  semi-bold d-block">
                      Q9 - Please provide the representative details?
                    </span>
                    <span className="f-13">
                      Ans -
                      <ul>
                        <li>
                          <span className="f-13">
                            Name: {upperFirst(data?.groupInfo?.first_name)}
                          </span>
                        </li>

                        <li>
                          <span className="f-13">
                            Lastname: {upperFirst(data?.groupInfo?.last_name)}
                          </span>
                        </li>

                        <li>
                          <span className="f-13">
                            Email:{" "}
                            {upperFirst(data?.groupInfo?.representative_email)}
                          </span>
                        </li>

                        <li>
                          <span className="f-13">
                            Phone No.:{" "}
                            {upperFirst(
                              data?.groupInfo?.representative_phone_no
                            )}
                          </span>
                        </li>

                        <li>
                          <span className="f-13">
                            Address:{" "}
                            {upperFirst(
                              data?.groupInfo?.representativeLocation
                            )}
                          </span>
                        </li>
                      </ul>
                    </span>
                  </div>
                </>
              )}
            </>
          )}

          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - What is the type of opposing party?
            </span>
            <span className="f-13">Ans - {upperFirst(data?.opposing)}</span>

            {data?.opposing == "individual" && (
              <div>
                <span className="semi-bold">Individual Details:</span>
                <ul>
                  <li>
                    <span className="f-13">
                      First name:{" "}
                      {upperFirst(data?.opposingIndividual?.first_name)}
                    </span>
                  </li>

                  <li>
                    <span className="f-13">
                      Last name:{" "}
                      {upperFirst(data?.opposingIndividual?.last_name)}
                    </span>
                  </li>

                  <li>
                    <span className="f-13">
                      Email: {upperFirst(data?.opposingIndividual?.email)}
                    </span>
                  </li>

                  <li>
                    <span className="f-13">
                      Phone No.:{" "}
                      {upperFirst(data?.opposingIndividual?.phone_no)}
                    </span>
                  </li>
                  <li>
                    <span className="f-13">
                      Address: {upperFirst(data?.opposingIndividual?.location)}
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {data?.opposing == "company" && (
              <div>
                <span className="semi-bold">Company Details:</span>
                <ul>
                  <li>
                    <span className="f-13">
                      Registration No.:{" "}
                      {upperFirst(data?.opposingCompany?.reg_no)}
                    </span>
                  </li>

                  <li>
                    <span className="f-13">
                      Company name:{" "}
                      {upperFirst(data?.opposingCompany?.companyName) ?? "NA"}
                    </span>
                  </li>

                  <li>
                    <span className="f-13">
                      Address:{" "}
                      {upperFirst(data?.opposingCompany?.address) ?? "NA"}
                    </span>
                  </li>

                  <li>
                    <span className="f-13">
                      Legal representative:{" "}
                      {upperFirst(data?.opposingCompany?.legal) ?? "NA"}
                    </span>
                  </li>
                  <li>
                    <span className="f-13">
                      Contact name:{" "}
                      {upperFirst(data?.opposingCompany?.contact_name) ?? "NA"}
                    </span>
                  </li>

                  <li>
                    <span className="f-13">
                      Contact email:{" "}
                      {upperFirst(data?.opposingCompany?.contact_email) ?? "NA"}
                    </span>
                  </li>

                  <li>
                    <span className="f-13">
                      Phone no.:{" "}
                      {upperFirst(data?.opposingCompany?.phone_no) ?? "NA"}
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - What is the initial status of claim?
            </span>

            <span className="f-13">
              Ans -{" "}
              {initialStatus == "not_taken"
                ? "I have not taken any steps yet"
                : initialStatus == "amicable_claim"
                ? "I have initiated an amicable claim"
                : initialStatus == "first_instance"
                ? "I have obtained a first-instance decision"
                : "I am involved in an appeal procedure"}
            </span>
          </div>

          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - Could you please provide the lawyer details?
            </span>

            <span className="f-13">
              Ans -
              <ul>
                <li>
                  <span className="f-13">
                    First name:{" "}
                    {upperFirst(data?.lawyer?.name) ?? "NA"}
                  </span>
                </li>
               

                <li>
                  <span className="f-13">
                    Email: {upperFirst(data?.lawyer?.email) ?? "NA"}
                  </span>
                </li>

                <li>
                  <span className="f-13">
                    Phone no.:{" "}
                    {upperFirst(data?.lawyer?.phoneNumber) ?? "NA"}
                  </span>
                </li>

               
              </ul>
            </span>
          </div>

          <div className="p-3 border-btm-lgt">
            <span className="title-questioner f-15  semi-bold d-block">
              Q - What is the case category?
            </span>

            <span className="f-13">
              Ans - {upperFirst(data?.category) ?? "NA"}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};
