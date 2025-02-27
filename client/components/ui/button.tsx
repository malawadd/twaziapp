import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-base text-sm font-base ring-offset-white transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'text-mtext bg-main border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        noShadow:
          'text-mtext bg-main border-2 border-border',
        neutral:
          'bg-bw text-text border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        outline:
          'bg-bw text-text border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        reverse:
          'text-mtext bg-main border-2 border-border hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
        sidebarItem:
          "gap-2 !justify-start hover:bg-accent hover:bg-primary/80 hover:text-primary-foreground",
        sidebarActiveItem:
          "gap-2 !justify-start bg-primary text-primary-foreground hover:bg-primary/90",
        ghost:
          'bg-transparent text-mtext border-2 border-border shadow-none hover:bg-border hover:text-white transition-all duration-200',
        secondary:
          'bg-transparent text-mtext border-2 border-border shadow-none hover:bg-border hover:text-white transition-all duration-200',
          brutalistRedPulse:
          'bg-red-500 text-white border-4 border-black shadow-[4px_4px_0px_black] rounded-none ' +
          'hover:animate-pulse hover:bg-red-600 hover:shadow-none transition-transform duration-200 ' +
          'active:bg-black active:text-red-500 active:border-red-500',
        destructive:
          'bg-red-500 text-white border-4 border-black shadow-[4px_4px_0px_black] rounded-none ' +
          'hover:animate-pulse hover:bg-red-600 hover:shadow-none transition-transform duration-200 ' +
          'active:bg-black active:text-red-500 active:border-red-500',
        brutalistGreenShift:
          'bg-green-400 text-black border-4 border-black shadow-[4px_4px_0px_black] rounded-none ' +
          'hover:bg-green-500 hover:text-white hover:translate-x-2 hover:translate-y-2 hover:shadow-none ' +
          'transition-transform duration-300 ease-in-out ' +
          'active:bg-black active:text-green-400 active:border-green-400',

        brutalistBlueFlash:
          'bg-blue-400 text-white border-4 border-black shadow-[4px_4px_0px_black] rounded-none ' +
          'hover:bg-white hover:text-blue-400 hover:border-blue-400 hover:shadow-none ' +
          'transition-transform duration-150 ease-in-out ' +
          'active:animate-ping active:bg-black active:text-white',

        brutalistYellow:
          'bg-yellow-400 text-black border-4 border-black shadow-[4px_4px_0px_black] rounded-none ' +
          'dark:bg-yellow-500 dark:text-black dark:border-white ' +
          'hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform duration-150 ' +
          'active:bg-black active:text-yellow-400 active:border-yellow-400'



      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }