"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "../../../../app/(auth)/shared/components/Input";
import { Button } from "../../../../app/(auth)/shared/components/Button";
import { useUsernameCheck } from "../hooks/useUsernameCheck";
import { Loader, CheckCircle, XCircle } from "lucide-react";

type UsernameStatus =
  | "idle"
  | "typing"
  | "available"
  | "taken"
  | "invalid";

export function OnboardingStep1({
  data,
  setData,
  setStep,
}: {
  data: any;
  setData: any;
  setStep: any;
}) {
  const [usernameStatus, setUsernameStatus] =
    useState<UsernameStatus>("idle");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const { mutate: checkUsername, isPending } = useUsernameCheck();

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckedUsernameRef = useRef<string>("");

  // 🔥 API CALL (after debounce)
  useEffect(() => {
    if (
      debouncedUsername.length >= 3 &&
      debouncedUsername !== lastCheckedUsernameRef.current
    ) {
      lastCheckedUsernameRef.current = debouncedUsername;

      checkUsername(debouncedUsername.trim(), {
        onSuccess: (res) => {
          setUsernameStatus(res.available ? "available" : "taken");
        },
        onError: () => {
          setUsernameStatus("invalid");
        },
      });
    } else if (debouncedUsername.length < 3 && debouncedUsername.length > 0) {
      setUsernameStatus("invalid");
    } else if (debouncedUsername.length === 0) {
      setUsernameStatus("idle");
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [debouncedUsername, checkUsername]);

  // 🔥 INPUT HANDLER
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setData({ ...data, username: value });

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.length > 0) {
      setUsernameStatus("typing");
    } else {
      setUsernameStatus("idle");
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedUsername(value);
      debounceTimerRef.current = null;
    }, 500);
  };

  const canProceed =
    usernameStatus === "available" && data.username?.trim().length >= 3;

  // 🔥 STATUS MESSAGE
  const getStatusMessage = () => {
    const base = "flex items-center gap-2 text-xs font-medium";

    switch (usernameStatus) {
      case "typing":
        return (
          <div className={`${base} text-muted-foreground`}>
            <Loader size={14} className="animate-spin" />
            <span>Checking...</span>
          </div>
        );

      case "available":
        return (
          <div className={`${base} text-green-500`}>
            <CheckCircle size={14} />
            <span>Username is available</span>
          </div>
        );

      case "taken":
        return (
          <div className={`${base} text-red-500`}>
            <XCircle size={14} />
            <span>Username already taken</span>
          </div>
        );

      case "invalid":
        return (
          <div className={`${base} text-red-500`}>
            <XCircle size={14} />
            <span>Minimum 3 characters required</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canProceed) setStep(2);
        }}
        className="space-y-5"
      >

        {/* INPUT BLOCK */}
        <div className="space-y-2">

          {/* FLOATING LABEL (ONLY WHEN TYPING) */}
          {data.username?.trim() !== "" && (
            <label className="text-xs font-medium text-muted-foreground">
              Username <span className="text-destructive">*</span>
            </label>
          )}

          <div className="relative">

            <Input
              type="text"
              placeholder="ayush_dev"
              value={data.username ?? ""}
              onChange={handleUsernameChange}
              required
              className="
                w-full h-11
                rounded-xl
                bg-background/70
                border border-border
                px-4 text-sm

                focus:border-primary
                focus:ring-2 focus:ring-primary/20

                hover:border-primary/30

                transition-all duration-200
              "
            />

            {/* ICONS */}
            {usernameStatus === "available" && (
              <CheckCircle
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
              />
            )}

            {(usernameStatus === "taken" ||
              usernameStatus === "invalid") && (
              <XCircle
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
              />
            )}

            {usernameStatus === "typing" && (
              <Loader
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-primary"
              />
            )}
          </div>

          {/* STATUS → ONLY WHEN USER TYPES */}
          {data.username?.trim() !== "" && (
            <div className="text-xs animate-fade-in">
              {getStatusMessage()}
            </div>
          )}
        </div>

        {/* BUTTON */}
        <Button
          type="submit"
          disabled={!canProceed || isPending}
          className="
            w-full h-11
            rounded-xl
            font-medium text-sm

            bg-primary text-primary-foreground

            hover:shadow-[0_0_20px_var(--hover-glow)]
            hover:brightness-105

            transition-all duration-200
            active:scale-[0.97]

            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isPending ? "Checking..." : "Next →"}
        </Button>
      </form>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}