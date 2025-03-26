import dedent from "dedent";

export const CHAT_PROMPT = dedent`
    You are an AI Assistant with expertise in React Development.
    
    GUIDELINES:
    - Clearly inform the user about what they are building.
    - Ensure responses are concise and under 15 lines.
    - Avoid providing code examples or additional commentary.
    - Always respond in Vietnamese, regardless of the language the user is writing in.
`;

export const DEPENDANCY = {
  postcss: "^8",
  tailwindcss: "^3.4.1",
  autoprefixer: "^10.0.0",
  uuid4: "^2.0.3",
  "tailwind-merge": "^2.4.0",
  "tailwindcss-animate": "^1.0.7",
  "lucide-react": "latest",
  "react-router-dom": "latest",
  firebase: "^11.1.0",
  "@google/generative-ai": "^0.21.0",
};

export const DEFAULT_FILE = {
  "/public/index.html": {
    code: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ai Bolt React by hungvq</title>
      <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
      <div id="root"></div>
  </body>
  </html>`,
  },
  "/App.css": {
    code: `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;`,
  },
  "/tailwind.config.js": {
    code: `
  /** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      "./**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }`,
  },
  "/postcss.config.js": {
    code: `
  /** @type {import('postcss-load-config').Config} */
  const config = {
    plugins: {
      tailwindcss: {},
    },
  };
  
  export default config;`,
  },
};

export const CODE_GEN_PROMPT = dedent`
  Generate a Project in React **without using a "src" folder**. Place "App.js" in the root directory. Create multiple components, organizing them

  Return the response in JSON format with the following schema:
  {
    "projectTitle": "",
    "explanation": "",
    "files": {
      "/App.js": {
        "code": ""
      },
      ...
    },
    "generatedFiles": []
  }

  Here's the reformatted and improved version of your prompt:
  Generate a programming code structure for a React project using Vite.
  Return the response in JSON format with the following schema:

  json
  Copy code
  {
    "projectTitle": "",
    "explanation": "",
    "files": {
      "/App.js": {
        "code": ""
      },
      ...
    },
    "generatedFiles": []
  }

  Ensure the files field contains all created files, and the generatedFiles field contains all necessary additional files.
  files": {
  "/App.js": {
    "code": "import React from 'react';\nimport './styles.css';\n\nfunction App() {\n  return (\n    <div className='App'>\n      <h1>Hello Anh Em</h1>\n    </div>\n  );\n}\n\nexport default App;"
    },
  }

  Additionally, include an explanation of the project's structure, purpose, and technologies used. For placeholder images, please use a URL like https://archive.org/download/placeholder_image.
  Add Emoji icons whenever needed to give good user experience.
  The lucide-react library is also available to be imported IF NECESSARY.
`;


