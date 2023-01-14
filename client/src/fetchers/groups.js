import { GroupsService } from "../services/groups.service";

export const fetchGroups = async () => {
    const res = await GroupsService.getGroups();
    return res.data;
}