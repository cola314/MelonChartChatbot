import axios from 'axios';
import * as express from 'express';
import * as config from '../Config/AppConfig';

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
    message: string;
    isGroupChat: boolean;   
    secret: string;
}

export class KakaoService {

    constructor(handler: MessageHandler) {
        const app = express();
        app.use(express.json());

        app.post('/api/message/send', (req: express.Request<{}, {}, RawMessage>, res) => {
            if (!req.body.room || !req.body.message)
                return res.sendStatus(400);
            if (req.body.secret != config.API_SECRET)
                return res.status(400).send('Invalid Secret');
            
            handler({
                room: req.body.room,
                message: req.body.message,
            })
            res.sendStatus(200);
        });

        app.listen(config.HTTP_PORT, () => {
            console.log(`app listening on port ${config.HTTP_PORT}`);
        });
    }

    send(room: string, message: string) {
        axios
            .post(config.API_SERVER, {
                apiKey: config.API_KEY,
                room: room,
                message: message,
            })
            .catch(ex => {
                console.error(ex);
            });
    }
};