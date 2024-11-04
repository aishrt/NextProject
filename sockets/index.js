const SocketClient = require("socket.io");
const Controller = require("./controller");
require("dotenv").config();
module.exports = async (server) => {
  const io = SocketClient(server, {
    origin: "*",
    cors: process.env.NEXT_PUBLIC_AUTH_URL,
  });
  io.use(Controller.auth);
  io.on("connection", (Socket) => {
    // (async () => {
    //   Controller.GenerateHandshake(Socket, io, data);
    // })();
    Socket.on("handshake", async (data) =>
      Controller.GenerateHandshake(Socket, io, data)
    );
    Socket.on("handshake_single", async (data) =>
      Controller.GenerateHandshakeSingle(Socket, io, data)
    );
    Socket.on("send_message", async (data) =>
      Controller.SendMessage(Socket, io, data)
    );

    Socket.on("send_message_single", async (data) =>
      Controller.SendMessageSingle(Socket, io, data)
    );
    Socket.on("retrieve_message", async (data) =>
      Controller.GetMessages(Socket, io, data)
    );
    Socket.on("chat_header", async (data) =>
      Controller.GetChatHeader(Socket, io, data)
    );
  });
};
