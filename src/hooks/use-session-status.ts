'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './use-auth';

/**
 * 📊 Real-time session status interface
 * Tracks when user's session will expire and warning status
 */
interface SessionStatus {
  isActive: boolean; // Is session still valid?
  lastActivity: Date | null; // When was user last active?
  timeUntilExpiry: number; // Milliseconds until auto-logout
  isExpiringSoon: boolean; // Should show warning?
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes until auto-logout
const WARNING_THRESHOLD = 5 * 60 * 1000; // Warn when < 5 minutes left

/**
 * ⏱️ useSessionStatus Hook
 * Monitors session activity in real-time and provides countdown timer
 * Updates every 1 second for accurate remaining time display
 * Useful for UI components showing session expiry warnings
 */
export function useSessionStatus() {
  const { user, lastActivityTime } = useAuth();
  
  // Initialize with current session state
  const [status, setStatus] = useState<SessionStatus>({
    isActive: !!user,
    lastActivity: lastActivityTime ? new Date(lastActivityTime) : null,
    timeUntilExpiry: SESSION_TIMEOUT,
    isExpiringSoon: false,
  });

  /**
   * Monitor session expiry and update countdown timer
   * Recalculates remaining time based on last user activity
   */
  useEffect(() {
    if (!user || !lastActivityTime) return;

    // Calculate current session expiry status
    const updateStatus = () => {
      const now = Date.now();
      const elapsed = now - lastActivityTime;
      const timeUntilExpiry = SESSION_TIMEOUT - elapsed;
      const isExpiringSoon = timeUntilExpiry < WARNING_THRESHOLD; // Warn if < 5 min left

      setStatus({
        isActive: timeUntilExpiry > 0,
        lastActivity: new Date(lastActivityTime),
        timeUntilExpiry: Math.max(0, timeUntilExpiry),
        isExpiringSoon, // True if session expires in < 5 minutes
      });
    };

    // Update session status immediately
    updateStatus();

    // Update every 1 second for real-time countdown display
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [user, lastActivityTime]);

  return status;
}
