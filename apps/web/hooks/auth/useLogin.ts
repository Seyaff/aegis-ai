import { loginMutation } from "@/lib/api/auth/auth-api";
import { useMutation } from "@tanstack/react-query";

export default function useLogin () {
    return useMutation({
        mutationFn : loginMutation
    })
}