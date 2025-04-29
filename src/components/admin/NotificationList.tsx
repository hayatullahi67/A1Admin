// import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Send } from "lucide-react";

interface Notification {
  id: string;
  message: string;
}

interface AdminNotificationListProps {
  notifications: Notification[];
  onEdit: (n: Notification) => void;
  onDelete: (id: string) => void;
  onSend: (id: string) => void;
}

export function AdminNotificationList({
  notifications,
  onEdit,
  onDelete,
  onSend,
}: AdminNotificationListProps) {


  return (
    <div className="grid grid-cols-1 gap-4">
      {notifications.map((n) => (
        <Card key={n.id} className="hover:shadow-lg flex justify-between items-center py-[30px] transition-shadow">
          <CardContent className="flex ">{n.message}</CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button size="sm" variant="ghost" onClick={() => onEdit(n)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(n.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={() => onSend(n.id)}>
              <Send className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
