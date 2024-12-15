import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";

export default function Preview({
  webcontainer,
}: {
  webcontainer: WebContainer | null;
}) {
  const [serverUrl, setServerUrl] = useState<string | null>(null);

  async function main() {
    if (!webcontainer) return;

    try {
      console.log("Starting installation...");
      const installProcess = await webcontainer.spawn("npm", ["install"]);

      const installOutput = new WritableStream({
        write(data) {
          console.log("Install output:", data);
        },
      });

      installProcess.output.pipeTo(installOutput);
      await installProcess.exit;

      console.log("Starting development server...");
      const startProcess = await webcontainer.spawn("npm", ["start"]);

      startProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log("Server output:", data);
          },
        })
      );

      // Listen for server ready event
      webcontainer.on("server-ready", (port, url) => {
        console.log("Server is ready on:", url);
        setServerUrl(url);
      });
    } catch (error) {
      console.error("Error in preview:", error);
    }
  }

  useEffect(() => {
    main();
  }, [webcontainer]);

  return (
    <div className="h-full w-full">
      {serverUrl ? (
        <iframe
          src={serverUrl}
          className="w-full h-full border-0"
          title="Preview"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Loading preview...</p>
        </div>
      )}
    </div>
  );
}
