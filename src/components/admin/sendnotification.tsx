// import React, { useState, useEffect } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, X } from "lucide-react";
// import { toast } from "react-hot-toast";

// export function SendNotificationModal({ 
//   isOpen, 
//   onClose, 
//   notificationId
// }) {
//   const [sendType, setSendType] = useState(null); // "all" or "specific"
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedUser, setSelectedUser] = useState(null);
  
//   const userData = JSON.parse(localStorage.getItem("user") || "{}");
//   const token = userData.token;

//   useEffect(() => {
//     if (isOpen && sendType === "specific") {
//       fetchUsers();
//     }
//   }, [isOpen, sendType]);

//   const fetchUsers = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch("https://api.a1schools.org/users", {
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch users: ${response.status}`);
//       }
      
//       const data = await response.json();
//       setUsers(Array.isArray(data.data) ? data.data : []);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       toast.error("Failed to load users");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSendToAll = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`https://api.a1schools.org/notifications/${notificationId}/send`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to send notification: ${response.status}`);
//       }
      
//       toast.success("Notification sent to all users successfully!");
//       onClose();
//     } catch (error) {
//       console.error("Error sending notification:", error);
//       toast.error("Failed to send notification");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSendToUser = async () => {
//     if (!selectedUser) {
//       toast.error("Please select a user first");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await fetch(`https://api.a1schools.org/notifications/${notificationId}/send/${selectedUser.id}`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to send notification: ${response.status}`);
//       }
      
//       toast.success(`Notification sent to ${selectedUser.name || selectedUser.email || 'user'} successfully!`);
//       onClose();
//     } catch (error) {
//       console.error("Error sending notification:", error);
//       toast.error("Failed to send notification");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredUsers = users.filter(user => {
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       (user.fullname && user.fullname.toLowerCase().includes(searchLower)) ||
//       (user.email && user.email.toLowerCase().includes(searchLower)) ||
//       (user.id && user.id.toString().includes(searchLower))
//     );
//   });

//   const resetModal = () => {
//     setSendType(null);
//     setSearchTerm("");
//     setSelectedUser(null);
//   };

//   const handleClose = () => {
//     resetModal();
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Send Notification</DialogTitle>
//         </DialogHeader>

//         {!sendType ? (
//           <div className="grid gap-4 py-4">
//             <p className="text-sm text-gray-500">Choose how to send this notification:</p>
//             <div className="flex flex-col gap-3">
//               <Button 
//                 onClick={() => setSendType("all")}
//                 className="w-full"
//               >
//                 Send to All Users
//               </Button>
//               <Button 
//                 onClick={() => setSendType("specific")}
//                 variant="outline" 
//                 className="w-full"
//               >
//                 Send to Specific User
//               </Button>
//             </div>
//           </div>
//         ) : sendType === "all" ? (
//           <div className="py-4">
//             <p className="text-sm text-gray-500 mb-4">
//               This will send the notification to all users in the system.
//             </p>
//             <DialogFooter className="flex gap-2 justify-end">
//               <Button 
//                 variant="outline" 
//                 onClick={() => setSendType(null)}
//                 disabled={isLoading}
//               >
//                 Back
//               </Button>
//               <Button 
//                 onClick={handleSendToAll}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Sending..." : "Confirm Send to All"}
//               </Button>
//             </DialogFooter>
//           </div>
//         ) : (
//           <div className="py-4">
//             <div className="relative mb-4">
//               <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search users by name or email..."
//                 className="pl-8"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               {searchTerm && (
//                 <button 
//                   onClick={() => setSearchTerm("")}
//                   className="absolute right-2 top-2.5"
//                 >
//                   <X className="h-4 w-4 text-gray-400" />
//                 </button>
//               )}
//             </div>

//             <div className="max-h-60 overflow-y-auto mb-4 border rounded-md">
//               {isLoading ? (
//                 <div className="flex justify-center items-center p-4">
//                   <p>Loading users...</p>
//                 </div>
//               ) : filteredUsers.length === 0 ? (
//                 <div className="p-4 text-center text-gray-500">
//                   {searchTerm ? "No users match your search" : "No users found"}
//                 </div>
//               ) : (
//                 <div className="divide-y">
//                   {filteredUsers.map((user) => (
//                     <div
//                       key={user.id}
//                       className={`p-2 hover:bg-gray-100 cursor-pointer ${
//                         selectedUser?.id === user.id ? "bg-blue-50" : ""
//                       }`}
//                       onClick={() => setSelectedUser(user)}
//                     >
//                       <div className="font-medium">
//                         {user.fullname || "Unnamed User"}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {user.email || "No email"} • ID: {user.id}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {selectedUser && (
//               <div className="mb-4 p-2 bg-blue-50 border border-blue-100 rounded-md">
//                 <p className="text-sm">
//                   Selected: <span className="font-medium">{selectedUser.name || selectedUser.email || selectedUser.id}</span>
//                 </p>
//               </div>
//             )}

//             <DialogFooter className="flex gap-2 justify-end">
//               <Button 
//                 variant="outline" 
//                 onClick={() => setSendType(null)}
//                 disabled={isLoading}
//               >
//                 Back
//               </Button>
//               <Button 
//                 onClick={handleSendToUser}
//                 disabled={isLoading || !selectedUser}
//               >
//                 {isLoading ? "Sending..." : "Send to Selected User"}
//               </Button>
//             </DialogFooter>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }




import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { toast } from "react-hot-toast";

// Define interfaces for props and data structures
interface User {
  id: string;
  fullname?: string;
  email?: string;
}

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificationId: string | null;
}

export function SendNotificationModal({ 
  isOpen, 
  onClose, 
  notificationId 
}: SendNotificationModalProps): React.ReactElement {
  const [sendType, setSendType] = useState<"all" | "specific" | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const token: string = userData.token;

  useEffect(() => {
    if (isOpen && sendType === "specific") {
      fetchUsers();
    }
  }, [isOpen, sendType]);

  const fetchUsers = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch("https://api.a1schools.org/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToAll = async (): Promise<void> => {
    if (!notificationId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.a1schools.org/notifications/${notificationId}/send`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.status}`);
      }
      
      toast.success("Notification sent to all users successfully!");
      onClose();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToUser = async (): Promise<void> => {
    if (!selectedUser || !notificationId) {
      toast.error("Please select a user first");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`https://api.a1schools.org/notifications/${notificationId}/send/${selectedUser.id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.status}`);
      }
      
      toast.success(`Notification sent to ${selectedUser.fullname || selectedUser.email || 'user'} successfully!`);
      onClose();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.fullname && user.fullname.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.id && user.id.toString().includes(searchLower))
    );
  });

  const resetModal = (): void => {
    setSendType(null);
    setSearchTerm("");
    setSelectedUser(null);
  };

  const handleClose = (): void => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>

        {!sendType ? (
          <div className="grid gap-4 py-4">
            <p className="text-sm text-gray-500">Choose how to send this notification:</p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => setSendType("all")}
                className="w-full"
              >
                Send to All Users
              </Button>
              <Button 
                onClick={() => setSendType("specific")}
                variant="outline" 
                className="w-full"
              >
                Send to Specific User
              </Button>
            </div>
          </div>
        ) : sendType === "all" ? (
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-4">
              This will send the notification to all users in the system.
            </p>
            <DialogFooter className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setSendType(null)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                onClick={handleSendToAll}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Confirm Send to All"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-[gray]" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-2.5"
                >
                  <X className="h-4 w-4 text-[gray]" />
                </button>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto mb-4 border rounded-md">
              {isLoading ? (
                <div className="flex justify-center items-center p-4">
                  <p>Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm ? "No users match your search" : "No users found"}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-2 hover:bg-[gray] cursor-pointer ${
                        selectedUser?.id === user.id ? "bg-[blue]" : ""
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="font-medium">
                        {user.fullname || "Unnamed User"}
                      </div>
                      <div className="text-sm text-[gray]">
                        {user.email || "No email"} • ID: {user.id}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedUser && (
              <div className="mb-4 p-2 bg-[blue] border border-blue-100 rounded-md">
                <p className="text-sm">
                  Selected: <span className="font-medium">{selectedUser.fullname || selectedUser.email || selectedUser.id}</span>
                </p>
              </div>
            )}

            <DialogFooter className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setSendType(null)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                onClick={handleSendToUser}
                disabled={isLoading || !selectedUser}
              >
                {isLoading ? "Sending..." : "Send to Selected User"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}