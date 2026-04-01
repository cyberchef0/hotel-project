"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineTrash } from "react-icons/hi";

export default function DeleteRoomButton({ roomId }: { roomId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this room? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("An error occurred while deleting the room");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete Room"
      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
    >
      <HiOutlineTrash className="w-4 h-4" />
    </button>
  );
}
