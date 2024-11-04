"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Table from "@/components/Table/Table";
import "../../../client/client.css";
import ellipse from "@/assets/ellipse.png";
import { IoCloseSharp } from "react-icons/io5";
import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
  Link,
} from "@mui/material";
import Button from "@mui/material/Button";
import report from "@/assets/update.png";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material";
import { FaCheck } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import { axios } from "@/utils/axios";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import moment from "moment";
import { useRouter } from "next/navigation";
import claim1 from "@/assets/claim1.png";
import purchase from "@/assets/purchase.png";
import useSnackbar from "@/hooks/useSnackbar";

import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import { General } from "@/types/General";
export const PendingClaims = ({ setLoading }: { setLoading: any }) => {
  const [page, setPage] = useState(1);
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [listData, setListdata] = useState({
    data: [],
    currentPage: 0,
    totalEntries: 0,
  });
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  // const toggleDropdown = (  ) => {
  //   setIsDropdownOpen(!isDropdownOpen);
  //   setIsSubmenuOpen(false); // Close the submenu when the dropdown is toggled
  // };

  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (id: any) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };
  const router = useRouter();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [show, setShow] = React.useState(false);
  const [showPurchase, setPurchaseShow] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [general, setGeneralData] = useState<General>();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [id, setId] = useState();

  const options = ["Accept", "Reject"];
  const UpdateReportStatus = (id: any, status: any) => {
    axios
      .post("/api/report", { report_id: id, status: status })
      .then((res: any) => {
        console.log(res);
        if (res?.success) {
          openSnackbar({
            message: `Claim ${status}ed successfuly !`,
            type: "success",
          });
          setTimeout(() => {
            setLoading(true);
            GetReports();
          }, 1000);
        }
      });
  };

  const GetReports = () => {
    axios
      .get(
        `/api/report/list?page=${page}&status=pending&user_id=${session?.user?._id}`
      )
      .then((res: any) => {
        if (res?.success) {
          setListdata(res);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    if (session?.user?._id) GetReports();

    getFile();
  }, [session]);

  const GetStatus = (key: any) => {
    switch (key) {
      case "accept":
        return "Accepted";
        break;
      case "reject":
        return "Rejected";
        break;
      case "purchase":
        return "Purchased";
        break;

      default:
        return "Pending";
        break;
    }
  };
  const NavigatePage = (key: any) => {
    return router.push(`/client/${key}`);
  };

  const getFile = () => {
    axios.get("/api/admin/general").then((res: any) => {
      if (res?.success) {
        setGeneralData(res?.data);
      }
    });
  };

  return (
    <>
      <Table<any>
        currentPage={listData?.currentPage}
        totalEntries={listData?.totalEntries}
        data={listData?.data}
        clientPagination={false}
        handlePageChange={(e, page) => {
          setPage(page);
          GetReports();
        }}
        columns={[
          // { field: "ref_id", title: "Sr. No." },
          {
            field: "referenceID",
            title: "Reference ID",
            Cell({ entry: { case_id } }) {
              return <span className="">#{case_id?.referenceId}</span>;
            },
          },
          {
            field: "category",
            title: "Category",
            Cell({ entry: { case_id } }) {
              return <span className="">{case_id?.category || "NA"}</span>;
            },
          },
          {
            field: "createdAt",
            title: "Case Registered on",
            Cell({ entry: { case_id } }) {
              return (
                <span className="">
                  {moment(case_id?.createdAt).format("DD-MMM-YYYY")}
                </span>
              );
            },
          },
          {
            field: "createdAt",
            title: "Report Uploaded On",
            Cell({ entry: { createdAt } }) {
              return (
                <span className="">
                  {moment(createdAt).format("DD-MMM-YYYY")}
                </span>
              );
            },
          },

          {
            field: "ev_report",
            title: "Evaluation Report",
            Cell({ entry: { case_id } }) {
              return (
                <span>
                  <span className="action-btns d-flex align-items-center justify-content-center gap-2">
                    <span>
                      {case_id?.isEvalReport ? (
                        <Image
                          onClick={() =>
                            NavigatePage(`eval-report?id=${case_id?._id}`)
                          }
                          src={report}
                          alt=""
                          className="view-icons"
                        />
                      ) : (
                        "Pending"
                      )}{" "}
                    </span>
                  </span>
                </span>
              );
            },
          },
          {
            field: "fin_report",
            title: "Financial Report",
            Cell({ entry: { case_id } }) {
              return (
                <span>
                  <span className="action-btns d-flex align-items-center justify-content-center gap-2">
                    <span>
                      {case_id?.isFinancialReport ? (
                        <Image
                          onClick={() =>
                            NavigatePage(`financial-report?id=${case_id?._id}`)
                          }
                          src={report}
                          alt=""
                          className="view-icons"
                        />
                      ) : (
                        "Pending"
                      )}
                    </span>
                  </span>
                </span>
              );
            },
          },
          {
            field: "status",
            title: "Status",
            Cell({ entry: { status } }) {
              return (
                <span className="pending-status">{GetStatus(status)}</span>
              );
            },
          },
          {
            field: "action",
            title: "Action",
            Cell({ entry: { _id, status, case_id } }) {
              return (
                <span>
                  <span className="action-btns d-flex align-items-center gap-2  justify-content-center">
                    {status == "pending" ? (
                      <span>
                        {/* <Tooltip title={"Accept"}>
                          <FaCheck
                            onClick={() => {
                              router.push(
                                `/client/financial-report?id=${case_id?._id}`
                              );
                              //UpdateReportStatus(_id, "accept");
                            }}
                            className="cursor-pointer"
                            size={15}
                          />
                        </Tooltip>
                        <Tooltip title={"Accept"}>
                          <IoCloseSharp
                            onClick={() => {
                              // UpdateReportStatus(_id, "reject");
                              setShow(true);
                              setId(_id);
                            }}
                            size={15}
                            style={{ marginLeft: "5px" }}
                          />
                        </Tooltip> */}
                        <div className="menu-container">
                          <button
                            className="menu-button"
                            onClick={() => toggleDropdown(_id)} // Pass the unique ID
                          >
                            <Image
                              src="/assets/ellipse.png"
                              className="ellipse-ico"
                              alt=""
                              height={32}
                              width={32}
                            />
                          </button>
                          {openDropdownId == _id && (
                            <ul className="dropdown-menu">
                              <li>
                                <a
                                  className="cursor"
                                  onClick={() => {
                                    router.push(
                                      `/client/financial-report?id=${case_id?._id}`
                                    );
                                    //UpdateReportStatus(_id, "accept");
                                  }}
                                >
                                  Accept
                                </a>
                              </li>
                              <li>
                                <a
                                  className="cursor"
                                  onClick={() => {
                                    // UpdateReportStatus(_id, "reject");
                                    setShow(true);
                                    setId(_id);
                                    setIsDropdownOpen(false);
                                  }}
                                >
                                  Reject
                                </a>
                              </li>
                            </ul>
                          )}
                        </div>
                      </span>
                    ) : null}
                  </span>
                </span>
              );
            },
          },
        ]}
      />

      <Dialog
        fullScreen={fullScreen}
        open={show}
        // onClose={handleHide}
        className="assgn-succes-modal"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <IconButton
            aria-label="close"
            onClick={() => setShow(false)}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="assign-lawyer-success text-center">
            <div className="">
              <Image src={claim1} className="assign-trf-sucess" alt="image" />
              <div className="assign-law-cnt mt-4">
                <h4 className="f-22 semi-bold">
                  Our offer doesn&apos;t satisfy you! Here&apos;s the evaluation
                  report how it looks.
                  <span>
                    <Link href={general?.file} target="_blank">
                      View evaluation report
                    </Link>
                  </span>
                </h4>
              </div>
              <div className="text-center mt-4 pb-4">
                <Button
                  variant="contained"
                  className=""
                  onClick={() => {
                    setShow(false);
                    setPurchaseShow(true);
                  }}
                >
                  Purchase
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  className="ms-3 px-3"
                  onClick={() => {
                    setShow(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
              <div className="text-center">
                <p
                  className="f-18 semi-bold dark text-decoration-underline"
                  onClick={() => {
                    UpdateReportStatus(id, "reject");
                    setShow(false);
                  }}
                >
                  Close Claim
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={showPurchase}
        // onClose={handleHide}
        className="assgn-succes-modal"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <IconButton
            aria-label="close"
            onClick={() => setPurchaseShow(false)}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="assign-lawyer-success text-center">
            <div className="">
              <Image src={purchase} className="assign-trf-sucess" alt="image" />
              <div className="assign-law-cnt mt-4">
                <h4 className="f-24 semi-bold">
                  You need to pay ${general?.price} for reports
                </h4>
              </div>
              <div className="text-center mt-4 pb-4">
                <LoadingButton
                  variant="contained"
                  className=""
                  loading={load}
                  onClick={() => {
                    setLoad(true);
                    router.push(
                      `/client/payment?id=${id}&amount=${general?.price}`
                    );
                  }}
                >
                  Pay Now
                </LoadingButton>

                <Button
                  variant="outlined"
                  color="primary"
                  className="ms-3 px-3"
                  onClick={() => {
                    setPurchaseShow(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </>
  );
};
