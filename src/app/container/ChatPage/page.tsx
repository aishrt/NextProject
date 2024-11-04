"use client";
import React, { useEffect, useRef, useState } from "react";
import Chat from "./index";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import folder from "../../../assets/folder-blue.png";
import { axios } from "@/utils/axios";
import { useSearchParams } from "next/navigation";
function ChatPage({
  case_id,
  referenceId,
  role,
  isGroup,
  ChatUser,
  roomdata,
  room,
}: any) {
  const SocketClient: any = useRef(null);
  const { data: session } = useSession();
  const [Messages, setMessages]: any = useState({ data: [] });
  const [CaseID, setCaseID] = useState("");
  const [isJoined, setisJoined] = useState(false);
  const FileRef: any = useRef(null);
  const [ChatMembers, setChatMembers] = useState([]);
  const [FileModal, setFileModalOpen] = useState(false);
  const [AudioBlob, setAudioBlob]: any = useState(new Blob());
  const ListRef: any = useRef(null);
  const search = useSearchParams();
  const [GetMembers, setMembers] = useState([]);
  const [DateModal, setDateModalOpen] = useState(false);
  const id = search?.get("case_id");
  const [isSearch, setisSearch] = useState(false);
  const [expertData, setExpertdata]: any = useState({});
  const [form, setForm] = useState({
    text: "",
    media: "",
    link: "",
    meeting: "",
  });
  const GetExpertdetails = () => {
    axios.get("/api/expert/get").then((res: any) => {
      setExpertdata(res);
      console.log(res);
    });
  };
  const GetUnseenCount = () => {
    axios.post("/api/chat/unseen", { case_id: id }).then((res: any) => {});
  };
  const getBaseURL = () => {
    return process.env.NEXT_PUBLIC_PDF_URL;
    if (window.location.hostname == "localhost") {
      return;
    } else {
      return "http://vipankumar.in:3000";
    }
  };

  useEffect(() => {
    if (session?.user?._id) {
      SocketClient.current = io(getBaseURL(), {
        extraHeaders: {
          token: session?.user?._id,
        },
      });
    }

    SocketClient?.current?.on("error", (err: any) => {
      console.log(`Error from the server: ${err.message}`);
    });
    SocketClient?.current?.on("handshake_error", (err: any) => {
      console.log(`Handshake error: ${err.message}`);
    });
    SocketClient?.current?.on("sendMessage_error", (err: any) => {
      console.log(`Message Send error: ${err.message}`);
    });
    SocketClient?.current?.on("getMessage_error", (err: any) => {
      console.log(`Get Messages error: ${err.message}`);
    });

    if (id) {
      JoinChat(id);
      GetUnseenCount();
    }
    if (roomdata?._id) {
      JoinChat(room);
    }

    return () => {
      SocketClient?.current?.disconnect();
    };
  }, [session, id]);
  const JoinChat = async (id: any) => {
    let payload: any = {
      case_id: case_id,
    };
    if (id) {
      payload["case_id"] = id;
    }
    if (room) {
      payload["room"] = room;
    }
    console.log(payload, "======handhskae payload");
    SocketClient?.current?.emit("handshake", payload);
    GetOlderMessage(id, "");
    SocketClient?.current?.on("connection_listner", async (data: any) => {
      setCaseID(id);
      if (data?.message) {
        setisJoined(true);
      }
    });
  };

  const GetOlderMessage = async (id: any, search: any) => {
    console.log(isJoined);
    axios
      .post(`/api/chat/getmessages`, {
        userRole: session?.user?.role,
        userIde: session?.user?._id,
        case_id: case_id || CaseID,
        search: search,
        room: roomdata?._id,
      })
      .then((res: any) => {
        console.log(res);
        setMessages(res);
        setChatMembers(res?.Users);
      });
    SocketClient?.current?.emit("retrieve_message", { case_id: id, search });
    SocketClient?.current?.on("old_messages", async (data: any) => {
      setMessages(data);
      setChatMembers(data?.Users);
    });
  };
  useEffect(() => {
    if (case_id) {
      JoinChat(case_id);
    }
    if (roomdata) {
      JoinChat(roomdata?._id);
      GetExpertdetails();
    }
    if (id) {
      JoinChat(id);
      GetOlderMessage(id, "");
    }
  }, [case_id, id, roomdata]);

  const ConvertMemberToUser = (id: any, doc: any) => {
    console.log(doc, "============data", ChatMembers, id);
    let filters: any = ChatMembers?.filter(
      (itm: any) => itm?._id == doc?.memberId
    );
    if (filters?.length > 0) {
      if (filters[0]?.client?.length > 0) {
        console.log(filters[0]?.client[0]);
        return filters[0]?.client[0];
      }
      if (filters[0]?.expert?.length > 0) {
        console.log(filters[0]?.client[0]);

        return filters[0]?.expert[0];
      }
      if (filters[0]?.lawyer?.length > 0) {
        return filters[0]?.lawyer[0];
      }
      return filters[0]?.user;
    } else {
      return false;
    }
  };

  const SendMessage = async (MsgData: any) => {
    if (
      !MsgData?.media &&
      !MsgData?.text &&
      !MsgData?.link &&
      !MsgData?.meeting
    ) {
      return false;
    }
    let payload: any = {
      case_id: case_id,
      room: roomdata?._id,
      message: {
        text: "",
        link: "",
        media: [],
        meeting: "",
      },
      roomdata,
    };
    if (MsgData?.text?.includes("http" || "https" || ".com" || ".in")) {
      payload.message.link = MsgData?.text;
    } else {
      payload.message.text = MsgData?.text;
    }
    if (MsgData?.media) {
      payload.message.media = [MsgData?.media];
    }
    if (MsgData?.meeting) {
      payload.message.meeting = [MsgData?.meeting];
    }

    SocketClient?.current?.emit("send_message", payload);
    setForm({ text: "", link: "", media: "", meeting: "" });
    ReceiveCurrentMessages();
    // }
  };

  const ReceiveCurrentMessages = () => {
    SocketClient?.current?.on("receive_message", async (data: any) => {
      let arr: any = [...Messages?.data];
      ListRef?.current?.lastElementChild?.scrollIntoView();
      arr.push(data?.data);
      setMessages({ ...Messages, data: arr });
    });
    let ScrollDiv: any = document.getElementById("MainMessageBox");
    ScrollDiv.scrollTop = ScrollDiv.scrollHeight;
  };
  useEffect(() => {
    SocketClient?.current?.on("receive_message", async (data: any) => {
      let arr: any = [...Messages?.data];
      console.log(data, "========data");
      arr.push({ ...data?.data, senderDetails: data?.senderDetails });
      setMessages({ ...Messages, data: arr });
    });
    return () => {
      SocketClient?.current?.off("receive_message");
    };
  });

  useEffect(() => {
    let ScrollDiv: any = document.getElementById("MainMessageBox");
    ScrollDiv.scrollTop = ScrollDiv.scrollHeight;
  }, [Messages]);
  const UploadFile = (e: any) => {
    setFileModalOpen(true);
    let file = e.target.files[0];
    let formdata = new FormData();
    formdata.append("file", file);
    axios.post("/api/uploads", formdata).then((res: any) => {
      FileRef.current.value = null;
      setForm({ ...form, media: res?.filePath });
    });
  };
  const getFilePath = () => {
    if (window.location.hostname == "localhost") {
      return "/uploads";
    } else {
      return "/api/file";
    }
  };
  const GetFileHTML = (URL: any) => {
    const fileExtension = URL?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension!)) {
      return (
        <img
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "7px",
            objectFit: "contain",
          }}
          src={`${process.env.NEXT_PUBLIC_PDF_URL}/uploads${URL}`}
        />
      );
    } else if (["webm"].includes(fileExtension!)) {
      return (
        <audio
          className="form-control"
          controls
          src={`${process.env.NEXT_PUBLIC_PDF_URL}/uploads${URL}`}
        ></audio>
      );
    } else {
      // if (fileExtension === "pdf") {
      return (
        <img
          src={folder?.src}
          alt="document preview"
          style={{
            width: "110px",
            backgroundColor: "white",
            height: "110px",
            objectFit: "contain",
            borderRadius: "10px",
          }}
        />
      );
    }
    // }
  };
  const GetFormat = (key: any) => {
    console.log(key);
    if (key.includes(".pdf")) return ".pdf";
    if (key.includes(".png")) return ".png";
    if (key.includes(".jpeg")) return ".jpeg";
    if (key.includes(".jpg")) return ".jpg";
    if (key.includes(".ods")) return ".ods";
    if (key.includes(".txt")) return ".txt";
    if (key.includes(".csv")) return ".csv";
    if (key.includes(".xls")) return ".xls";
    if (key.includes(".xlsx")) return ".xlsx";
    if (key.includes(".doc")) return ".doc";
    if (key.includes(".docx")) return ".docx";
    if (key.includes(".ppt")) return ".ppt";
    if (key.includes(".pptx")) return ".pptx";
    if (key.includes(".zip")) return ".zip";
    if (key.includes(".rar")) return ".rar";
    if (key.includes(".mp4")) return ".mp4";
    if (key.includes(".mp3")) return ".mp3";
    if (key.includes(".wav")) return ".wav";
    if (key.includes(".gif")) return ".gif";
    if (key.includes(".svg")) return ".svg";
    if (key.includes(".html")) return ".html";
    if (key.includes(".css")) return ".css";
    if (key.includes(".js")) return ".js";
    if (key.includes(".json")) return ".json";
    if (key.includes(".webp")) return ".webp";
    if (key.includes(".webp")) return ".webm";

    return ".png";
  };

  const addAudioElement = (blob: any) => {
    setAudioBlob(blob);
    const url = URL.createObjectURL(blob);
    console.log(blob, url);
    let formdata = new FormData();
    formdata.append("file", blob);
    axios.post("/api/chat/voice-note", formdata).then((res: any) => {
      console.log(res);
      setFileModalOpen(true);
      setForm({ ...form, media: res?.filePath });
    });

    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
  };
  const DownloadAudio = async (file: any) => {
    const getFIle = await fetch(
      `${process.env.NEXT_PUBLIC_PDF_URL}/uploads${file}`,
      {
        method: "GET",
        headers: {},
      }
    );
    const blob = await getFIle.blob();
    const url = URL.createObjectURL(blob);

    let a: any = document.createElement("a");
    a.href = url;
    a.download = file;
    a.click();
  };
  const HandleDOwnloadImage = async (URL: any) => {
    if (!URL) {
      return false;
    }
    const filename = URL?.split(".")[0];
    const fileExtension = URL?.split(".")[1];
    if (fileExtension == "webm") {
      return DownloadAudio(URL);
    }
    // const res = await fetch(`http://localhost:3000/public${details?.updates?.document}`)
    // const blob = await res.blob()
    fetch(`${getFilePath() + URL}`, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;

          link.setAttribute(
            "download",
            `${filename || "document"}${GetFormat(URL)}`
          ); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getGroupUsers = (data: any) => {
    let filter = data?.filter(
      (obj1: any, i: any, arr: any) =>
        arr?.findIndex((obj2: any) => obj2?.userId === obj1?.userId) === i
    );
    console.log(filter, "===========filter user");
    return filter;
  };
  return (
    <Chat
      role={role}
      MessagesData={Messages}
      ConvertMemberToUser={ConvertMemberToUser}
      JoinChat={JoinChat}
      getBaseURL={getBaseURL}
      getGroupUsers={getGroupUsers}
      getFilePath={getFilePath}
      FileRef={FileRef}
      HandleDOwnloadImage={HandleDOwnloadImage}
      session={session}
      isJoined={isJoined}
      SendMessage={SendMessage}
      expertData={expertData}
      UploadFile={UploadFile}
      setFileModalOpen={setFileModalOpen}
      FileModal={FileModal}
      setForm={setForm}
      roomdata={roomdata}
      GetFileHTML={GetFileHTML}
      ChatMembers={ChatMembers}
      GetOlderMessage={GetOlderMessage}
      referenceId={referenceId}
      case_id={case_id}
      setDateModalOpen={setDateModalOpen}
      DateModal={DateModal}
      ListRef={ListRef}
      addAudioElement={addAudioElement}
      isSearch={isSearch}
      setisSearch={setisSearch}
      form={form}
    />
  );
}

export default ChatPage;
