import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get("accessToken")?.value;
  const { pathname } = context.url;

  // Define paths that don't require authentication
  const isLoginPage = pathname === "/login" || pathname === "/login/";
  const isStaticAsset =
    pathname.startsWith("/_") ||
    pathname.startsWith("/assets/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico";

  if (isStaticAsset) {
    return next();
  }

  // Validate the token on the server side
  let isValidUser = false;
  if (token) {
    try {
      const apiBase = import.meta.env.BASE_URL_SPRINT_DASH_API;
      const response = await fetch(`${apiBase}/api/v1/auth/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        isValidUser = true;
      }
    } catch (e) {
      console.error("Token validation error in middleware:", e);
    }
  }

  // If user is not authenticated/valid
  if (!isValidUser) {
    // Clear the invalid token cookie if it exists
    if (token) {
      context.cookies.delete("accessToken", { path: "/" });
    }

    // Redirect to login if accessing a protected route
    if (!isLoginPage) {
      return context.redirect("/login");
    }
  } else {
    // If user is authenticated but trying to access login page, redirect to home
    if (isLoginPage) {
      return context.redirect("/");
    }
  }

  return next();
});
