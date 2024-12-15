import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileNode, StepFile, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export function Steps() {
  const { files = [], selectedFile, steps, setSteps } = useStore();

  console.log("steps", steps);
  console.log("files", files);

  const newSteps = JSON.parse(JSON.stringify(steps));

  const findFile = (nodes: FileNode[], targetPath: string): boolean => {
    const pathParts = targetPath.split("/");
    const targetFileName = pathParts[pathParts.length - 1];

    // Convert .js/.jsx/.ts to .tsx for matching
    const normalizedTargetName = targetFileName.replace(
      /\.(js|jsx|ts)$/,
      ".tsx"
    );

    for (const node of nodes) {
      if (
        node.type === "file" &&
        (node.name === targetFileName || node.name === normalizedTargetName)
      ) {
        return true;
      }
      if (node.type === "folder" && node.children) {
        if (findFile(node.children, targetPath)) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    // Early return if no files or steps
    if (!files.length || !steps.length) return;

    const updatedSteps = steps.map((step: StepFile) => {
      if (!step.fileName) return step;

      const fileExists = findFile(files, step.fileName);
      return fileExists ? { ...step, status: "completed" } : step;
    });

    const stepsHaveChanged =
      JSON.stringify(steps) !== JSON.stringify(updatedSteps);
    if (stepsHaveChanged) {
      setSteps(updatedSteps as StepFile[]);
    }
  }, [files, steps]); // Include both files and steps in dependencies

  const getStatusColor = (status: StepFile["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white ring-2 ring-green-500/20 shadow-sm";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">
          Steps to Create Your Website
        </CardTitle>
      </CardHeader>
      <ScrollArea className="max-h-[43vh] overflow-scroll">
        <CardContent>
          <ol className="space-y-4">
            {newSteps.map((step: StepFile, index: number) => {
              const isSelected = selectedFile?.name === step.fileName;

              return (
                <li
                  key={`${step.fileName}-${index}`}
                  className={cn(
                    "flex items-start space-x-3 p-2 rounded-lg",
                    isSelected && "bg-primary/10",
                    step.status === "completed" &&
                      "bg-green-500/5 ring-1 ring-green-500/20"
                  )}
                >
                  <Badge
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0",
                      getStatusColor(step.status)
                    )}
                  >
                    {index + 1}
                  </Badge>
                  <span className="text-foreground">{step.step}</span>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
