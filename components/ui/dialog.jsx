import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

export const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
    <DialogPrimitive.Content
      ref={ref}
      className={`fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 
        bg-white rounded-lg shadow-lg p-6 ${className}`}
      {...props}
    >
      {/* 👇 Agar DialogTitle na diya ho toh VisuallyHidden add kar dete hain */}
      <DialogPrimitive.Title className="sr-only">Dialog</DialogPrimitive.Title>

      {children}

      <DialogPrimitive.Close className="absolute right-4 top-4 text-gray-500 hover:text-gray-800">
        <X className="h-5 w-5" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = "DialogContent"

export const DialogHeader = ({ className, ...props }) => (
  <div className={`mb-4 ${className}`} {...props} />
)

export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description
export const DialogFooter = ({ className, ...props }) => (
  <div className={`mt-4 flex justify-end gap-2 ${className}`} {...props} />
)
