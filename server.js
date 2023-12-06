var express = require('express');
var http = require('http');
var { Server: SocketIoServer } = require('socket.io');
var next = require('next');
const { v4: uuidv4 } = require('uuid');

// Generate a random UUID


var app = next({ dev: process.env.NODE_ENV !== 'production' });
var handle = app.getRequestHandler();


var server = express();
var httpServer = http.createServer(server);
var io = new SocketIoServer(httpServer);


const Meetings=[]

app.prepare().then(() => {
  // Socket.io logic
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
 
    socket.on('createMeeting',({offer,meetingName},ackCallback)=>{
      console.log('creating the meeting brouuhh')
      const MeetingConfig={meetingID:uuidv4(),meetingName:meetingName,owner:socket.id,participants:[{user:socket.id,peerID:offer}],offer:offer}
     
      socket.join(MeetingConfig.meetingID)
      socket.room=MeetingConfig.meetingID
      console.log('socket ka room',socket.room)

      Meetings.push(MeetingConfig)
      ackCallback(MeetingConfig.meetingID)
      console.log('meetings',Meetings) 
    })

    socket.on('joinMeeting',({offer,meetingId},ackCallback)=>{
      const meeting = Meetings.find((x) => x.meetingID === meetingId);
      console.log('meeting....',meeting)
      if (meeting){

        console.log('meeting id before joining room',meeting.meetingID)
        socket.join(meeting.meetingID);
        socket.room = meeting.meetingID;      
        console.log('socket ka room joiner',socket.room)
        meeting.participants.push({user:socket.id,peerID:offer})
          // other logic blah blah  
          ackCallback([meeting.meetingID,meeting.offer],meeting.meetingName)
          //socket.to(meeting.owner).emit('clientConnected',offer)
        
      }
      else{
        ackCallback(null)
  
      }
    })

    socket.on('whoAmi',({meetingId,offer},ackCallback)=>{
      const meeting = Meetings.find((x) => x.meetingID === meetingId);
      if (meeting){
        console.log('meeting found',meeting,offer)

        if (meeting.offer == offer){
            ackCallback(null,meeting.meetingName) // later i have to replace it with all of the users

        }
        else{

         ackCallback(meeting.participants,meeting.meetingName) // array of {user:socket.id,peerID:offer}
        }
      }
      else{
        ackCallback(undefined)
      }

    })

    socket.on('Message',({message,meetingID})=>{
      console.log('meeting id coming in message and msg',socket.room,message)
      io.to(socket.room).emit('getChat',message)
      console.log('sending the chats to all of the available users in the group..')
      
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      console.log('socket.room',socket.room)
      let meetingno=-1
      const meeting = Meetings.find((x) => {
        meetingno++
        return x.meetingID === socket.room
      }
        );
      if(meeting){
        meeting.participants = meeting.participants.filter((user)=>user.user !== socket.id)
        if(!meeting.participants.length)
        {
          Meetings.splice(meetingno, 1);

        }
        io.to(socket.room).emit('userDisconnected',socket.id)
      }
    

    });
  });

  // Handle all other requests with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  httpServer.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
  });
});
