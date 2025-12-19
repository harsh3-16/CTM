import { useMutation } from '@tanstack/react-query';
import { authApi } from '../lib/api/auth';
import { useAppDispatch } from '../store/hooks';
import { setCredentials, logout as logoutAction } from '../store/authSlice';
import type { LoginDto, RegisterDto } from '../types';

export const useLogin = () => {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: (data: LoginDto) => authApi.login(data),
        onSuccess: (response) => {
            dispatch(setCredentials(response));
        },
    });
};

export const useRegister = () => {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: (data: RegisterDto) => authApi.register(data),
        onSuccess: (response) => {
            dispatch(setCredentials(response));
        },
    });
};

export const useLogout = () => {
    const dispatch = useAppDispatch();

    return () => {
        dispatch(logoutAction());
    };
};
