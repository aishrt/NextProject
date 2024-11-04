"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import Chat from "@/app/container/ChatPage";
import "../admin.css";
import { FaRegNewspaper } from "react-icons/fa";
import ChatPage from "@/app/container/ChatPage/page";
import { axios } from "@/utils/axios";
import { MdRecentActors } from "react-icons/md";
import { Skeleton, Tooltip } from "@mui/material";
function Page() {
  const [Cases, setCases] = useState([]);
  const [CaseID, setCaseID] = useState("");
  const [RefID, setRefID] = useState("");
  const { data: session } = useSession();
  const [Loading, setLoading] = useState(false);
  const [Sender, setSender]: any = useState({});
  const [isAll, setisAll] = useState(false);
  const [AllCases, setAllCases] = useState([]);
  const GetCases = () => {
    setLoading(true);
    axios.get("/api/chat").then((res: any) => {
      console.log(res);
      setisAll(false);
      setLoading(false);
      setCases(res?.data);
    });
  };
  const GetAllCases = () => {
    setLoading(true);
    axios
      .get(
        `/api/client/case/get-case?isLawyer=true&user=${session?.user?._id}&role=client`
      )
      .then((res: any) => {
        setLoading(false);
        setisAll(false);
        setAllCases(res?.data);
        // setCases(res?.data);
      });
  };
  const GetUserDetails = (data: any) => {
    if (data?.client[0]) {
      return data?.client[0];
    }
    if (data?.expert[0]) {
      return data?.expert[0];
    }
    if (data?.lawyer[0]) {
      return data?.lawyer[0];
    }
  };
  useEffect(() => {
    if (session?.user?._id) {
      GetCases();
      GetAllCases();
    }
  }, [session]);

  return (
    <>
      <div className="main-content submit-new indivi-form  mt-4">
        <h2 className="f-26 fw-500 pb-3">Messages</h2>
        <div className="row">
          <div className="col-12 col-md-4">
            <div className="white-card rounded p-4 border">
              <Tooltip title={"Recent Chat"}>
                <MdRecentActors
                  className="recent-chat-icon"
                  onClick={() => {
                    GetCases();
                  }}
                />
              </Tooltip>
              <Tooltip title={"New Chat"}>
                <FaRegNewspaper
                  className="recent-chat-icon"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    setisAll(true);

                    setCases(AllCases);
                  }}
                />
              </Tooltip>
              <ul className="list-group list-group-flush chat-content">
                {Loading && (
                  <>
                    {[1, 2, 3]?.map((itm: any, i: any) => {
                      return (
                        <div
                          key={i}
                          className="d-flex justify-content-center mt-3"
                          style={{ flexDirection: "column" }}
                        >
                          <Skeleton width={300} animation="wave" />
                          <Skeleton width={300} animation="wave" />
                          <Skeleton width={300} animation="wave" />
                        </div>
                      );
                    })}
                  </>
                )}
                {!Loading &&
                  Cases?.map((itm: any, i: any) => {
                    return (
                      <li
                        key={i}
                        onClick={() => {
                          if (isAll) {
                            setCaseID(itm?._id);
                            setRefID(itm?.referenceId);
                          } else {
                            setCaseID(itm?.case_id?._id);
                            setRefID(itm?.case_id?.referenceId);
                          }
                        }}
                        className="list-group-item chat-cases"
                      >
                        <span className="gray f-12">
                          {" "}
                          Case Id: #
                          {isAll ? itm?.referenceId : itm?.case_id?.referenceId}
                        </span>
                        <h6 className="f-16 semi-bold mb-1">
                          {isAll
                            ? ""
                            : GetUserDetails(itm)?.name ||
                              GetUserDetails(itm)?.firstName}
                        </h6>
                        <p className="f-13 mb-0 gray">
                          {itm?.lastMessage?.text}
                        </p>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className="col-12 col-md-8">
            <div className="white-card rounded p-4 border">
              <ChatPage role={"admin"} case_id={CaseID} referenceId={RefID} />{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
