import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Geist, Geist_Mono } from "next/font/google";
import bismillah_image from "@/assests/images/abc.png";
import styles from "@/styles/Home.module.css";
import axios from "axios";

// Font imports
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

interface ApiResponse {
  answer: string;
}

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: message },
    ]);
    setMessage("");

    await axios
      .post("/api/chatbot", { message })
      .then((res) => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { role: "user", content: res.data.answer },
        ]);
      })
      .catch((err) => {
        console.error("Axios Error:", err.response?.data || err.message);
        alert(
          `Front end request error. Error: ${
            err.response?.data?.message || err.message
          }`
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>Islamic Chatbot</title>
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <Box sx={{ textAlign: "center", marginBottom: 4 }}>
            <Image
              src={bismillah_image}
              alt="Bismillah"
              width={400}
              height={150}
              priority
            />
            <Typography variant="h4" gutterBottom>
              Islamic Chatbot
            </Typography>
          </Box>

          <Paper
            sx={{
              padding: 2,
              display: "flex",
              flexDirection: "column",
              height: "60vh",
              maxWidth: 600,
              margin: "auto",
              marginBottom: "20px",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Box sx={{ overflowY: "auto", flexGrow: 1, paddingBottom: 2 }}>
              {chatHistory.length === 0 && (
                <Box sx={{ textAlign: "center", padding: 2 }}>
                  <Typography variant="body1" color="textSecondary">
                    Welcome! Ask me anything about Islam.
                  </Typography>
                </Box>
              )}
              {chatHistory.map((chat, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: chat.role === "user" ? "row-reverse" : "row",
                    margin: 1,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor:
                        chat.role === "user" ? "#e0f7fa" : "#f1f1f1",
                      padding: 2,
                      borderRadius: 2,
                      maxWidth: "70%",
                      wordWrap: "break-word",
                    }}
                  >
                    <Typography variant="body1">{chat.content}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                label="Type your message..."
                variant="outlined"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ marginRight: 2 }}
                disabled={isLoading}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={isLoading}
                sx={{ padding: "10px 20px" }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send"
                )}
              </Button>
            </Box>
          </Paper>
        </main>
      </div>
    </>
  );
}
