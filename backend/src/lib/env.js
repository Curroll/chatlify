import 'dotenv/config';

export const ENV = {
PORT: process.env.PORT,
MONGODB_URI: process.env.MONGODB_URI,
JWT_SECRET: process.env.JWT_SECRET,
NODE_ENV: process.env.NODE_ENV,
CLIENT_URL: process.env.CLIENT_URL,
RESEND_API_KEY: process.env.RESEND_API_KEY,
EMAIL_FROM: process.env.EMAIL_FROM,
EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
CLIENT_URL: process.env.CLIENT_URL
};
// PORT=5001
// NODE_ENV=development
// JWT_SECRET=prince12345

// MONGODB_URI=mongodb+srv://chatlify_db:1234567890@cluster0.jb1lqtj.mongodb.net/chatlify_db?appName=Cluster0

// RESEND_API_KEY=re_hjCF73gf_EpsWSBGn34FqgTGnyfcHFL1a
// EMAIL_FROM=onboarding@resend.dev
// EMAIL_FROM_NAME="Prince Dhankar"