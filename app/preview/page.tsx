import { WebContainer } from "@webcontainer/api";
import { useEffect } from "react";

export default function Preview({
  webcontainer,
}: {
  webcontainer: WebContainer | null;
}) {
  async function main() {
    const installProcess = await webcontainer?.spawn("npm", ["install"]);

    installProcess?.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    await webcontainer?.spawn("npm", ["run", "dev"]);

    // Wait for `server-ready` event
    webcontainer?.on("server-ready", (port, url) => {
      // ...
      console.log(url);
      console.log(port);
    });
  }

  useEffect(() => {
    main();
  }, [webcontainer]);

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">My Website</h1>
        <nav className="mt-4">
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <h2 className="text-2xl font-semibold mb-4">Welcome to my website</h2>
        <p className="mb-4">
          This is a preview of the website you&apos;re creating. In a real
          application, this content would be dynamically generated based on your
          inputs and choices.
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Learn More
        </button>
      </main>
      <footer className="mt-8 text-center text-gray-500">
        <p>&copy; My Website. All rights reserved.</p>
      </footer>
    </div>
  );
}
