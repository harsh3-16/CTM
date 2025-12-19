import api from '../axios';
import type { User } from '@/types';

export const usersApi = {
    getUsers: () => api.get<User[]>('/users').then(res => res.data),
};
