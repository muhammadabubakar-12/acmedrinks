"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
}

export function useChat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch existing messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch("/api/chat/messages");
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a new message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || sending) return;

      setSending(true);
      try {
        const response = await fetch("/api/chat/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setSending(false);
      }
    },
    [sending]
  );

  // Subscribe to Pusher events
  useEffect(() => {
    if (!session?.user) return;

    const channel = pusherClient.subscribe("chat");

    channel.bind("new-message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    // Fetch initial messages
    fetchMessages();

    return () => {
      pusherClient.unsubscribe("chat");
    };
  }, [session?.user, fetchMessages]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    currentUser: session?.user,
  };
}
