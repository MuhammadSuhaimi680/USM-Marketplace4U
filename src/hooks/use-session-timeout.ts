'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before logout

export function useSessionTimeout() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const warningShownRef = useRef(false);

  const resetTimeout = useCallback(() => {
    // Clear existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    warningShownRef.current = false;

    if (!user) return;

    // Warning timeout (5 minutes before logout)
    warningRef.current = setTimeout(() => {
      if (!warningShownRef.current) {
        warningShownRef.current = true;
        toast({
          title: 'Session Expiring Soon',
          description:
            'Your session will expire in 5 minutes due to inactivity. Move your mouse or press a key to continue.',
          variant: 'destructive',
        });
      }
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Logout timeout
    timeoutRef.current = setTimeout(async () => {
      await signOut();
      toast({
        title: 'Session Expired',
        description: 'You have been logged out due to inactivity.',
        variant: 'destructive',
      });
      // Redirect to login page after a short delay
      setTimeout(() => { router
        router.push('/login');
      }, 1000);
    }, INACTIVITY_TIMEOUT);
  }, [user, signOut, toast]);

  useEffect(() => {
    if (!user) return;

    resetTimeout();

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      resetTimeout();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity, true);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [user, resetTimeout]);
}
