"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import Chat from "@/app/container/ChatPage";
import "../lawyer.css";
import { FaFile, FaMapPin, FaRegNewspaper, FaStar } from "react-icons/fa";
import ChatPage from "@/app/container/ChatPage/page";
import { axios } from "@/utils/axios";
import { MdRecentActors } from "react-icons/md";
import { Skeleton, Tooltip } from "@mui/material";
import { useSearchParams } from "next/navigation";
function Page() {
  const [Cases, setCases] = useState([]);
  const { data: session } = useSession();
  const [CaseID, setCaseID] = useState("");
  const [ChatUser, setChatUser] = useState({});
  const [Users, setUsers] = useState([]);
  const [RefID, setRefID] = useState("");
  const [Loading, setLoading] = useState(false);
  const [roomData, setroomData] = useState({});
  const [roomId, setRoomID] = useState("");
  const [Sender, setSender]: any = useState({});
  const [isAll, setisAll] = useState(false);
  const [Header, setHeader] = useState("case");
  const [AllCases, setAllCases] = useState([]);
  const [ExpertData, setExpertdata]: any = useState({});
  const [isGroup, setIsGroup] = useState(true);
  const search = useSearchParams();
  const id = search?.get("case_id");

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
        `/api/client/case/get-case?isLawyer=true&user=${session?.user?._id}&role=lawyer`
      )
      .then((res: any) => {
        setLoading(false);
        setisAll(false);
        setAllCases(res?.data);
        // setCases(res?.data);
      });
  };
  const GetExpertdetails = () => {
    axios.get("/api/expert/get").then((res: any) => {
      setExpertdata(res);
    });
  };
  const GetUserDetails = (data: any) => {
    if (data?.client?.length > 0) {
      return data?.client[0];
    }
    if (data?.expert?.length > 0) {
      return data?.expert[0];
    }
    if (data?.lawyer?.length > 0) {
      return data?.lawyer[0];
    }
  };
  useEffect(() => {
    GetCases();
    GetAllCases();
    GetExpertdetails();
  }, []);
  const PinChat = (id: any, action: any) => {
    axios.post("/api/chat/pin", { id: id, action }).then((res: any) => {
      GetCases();
    });
  };
  const refId: any = search?.get("referenceId");
  useEffect(() => {
    if (id) {
      setTimeout(() => {
        setCaseID(id);
        setIsGroup(true);
        setRefID(refId);
      }, 1000);
    }
  }, [id, refId]);

  return (
    <>
      <div className="main-content submit-new indivi-form  mt-4">
        <h2 className="f-26 fw-500 pb-3">Messages</h2>
        <div className="row">
          {!id && (
            <div className="col-12 col-md-4">
              <div className="white-card rounded p-4 border">
                {/* <MdRecentActors
                  onClick={() => {
                    setisAll(false);
                    GetCases();
                    setHeader("case");
                  }}
                /> */}
                {/* <FaRegNewspaper
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    setisAll(true);
                    setHeader("case");

                    setCases(AllCases);
                  }}
                />
                <FaUsers
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    setCases(AllCases);
                    setHeader("user");
                  }}
                /> */}
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
                  {Header == "case" &&
                    !Loading &&
                    Cases?.map((itm: any, i: any) => {
                      return (
                        <li
                          key={i}
                          onClick={() => {
                            setIsGroup(false);
                            setroomData(itm);
                            setRoomID(itm?._id);

                            if (isAll) {
                              setCaseID(itm?._id);
                              setRefID(itm?.referenceId);
                            } else {
                              setCaseID(itm?.case_id?._id);
                              setRefID(itm?.case_id?.referenceId);
                            }
                          }}
                          className={`list-group-item ${
                            CaseID == itm?._id || roomId == itm?._id
                              ? "selected_chat"
                              : ""
                          } chat-cases pointer bg_effect`}
                        >
                          <div className="d-flex justify-content-end">
                            {itm?.pinnedBy?.some(
                              (itm: any) => itm?._id == session?.user?._id
                            ) ? (
                              <>
                                <FaStar
                                  onClick={() => {
                                    PinChat(itm?._id, "remove");
                                  }}
                                />
                              </>
                            ) : (
                              <FaMapPin
                                onClick={() => {
                                  PinChat(itm?._id, "add");
                                }}
                              />
                            )}
                          </div>
                          {itm?.isPersonal ? null : (
                            <span className="gray f-12">
                              {" "}
                              Case Id: #
                              {isAll
                                ? itm?.referenceId
                                : itm?.case_id?.referenceId}
                            </span>
                          )}
                          <h6 className="f-16 semi-bold mb-1">
                            {itm?.isPersonal ? (
                              <>{ExpertData?.name || ExpertData?.firstName}</>
                            ) : (
                              <>
                                {isAll
                                  ? ""
                                  : GetUserDetails(itm)?.name ||
                                    GetUserDetails(itm)?.firstName}
                              </>
                            )}
                          </h6>
                          <p className="f-13 mb-0 gray">
                            {itm?.lastMessage?.text ||
                              itm?.lastMessage?.link ||
                              (itm?.lastMessage?.media &&
                                itm?.lastMessage?.media?.length != 0 && (
                                  <>
                                    <FaFile />
                                    &nbsp; File
                                  </>
                                ))}
                          </p>
                        </li>
                      );
                    })}

                  {Header == "user" &&
                    !Loading &&
                    Users?.map((itm: any, i: any) => {
                      return (
                        <li
                          key={i}
                          className="list-group-item chat-cases"
                          onClick={() => {
                            setIsGroup(false);
                            setChatUser(itm);
                          }}
                        >
                          <div className="d-flex justify-content-end">
                            {itm?.pinnedBy?.includes(session?.user?._id) ? (
                              <>
                                <FaStar
                                  onClick={() => {
                                    PinChat(itm?._id, "remove");
                                  }}
                                />
                              </>
                            ) : (
                              <FaMapPin
                                onClick={() => {
                                  PinChat(itm?._id, "add");
                                }}
                              />
                            )}
                          </div>

                          <h6 className="f-16 semi-bold mb-1">
                            {itm?.name || itm?.firstName}
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
          )}
          <div className="col-12 col-md-8">
            <div className="white-card rounded p-4 border">
              <ChatPage
                case_id={CaseID}
                referenceId={RefID}
                isGroup={isGroup}
                ChatUser={ChatUser}
                room={roomId}
                roomdata={roomData}
              />{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
