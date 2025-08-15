import { useState, useEffect } from "react";
import { Registration } from "@/types";
import { RegistrationService } from "@/services/firestore";

export function useRegistration(registrationId: string) {
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!registrationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = RegistrationService.onSnapshot(
      registrationId,
      (data) => {
        setRegistration(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [registrationId]);

  const approve = async (schoolId: string, approvedBy: string) => {
    try {
      await RegistrationService.approve(registrationId, schoolId, approvedBy);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to approve registration";
      setError(errorMessage);
      throw error;
    }
  };

  const reject = async (rejectedBy: string, reason?: string) => {
    try {
      await RegistrationService.reject(registrationId, rejectedBy, reason);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reject registration";
      setError(errorMessage);
      throw error;
    }
  };

  return {
    registration,
    loading,
    error,
    approve,
    reject,
  };
}

export function usePendingRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = RegistrationService.onPendingSnapshot((data) => {
      setRegistrations(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    registrations,
    loading,
    error,
  };
}
