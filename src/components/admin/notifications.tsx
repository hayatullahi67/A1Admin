// import React, { useState, useEffect } from "react";
// import { AdminNotificationModal } from "./NotificationModal";
// import { AdminNotificationList } from "./NotificationList";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";

// export  function AdminNotificationsPage() {
//   const [notifications, setNotifications] = useState<
//     { id: string; message: string }[]
//   >([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editItem, setEditItem] = useState<{id: string, message: string} | null>(null);


//   const userData = JSON.parse(localStorage.getItem("user") || "{}");
//    const token = userData.token;

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

  

// const fetchNotifications = async () => {
//   try {
//     // setIsLoading(true);
//     const response = await fetch("https://api.a1schools.org/notifications");

//     if (!response.ok) {
//       throw new Error(`Failed to fetch: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     // Add validation for array structure
//     if (!Array.isArray(data.data)) {
//       console.error("API response is not an array:", data.data);
//       setNotifications([]);
//       return;
//     }
    
//     setNotifications(data.data);
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     setNotifications([]); // Ensure state remains an array
//     // Consider adding a user-facing error message here
//   } finally {
//     // setIsLoading(false);
//   }
// };





// const handleSubmit = async (message: string) => {
//   const userData = JSON.parse(localStorage.getItem("user") || "{}");
//   const token = userData.token;

//   try {
//     if (editItem) {
//       // EDIT existing notification
//       await fetch(`https://api.a1schools.org/notifications/${editItem.id}`, {
//         method: "PUT",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ message })
//       });
//     } else {
//       // CREATE new notification
//       await fetch("https://api.a1schools.org/notifications", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ message })
//       });
//     }
    
//     fetchNotifications(); // Refresh the list
//     setModalOpen(false); // Close modal
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// // When opening modal for editing
// // const handleEdit = (notification: {id: string, message: string}) => {
// //   setEditItem(notification);
// //   setModalOpen(true);
// // };

//   const openModalForEdit = (item: { id: string; message: string }) => {
//     setEditItem(item);
//     setModalOpen(true);
//   };

//   // const closeModal = () => {
//   //   setModalOpen(false);
//   //   setEditItem(null);
//   // };

//   // const handleDelete = async (id: string) => {
//   //   if (window.confirm("Are you sure?")) {
//   //     await fetch(`/api/notifications/${id}`, { method: "DELETE" });
//   //     fetchNotifications();
//   //   }
//   // };

//   const handleDelete = async (id: string) => {
//     if (window.confirm("Are you sure?")) {
//       try {
//         // setIsLoading(true);
//         await fetch(`https://api.a1schools.org/notifications/${id}`, { 
//           method: "DELETE",
//           headers: {
//             "Authorization": `Bearer ${token}` // Add this line
//           }
//         });
//         fetchNotifications();
//       } catch (error) {
//         console.error("Error deleting:", error);
//       } finally {
//         // setIsLoading(false);
//       }
//     }
//   };

//   const handleSend = (id: string) => {
//     if (window.confirm("Send to all users? OK=All, Cancel=Specific")) {
//       fetch(`/api/notifications/${id}/send-all`, { method: "POST" }).then(
//         fetchNotifications
//       );
//     } else {
//       fetch("/api/users")
//         .then((r) => r.json())
//         .then((users) => {
//           const uid = window.prompt("Enter user ID:");
//           if (uid)
//             fetch(`/api/notifications/${id}/send/${uid}`, {
//               method: "POST",
//             }).then(fetchNotifications);
//         });
//     }
//   };
     

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Admin Notifications</h1>
//         <Button onClick={() => setModalOpen(true)}>
//           <Plus className="w-4 h-4 mr-1" /> Create
//         </Button>
//       </div>
//       <AdminNotificationList
//         notifications={notifications}
//         onEdit={openModalForEdit}
//         onDelete={handleDelete}
//         onSend={handleSend}
//       />
//       <AdminNotificationModal
//         isOpen={modalOpen}
//         initialMessage={editItem?.message}
//         // onClose={closeModal}
//       //   onSubmit={(message) => upsertNotification(message, editItem?.id)}
//       //   submitLabel={editItem ? "Update" : "Create"}
//       onClose={() => {
//         setModalOpen(false);
//         setEditItem(null);
//       }}
//       onSubmit={handleSubmit}
//       submitLabel={editItem ? "Update" : "Create"}
//        />
//     </div>
//   );
// }





// import React, { useState, useEffect } from "react";
// import { AdminNotificationModal } from "./NotificationModal";
// import { AdminNotificationList } from "./NotificationList";
// import { SendNotificationModal } from "@/components/admin/sendnotification"; // Import the new component
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { Toaster } from "react-hot-toast"; // Import Toaster for toast notifications

// interface Notification {
//   id: string;
//   message: string;
// }

// export function AdminNotificationsPage() {
//   const [notifications, setNotifications] = useState<Notification []>([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editItem, setEditItem] = useState(null);
//   const [sendModalOpen, setSendModalOpen] = useState(false); // State for send modal
//   const [selectedNotificationId, setSelectedNotificationId] = useState(null); // Track selected notification ID

//   const userData = JSON.parse(localStorage.getItem("user") || "{}");
//   const token = userData.token;

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const response = await fetch("https://api.a1schools.org/notifications");

//       if (!response.ok) {
//         throw new Error(`Failed to fetch: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (!Array.isArray(data.data)) {
//         console.error("API response is not an array:", data.data);
//         setNotifications([]);
//         return;
//       }
      
//       setNotifications(data.data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setNotifications([]);
//     }
//   };

//   const handleSubmit = async (message) => {
//     const userData = JSON.parse(localStorage.getItem("user") || "{}");
//     const token = userData.token;

//     try {
//       if (editItem) {
//         // EDIT existing notification
//         await fetch(`https://api.a1schools.org/notifications/${editItem.id}`, {
//           method: "PUT",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({ message })
//         });
//       } else {
//         // CREATE new notification
//         await fetch("https://api.a1schools.org/notifications", {
//           method: "POST",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({ message })
//         });
//       }
      
//       fetchNotifications(); // Refresh the list
//       setModalOpen(false); // Close modal
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const openModalForEdit = (item) => {
//     setEditItem(item);
//     setModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure?")) {
//       try {
//         await fetch(`https://api.a1schools.org/notifications/${id}`, { 
//           method: "DELETE",
//           headers: {
//             "Authorization": `Bearer ${token}`
//           }
//         });
//         fetchNotifications();
//       } catch (error) {
//         console.error("Error deleting:", error);
//       }
//     }
//   };

//   // Updated to open the modal instead of using window.confirm
//   const handleSend = (id) => {
//     setSelectedNotificationId(id);
//     setSendModalOpen(true);
//   };

//   return (
//     <div className="p-6">
//       {/* Add Toaster component for notifications */}
//       <Toaster position="top-right" />
      
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Admin Notifications</h1>
//         <Button onClick={() => setModalOpen(true)}>
//           <Plus className="w-4 h-4 mr-1" /> Create
//         </Button>
//       </div>
      
//       <AdminNotificationList
//         notifications={notifications}
//         onEdit={openModalForEdit}
//         onDelete={handleDelete}
//         onSend={handleSend}
//       />
      
//       <AdminNotificationModal
//         isOpen={modalOpen}
//         initialMessage={editItem?.message}
//         onClose={() => {
//           setModalOpen(false);
//           setEditItem(null);
//         }}
//         onSubmit={handleSubmit}
//         submitLabel={editItem ? "Update" : "Create"}
//       />
      
//       {/* Add the new SendNotificationModal */}
//       <SendNotificationModal
//         isOpen={sendModalOpen}
//         onClose={() => setSendModalOpen(false)}
//         notificationId={selectedNotificationId}
//       />
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { AdminNotificationModal } from "./NotificationModal";
import { AdminNotificationList } from "./NotificationList";
import { SendNotificationModal } from "@/components/admin/sendnotification";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Toaster } from "react-hot-toast";

// Define interfaces for the component
interface Notification {
  id: string;
  message: string;
}

export function AdminNotificationsPage(): React.ReactElement {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<Notification | null>(null);
  const [sendModalOpen, setSendModalOpen] = useState<boolean>(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const token: string = userData.token;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (): Promise<void> => {
    try {
      const response = await fetch("https://api.a1schools.org/notifications");

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data.data)) {
        console.error("API response is not an array:", data.data);
        setNotifications([]);
        return;
      }

      setNotifications(data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  const handleSubmit = async (message: string): Promise<void> => {
    try {
      if (editItem) {
        // EDIT existing notification
        await fetch(`https://api.a1schools.org/notifications/${editItem.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message })
        });
      } else {
        // CREATE new notification
        await fetch("https://api.a1schools.org/notifications", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message })
        });
      }

      fetchNotifications(); // Refresh the list
      setModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openModalForEdit = (item: Notification): void => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm("Are you sure?")) {
      try {
        await fetch(`https://api.a1schools.org/notifications/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        fetchNotifications();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const handleSend = (id: string): void => {
    setSelectedNotificationId(id);
    setSendModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Add Toaster component for notifications */}
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Notifications</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Create
        </Button>
      </div>

      <AdminNotificationList
        notifications={notifications}
        onEdit={openModalForEdit}
        onDelete={handleDelete}
        onSend={handleSend}
      />

      <AdminNotificationModal
        isOpen={modalOpen}
        initialMessage={editItem?.message}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        onSubmit={handleSubmit}
        submitLabel={editItem ? "Update" : "Create"}
      />

      <SendNotificationModal
        isOpen={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        notificationId={selectedNotificationId}
      />
    </div>
  );
}
