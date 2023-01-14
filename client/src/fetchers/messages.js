import { MessagesService } from "../services/messages.service";

export const fetchMessages = async (data) => {
    const res = await MessagesService.getAllMessages(data);
    return res.data;
}