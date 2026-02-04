import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // If trying to access login page, allow it (though middleware shouldn't trigger if excluded)
      if (req.nextUrl.pathname === "/admin/login") {
        return true;
      }
      return token?.role === "ADMIN";
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
