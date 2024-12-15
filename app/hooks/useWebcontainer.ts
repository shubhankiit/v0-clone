import { useEffect, useState, useRef } from "react";
import { WebContainer } from "@webcontainer/api";

export function useWebContainer() {
  const [webcontainer, setWebcontainer] = useState<WebContainer>();
  const initializingRef = useRef(false);

  useEffect(() => {
    async function main() {
      // Prevent multiple initialization attempts
      if (initializingRef.current) return;
      if (webcontainer) return;

      initializingRef.current = true;

      try {
        const webcontainerInstance = await WebContainer.boot();
        setWebcontainer(webcontainerInstance);
        console.log(
          "webcontainerInstance.workdir",
          webcontainerInstance.workdir
        );
      } finally {
        initializingRef.current = false;
      }
    }

    main();

    return () => {
      if (webcontainer) {
        webcontainer.teardown();
      }
    };
  }, [webcontainer]); // Include webcontainer in dependencies

  return webcontainer;
}
