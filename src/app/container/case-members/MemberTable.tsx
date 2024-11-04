"use client";

import React, { useEffect, useState } from "react";
import Table, { Column } from "@/components/Table/Table";
import down from "@/assets/down.png";
import edit from "@/assets/pencil.png";
import delte from "@/assets/delete.png";

import "../../client/client.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import { Button } from "@/components/Form/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { upperFirst } from "lodash";
import { Cases } from "@/types/Cases";
import { useSession } from "next-auth/react";
import { useMembersTypes } from "@/queries/members";
import { Member as MemberType } from "@/types/Members";
import axios from "axios";
import useSnackbar from "@/hooks/useSnackbar";

interface TableData {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
}

interface CellProps {
  entry: TableData;
}

const MembersTable = ({ caseId }: { caseId: string }) => {
  const router = useRouter();
  const [page, setPage] = useState<any>(1);
  const [ExpertDetails, setExpert]: any = useState({});
  const [caseData, setCaseData] = useState<Cases>();

  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const { data } = useSession();
  const session = data?.user;

  // const { data, isLoading, isFetching, refetch } = useMembersTypes({
  //   caseId,
  //   page,
  // });

  // useEffect(() => {
  //   refetch();
  // }, [page]);

  const tableArr: Column<MemberType>[] = [
    {
      field: "name",
      title: "Name",
      Cell({ entry: { name } }) {
        return <span>{upperFirst(name)}</span>;
      },
    },
    {
      field: "email",
      title: "Email",
      Cell({ entry: { email } }) {
        return <span> {upperFirst(email) ?? "NA"}</span>;
      },
    },
    {
      field: "phone",
      title: "Phone Number",
      Cell({ entry: { phone } }) {
        return <span> {upperFirst(phone) ?? "NA"}</span>;
      },
    },
    {
      field: "gender",
      title: "Gender",
      Cell({ entry: { gender } }) {
        return <span> {upperFirst(gender) ?? "NA"}</span>;
      },
    },
  ];

  // const deleteMember = async (id: string) => {
  //   try {
  //     await axios.delete(`/api/client/case-member/${id}`);
  //     openSnackbar({
  //       message: "Member deleted successfuly!",
  //       type: "success",
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     refetch();
  //   }
  // };

  const GetexpertDetails = () => {
    axios
      .get("/api/expert/get")
      .then((res: any) => {
        if (res.data?.success) {
          setExpert(res?.data?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    GetexpertDetails();

    const getCaseById = async () => {
      try {
        if (caseId) {
          const { data } = await axios.get(
            `/api/client/case/get-case?caseId=${caseId}`
          );
          setCaseData(data?.data);
        }
      } catch (error) {
        console.log("err", error);
      }
    };
    getCaseById();
  }, [caseId]);

  return (
    <div className="main-content expert-cases case-members">
      <div className="cases-details-liti white-card rounded-lg mt-4  p-4">
        <h4 className="f-18 pb-2">Representative Individual</h4>
        <div className="cases-liti bglightblue rounded-lg d-flex flex-wrap">
          <p className="mb-0 f-14 d-flex gap-4">
            <span> Name :</span>
            <span className="semi-bold">{caseData?.user?.firstName}</span>
          </p>
          <p className="mb-0 f-14 d-flex gap-4">
            <span>Email :</span>
            <span className="semi-bold">{caseData?.user?.email}</span>
          </p>

          <p className="mb-0 f-14 d-flex gap-4">
            <span>Mobile No :</span>
            <span className="semi-bold">{caseData?.user?.phoneNumber}</span>
          </p>
          <p className="mb-0 f-14 d-flex gap-4">
            <span>DOB :</span>
            <span className="semi-bold">{caseData?.user?.dob}</span>
          </p>
          {/* <p className="mb-0 f-14 d-flex justify-content-between">
            <span>Gender :</span>
            <span className="semi-bold">{session?.gender}</span>
          </p> */}
        </div>

        {/* <div className="cases-list-table res-table-box">
          {isLoading || isFetching ? (
            <div className="text-center mt-5">
              <CircularProgress />
            </div>
          ) : (
            <Table<MemberType>
              data={data?.data ?? []}
              dataPerPage={5}
              currentPage={data?.currentPage ?? 1}
              totalEntries={data?.totalEntries ?? 5}
              handlePageChange={(e, page) => {
                setPage(page);
                refetch();
              }}
              columns={
                role == "client"
                  ? [
                      ...tableArr,
                      {
                        field: "_id",
                        title: "Actions",
                        Cell({ entry: { _id } }) {
                          return (
                            <>
                              <span className="d-flex gap-3">
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    router.push(
                                      `/client/case-members/edit?id=${_id}`
                                    )
                                  }
                                >
                                  <Image src={edit} alt="" className="" />
                                </span>

                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    deleteMember(_id ?? "");
                                  }}
                                >
                                  <Image src={delte} alt="" className="" />
                                </span>
                              </span>
                            </>
                          );
                        },
                      },
                    ]
                  : tableArr
              }
            />
          )}
        </div> */}
      </div>

      <div className="cases-details-liti legal-experts white-card rounded-lg mt-4  p-4">
        <h4 className="f-18 pb-2">Legal Expert</h4>
        <div className="cases-liti bglightblue rounded-lg d-flex flex-wrap">
        <p className="mb-0 f-14 d-flex gap-4">
            <span> Name :</span>
            <span className="semi-bold">{ExpertDetails?.firstName}</span>
          </p>
          <p className="mb-0 f-14 d-flex gap-4">
            <span>Email :</span>
            <span className="semi-bold">{ExpertDetails?.email}</span>
          </p>

          <p className="mb-0 f-14 d-flex gap-4">
            <span>Mobile No :</span>
            <span className="semi-bold">{ExpertDetails?.phoneNumber}</span>
          </p>
          <p className="mb-0 f-14 d-flex gap-4">
            <span>DOB :</span>
            <span className="semi-bold">{ExpertDetails?.dob}</span>
          </p>
          <p className="mb-0 f-14 d-flex gap-4">
            <span>Gender :</span>
            <span className="semi-bold">{ExpertDetails?.gender}</span>
          </p>
          <p className="mb-0 f-14 d-flex gap-4">
            <span>Expertise :</span>
            <span className="semi-bold">{ExpertDetails?.expertise}</span>
          </p>
        </div>
      </div>

      <div className="cases-details-liti white-card rounded-lg mt-4  p-4">
        <h4 className="f-18 pb-2">Lawyer</h4>
        <div className="cases-liti bglightblue rounded-lg d-flex flex-wrap">
        <p className="mb-0 f-14 d-flex gap-4">
            <span> Experience :</span>
            <span className="semi-bold">
              {caseData?.lawyer?.experiences ?? "Not Assigned"}
            </span>
          </p>
          <p className="mb-0 f-14 d-flex gap-4">
            <span>License ID no :</span>
            <span className="semi-bold">
              {caseData?.lawyer?.licenseId ?? "Not Assigned"}
            </span>
          </p>

          <p className="mb-0 f-14 d-flex gap-4">
            <span>Company :</span>
            <span className="semi-bold">
              {caseData?.lawyer?.company ?? "Not Assigned"}
            </span>
          </p>
          <p className="mb-0 f-14 d-flex gap-4">
            <span>Location :</span>
            <span className="semi-bold">
              {caseData?.lawyer?.location ?? "Not Assigned"}
            </span>
          </p>
          <p className="mb-0 f-14 d-flex gap-4">
            <span>Rating :</span>
            <span className="semi-bold">
              {caseData?.lawyer?.rating ?? "Not Assigned"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MembersTable;
