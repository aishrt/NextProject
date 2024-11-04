"use client";
import moment from "moment";
import React from "react";
import clip from "@/assets/clip.png";
import Image from "next/image";
import pic from "@/assets/pic.png";
import { IoIosDownload } from "react-icons/io";
import { RiCalendarScheduleFill } from "react-icons/ri";

import { MdManageSearch } from "react-icons/md";

import { AudioRecorder } from "react-audio-voice-recorder";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

function Chat({
  JoinChat,
  expertData,
  isGroup,
  roomdata,
  addAudioElement,
  FileRef,
  setDateModalOpen,
  DateModal,
  case_id,
  GetOlderMessage,
  HandleDOwnloadImage,
  role,
  MessagesData,
  setFileModalOpen,
  FileModal,
  isSearch,
  setisSearch,
  ConvertMemberToUser,
  session,
  GetFileHTML,
  SendMessage,
  form,
  ChatMembers,
  referenceId,
  getGroupUsers,
  UploadFile,
  ListRef,
  isJoined,
  setForm,
  ChatUser,
  getFilePath,
  getBaseURL,
}: any) {
  console.log(MessagesData);
  return (
    <section style={{ width: "100%" }}>
      <div className="chat-right-mesages">
        <div className="card-chat" id="chat2">
          <div className="chat-header border-btm f-20 fw-500 p-2 mb-0 d-flex gap-4 flex-wrap">
            {" "}
            {!isGroup ? ChatUser?.name || ChatUser?.firstName : null}
            {MessagesData?.data && !roomdata?.isPersonal && (
              <>
                {getGroupUsers(MessagesData?.Users)?.map((itm: any) => {
                  return (
                    <>
                      {itm?.client?.length > 0 && (
                        <>
                          <p>
                            {itm?.client[0]?.name || itm?.client[0]?.firstName}
                          </p>
                        </>
                      )}
                      {itm?.expert?.length > 0 && (
                        <>
                          <p>
                            {itm?.expert[0]?.name || itm?.expert[0]?.firstName}
                          </p>
                        </>
                      )}
                      {itm?.lawyer?.length > 0 && (
                        <>
                          <p>
                            {itm?.lawyer[0]?.name || itm?.lawyer[0]?.firstName}
                          </p>
                        </>
                      )}
                    </>
                  );
                })}
              </>
            )}
            {roomdata?.isPersonal ? (
              <>
                <div className="chat-id">
                  {" "}
                  {session?.user?.role == "expert"
                    ? roomdata?.userName
                    : expertData?.name || expertData?.firstName}
                  {/* {roomdata?.userName == session?.user?.name ||
                  session?.user?.firstName
                    ? expertData?.name || expertData?.firstName
                    : roomdata?.userName} */}
                </div>
              </>
            ) : (
              <>
                <div className="chat-id">
                  {referenceId ? "#" : ""}
                  {referenceId}
                </div>
              </>
            )}
            {isJoined && (
              <div className="d-flex">
                {isSearch && (
                  <form
                    onSubmit={(e: any) => {
                      e.preventDefault();
                      let value = e.target.elements?.search?.value;
                      // if (value) {
                      GetOlderMessage(case_id, value);
                      // }
                    }}
                  >
                    <input name="search" className="form-control" type="text" />
                  </form>
                )}
                <MdManageSearch
                  onClick={() => {
                    if (isSearch) {
                      setisSearch(false);
                    } else {
                      setisSearch(true);
                    }
                  }}
                  size={30}
                />
              </div>
            )}
          </div>
          <div
            ref={ListRef}
            id="MainMessageBox"
            className="card-body messages-chat-body"
            data-mdb-perfect-scrollbar-init=""
            style={{ position: "relative" }}
          >
            {/* {!isJoined && (
              <div>
                {[1, 2, 3]?.map((itm: any, i: any) => {
                  return (
                    <>
                      <div
                        key={i}
                        className="d-flex justify-content-end align-items-end "
                        style={{ flexDirection: "column" }}
                      >
                        <Skeleton width={200} animation="wave" />
                        <Skeleton width={200} animation="wave" />
                        <Skeleton width={200} animation="wave" />
                      </div>
                      <div
                        className="d-flex justify-content-start align-items-start "
                        style={{ flexDirection: "column" }}
                      >
                        <Skeleton width={200} animation="wave" />
                        <Skeleton width={200} animation="wave" />
                        <Skeleton width={200} animation="wave" />
                      </div>
                    </>
                  );
                })}
              </div>
            )} */}

            {!isJoined && (
              <div
                style={{ height: "40vh" }}
                className="d-flex justify-content-center align-items-center"
              >
                <h5>No Conversation yet!</h5>
              </div>
            )}

            {MessagesData?.data && (
              <>
                {MessagesData?.data?.map((item: any, i: any) => {
                  return (
                    <>
                      {item?.userId == session?.user?._id ? (
                        <div
                          key={i}
                          className={`d-flex flex-row ${
                            item?.userId == session?.user?._id
                              ? "justify-content-end align-items-end otherusers-chat"
                              : "justify-content-start justify-content-start align-items-start gap-2 logged-in-user"
                          }  gap-2  mt-3 otherusers-chat`}
                        >
                          <div className="other-users-msg">
                            <p className="small mb-1">{item?.message?.text}</p>
                            {item?.message?.media?.length > 0 && (
                              <>
                                {GetFileHTML(item?.message?.media[0])}
                                <IoIosDownload
                                  size={30}
                                  onClick={() => {
                                    HandleDOwnloadImage(
                                      item?.message?.media[0]
                                    );
                                  }}
                                />
                              </>
                            )}
                            <p className="f-13 text-white mb-0 text-end">
                              {ConvertMemberToUser(item?.memerId, item)
                                ?.firstName ||
                                ConvertMemberToUser(item?.memerId, item)?.name}
                            </p>
                          </div>
                          <img
                            onError={(e: any) => {
                              e.target.src =
                                "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp";
                            }}
                            src={
                              ConvertMemberToUser(item?.memerId, item)?.image
                                ? `${
                                    getFilePath() +
                                    ConvertMemberToUser(item?.memerId, item)
                                      ?.image
                                  }`
                                : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                            }
                            alt="avatar 1"
                            style={{
                              width: 45,
                              height: "100%",
                              borderRadius: "100%",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          key={i}
                          className={`d-flex flex-row ${
                            item?.userId == session?.user?._id
                              ? "justify-content-end align-items-end otherusers-chat"
                              : "justify-content-start justify-content-start align-items-start gap-2 logged-in-user"
                          }  gap-2  mt-3 otherusers-chat`}
                        >
                          <div className="other-users-msg">
                            <p className="small mb-1">{item?.message?.text}</p>

                            {item?.message?.media?.length > 0 && (
                              <>
                                {GetFileHTML(item?.message?.media[0])}
                                <IoIosDownload
                                  size={30}
                                  onClick={() => {
                                    HandleDOwnloadImage(
                                      item?.message?.media[0]
                                    );
                                  }}
                                />
                              </>
                            )}

                            <p className="f-13 text-white mb-0 text-end">
                              {ConvertMemberToUser(item?.memerId, item)
                                ?.firstName ||
                                ConvertMemberToUser(item?.memerId, item)?.name}
                              <p>
                                {ConvertMemberToUser(item?.memerId, item)?.role}
                              </p>
                            </p>
                          </div>
                          <img
                            onError={(e: any) => {
                              e.target.src =
                                "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp";
                            }}
                            src={
                              ConvertMemberToUser(item?.memerId, item)?.image
                                ? `${
                                    getFilePath() +
                                    ConvertMemberToUser(item?.memerId, item)
                                      ?.image
                                  }`
                                : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                            }
                            alt="avatar 1"
                            style={{
                              width: 45,
                              height: "100%",
                              borderRadius: "100%",
                            }}
                          />
                        </div>
                      )}
                    </>
                  );
                })}
              </>
            )}
          </div>
          {/* <div className="card-footer mt-4 border-top chat-footer  text-muted d-flex justify-content-start align-items-center py-3"> */}
          {/* <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
              alt="avatar 3"
              style={{ width: 40, height: "100%" }}
            /> */}
          {role == "admin" || !isJoined ? null : (
            <form
              onSubmit={(e: any) => {
                e.preventDefault();
                console.log(form);
                if (form?.text || form?.media) {
                  SendMessage(form);
                }
              }}
              className="card-footer mt-4 border-top chat-footer  text-muted d-flex justify-content-start align-items-center py-3"
            >
              <input
                onChange={(e: any) => setForm({ text: e.target.value })}
                type="text"
                value={form?.text}
                disabled={!isJoined}
                className="form-control form-control-lg"
                id="exampleFormControlInput1"
                placeholder="Type message"
              />
              <input
                ref={FileRef}
                type="file"
                onChange={UploadFile}
                style={{ display: "none" }}
                id="ChatMediaSelector"
              />
              <a className="me-3 text-muted d-flex">
                <Image
                  src={clip}
                  className="clip-icon pointer"
                  onClick={() => {
                    document.getElementById("ChatMediaSelector")?.click();
                  }}
                  alt=""
                />
                {session?.user?.role == "expert" && (
                  <RiCalendarScheduleFill
                    style={{ marginLeft: "3px" }}
                    size={20}
                    onClick={() => {
                      setDateModalOpen(true);
                    }}
                  />
                )}
              </a>

              {/* {isJoined && (
                <AudioRecorder
                  onRecordingComplete={addAudioElement}
                  audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                  }}
                  downloadOnSavePress={true}
                  showVisualizer={true}
                  downloadFileExtension="webm"
                />
              )} */}
              <button
                disabled={!isJoined}
                className="send-btn-chat"
                onClick={() => SendMessage(form)}
              >
                Send
              </button>
            </form>
            // </div>
          )}
        </div>
      </div>
      <Dialog open={FileModal} onClose={() => setFileModalOpen(false)}>
        <DialogTitle>Are you sure to share this file ?</DialogTitle>
        <DialogContent>{GetFileHTML(form?.media)}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              FileRef.current.value = null;
              setFileModalOpen(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={() => {
              SendMessage(form);
              setFileModalOpen(false);
            }}
            color="secondary"
          >
            <span>Confirm</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Dialog open={DateModal} onClose={() => setDateModalOpen(false)}>
        <DialogTitle>Select date to schedule this Meeting.</DialogTitle>
        <DialogContent>
          <DatePicker
            sx={{
              width: 500,
              backgroundColor: "#d5eae0",
            }}
            // defaultValue={i.dob}
            // value={i.dob}
            className="bglight-ip"
            disablePast
            onChange={(date: any | null) => {
              const time = moment(date).format("DD-MMM-YYYY");
              setForm({ ...form, meeting: time });
              // handleValueChange(index, date, "dob");
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDateModalOpen(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={() => {
              SendMessage(form);
              setDateModalOpen(false);
            }}
            color="secondary"
          >
            <span>Confirm</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </section>
  );
}

export default Chat;
