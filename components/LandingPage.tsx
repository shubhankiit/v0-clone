"use client";

import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Sparkles, Code, Palette } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const { setIsGenerating, setError, clearError, setSteps } = useStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!prompt.trim()) return;

    setIsGenerating(true);
    clearError();

    try {
      // Initial check for React/Next.js suitability
      const response = await axios.post("/api/template", {
        prompt,
      });

      if (response.status !== 200) {
        throw new Error("Failed to generate website");
      }

      console.log("response.data", response.data);

      setSteps(response.data);
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsGenerating(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-muted/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-muted/50 rounded-full blur-3xl" />

      <div className="px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex mb-10 items-center px-4 py-2 rounded-full bg-muted">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                Create stunning websites instantly
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Transform Your Ideas Into
              <br />
              <span>Beautiful Websites</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter your vision and watch as we transform it into a
              professionally designed website. No coding required.
            </p>
          </div>

          {/* Main Input Section */}
          <Card className="shadow-xl border-none">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center border border-primary/10 px-2 rounded-lg justify-between">
                  <Input
                    type="text"
                    placeholder="Describe your dream website..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full border-none h-16 pl-6 pr-32 text-lg outline-none focus-visible:outline-none focus-visible:ring-0"
                  />

                  <Button
                    type="submit"
                    className=" right-2 top-3 py-4 px-6"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Create"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: Code,
                title: "Clean Code",
                description:
                  "Generate well-structured, maintainable code that follows best practices.",
              },
              {
                icon: Palette,
                title: "Beautiful Design",
                description:
                  "Create visually stunning interfaces with modern design principles.",
              },
              {
                icon: Sparkles,
                title: "Instant Results",
                description:
                  "See your website come to life in real-time as you describe it.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="shadow-xl border-none">
                <CardContent className="p-6">
                  <feature.icon className="w-10 h-10 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
