import { UsersService } from "../services/users.service"

export const fetchUsers = async () => {
    const res = await UsersService.getAllUsers();
    return res.data;
}