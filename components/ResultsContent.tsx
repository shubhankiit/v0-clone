"use client";

import { useEffect } from "react";
import { Steps } from "@/components/Steps";
import { FileExplorer } from "@/components/FileExplorer";
import { ChatBot } from "@/components/ChatBot";
import { useStore } from "@/lib/store";
import axios from "axios";

export function ResultsContent() {
  const { setFiles, steps } = useStore();

  useEffect(() => {
    const generateFiles = async () => {
      if (!steps) return null;

      try {
        const response = await axios.post("/api/files", {
          steps,
        });
        console.log("response 3: ", JSON.parse(response.data));
        return JSON.parse(response.data);
      } catch (err) {
        console.error("Error in file generation:", err);
        return null;
      }
    };

    const fetchData = async () => {
      const response = await generateFiles();
      if (response) {
        console.log("responsegcgcgcgcgc: ", response);
        setFiles(response);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Steps />
            <div className="mt-6">
              <ChatBot />
            </div>
          </div>
          <div className="lg:col-span-2">
            <FileExplorer />
          </div>
        </div>
      </div>
    </div>
  );
}
