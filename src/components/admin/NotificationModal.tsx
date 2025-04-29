// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";

// interface AdminNotificationModalProps {
//   isOpen: boolean;
//   initialMessage?: string;
//   onClose: () => void;
//   onSubmit: (message: string) => void;
//   submitLabel: string;
// }

// export function AdminNotificationModal({
//   isOpen,
//   initialMessage = "",
//   onClose,
//   onSubmit,
//   submitLabel,
// }: AdminNotificationModalProps) {
//   const [message, setMessage] = useState(initialMessage);
//   const userData = JSON.parse(localStorage.getItem("user") || "{}");
//       const token = userData.token;

//   useEffect(() => {
//     setMessage(initialMessage);
//   }, [initialMessage]);

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>{submitLabel}</DialogTitle>
//         </DialogHeader>
//         <Textarea
//           rows={5}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Enter notification message..."
//           className="w-full"
//         />
//         <DialogFooter className="flex justify-end space-x-2">
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={() => onSubmit(message)}>{submitLabel}</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }



// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// // import { toast } from "@/components/ui/use-toast";
// import { Toast } from "@radix-ui/react-toast";

// interface AdminNotificationModalProps {
//   isOpen: boolean;
//   initialMessage?: string;
//   onClose: () => void;
//   onSubmit: (message: string) => void;
//   submitLabel: string;
// }

// export function AdminNotificationModal({
//   isOpen,
//   initialMessage = "",
//   onClose,
//   onSubmit,
//   submitLabel,
// }: AdminNotificationModalProps) {
//   const [message, setMessage] = useState(initialMessage);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const userData = JSON.parse(localStorage.getItem("user") || "{}");
//   const token = userData.token;

//   useEffect(() => {
//     setMessage(initialMessage);
//   }, [initialMessage]);

//   const handleSubmit = async () => {
//     if (!message.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter a notification message",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Make API call to create notification
//       const response = await fetch("https://api.a1schools.org/notifications", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({ message }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `Failed to create notification: ${response.status}`);
//       }

//       // Show success toast
//       toast({
//         title: "Success",
//         description: "Notification created successfully",
//       });

//       // Call the original onSubmit prop (for any additional handling)
//       onSubmit(message);
      
//       // Close the modal
//       onClose();
      
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to create notification",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>{submitLabel}</DialogTitle>
//         </DialogHeader>
//         <Textarea
//           rows={5}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Enter notification message..."
//           className="w-full"
//         />
//         <DialogFooter className="flex justify-end space-x-2">
//           <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={isSubmitting}>
//             {isSubmitting ? "Creating..." : submitLabel}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }






import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import * as Toast from '@radix-ui/react-toast';

interface AdminNotificationModalProps {
  isOpen: boolean;
  initialMessage?: string;
  onClose: () => void;
  onSubmit: (message: string) => void;
  submitLabel: string;
}

export function AdminNotificationModal({
  isOpen,
  initialMessage = "",
  onClose,
  onSubmit,
  submitLabel,
}: AdminNotificationModalProps) {
  const [message, setMessage] = useState(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const token = userData.token;

  useEffect(() => {
    setMessage(initialMessage);
  }, [initialMessage]);

  const showToast = (type: "success" | "error", message: string) => {
    setToastType(type);
    setToastMessage(message);
    setOpen(true);
  };

  // const handleSubmit = async () => {
  //   if (!message.trim()) {
  //     showToast("error", "Please enter a notification message");
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     // Make API call to create notification
  //     const response = await fetch("https://api.a1schools.org/notifications", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ message }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}));
  //       throw new Error(errorData.message || `Failed to create notification: ${response.status}`);
  //     }

  //     // Show success toast
  //     showToast("success", "Notification created successfully");

  //     // Call the original onSubmit prop (for any additional handling)
  //     onSubmit(message);
      
  //     // Close the modal
  //     onClose();
      
  //   } catch (error) {
  //     showToast("error", error instanceof Error ? error.message : "Failed to create notification");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{submitLabel}</DialogTitle>
          </DialogHeader>
          <Textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message..."
            className="w-full"
          />
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={() => onSubmit(message)} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : submitLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Radix UI Toast */}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className={`rounded-md shadow-md p-4 ${
            toastType === "error" ? "bg-red-100 border-l-4 border-red-500" : "bg-green-100 border-l-4 border-green-500"
          }`}
          open={open}
          onOpenChange={setOpen}
          duration={3000}
        >
          <Toast.Title className={`font-medium ${toastType === "error" ? "text-red-800" : "text-green-800"}`}>
            {toastType === "error" ? "Error" : "Success"}
          </Toast.Title>
          <Toast.Description className={toastType === "error" ? "text-red-600" : "text-green-600"}>
            {toastMessage}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 w-80 max-w-[100vw] m-0 list-none z-50" />
      </Toast.Provider>
    </>
  );
}