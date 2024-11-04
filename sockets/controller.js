const axios = require("axios");
require("dotenv").config();
const errorNotify = (socket, io, error) => {
  io.to(socket?.id).emit("notify_error", error);
};
const NEXT_URL = process.env.NEXT_PUBLIC_AUTH_URL;

module.exports = {
  auth: async (socket, next) => {
    const userID = socket?.handshake?.headers?.token;
    socket.userData = { userId: userID };
    const payload = {
      token: userID,
    };
    axios.post(`${NEXT_URL}/api/chat/auth`, payload).then((res) => {
      if (res?.data?.success) {
        socket.userRole = res?.data?.data?.userRole;
        next();
      } else {
        return;
      }
    });
  },
  GenerateHandshake: async (socket, io, data) => {
    try {
      let { userId } = socket?.userData;
      axios
        .post(`${NEXT_URL}/api/chat/handshake`, {
          userRole: socket?.userRole,
          userId,
          roomId: data?.room,
          case_id: data?.case_id,
        })
        .then((res) => {
          if (res?.data?.success) {
            socket?.join(res?.data?.data?.roomID);
            io?.to(res?.data?.data?.roomID).emit("connection_listner", {
              message: `Connected Room ${res?.data?.data?.roomID} succefully`,
            });
          }
        })
        .catch((err) => {});
    } catch (error) {
      errorNotify(error);
      io?.to(socket?.id).emit("handshake_error", {
        message: error?.message || "Internal server error",
      });
    }
  },
  SendMessage: async (socket, io, data) => {
    try {
      const GetModel = (key) => {
        if (key == "client") {
          return "User";
        }
        if (key == "lawyer") {
          return "Lawyer";
        }
        if (key == "expert") {
          return "Expert";
        }
      };
      let { message, media, link, case_id } = data;
      axios
        .post(`${NEXT_URL}/api/chat/SendMessage`, {
          userRole: socket?.userRole,
          userId: socket?.userData?.userId,
          case_id,
          message,
          media,
          link,
          room: data?.room,
        })
        .then((res) => {
          if (res?.data?.success) {
            io?.to(res?.data?.room).emit("receive_message", {
              data: res?.data?.data,
              senderDetails: res?.data?.senderDetails,
              success: true,
            });
          }
        })
        .catch((err) => {});
    } catch (error) {
      errorNotify(error);
      io?.to(socket?.id).emit("sendMessage_error", {
        message: error?.message || "Internal server error",
      });
    }
  },
  GetMessages: async (socket, io, data) => {
    try {
      axios
        .post(`${NEXT_URL}/api/chat/getmessages`, {
          userRole: socket?.userRole,
          userId: socket?.userData?.userId,
          case_id: data?.case_id,
          search: data?.search,
          room: data?.room,
        })
        .then((res) => {
          if (res?.data?.success) {
            io?.to(res?.data?.room).emit("old_messages", {
              data: res?.data?.data?.data,
              // GetSenderUser,
              Users: res?.data?.data?.Users,
              message: "Messages fetched successfully",
              success: true,
            });
          }
        })
        .catch((err) => {});
    } catch (error) {
      errorNotify(error);
      io?.to(socket?.id).emit("getMessage_error", {
        message: error?.message || "Internal server error",
      });
    }
  },
  GetChatHeader: async (socket, io) => {},
};
