"use client";

import React from "react";
import Image from "next/image";
import "../../../client/client.css";
import logo from "@/assets/logo.jpeg";
import moment from "moment";
import { useRouter } from "next/navigation";
import { axios } from "@/utils/axios";

export const CaseNotifications = ({ caseId, data, role }: any) => {
  const router = useRouter();

  const RedirectUser = (key: any, id: any) => {
    switch (key) {
      case "caseCreated":
        return router.push(`/${role}/case-overview?id=${id}`);
        break;
      case "lawyerAssigned":
        return router.push(`/${role}/claim-evaluation-report-list`);
        break;
      case "financial":
        return router.push(`/${role}/financial-report?id=${id}`);
        break;

      case "evaluation":
      case "reportStatus":
        return router.push(`/${role}/eval-report?id=${id}`);
        break;
      case "taskAdd":
        return router.push(`/${role}/tasks?id=${id}`);
        break;

      case "taskComplete":
        return router.push(`/${role}/tasks`);
        break;

      case "switchCase":
      case "caseAssigned":
        return router.push(`/${role}/cases-list?type=litigation`);
        break;

      case "addDocument":
      case "docStatus":
        return router.push(`/${role}/case-documents/${id}`);
        break;

      case "caseUpdates":
        return router.push(`/${role}/case-updates?case_id=${id}`);
        break;

      case "caseRequest":
      case "counterStatus":
        return router.push(`/${role}/financial-report?id=${id}`);
        break;

      case "counterOffer":
      case "lawyerStatus":
        return router.push(`/${role}/case-requests`);
        break;
      case "carpaDoc":
        return router.push(`/${role}/litigation-case-complete?case_id=${id}`);
        break;
      case "quittense":
        return router.push(`/${role}/quitense?case_id=${id}`);
        break;

      default:
        return;
        break;
    }
  };

  return (
    <div
      className="case-details-pre rounded-lg doc-notifciations"
      style={{ background: "#FFF" }}
    >
      {/* <div className="headr-pre p-3 border-btm">
        <h3 className="f-18 semi-bold mb-0">Notifications </h3>
      </div> */}
      <div className="over-card-details">
        <div className="over-card-inner rounded">
          {data.slice(0, 3)?.map((val: any, index: number) => (
            <div key={index}>
              {val?.type !== "caseCreated" && (
                <div
                  className="f-14 p-3 border-btm-lgt d-flex flex-wrap cursor"
                  onClick={async () => {
                    // await axios.put(`/api/notifications/read`, {
                    //   ids: [val?._id],
                    // });
                    RedirectUser(val?.type, val?.caseId?._id);
                  }}
                >
                  <div className="overview-icon">
                    <Image src={logo} width={100} height={100} alt="image" />
                  </div>
                  <div className="overview-middle-cntent">
                    <h6 className="mb-1 semi-bold">{val?.title}</h6>
                    <p className="f-14 mb-0">{val?.description} </p>
                  </div>
                  <div className="text-end minutes-over">
                    {moment(val?.createdAt).fromNow()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="view-gray-btns d-flex gap-2 justify-content-center py-2 align-items-center">
          <a
            onClick={() => router.push(`/${role}/notifications?id=${caseId}`)}
            className="view-dc-gray dark rounded-lg px-4 py-3 cursor"
          >
            View All Notifications
          </a>
        </div>
      </div>
    </div>
  );
};
