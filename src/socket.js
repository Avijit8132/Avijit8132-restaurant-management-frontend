import React from "react";
import { io } from 'socket.io-client';
import { API_BASE_URL } from './constants/CONSTANT';

const URL = API_BASE_URL.replace('/property', '');
//.log('URL :>> ', URL);
let tempSocket;
try{
    const token = localStorage.getItem("token");
    tempSocket =  io(URL, {auth: {token : token}, transports: ['websocket'], upgrade: false}).connect();
    tempSocket.on('connect', () => {
        //.log('socket connected')
    })
    tempSocket.on("connect_error", (err) => {
        //.log(`connect_error due to ${err.message}`);
    });
}catch(e){
    //.log('e.message:', e.message);
}

export const socket = tempSocket
export const SocketContext = React.createContext(socket);