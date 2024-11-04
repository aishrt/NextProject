"use client";
import React from "react";

import { CSSTransition } from "react-transition-group";
import "./style.css";
import moment from "moment";
import { CircularProgress, Link, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bell from "@/assets/bell.png";
import { axios } from "@/utils/axios";

function NotificationBar({
  isOpen,
  handleCloseModal,
  data,
  isLoading,
  role,
}: any) {
  const router = useRouter();
  const notifications = [
    {
      type: "New Sale",
      message: "Marina Jonas just purchased Apple Watch Series 7 from website.",
      time: "2 hours ago",
      icon: "🔔", // Example of a bell icon
    },
    {
      type: "Weekly Earning Report",
      message:
        "Your weekly earning report is ready now. To see the report, click here.",
      time: "3 hours ago",
      icon: "📊", // Example of a bar chart icon
    },
    {
      type: "New Sale",
      message:
        "Dawlin Bartia just purchased Apple Watch Series 7 from website.",
      time: "4 hours ago",
      icon: "🔔",
    },
    {
      type: "New Sale",
      message: "Kristen Alis just purchased Apple Watch Series 7 from website.",
      time: "1 day ago",
      icon: "🔔",
    },
  ];

  const RedirectUser = (key: any, id: any) => {
    handleCloseModal();
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

      case "switchCase":
      case "caseAssigned":
        return router.push(`/${role}/cases-list?type=litigation`);
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
    <>
      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="modal-notification"
        unmountOnExit
      >
        <div className="modal-container">
          <div className="modal-content">
            <button onClick={handleCloseModal} className="close-button">
              &times;
            </button>
            <label className="f-26 fw-500">Notifications</label>
            {isLoading ? (
              <p className="text-center my-4">
                {" "}
                <CircularProgress size="30px" />{" "}
              </p>
            ) : (
              <ul className="ps-0 list-style-none notifi-list fw-400">
                {data?.length == 0 && (
                  <p className="text-center">No notifications found</p>
                )}

                {data?.slice(0, 3)?.map((notification: any, index: any) => (
                  <>
                    {notification?.type !== "switchCase" && (
                      <li
                        className="py-3 border-bottom cursor"
                        key={index}
                        onClick={async () => {
                          await axios.put(`/api/notifications/read`, {
                            ids: [notification?._id],
                          });
                          RedirectUser(
                            notification?.type,
                            notification?.caseId?._id
                          );
                        }}
                      >
                        <span
                          role="img"
                          aria-label={notification.type}
                          className="notification-icon"
                        >
                          {/* {notification.icon} */}
                          <Image src={bell} className="note-ico" alt="" />
                        </span>
                        <div className="right-side-niti">
                          <span className="notification-message fw-400">
                            <Tooltip title={"New task created"}>
                              <>
                                {notification.title}
                                {notification?.caseId && (
                                  <p className="fw-400 mb-0">
                                    #{notification?.caseId?.referenceId}
                                  </p>
                                )}
                              </>
                            </Tooltip>
                          </span>
                          <span
                            className="notification-time  ml-2 text-end d-block"
                            style={{ marginLeft: "3px" }}
                          >
                            {moment(notification.createdAt).fromNow()}
                          </span>
                        </div>
                      </li>
                    )}
                  </>
                ))}

                {data?.length > 0 && (
                  <div className="text-center mt-1">
                    <a
                      onClick={() => {
                        handleCloseModal();
                        router.push(`/${role}/notifications`);
                      }}
                      className="view-dc-gray dark rounded-lg px-4 py-3"
                    >
                      View All Notifications
                    </a>
                  </div>
                )}
              </ul>
            )}
          </div>
        </div>
      </CSSTransition>
    </>
  );
}

export default NotificationBar;
