"use client";
import React, { useEffect, useState } from "react";
import "../../expert/expert.css";
import { Alert, CircularProgress, Link } from "@mui/material";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import { axios } from "@/utils/axios";
import { useSession } from "next-auth/react";
import moment from "moment";
import logo from "@/assets/logo.jpeg";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Snackbar, Pagination } from "@mui/material";
import Stack from "@mui/material/Stack";
import { getAllNotifications, useNotifications } from "@/queries/notifications";
import { usePagination } from "@/hooks/usePagination";
import useSnackbar from "@/hooks/useSnackbar";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingButton from "@mui/lab/LoadingButton";

export default function Notifications({ role }: { role: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const caseId: string = params?.get("id")!;

  const { data } = useSession();
  const session = data?.user;
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const { page, changePage } = usePagination();
  // const { isFetching, refetch } = useNotifications({
  //   page: page,
  //   caseId: caseId ?? "",
  // });
  console.log(caseId, "case id");
  const [load, setLoad] = useState<boolean>(false);

  const [count, setCount] = useState<number>(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<any>();

  useEffect(() => {
    // refetch();
  }, [session, page, caseId]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const notify = await getAllNotifications(page, session, caseId ?? "");
        setNotification(notify);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [session, caseId, page]);

  const handleSelect = (id: string) => {
    let curSelected = [...selected];
    if (curSelected.includes(id)) {
      curSelected = curSelected.filter((i) => i !== id);
    } else {
      curSelected.push(id);
    }
    setSelected(curSelected);
  };

  const selectAll = () => {
    if (selected.length === notification?.data?.length) {
      setSelected([]);
    } else {
      const currentSelected = notification?.data?.map((i: any) => i._id);
      if (currentSelected) {
        setSelected(currentSelected);
      }
    }
  };

  const handleDelete = async () => {
    const payload = {
      ids: selected,
    };
    await axios.post(`/api/notifications/read`, {
      ids: selected,
    });
    openSnackbar({
      message: "Notification deleted successfuly",
      type: "success",
    });

    setSelected([]);
    // refetch();
    setCount(count - selected.length);
  };

  const handleRead = async () => {
    const payload = {
      ids: selected,
    };

    await axios.put(`/api/notifications/read`, {
      ids: selected,
    });
    openSnackbar({
      message: "Notification Read successfuly",
      type: "success",
    });
    setSelected([]);
    // refetch();
  };

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

      default:
        return;
        break;
    }
  };

  return (
    <div className="main-content expert-cases case-members request-doc-upload">
      <div className="top-br d-flex justify-content-between align-items-center ">
        <h2 className="f-24">Notifications</h2>
        {/* <LoadingButton
          loading={load}
          variant="contained"
          className="client-btn f-14 rounded-lg"
          size="large"
          onClick={() => {
            setLoad(true);
            router.back();
          }}
        >
          <span>Go Back</span>
        </LoadingButton> */}
      </div>

      <div className="heading">
        <div className="d-flex justify-content-end gap-2 mb-3 toper">
          {selected.length > 0 ? (
            <>
              {/* <button onClick={handleDelete}>
                Delete{" "}
                <span className="smallTert">
                  {selected.length > 0 ? selected.length : null}
                </span>
              </button> */}
              <button onClick={handleRead}>
                Read{" "}
                <span className="smallTert">
                  {selected.length > 0 ? selected.length : null}
                </span>
              </button>
            </>
          ) : null}
          {notification?.data?.length !== 0 && (
            <button onClick={selectAll}>
              {selected.length === notification?.data?.length
                ? "Unselect All"
                : "Select All"}
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="my-5 text-center">
          <CircularProgress />{" "}
        </p>
      ) : (
        <div className="notification-box">
          {notification?.data?.length == 0 && (
            <div className="white-card p-5 rounded my-5 text-center">
              <h5 className="mb-1 semi-bold" style={{ color: "#696969" }}>
                No new notification
              </h5>
            </div>
          )}
          {notification?.data
            ?.slice(0, count)
            .map((val: any, index: number) => (
              <div key={index} className="white-card p-4 rounded my-3">
                <div className="row">
                  <div className="col-12 col-md-2  d-flex justify-content-center gap-3 ">
                    <input
                      type="checkbox"
                      style={{ width: "20px" }}
                      checked={selected.includes(val?._id)}
                      onChange={() => {
                        handleSelect(val?._id);
                      }}
                    />

                    {!val.isRead && <span className="text-dark mt-4">•</span>}
                    {/* <div className="">
                      <Image src={logo} width={80} height={60} alt="image" />
                    </div> */}
                  </div>

                  <div
                    className="col-12 col-md-7 cursor"
                    onClick={async () => {
                      await axios.put(`/api/notifications/read`, {
                        ids: [val?._id],
                      });
                      RedirectUser(val?.type, val?.caseId?._id);
                    }}
                  >
                    <h3 className="f-15">
                      <span className="gray">Case ID </span>
                      <span className="text-black">
                        # {val?.caseId?.referenceId}
                      </span>
                    </h3>
                    <h6 className="mb-1 semi-bold">{val?.title}</h6>
                    <p className="f-14 mb-0">{val?.description}</p>
                  </div>

                  <div className="col-12 col-md-3">
                    <div className="d-flex justify-content-center">
                      <p className="f-16  mt-2">
                        {moment(val?.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {notification && notification?.data?.length > 0 && (
            <div>
              <Stack>
                <Pagination
                  variant="outlined"
                  color="primary"
                  page={page}
                  count={notification?.totalPages}
                  onChange={(_: any, page: number) => {
                    changePage(page);
                  }}
                />
              </Stack>
            </div>
          )}
        </div>
      )}

      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
}
