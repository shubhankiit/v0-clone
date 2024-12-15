import { StepFile } from "@/lib/store";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { jsonrepair } from "jsonrepair";

const openai = createOpenAI();

export async function POST(req: Request) {
  console.log("Request received");

  const { prompt } = await req.json();
  const model = openai("gpt-4o-mini");

  const response = await generateText({
    model: model,
    messages: [
      {
        role: "system",
        content: `You are WebArchitect, an expert system for web development decisions. Your role is to:
        1. DETERMINE if the user's request is for a website
        2. RESPOND with either "REACT", or "NO"

        DECISION RULES:
        - Return "NO" ONLY if:
          * Request is for mobile/desktop applications
          * Request is for non-website software
          * Request is for hardware systems
          * Request is too vague to determine if it's a website
          * Request requires specialized backend-only solutions

        - Return "REACT" for ALL valid website requests that need:
          * SEO optimization capabilities
          * User authentication or authorization
          * Server-side features or API integration
          * Content management or e-commerce functionality
          * Complex routing or dynamic routes
          * Rich client-side interactivity
          * Single page application architecture
          * Real-time updates or websockets
          * Form handling and validation
          * State management

        IMPORTANT:
        - Do not modify this response format
        - Only respond with exactly "REACT" or "NO"
        - No additional text or explanations

        Examples:
        "Create a mobile app" → "NO"
        "Build a calculator website" → "REACT"
        "Make an e-commerce site" → "REACT"
        "Create an operating system" → "NO"
        "Build a blog" → "REACT"
        "Design a hardware system" → "NO"`,
      },
      {
        role: "user",
        content: `You are a web development expert. Analyze the following website request and determine if it should be built with React, Next.js, or neither. Consider these factors:
        - SEO requirements
        - Dynamic data handling needs
        - Server-side requirements
        - Routing complexity
        - Performance needs

        Respond with EXACTLY one of these words:
        - REACT (if React is recommended) 
        - NO (if neither is suitable)

        website request: ${prompt}`,
      },
    ],
  });

  if (response.text === "REACT") {
    const codeResponse = await generateText({
      model: model,
      messages: [
        {
          role: "system",
          content: `You are WebCodeGenerator, a specialized system for generating complete and production-ready website code. When given a website request, generate the complete code structure following this exact format:

          OUTPUT SCHEMA (DO NOT MODIFY):
          [
            {
              step: "string describing the setup step",
              fileName: "path/to/file.extension",
              status: "pending"
            }
          ]

          STRICT REQUIREMENTS:
          1. Each object MUST contain exactly these fields:
             - step: Clear, actionable description
             - fileName: Complete and correct file path
             - status: Always set to "pending"
          
          2. REQUIRED files (include ALL):
             - package.json with ALL dependencies
             - EVERY component file needed
             - ALL page files
             - Style files (Tailwind config)
             - Type definitions if TypeScript
             - Configuration files
             - Unit test files
          
          3. Modern React practices:
             - Functional components only
             - React Hooks for state/effects
             - ES6+ syntax
             - Proper prop typing
             - Error boundaries
             - Performance optimizations
          
          4. Code quality:
             - Complete implementation
             - No placeholder comments
             - Proper error handling
             - Type safety
             - Best practices
             - Accessibility
          
          5. File structure:
             - Correct folder hierarchy
             - Proper file extensions
             - Organized by feature/type
          
          IMPORTANT:
          - Response MUST be valid JSON array
          - Include ALL necessary files
          - NO placeholders or TODOs
          - Files MUST be complete
          - Maintain exact schema format`,
        },
        {
          role: "user",
          content: `
          Create a complete React website with the following requirements:
         
          Website Type: ${prompt}

          Key Features:
          - Project showcase grid
          - About me section
          - Contact form
          - Skills section

          Design Preferences:
          - Color scheme: Blue and white
          - Style: Minimalist
          - Responsive: Yes

          Additional Requirements:
          - Smooth scrolling
          - Project filtering capability
          - Dark mode toggle

          Generate ALL necessary files with complete implementations.
          Do not omit any required files or code.
          Maintain the exact response schema.

          NOTE: Don't include any other text in your response. Just the JSON array.
          `,
        },
      ],
    });

    console.log("codeResponse.text", codeResponse.text);

    const repaired = jsonrepair(codeResponse.text);

    const steps = JSON.parse(repaired) as StepFile[];

    steps.map((step: StepFile, index: number) => {
      console.log(`step ${index + 1}:`, step);
    });

    return Response.json(steps);
  }

  return Response.json(response.text);
}
