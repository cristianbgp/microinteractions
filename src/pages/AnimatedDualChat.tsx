import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
import { SendHorizonalIcon } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

interface TypingIndicatorProps {
  isVisible: boolean;
}

function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 px-2 py-1"
        >
          <div className="flex items-center gap-1 rounded-full bg-gray-200 px-2 py-1">
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-gray-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
}

function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={clsx(
        "flex w-full px-2 py-0.5",
        isOwn ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={clsx(
          "max-w-[75%] rounded-xl px-3 py-1.5 text-xs",
          isOwn
            ? "rounded-br-md bg-neutral-500 text-white"
            : "rounded-bl-md bg-gray-200 text-gray-800",
        )}
      >
        {message.text}
      </div>
    </motion.div>
  );
}

interface PhoneScreenProps {
  title: string;
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: (text: string) => void;
  showTypingIndicator: boolean;
  Avatar: React.ReactNode;
}

function PhoneScreen({
  title,
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  showTypingIndicator,
  Avatar,
}: PhoneScreenProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      onSendMessage(inputValue.trim());
    }
  };

  return (
    <div className="flex h-[300px] w-[220px] flex-col rounded-[1.5rem] border-6 border-gray-800 p-1.5">
      {/* Phone screen */}
      <div className="flex h-full flex-col rounded-[1.5rem] bg-white">
        {/* Header */}
        <div className="flex items-center justify-center border-b border-gray-200 px-3 py-2">
          <div className="flex items-center gap-1.5">
            {Avatar}
            <span className="text-sm font-semibold text-gray-800">{title}</span>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-1.5">
          <div className="flex flex-col gap-1.5">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                isOwn={message.sender === "user"}
              />
            ))}
            <TypingIndicator isVisible={showTypingIndicator} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 p-2">
          <div className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type..."
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-gray-500"
            />
            <button
              onClick={() =>
                inputValue.trim() && onSendMessage(inputValue.trim())
              }
              disabled={!inputValue.trim()}
              className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-500 text-white disabled:bg-gray-300"
            >
              <SendHorizonalIcon className="size-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnimatedDualChatPage() {
  const [leftMessages, setLeftMessages] = useState<Message[]>([]);
  const [rightMessages, setRightMessages] = useState<Message[]>([]);

  const [leftInput, setLeftInput] = useState("");
  const [rightInput, setRightInput] = useState("");
  const [leftTyping, setLeftTyping] = useState(false);
  const [rightTyping, setRightTyping] = useState(false);

  // Handle typing indicators
  useEffect(() => {
    const timer = setTimeout(() => setLeftTyping(false), 1000);
    return () => clearTimeout(timer);
  }, [leftInput]);

  useEffect(() => {
    const timer = setTimeout(() => setRightTyping(false), 1000);
    return () => clearTimeout(timer);
  }, [rightInput]);

  const handleLeftInputChange = (value: string) => {
    setLeftInput(value);
    setLeftTyping(value.length > 0);
  };

  const handleRightInputChange = (value: string) => {
    setRightInput(value);
    setRightTyping(value.length > 0);
  };

  const handleLeftSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    // Add to left phone as sent message
    setLeftMessages((prev) => [...prev, newMessage]);
    // Add to right phone as received message
    setRightMessages((prev) => [...prev, { ...newMessage, sender: "other" }]);
    setLeftInput("");
    setLeftTyping(false);
  };

  const handleRightSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    // Add to right phone as sent message
    setRightMessages((prev) => [...prev, newMessage]);
    // Add to left phone as received message
    setLeftMessages((prev) => [...prev, { ...newMessage, sender: "other" }]);
    setRightInput("");
    setRightTyping(false);
  };

  return (
    <div className="relative flex w-full items-center justify-center rounded-lg border border-gray-200 p-4 lg:w-[600px]">
      <div className="flex flex-col items-center gap-6 lg:flex-row">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <PhoneScreen
            title="V"
            messages={leftMessages}
            inputValue={leftInput}
            onInputChange={handleLeftInputChange}
            onSendMessage={handleLeftSendMessage}
            showTypingIndicator={rightTyping}
            Avatar={<div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-200" />}
          />
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
          className="hidden size-8 items-center justify-center rounded-full bg-white shadow-lg lg:flex"
        >
          <motion.svg
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-4 w-4 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </motion.svg>
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <PhoneScreen
            title="C"
            messages={rightMessages}
            inputValue={rightInput}
            onInputChange={handleRightInputChange}
            onSendMessage={handleRightSendMessage}
            showTypingIndicator={leftTyping}
            Avatar={<div className="h-6 w-6 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-200" />}
          />
        </motion.div>
      </div>
    </div>
  );
}
