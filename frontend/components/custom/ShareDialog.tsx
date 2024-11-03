"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";

interface User {
  username: string;
  nombre: string;
}

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemPath: string;
}

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    return data.users ? { users: data.users } : { users: [] };
  } catch (error) {
    console.error("Fetch error:", error);
    return { users: [] };
  }
};

export function ShareDialog({ isOpen, onClose, itemName, itemPath }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const { toast } = useToast();

  const { data } = useSWR<{ users: User[] }>(
    isOpen ? "/api/users" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const handleShare = async () => {
    if (!selectedUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a user to share with",
      });
      return;
    }
    try {
      const resourceName = itemName;
      const extractResorcePath = itemPath.replace(`/${resourceName}` , '');
      const pathToResource = extractResorcePath.replace(/^\/+/, '');
      console.log({
        name : resourceName,
        path : pathToResource,
        to: selectedUser,
      })
      const response = await fetch("/api/transfer_resource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name : resourceName,
          path : pathToResource,
          to: selectedUser,
        }),
      });

      if (!response.ok) throw new Error("Failed to share");

      toast({
        title: "Success",
        description: `Successfully shared ${itemName} with ${selectedUser}`,
      });
      onClose();
    } catch (error) {
      console.error("Share error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to share the item. Please try again.",
      });
    }
  };

  const users = data?.users ?? [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share {itemName}</DialogTitle>
          <DialogDescription>
            Select a user to share this item with. They will receive access immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setOpen((prev) => !prev)}
              >
                {selectedUser ? selectedUser : "Select a user..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <div className="max-h-60 overflow-y-auto">
                {users.length === 0 ? (
                  <div className="p-2 text-gray-500">No users found.</div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.username}
                      className="p-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                      onClick={() => {
                        setSelectedUser(user.username);
                        setOpen(false);
                      }}
                    >
                      {user.nombre} ({user.username})
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={!selectedUser}>
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


