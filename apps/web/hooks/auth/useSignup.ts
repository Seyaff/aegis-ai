import { registerMutation } from "@/lib/api/auth/auth-api";
import { useMutation } from "@tanstack/react-query";

export default function useSignup() {
  return useMutation({
    mutationFn: registerMutation,
  });
}
