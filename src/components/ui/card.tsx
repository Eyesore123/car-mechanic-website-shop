import * as React from "react"
import { cn } from "@/lib/utils"

interface CardDescriptionProps extends React.ComponentProps<"div"> {
  text?: string;
  maxLength?: number;
}

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "scale-90 md:scale-100 bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-4 shadow-lg break-words hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out",
        // { 'border-none': window.innerWidth < 1000 },
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ 
  className, 
  text, 
  maxLength = 120, 
  children, 
  ...props 
}: CardDescriptionProps) {
  const displayText = text && maxLength && text.length > maxLength 
    ? `${text.slice(0, maxLength)}...` 
    : text;
  
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm mt-4 min-h-[60px]", className)}
      {...props}
    >
      {displayText || children}
    </div>
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 flex items-center justify-center w-full", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pt-0", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
