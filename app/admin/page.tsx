"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Admin = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/pet-management");
  }, [router]);
  return null;
};

export default Admin;
