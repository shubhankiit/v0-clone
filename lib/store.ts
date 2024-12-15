import { create } from "zustand";

export type FileNode = {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export type StepFile = {
  step: string;
  fileName: string;
  status: "pending" | "completed";
};

const INITIAL_STEPS: StepFile[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "index.tsx",
        type: "file",
        content:
          "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root')!);\nroot.render(<React.StrictMode><App /></React.StrictMode>);",
      },
      {
        name: "App.tsx",
        type: "file",
        content:
          "import React from 'react';\nimport Header from './components/Header';\nimport Footer from './components/Footer';\nimport AboutMe from './components/AboutMe';\nimport Skills from './components/Skills';\nimport ContactForm from './components/ContactForm';\nimport ProjectShowcase from './components/ProjectShowcase';\nimport DarkModeToggle from './components/DarkModeToggle';\n\nconst App: React.FC = () => {\n    return (\n        <div className=\"min-h-screen bg-gray-100 dark:bg-gray-900\">\n            <Header />\n            <main className=\"p-4\">\n                <AboutMe />\n                <Skills />\n                <ContactForm />\n                <ProjectShowcase />\n                <DarkModeToggle />\n            </main>\n            <Footer />\n        </div>\n    );\n};\n\nexport default App;",
      },
      {
        name: "styles",
        type: "folder",
        children: [
          {
            name: "global.css",
            type: "file",
            content:
              "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
          },
        ],
      },
      {
        name: "components",
        type: "folder",
        children: [
          {
            name: "Header.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst Header: React.FC = () => {\n    return <header className=\"bg-blue-500 p-4 text-white text-center\">My Portfolio</header>;\n};\n\nexport default Header;",
          },
          {
            name: "Footer.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst Footer: React.FC = () => {\n    return <footer className=\"bg-gray-800 p-4 text-white text-center\">&copy; 2023 My Portfolio</footer>;\n};\n\nexport default Footer;",
          },
          {
            name: "AboutMe.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst AboutMe: React.FC = () => {\n    return <section className=\"my-4 p-4 bg-white shadow rounded\">About Me Content</section>;\n};\n\nexport default AboutMe;",
          },
          {
            name: "Skills.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst Skills: React.FC = () => {\n    return <section className=\"my-4 p-4 bg-white shadow rounded\">Skills Content</section>;\n};\n\nexport default Skills;",
          },
          {
            name: "ContactForm.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst ContactForm: React.FC = () => {\n    return <form className=\"my-4 p-4 bg-white shadow rounded\">Contact Form</form>;\n};\n\nexport default ContactForm;",
          },
          {
            name: "ProjectShowcase.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst ProjectShowcase: React.FC = () => {\n    return <section className=\"my-4 p-4 bg-white shadow rounded\">Project Showcase Content</section>;\n};\n\nexport default ProjectShowcase;",
          },
          {
            name: "ProjectFilter.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst ProjectFilter: React.FC = () => {\n    return <div className=\"my-4\">Project Filter Component</div>;\n};\n\nexport default ProjectFilter;",
          },
          {
            name: "DarkModeToggle.tsx",
            type: "file",
            content:
              "import React, { useState } from 'react';\n\nconst DarkModeToggle: React.FC = () => {\n    const [darkMode, setDarkMode] = useState(false);\n    return <button onClick={() => setDarkMode(!darkMode)} className=\"my-4\">Toggle Dark Mode</button>;\n};\n\nexport default DarkModeToggle;",
          },
        ],
      },
      {
        name: "__tests__",
        type: "folder",
        children: [
          {
            name: "App.test.tsx",
            type: "file",
            content:
              "import { render, screen } from '@testing-library/react';\nimport App from '../App';\n\ntest('renders header', () => {\n    render(<App />);\n    const linkElement = screen.getByText(/My Portfolio/i);\n    expect(linkElement).toBeInTheDocument();\n});",
          },
          {
            name: "AboutMe.test.tsx",
            type: "file",
            content:
              "import { render, screen } from '@testing-library/react';\nimport AboutMe from '../components/AboutMe';\n\ntest('renders About Me section', () => {\n    render(<AboutMe />);\n    const sectionElement = screen.getByText(/About Me Content/i);\n    expect(sectionElement).toBeInTheDocument();\n});",
          },
          {
            name: "Skills.test.tsx",
            type: "file",
            content:
              "import { render, screen } from '@testing-library/react';\nimport Skills from '../components/Skills';\n\ntest('renders Skills section', () => {\n    render(<Skills />);\n    const sectionElement = screen.getByText(/Skills Content/i);\n    expect(sectionElement).toBeInTheDocument();\n});",
          },
          {
            name: "ContactForm.test.tsx",
            type: "file",
            content:
              "import { render, screen } from '@testing-library/react';\nimport ContactForm from '../components/ContactForm';\n\ntest('renders Contact Form', () => {\n    render(<ContactForm />);\n    const formElement = screen.getByText(/Contact Form/i);\n    expect(formElement).toBeInTheDocument();\n});",
          },
          {
            name: "ProjectShowcase.test.tsx",
            type: "file",
            content:
              "import { render, screen } from '@testing-library/react';\nimport ProjectShowcase from '../components/ProjectShowcase';\n\ntest('renders Project Showcase section', () => {\n    render(<ProjectShowcase />);\n    const sectionElement = screen.getByText(/Project Showcase Content/i);\n    expect(sectionElement).toBeInTheDocument();\n});",
          },
          {
            name: "DarkModeToggle.test.tsx",
            type: "file",
            content:
              "import { render, screen } from '@testing-library/react';\nimport DarkModeToggle from '../components/DarkModeToggle';\n\ntest('renders Dark Mode Toggle', () => {\n    render(<DarkModeToggle />);\n    const buttonElement = screen.getByText(/Toggle Dark Mode/i);\n    expect(buttonElement).toBeInTheDocument();\n});",
          },
        ],
      },
    ],
  },
  {
    name: "tailwind.config.js",
    type: "file",
    content:
      "module.exports = {\n  content: ['./src/**/*.{js,jsx,ts,tsx}'],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};",
  },
  {
    name: "postcss.config.js",
    type: "file",
    content:
      "module.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};",
  },
  {
    name: "tsconfig.json",
    type: "file",
    content:
      '{\n  "compilerOptions": {\n    "target": "es5",\n    "lib": ["dom", "dom.iterable", "esnext"],\n    "allowJs": true,\n    "skipLibCheck": true,\n    "strict": true,\n    "forceConsistentCasingInFileNames": true,\n    "noEmit": true,\n    "esModuleInterop": true,\n    "module": "esnext",\n    "moduleResolution": "node",\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "jsx": "react-jsx"\n  },\n  "include": ["src"]\n}',
  },
  {
    name: "package.json",
    type: "file",
    content:
      '{\n  "name": "my-portfolio",\n  "version": "1.0.0",\n  "private": true,\n  "dependencies": {\n    "react": "^17.0.2",\n    "react-dom": "^17.0.2",\n    "tailwindcss": "^2.2.19",\n    "autoprefixer": "^10.4.2",\n    "postcss": "^8.4.5",\n    "@types/react": "^17.0.2",\n    "@types/react-dom": "^17.0.2",\n    "@testing-library/react": "^12.1.5"\n  },\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build",\n    "test": "react-scripts test",\n    "eject": "react-scripts eject"\n  },\n  "eslintConfig": {\n    "extends": [\n      "react-app",\n      "react-app/jest"\n    ]\n  },\n  "browserslist": {\n    "production": [\n      ">0.2%",\n      "not dead",\n      "not op_mini all"\n    ],\n    "development": [\n      "last 1 chrome version",\n      "last 1 firefox version",\n      "last 1 safari version"\n    ]\n  }\n}',
  },
];

type FileStructure = {
  name: string;
  type: "file" | "folder";
  children?: FileStructure[];
  content?: string;
};

const createInitialFileStructure = (): FileStructure[] => [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "index.tsx",
        type: "file",
        content:
          "import React from 'react';\nimport ReactDOM from 'react-dom';\nimport App from './App';\nimport './styles/global.css';\n\nReactDOM.render(<App />, document.getElementById('root'));",
      },
      {
        name: "App.tsx",
        type: "file",
        content:
          "import React from 'react';\nimport Header from './components/Header';\nimport Footer from './components/Footer';\nimport AboutMe from './components/AboutMe';\nimport Skills from './components/Skills';\nimport ContactForm from './components/ContactForm';\nimport ProjectShowcase from './components/ProjectShowcase';\nimport DarkModeToggle from './components/DarkModeToggle';\n\nconst App: React.FC = () => {\n    return (\n        <div className=\"min-h-screen flex flex-col\">\n            <Header />\n            <main className=\"flex-grow\">\n                <AboutMe />\n                <Skills />\n                <ProjectShowcase />\n                <ContactForm />\n            </main>\n            <Footer />\n            <DarkModeToggle />\n        </div>\n    );\n};\n\nexport default App;",
      },
      {
        name: "styles",
        type: "folder",
        children: [
          {
            name: "global.css",
            type: "file",
            content:
              "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
          },
        ],
      },
      {
        name: "components",
        type: "folder",
        children: [
          {
            name: "Header.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst Header: React.FC = () => {\n    return <header className=\"bg-blue-500 text-white p-4 text-center\">My Portfolio</header>;\n};\n\nexport default Header;",
          },
          {
            name: "Footer.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst Footer: React.FC = () => {\n    return <footer className=\"bg-gray-800 text-white p-4 text-center\">&copy; 2023 My Portfolio</footer>;\n};\n\nexport default Footer;",
          },
          {
            name: "AboutMe.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst AboutMe: React.FC = () => {\n    return <section className=\"p-4\">About Me Content</section>;\n};\n\nexport default AboutMe;",
          },
          {
            name: "Skills.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst Skills: React.FC = () => {\n    return <section className=\"p-4\">Skills Content</section>;\n};\n\nexport default Skills;",
          },
          {
            name: "ContactForm.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst ContactForm: React.FC = () => {\n    return <section className=\"p-4\">Contact Form Content</section>;\n};\n\nexport default ContactForm;",
          },
          {
            name: "ProjectShowcase.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst ProjectShowcase: React.FC = () => {\n    return <section className=\"p-4\">Project Showcase Content</section>;\n};\n\nexport default ProjectShowcase;",
          },
          {
            name: "ProjectFilter.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst ProjectFilter: React.FC = () => {\n    return <div>Project Filter Component</div>;\n};\n\nexport default ProjectFilter;",
          },
          {
            name: "DarkModeToggle.tsx",
            type: "file",
            content:
              "import React from 'react';\n\nconst DarkModeToggle: React.FC = () => {\n    return <button className=\"p-2\">Toggle Dark Mode</button>;\n};\n\nexport default DarkModeToggle;",
          },
        ],
      },
      {
        name: "__tests__",
        type: "folder",
        children: [
          {
            name: "App.test.tsx",
            type: "file",
            content:
              "import React from 'react';\nimport { render } from '@testing-library/react';\nimport App from '../App';\n\ntest('renders App component', () => {\n    render(<App />);\n});",
          },
          {
            name: "AboutMe.test.tsx",
            type: "file",
            content:
              "import React from 'react';\nimport { render } from '@testing-library/react';\nimport AboutMe from '../components/AboutMe';\n\ntest('renders AboutMe component', () => {\n    render(<AboutMe />);\n});",
          },
          {
            name: "Skills.test.tsx",
            type: "file",
            content:
              "import React from 'react';\nimport { render } from '@testing-library/react';\nimport Skills from '../components/Skills';\n\ntest('renders Skills component', () => {\n    render(<Skills />);\n});",
          },
          {
            name: "ContactForm.test.tsx",
            type: "file",
            content:
              "import React from 'react';\nimport { render } from '@testing-library/react';\nimport ContactForm from '../components/ContactForm';\n\ntest('renders ContactForm component', () => {\n    render(<ContactForm />);\n});",
          },
          {
            name: "ProjectShowcase.test.tsx",
            type: "file",
            content:
              "import React from 'react';\nimport { render } from '@testing-library/react';\nimport ProjectShowcase from '../components/ProjectShowcase';\n\ntest('renders ProjectShowcase component', () => {\n    render(<ProjectShowcase />);\n});",
          },
          {
            name: "DarkModeToggle.test.tsx",
            type: "file",
            content:
              "import React from 'react';\nimport { render } from '@testing-library/react';\nimport DarkModeToggle from '../components/DarkModeToggle';\n\ntest('renders DarkModeToggle component', () => {\n    render(<DarkModeToggle />);\n});",
          },
        ],
      },
    ],
  },
  {
    name: "tailwind.config.js",
    type: "file",
    content:
      "module.exports = {\n    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],\n    darkMode: false, // or 'media' or 'class'\n    theme: {\n        extend: {},\n    },\n    variants: {\n        extend: {},\n    },\n    plugins: [],\n};",
  },
  {
    name: "postcss.config.js",
    type: "file",
    content:
      "module.exports = {\n    plugins: {\n        tailwindcss: {},\n        autoprefixer: {},\n    },\n};",
  },
  {
    name: "tsconfig.json",
    type: "file",
    content:
      '{\n    "compilerOptions": {\n        "target": "es5",\n        "lib": ["dom", "dom.iterable", "esnext"],\n        "allowJs": true,\n        "skipLibCheck": true,\n        "strict": true,\n        "forceConsistentCasingInFileNames": true,\n        "noEmit": true,\n        "esModuleInterop": true,\n        "module": "esnext",\n        "moduleResolution": "node",\n        "resolveJsonModule": true,\n        "isolatedModules": true,\n        "jsx": "react-jsx"\n    },\n    "include": ["src"]\n}',
  },
  {
    name: "package.json",
    type: "file",
    content:
      '{\n    "name": "my-portfolio",\n    "version": "1.0.0",\n    "private": true,\n    "dependencies": {\n        "react": "^17.0.2",\n        "react-dom": "^17.0.2",\n        "tailwindcss": "^2.2.19",\n        "autoprefixer": "^10.4.2",\n        "postcss": "^8.4.5",\n        "typescript": "^4.4.4",\n        "@testing-library/react": "^12.1.5"\n    },\n    "scripts": {\n        "build": "tsc && postcss src/styles/global.css -o src/styles/output.css",\n        "start": "webpack serve --mode development",\n        "test": "react-scripts test"\n    }\n}',
  },
];

type State = {
  files: FileNode[];
  selectedFile: { name: string; content: string } | null;
  activeTab: "code" | "preview";
  isGenerating: boolean;
  messages: Message[];
  currentStep: number;
  currentStepName: string;
  steps: StepFile[];
  error: string | null;
  setFiles: (files: FileNode[]) => void;
  setSelectedFile: (file: { name: string; content: string } | null) => void;
  updateFileContent: (name: string, content: string) => void;
  setActiveTab: (tab: "code" | "preview") => void;
  setIsGenerating: (isGenerating: boolean) => void;
  addMessage: (message: Message) => void;
  setCurrentStep: (step: number) => void;
  setCurrentStepName: (step: string) => void;
  initializeFiles: () => void;
  setError: (error: string | null) => void;
  setSteps: (steps: StepFile[]) => void;
  clearError: () => void;
};

export const useStore = create<State>((set) => ({
  files: [
    {
      name: "src",
      type: "folder",
      children: [
        {
          name: "index.tsx",
          type: "file",
          content:
            "import React from 'react';\nimport ReactDOM from 'react-dom';\nimport App from './App';\nimport './styles/global.css';\n\nReactDOM.render(<App />, document.getElementById('root'));",
        },
        {
          name: "App.tsx",
          type: "file",
          content:
            "import React from 'react';\nimport { BrowserRouter as Router, Route, Switch } from 'react-router-dom';\nimport Home from './pages/Home';\nimport AboutMe from './components/AboutMe';\nimport ContactForm from './components/ContactForm';\nimport ProjectGrid from './components/ProjectGrid';\nimport DarkModeToggle from './components/DarkModeToggle';\n\nconst App: React.FC = () => {\n return (\n <Router>\n <div className=\"min-h-screen bg-gray-100 dark:bg-gray-900 transition duration-500\">\n <DarkModeToggle />\n <Switch>\n <Route path=\"/\" exact component={Home} />\n <Route path=\"/about\" component={AboutMe} />\n <Route path=\"/contact\" component={ContactForm} />\n <Route path=\"/projects\" component={ProjectGrid} />\n </Switch>\n </div>\n </Router>\n );\n};\n\nexport default App;",
        },
        {
          name: "pages",
          type: "folder",
          children: [
            {
              name: "Home.tsx",
              type: "file",
              content:
                "import React from 'react';\n\nconst Home: React.FC = () => {\n return <h1 className=\"text-4xl font-bold text-center\">Welcome to My Portfolio</h1>;\n};\n\nexport default Home;",
            },
          ],
        },
        {
          name: "components",
          type: "folder",
          children: [
            {
              name: "ProjectGrid.tsx",
              type: "file",
              content:
                "import React from 'react';\n\nconst ProjectGrid: React.FC = () => {\n return <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">{/* Project cards go here */}</div>;\n};\n\nexport default ProjectGrid;",
            },
            {
              name: "AboutMe.tsx",
              type: "file",
              content:
                'import React from \'react\';\n\nconst AboutMe: React.FC = () => {\n return <section className="p-4"><h2 className="text-2xl">About Me</h2><p>Information about myself.</p></section>;\n};\n\nexport default AboutMe;',
            },
            {
              name: "Skills.tsx",
              type: "file",
              content:
                'import React from \'react\';\n\nconst Skills: React.FC = () => {\n return <section className="p-4"><h2 className="text-2xl">Skills</h2><p>My skills and expertise.</p></section>;\n};\n\nexport default Skills;',
            },
            {
              name: "ContactForm.tsx",
              type: "file",
              content:
                'import React from \'react\';\n\nconst ContactForm: React.FC = () => {\n return <form className="p-4"><h2 className="text-2xl">Contact Me</h2>{/* Form fields go here */}</form>;\n};\n\nexport default ContactForm;',
            },
            {
              name: "DarkModeToggle.tsx",
              type: "file",
              content:
                "import React, { useState } from 'react';\n\nconst DarkModeToggle: React.FC = () => {\n const [darkMode, setDarkMode] = useState(false);\n const toggleDarkMode = () => setDarkMode(!darkMode);\n\n return <button onClick={toggleDarkMode} className=\"p-2\">Toggle Dark Mode</button>;\n};\n\nexport default DarkModeToggle;",
            },
          ],
        },
        {
          name: "styles",
          type: "folder",
          children: [
            {
              name: "global.css",
              type: "file",
              content:
                "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
            },
            {
              name: "components.css",
              type: "file",
              content: "/* Component specific styles can go here */",
            },
          ],
        },
        {
          name: "utils",
          type: "folder",
          children: [
            {
              name: "smoothScroll.ts",
              type: "file",
              content:
                "export const smoothScroll = (target: string) => {\n const element = document.querySelector(target);\n if (element) {\n element.scrollIntoView({ behavior: 'smooth' });\n }\n};",
            },
          ],
        },
      ],
    },
    {
      name: "tailwind.config.js",
      type: "file",
      content:
        "module.exports = {\n purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],\n darkMode: 'class', // or 'media' or false\n theme: {\n extend: {},\n },\n variants: {\n extend: {},\n },\n plugins: [],\n};",
    },
    {
      name: "package.json",
      type: "file",
      content:
        '{\n  "name": "my-portfolio",\n  "version": "1.0.0",\n  "private": true,\n  "dependencies": {\n    "@types/node": "^20.11.0",\n    "@types/react": "^18.2.47",\n    "@types/react-dom": "^18.2.18",\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "react-router-dom": "^6.21.1",\n    "react-scripts": "5.0.1"\n  },\n  "devDependencies": {\n    "autoprefixer": "^10.4.16",\n    "postcss": "^8.4.33",\n    "tailwindcss": "^3.4.1",\n    "typescript": "^5.3.3",\n    "@typescript-eslint/eslint-plugin": "^6.18.1",\n    "@typescript-eslint/parser": "^6.18.1",\n    "eslint": "^8.56.0",\n    "eslint-plugin-react": "^7.33.2"\n  },\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build",\n    "test": "react-scripts test",\n    "eject": "react-scripts eject"\n  },\n  "browserslist": {\n    "production": [\n      ">0.2%",\n      "not dead",\n      "not op_mini all"\n    ],\n    "development": [\n      "last 1 chrome version",\n      "last 1 firefox version",\n      "last 1 safari version"\n    ]\n  }\n}',
    },
    {
      name: "README.md",
      type: "file",
      content:
        "# My Portfolio\n\nThis is a simple portfolio web application built with React and Tailwind CSS.",
    },
  ],
  selectedFile: null,
  activeTab: "code",
  isGenerating: false,
  messages: [],
  currentStep: 0,
  currentStepName: "",
  steps: [
    {
      step: "Set up a new React project",
      fileName: "package.json",
      status: "pending",
    },
    {
      step: "Install Tailwind CSS and other dependencies",
      fileName: "package.json",
      status: "pending",
    },
    {
      step: "Create the main application entry point",
      fileName: "src/index.js",
      status: "pending",
    },
    {
      step: "Create the main App component",
      fileName: "src/App.js",
      status: "pending",
    },
    {
      step: "Create a main page for the portfolio",
      fileName: "src/pages/Home.js",
      status: "pending",
    },
    {
      step: "Create a project showcase grid component",
      fileName: "src/components/ProjectGrid.js",
      status: "pending",
    },
    {
      step: "Create an about me section component",
      fileName: "src/components/AboutMe.js",
      status: "pending",
    },
    {
      step: "Create a skills section component",
      fileName: "src/components/Skills.js",
      status: "pending",
    },
    {
      step: "Create a contact form component",
      fileName: "src/components/ContactForm.js",
      status: "pending",
    },
    {
      step: "Create a dark mode toggle component",
      fileName: "src/components/DarkModeToggle.js",
      status: "pending",
    },
    {
      step: "Implement smooth scrolling functionality",
      fileName: "src/utils/smoothScroll.ts",
      status: "pending",
    },
    {
      step: "Create a CSS file for global styles",
      fileName: "src/styles/global.css",
      status: "pending",
    },
    {
      step: "Create a CSS file for component styles",
      fileName: "src/styles/components.css",
      status: "pending",
    },
    {
      step: "Set up routing for the application",
      fileName: "src/App.js",
      status: "pending",
    },
    {
      step: "Add Tailwind CSS configuration",
      fileName: "tailwind.config.js",
      status: "pending",
    },
    {
      step: "Create a README file for project documentation",
      fileName: "README.md",
      status: "pending",
    },
  ],
  error: null,
  setFiles: (files) => set({ files }),
  initializeFiles: () =>
    set((state) => ({
      files: createInitialFileStructure(state.steps),
      currentStepName: state.steps[0].step,
      currentStep: 0,
    })),
  setSelectedFile: (file) => set({ selectedFile: file }),
  updateFileContent: (name, content) =>
    set((state) => ({
      files: updateFileContentInTree(state.files, name, content),
      selectedFile:
        state.selectedFile && state.selectedFile.name === name
          ? { ...state.selectedFile, content }
          : state.selectedFile,
    })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setCurrentStep: (step) => set({ currentStep: step }),
  setSteps: (steps) => set({ steps }),
  setCurrentStepName: (stepName) => set({ currentStepName: stepName }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

function updateFileContentInTree(
  files: FileNode[],
  name: string,
  content: string
): FileNode[] {
  return files.map((file) => {
    if (file.type === "file" && file.name === name) {
      return { ...file, content };
    }
    if (file.type === "folder" && file.children) {
      return {
        ...file,
        children: updateFileContentInTree(file.children, name, content),
      };
    }
    return file;
  });
}
