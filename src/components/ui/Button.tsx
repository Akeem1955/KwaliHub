"use client";
import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  hasIcon?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", hasIcon = false, ...props }, ref) => {
    const baseStyles =
      "group relative inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium tracking-tight transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(147,51,234,0.25)] hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_6px_25px_rgba(168,85,247,0.35)] active:scale-[0.98] px-6 py-3",
      secondary:
        "bg-purple-50 border border-purple-200 text-purple-900 hover:bg-purple-100 hover:border-purple-300 shadow-sm active:scale-[0.98] px-6 py-3",
      outline:
        "border border-purple-200 bg-white text-purple-900 hover:bg-purple-50 hover:border-purple-300 shadow-sm active:scale-[0.98] px-6 py-3",
      ghost:
        "text-purple-700 hover:text-purple-900 hover:bg-purple-50 px-4 py-2",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.16, ease: [0.32, 0.72, 0, 1] }}
        className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}
        {...props}
      >
        <motion.span className="inline-flex items-center gap-2">
          {children}
        </motion.span>
      </motion.button>
    );
  }
);
Button.displayName = "Button";
