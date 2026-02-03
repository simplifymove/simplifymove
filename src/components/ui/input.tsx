import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-10 w-full min-w-0 rounded-lg border-2 border-gray-300 px-4 py-2 text-base bg-white transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium md:text-sm",
        "hover:border-gray-400",
        "focus-visible:border-blue-500 focus-visible:ring-blue-500/20 focus-visible:ring-4",
        "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };