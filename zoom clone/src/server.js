import http from "http";
import SocketIO from "socket.io";
import express from "express";
import { Socket } from "dgram";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
// catchall url: 유저가 어떤 url로 이동하던지 홈으로 리다이렉트(해당 url만 사용)
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);

// it's not require!!
// 현 프로젝트의 경우에는 http & ws 같은 port에 두기 위한 방식
// express로 같은 서버에 http 위에 ws 서버 생성 -> 동일한 포트에서 두가지 프로토콜 처리 가능
// 요점은 내 http 서버에 access하려는 것
// express는 ws를 지원 안하기 때문에 하기와 같이 function을 생성해 설정해아한다.

// http 서버 생성
const server = http.createServer(app);
const io = SocketIO(server);

io.on("connection", (socket) => {
  socket.onAny((e) => {
    console.log(`Socket Event: ${e}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
  });
});

// http서버도 같이 돌려야할 경우 위에서 생성한 http서버 전달
// http 서버 위에 webSocket 서버 생성

/*
const wss = new WebSocket.Server({ server });
const sockets = [];

// 각 브라우저에서 따로 작동된다.
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("connected to Browser ⭕️");
  // browser가 닫히면 실행되는 event
  socket.on("close", () => console.log("disconnected to Browser ❌"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg.toString());
    console.log(message, msg.toString());
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
      default:
        break;
    }
  });
});*/
// socket이란 연결된 유저의 contact line

server.listen(3000, handleListen);
