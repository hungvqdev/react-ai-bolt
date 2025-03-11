"use server";

import { cookies } from "next/headers";

export async function setUserCookie(user: object) {
  const cookieStore = await cookies();
  cookieStore.set("user", JSON.stringify(user), {
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    httpOnly: false,
  });
}

export async function getUserCookie() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) {
    return null;
  }

  try {
    return JSON.parse(userCookie.value);
  } catch (error) {
    console.error("Lỗi khi parse cookie:", error);
    return null;
  }
}

export async function removeUserCookie() {
  (await cookies()).delete("user");
}
