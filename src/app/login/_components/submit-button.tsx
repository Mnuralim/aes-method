import { LogIn } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export const LoginButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-3 
        bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600
        text-white font-medium py-3 px-4
        rounded-lg border border-blue-600
        focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
        transition-colors duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Memproses...</span>
        </>
      ) : (
        <>
          <LogIn className="w-5 h-5" />
          <span>Masuk</span>
        </>
      )}
    </button>
  );
};
