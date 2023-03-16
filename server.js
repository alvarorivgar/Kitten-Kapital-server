const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;

// Videocall

const myServer = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
// const http = require("http")
// const server = http.createServer(app)
const { Server } = require("socket.io")

const io = new Server(myServer, {
  	cors: {
  		origin: "http://localhost:3000",
  	}
  })
  
  io.on("connection", (socket) => {
    socket.emit("me", socket.id)
    console.log("hola patata");

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})


