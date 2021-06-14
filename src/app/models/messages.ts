import {Navigation, Router} from "@angular/router";

export enum MessageType {
    SUCCESS,
    INFO,
    WARNING,
    ERROR
}

export class Message {
    private _type: MessageType;
    private _message: string;
    private _alertClass: string;

    constructor(type: MessageType, message: string) {
        this._type = type;
        this._message = message;
        this._alertClass = this.getAlertClass(type);
    }

    get type() {
        return this._type;
    }

    get message() {
        return this._message;
    }

    get alertClass() {
        return this._alertClass;
    }

    static of(type: MessageType, message: string) {
        return new Message(type, message);
    }

    static success(message: string) {
        return Message.of(MessageType.SUCCESS, message);
    }

    static info(message: string) {
        return Message.of(MessageType.INFO, message);
    }

    static warning(message: string) {
        return Message.of(MessageType.WARNING, message);
    }

    static error(message: string) {
        return Message.of(MessageType.ERROR, message);
    }

    private getAlertClass(type: MessageType) {
        return type === MessageType.ERROR ? "danger" : MessageType[type].toLowerCase();
    }
}

export class Messages extends Array<Message> {

    static fromRouter(router: Router) {
        const navigation = router.getCurrentNavigation();
        const state = !!navigation ? navigation.extras.state as {messages: Messages} : undefined;
        if (state !== undefined) {
            return  state.messages;
        }
        return null;
    }
}
