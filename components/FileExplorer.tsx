"use client";

import { useEffect, useState } from "react";
import { useStore, FileNode } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Folder, File, ChevronRight, ChevronDown } from "lucide-react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useWebContainer, useWebcontainer } from "@/app/hooks/useWebcontainer";
import { FileSystemTree, WebContainer } from "@webcontainer/api";
import Preview from "@/app/preview/page";

// File type definitions and extensions
const FILE_TYPES = {
  typescript: [".ts", ".tsx"],
  javascript: [".js", ".jsx"],
  css: [".css", ".scss", ".less"],
  html: [".html", ".htm"],
  json: [".json"],
  markdown: [".md", ".markdown"],
  yaml: [".yml", ".yaml"],
  python: [".py"],
  java: [".java"],
  rust: [".rs"],
  go: [".go"],
} as const;

// Get file language from extension
function getFileLanguage(fileName: string): string {
  const extension = "." + fileName.split(".").pop()?.toLowerCase();

  for (const [language, extensions] of Object.entries(FILE_TYPES)) {
    if (extensions.includes(extension as any)) {
      return language;
    }
  }

  return "plaintext";
}

// Editor configuration for different file types
const getEditorConfig = (
  language: string
): editor.IStandaloneEditorConstructionOptions => {
  const baseConfig = {
    minimap: { enabled: false },
    fontSize: 14,
    formatOnPaste: true,
    formatOnType: true,
    tabSize: 2,
    readOnly: true,
    autoIndent: "full",
    wordWrap: "on",
    lineNumbers: "on",
    folding: true,
    foldingStrategy: "indentation",
    scrollBeyondLastLine: false,
    renderWhitespace: "selection",
    suggest: {
      showWords: true,
      showSnippets: true,
      showUsers: true,
      error: false,
    },
  };
  const languageSpecificConfig: Partial<editor.IStandaloneEditorConstructionOptions> =
    {
      typescript: {
        formatOnPaste: true,
        formatOnType: true,
      },
      javascript: {
        formatOnPaste: true,
        formatOnType: true,
      },
      json: {
        formatOnPaste: true,
        formatOnType: true,
      },
      css: {
        formatOnPaste: true,
        formatOnType: true,
      },
      html: {
        formatOnPaste: true,
        formatOnType: true,
      },
    }[language] || {};

  // Cast to IStandaloneEditorConstructionOptions to ensure type safety
  return {
    ...baseConfig,
    ...languageSpecificConfig,
  } as editor.IStandaloneEditorConstructionOptions;
};

function FileTreeNode({
  node,
  onSelectFile,
  level = 0,
}: {
  node: FileNode;
  onSelectFile: (name: string, content: string) => void;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(node.type === "folder");

  const toggleOpen = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen);
    } else if (node.type === "file" && node.content) {
      onSelectFile(node.name, node.content);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center cursor-pointer hover:bg-secondary/50 p-1 rounded ${
          node.type === "folder" ? "font-semibold" : ""
        }`}
        style={{ paddingLeft: `${(level + 1) * 16}px` }}
        onClick={toggleOpen}
      >
        {node.type === "folder" &&
          (isOpen ? (
            <ChevronDown size={16} className="text-primary" />
          ) : (
            <ChevronRight size={16} className="text-primary" />
          ))}
        {node.type === "folder" ? (
          <Folder size={16} className="mr-2 text-yellow-500" />
        ) : (
          <File size={16} className="mr-2 text-blue-400" />
        )}
        <span className="text-sm">{node.name}</span>
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeNode
              key={index}
              node={child}
              onSelectFile={onSelectFile}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer() {
  const {
    files,
    selectedFile,
    activeTab,
    isGenerating,
    setSelectedFile,
    updateFileContent,
    setActiveTab,
    steps,
  } = useStore();

  const [editorInstance, setEditorInstance] =
    useState<editor.IStandaloneCodeEditor | null>(null);

  const webcontainer = useWebContainer();

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    setEditorInstance(editor);

    // Add keyboard shortcut for format document
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      formatDocument();
    });
  };

  function convertToWebContainerFormat(inputStructure: FileNode[]) {
    const result: FileSystemTree = {};

    function processNode(node: FileNode) {
      if (node.type === "file") {
        return {
          file: {
            contents: node.content || "",
          },
        };
      }

      if (node.type === "folder") {
        const dirContent = {};
        node.children?.forEach((child) => {
          dirContent[child.name] = processNode(child);
        });

        return {
          directory: dirContent,
        };
      }
    }

    // Handle array of nodes or single node
    if (Array.isArray(inputStructure)) {
      inputStructure.forEach((item) => {
        result[item.name] = processNode(item);
      });
    } else {
      result[inputStructure.name] = processNode(inputStructure);
    }

    return result;
  }

  useEffect(() => {
    async function startWebContainer() {
      if (!webcontainer || !files) return;

      try {
        console.log("Mounting files to webcontainer...");
        const tree = convertToWebContainerFormat(files);
        await webcontainer.mount(tree);
        console.log("Files mounted successfully");
      } catch (error) {
        console.error("WebContainer mount error:", error);
      }
    }

    startWebContainer();

    return () => {
      if (webcontainer) {
        webcontainer.teardown();
      }
    };
  }, [webcontainer, files]);

  const formatDocument = async () => {
    if (editorInstance && selectedFile) {
      const language = getFileLanguage(selectedFile.name);

      try {
        await editorInstance.getAction("editor.action.formatDocument")?.run();
        console.log(`Formatted ${selectedFile.name} as ${language}`);
      } catch (error) {
        console.error("Error formatting document:", error);
      }
    }
  };

  const handleSelectFile = (name: string, content: string) => {
    setSelectedFile({ name, content });
    if (activeTab === "preview") {
      setActiveTab("code");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "code" | "preview");
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">
          File Explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex h-[89vh]">
          <ScrollArea className="w-1/3 border-r border-border p-2">
            {files.map((file, index) => (
              <FileTreeNode
                key={index}
                node={file}
                onSelectFile={handleSelectFile}
              />
            ))}
          </ScrollArea>
          <div className="w-2/3 h-full overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full h-full"
            >
              <TabsList className="w-full justify-start">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="preview" disabled={isGenerating}>
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="code" className="h-[calc(100%-40px)]">
                {selectedFile ? (
                  <Editor
                    height="100%"
                    language={getFileLanguage(selectedFile.name)}
                    theme="vs-dark"
                    value={selectedFile.content}
                    onChange={(value) => {
                      if (value) {
                        updateFileContent(selectedFile.name, value);
                      }
                    }}
                    onMount={handleEditorDidMount}
                    options={getEditorConfig(
                      getFileLanguage(selectedFile.name)
                    )}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a file to view its content
                  </div>
                )}
              </TabsContent>
              <TabsContent value="preview" className="h-[calc(100%-40px)]">
                <Preview webcontainer={webcontainer!} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
