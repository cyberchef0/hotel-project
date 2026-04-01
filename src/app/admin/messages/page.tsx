import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { HiOutlineMail, HiOutlineCheck } from "react-icons/hi";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-500 mt-1">Manage feedback and inquiries from customers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {messages.length === 0 ? (
            <li className="p-8 text-center text-gray-500">
              <HiOutlineMail className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p>No messages found.</p>
            </li>
          ) : (
            messages.map((msg) => (
              <li key={msg.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{msg.subject}</h3>
                    <p className="text-sm text-gray-500">
                      From: <span className="font-medium text-gray-900">{msg.name}</span> ({msg.email})
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </span>
                    {msg.status === "UNREAD" && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
