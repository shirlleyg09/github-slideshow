export { default } from "next-auth/middleware";
export const config = { matcher: ["/dashboard/:path*", "/tickets/:path*", "/kanban/:path*", "/clients/:path*", "/systems/:path*", "/support-plans/:path*", "/hours/:path*", "/reports/:path*", "/knowledge-base/:path*", "/users/:path*", "/settings/:path*", "/client/:path*"] };
