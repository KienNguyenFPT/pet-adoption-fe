"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyUserAccount } from "@/app/services/authService";
import { useSearchParams } from "next/navigation";

const VerifyAccount = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  useEffect(() => {
    if (token) {
      verifyUserAccount(token).then((response) => {
        if (response.success) {
          router.push("/admin/login");
        } else {
          router.push("/admin/register");
        }
      });
    } else {
      router.push("/admin/register");
    }
  }, [router, token]);
  return null;
};

export default VerifyAccount;
