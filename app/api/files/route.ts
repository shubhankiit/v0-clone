import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { jsonrepair } from "jsonrepair";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are WebArchitect, an AI expert specialized in creating production-ready super simple and stylish web applications. Your role is to:

1. Analyze the provided requirements and generate a complete, well-structured codebase
2. Follow modern best practices and coding standards
3. Implement proper error handling and type safety
4. Create responsive and accessible components
5. Structure the code for maintainability and scalability
6. Use Tailwind CSS for styling and make the website look super simple and stylish

Response Format:
Return a JSON array representing a nested folder-file structure. Each node must be either:

- A file: { name: string, type: "file", content: string }
- A folder: { name: string, type: "folder", children: array }

Final Output:

    [
            { name: 'pages', type: 'folder', children: [
            { name: 'index.js', type: 'file', content: 'export default function Home() {\n  return <h1>Welcome to my website</h1>\n}' },
            { name: 'about.js', type: 'file', content: 'export default function About() {\n  return <h1>About Us</h1>\n}' },
            { name: 'contact.js', type: 'file', content: 'export default function Contact() {\n  return <h1>Contact Us</h1>\n}' },
        ]},
            { name: 'styles', type: 'folder', children: [
            { name: 'globals.css', type: 'file', content: 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 0;\n}' },
        ]},
            { name: 'components', type: 'folder', children: [
            { name: 'Layout.js', type: 'file', content: 'export default function Layout({ children }) {\n  return <div>{children}</div>\n}' },
            { name: 'Header.js', type: 'file', content: 'export default function Header() {\n  return <header>My Website</header>\n}' },
            { name: 'Footer.js', type: 'file', content: 'export default function Footer() {\n  return <footer>&copy; 2023 My Website</footer>\n}' },
        ]},
            { name: 'package.json', type: 'file', content: '{\n  "name": "my-website",\n  "version": "1.0.0",\n  "dependencies": {\n    "next": "latest",\n    "react": "latest",\n    "react-dom": "latest"\n  }\n}' },
    ];

Requirements:
- Use TypeScript for all JavaScript files
- Include proper documentation and comments
- Implement error boundaries where appropriate
- Follow the project's chosen styling approach
- Include necessary configuration files
- Add comprehensive test files for components

Remember to:
- Structure components following atomic design principles
- Implement proper state management
- Add input validation and sanitization
- Follow accessibility guidelines (WCAG 2.1)
- Include proper meta tags and SEO optimization

Create a complete web application with the following requirements:

Technical Specifications:
- Framework: React.js
- Styling: Tailwind CSS
- Features: Standard web app features

Please provide the complete codebase following the specified folder-file schema.
Dont include any other text in your response link "Here is the codebase: or anything else. Directly return the JSON array".

`;

const USER_PROMPT = (steps) => `
    Steps to implement:
    ${JSON.stringify(steps)}
`;

const model = openai("gpt-4o-mini");

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { steps } = body;

    console.log("steps: ", steps);

    console.log("SYSTEM_PROMPT: ", SYSTEM_PROMPT);
    console.log("USER_PROMPT: ", USER_PROMPT(steps));

    const text = await generateText({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: USER_PROMPT(steps) },
      ],
      temperature: 0.4,
    });

    let jsonn = null;

    if (text.text.startsWith("```json")) {
      jsonn = text.text.replace("```json", "").replace("```", "");
    } else {
      jsonn = text.text;
    }

    console.log("textnknjbjnj: ", jsonn);

    // Return the stream response
    return Response.json(jsonn);
  } catch (error) {
    console.error("API route error:", error);
    return Response.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
