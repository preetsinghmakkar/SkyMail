import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-mono text-sm font-medium tracking-tight ring-offset-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#0F766E] text-white hover:bg-[#115E59] dark:bg-[#14B8A6] dark:text-[#052e2b] dark:hover:bg-[#2dd4bf]",
        destructive:
          "bg-[#EF4444] text-white hover:bg-red-600 dark:bg-red-900 dark:hover:bg-red-800",
        outline:
          "border border-gray-300 bg-white hover:bg-gray-50 hover:border-[#0F766E]/40 dark:border-white/15 dark:bg-transparent dark:hover:bg-white/5",
        secondary:
          "bg-[#F0FDFA] text-[#111827] hover:bg-[#CCFBF1] dark:bg-[#14B8A6]/10 dark:text-[#5eead4] dark:hover:bg-[#14B8A6]/20",
        ghost:
          "hover:bg-gray-100 dark:hover:bg-white/10 text-[#111827] dark:text-gray-100",
        link: "text-[#0F766E] underline-offset-4 hover:underline dark:text-[#2dd4bf]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(
          buttonVariants({ variant, size }),
          className,
          (children.props as any)?.className
        ),
        ref,
      });
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
