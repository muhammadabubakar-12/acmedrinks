"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Users, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@/hooks/useChat";

interface UserWithMessages {
  id: string;
  name?: string;
  email: string;
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
  }>;
}

interface AdminChatInterfaceProps {
  usersWithMessages: UserWithMessages[];
}

export default function AdminChatInterface({
  usersWithMessages,
}: AdminChatInterfaceProps) {
  const { messages, loading, sending, sendMessage, currentUser } = useChat();
  const [selectedUser, setSelectedUser] = useState<UserWithMessages | null>(
    null
  );
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || sending) return;

    const content = inputValue.trim();
    setInputValue("");
    await sendMessage(content);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "?";
  };

  const getLatestMessage = (user: UserWithMessages) => {
    return user.messages[0]?.content || "No messages yet";
  };

  const getMessageTime = (user: UserWithMessages) => {
    if (user.messages.length === 0) return "No messages";
    return formatDistanceToNow(new Date(user.messages[0].createdAt), {
      addSuffix: true,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Users List */}
      <div className="lg:col-span-1 bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customers ({usersWithMessages.length})
          </h2>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {usersWithMessages.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No customers have sent messages yet</p>
            </div>
          ) : (
            usersWithMessages.map((user) => (
              <div
                key={user.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedUser?.id === user.id
                    ? "bg-blue-50 border-blue-200"
                    : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      {getInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">
                        {user.name || user.email}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {user.messages.length} messages
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {getLatestMessage(user)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {getMessageTime(user)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-2 bg-white rounded-lg border">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-100 text-gray-600">
                    {getInitials(selectedUser.name, selectedUser.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    {selectedUser.name || selectedUser.email}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedUser.messages.length} messages
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col h-96">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No messages in this conversation</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = message.sender.id === currentUser?.id;
                    const isAdmin = message.sender.role === "admin";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isOwnMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex items-start gap-3 max-w-xs lg:max-w-md ${
                            isOwnMessage ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              className={`text-xs ${
                                isAdmin
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {getInitials(
                                message.sender.name,
                                message.sender.email
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              isOwnMessage
                                ? "bg-gray-800 text-white selection:bg-gray-600 selection:text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">
                                {message.sender.name || message.sender.email}
                                {isAdmin && " (Admin)"}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">
                              {message.content}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwnMessage ? "text-gray-300" : "text-gray-500"
                              }`}
                            >
                              {formatDistanceToNow(
                                new Date(message.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Form */}
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your response..."
                    disabled={sending}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={sending || !inputValue.trim()}
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">
                Select a customer to start chatting
              </p>
              <p className="text-sm">
                Choose a customer from the list to view their messages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
