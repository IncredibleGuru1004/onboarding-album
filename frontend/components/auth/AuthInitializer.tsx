"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "@/store/authSlice";
import { getCurrentUser } from "@/lib/auth";

/**
 * Component that initializes auth state from the backend on app mount
 * This ensures that the Redux store is synced with the backend auth state
 * Only runs if Redux store doesn't already have user data
 */
export const AuthInitializer = () => {
  const dispatch = useDispatch();
  const existingUser = useSelector(selectUser);

  useEffect(() => {
    // Skip if user data already exists in Redux
    if (existingUser) {
      return;
    }

    const initAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          dispatch(setUser(user));
        }
      } catch (error) {
        // Silently fail - user is not authenticated
        console.debug("User not authenticated", error);
      }
    };

    initAuth();
  }, [dispatch, existingUser]);

  // This component doesn't render anything
  return null;
};
