import csrf from "csurf";

const inProduction = "production";

// CSRF protection options
const csrfProtection = csrf({
  cookie: {
    httpOnly: true, // Helps prevent XSS attacks
    secure: inProduction, // Secure cookie only in production
    sameSite: "strict", // Helps protect against CSRF
  },
});

export default csrfProtection;
