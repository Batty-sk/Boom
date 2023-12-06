
const { v4: uuidv4 } = require('uuid');
const Express=require('express')
const app=Express()
const server=require('http').createServer(app)
const {Server}=require('socket.io')// binding the socket with the express server.
const cors=require('cors')
//middlewares
app.use(cors())

const io=new Server(server,{
  cors:{
      origin:'*', 
      methods:['GET','POST']
  }
})



const Meetings=[]

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
 
  // Start the server
  server.listen(3001,()=>{
    console.log('server has been started');
})
