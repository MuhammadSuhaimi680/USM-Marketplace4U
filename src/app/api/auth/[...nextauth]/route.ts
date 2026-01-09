import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUser } from '@/lib/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * 🔐 SECURE SESSION TRACKING - Audit Trail
 * Logs all authentication events (sign-in, sign-out) to Firestore
 * Enables security monitoring and detection of suspicious activity
 */
async function logSessionActivity(
  userId: string,
  action: string,
  metadata?: Record<string, any>
) {
  try {
    const timestamp = new Date().toISOString();
    const logRef = doc(db, 'session_logs', `${userId}_${Date.now()}`);
    await setDoc(logRef, {
      userId,
      action,
      timestamp,
      metadata: metadata || {},
    });
  } catch (error) {
    console.error('Failed to log session activity:', error);
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const user = await getUser(credentials.email);

        if (!user) {
          throw new Error('User not found');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.iat = Math.floor(Date.now() / 1000); // Issued at time
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    // 📝 Log user login events for security audit trail
    async signIn({ user }) {
      if (user?.id) {
        await logSessionActivity(user.id, 'sign_in', {
          email: user.email,
          timestamp: new Date().toISOString(),
        });
      }
      return true;
    },
    // 📝 Log user logout events for security audit trail
    async signOut({ token }) {
      if (token?.id) {
        await logSessionActivity(token.id as string, 'sign_out');
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  // ⏱️ Session timeout configuration
  session: {
    strategy: 'jwt', // Stateless token-based sessions
    maxAge: 30 * 60, // Auto-logout after 30 minutes of inactivity
    updateAge: 24 * 60 * 60, // Re-validate tokens every 24 hours
  },
  // 🔑 JWT token configuration with encryption
  jwt: {
    maxAge: 30 * 60, // Token expires after 30 minutes
    secret: process.env.NEXTAUTH_SECRET, // Signed with secure secret
  },
  // 🔐 HTTP-ONLY COOKIES - Best practice secure configuration
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true, // ✅ Cannot be accessed by JavaScript
        secure: process.env.NODE_ENV === 'production', // ✅ HTTPS only in production
        sameSite: 'lax' as const, // ✅ CSRF protection
        maxAge: 30 * 60,
        path: '/',
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 30 * 60,
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
      },
  // 📊 Event hooks for monitoring authentication events
  events: {
    async signIn({ user, profile, isNewUser }) {
      console.log(`✓ User ${user?.email} signed in`);
    },
    async signOut({ token }) {
      console.log(`✓ User ${token?.email} signed out`);
    },
   },
  } 
 }
}


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
