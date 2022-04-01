import * as io from 'socket.io-client';

export interface Message {
    room: string;
    message: string;
}

export interface MessageHandler {
    (message: Message): void
}

interface RawMessage {
    room: string;
    sender: string;
    msg: string;
    isGroupChat: boolean;   
}

export class KakaoService {
    _socket: SocketIOClient.Socket

    constructor(address: string, apiKey: string, handler: MessageHandler) {
        const socket = io.connect(address);
        this._socket = socket;

        socket.on('connect', () => {
            console.log('server connected')
            socket.emit("register", {
                "password": apiKey
            });
        });

        socket.on("receive message", async (data: RawMessage) => {
            console.log(data);
            handler({
                room: data.room,
                message: data.msg
            });
        });
    }

    send(room: string, message: string) {
        this._socket.emit("send message", {
            "room": room,
            "msg": message
        });
        console.log("send message to " + room);
    }
};