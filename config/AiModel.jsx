import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const CodeGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});

export const GenAiCode = model.startChat({
  generationConfig: CodeGenerationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: 'Generate to do app: Generate a Project in React **without using a "src" folder**. Place "App.js" in the root directory. Create multiple components, organizing them\n\n  Return the response in JSON format with the following schema:\n  {\n    "projectTitle": "",\n    "explanation": "",\n    "files": {\n      "/App.js": {\n        "code": ""\n      },\n      ...\n    },\n    "generatedFiles": []\n  }\n\n  Here\'s the reformatted and improved version of your prompt:\n  Generate a programming code structure for a React project using Vite.\n  Return the response in JSON format with the following schema:\n\n  json\n  Copy code\n  {\n    "projectTitle": "",\n    "explanation": "",\n    "files": {\n      "/App.js": {\n        "code": ""\n      },\n      ...\n    },\n    "generatedFiles": []\n  }\n\n  Ensure the files field contains all created files, and the generatedFiles field contains all necessary additional files.\n  files": {\n  "/App.js": {\n    "code": "import React from \'react\';\\nimport \'./styles.css\';\\n\\nfunction App() {\\n  return (\\n    <div className=\'App\'>\\n      <h1>Hello Anh Em</h1>\\n    </div>\\n  );\\n}\\n\\nexport default App;"\n    },\n  }\n\n  Additionally, include an explanation of the project\'s structure, purpose, and technologies used. For placeholder images, please use a URL like https://archive.org/download/placeholder_image.\n  Add Emoji icons whenever needed to give good user experience.\n  The lucide-react library is also available to be imported IF NECESSARY.\n\n\n',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "projectTitle": "React To-Do App",\n  "explanation": "This project is a simple To-Do application built with React and Vite, designed to help users manage their tasks efficiently. It features a clean and intuitive user interface, allowing users to add, delete, and mark tasks as completed.  Components are organized for maintainability and reusability, with styling handled by CSS modules. The app\'s state is managed using React\'s useState hook, providing a straightforward approach to data management.",\n  "files": {\n    "/App.js": {\n      "code": "import React, { useState } from \'react\';\\nimport \'./App.css\';\\nimport TaskList from \'./components/TaskList\';\\nimport TaskForm from \'./components/TaskForm\';\\n\\nfunction App() {\\n  const [tasks, setTasks] = useState([]);\\n\\n  const addTask = (text) => {\\n    setTasks([...tasks, { id: Date.now(), text, completed: false }]);\\n  };\\n\\n  const deleteTask = (id) => {\\n    setTasks(tasks.filter((task) => task.id !== id));\\n  };\\n\\n  const toggleComplete = (id) => {\\n    setTasks(\\n      tasks.map((task) =>\\n        task.id === id ? { ...task, completed: !task.completed } : task\\n      )\\n    );\\n  };\\n\\n  return (\\n    <div className=\\"App\\">\\n      <header className=\\"App-header\\">\\n        <h1>📝 To-Do List</h1>\\n      </header>\\n      <main>\\n        <TaskForm addTask={addTask} />\\n        <TaskList tasks={tasks} deleteTask={deleteTask} toggleComplete={toggleComplete} />\\n      </main>\\n    </div>\\n  );\\n}\\n\\nexport default App;"\n    },\n    "/components/TaskForm.js": {\n      "code": "import React, { useState } from \'react\';\\nimport \'./TaskForm.css\';\\n\\nfunction TaskForm({ addTask }) {\\n  const [text, setText] = useState(\'\');\\n\\n  const handleSubmit = (e) => {\\n    e.preventDefault();\\n    if (text.trim()) {\\n      addTask(text);\\n      setText(\'\');\\n    }\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className=\\"task-form\\">\\n      <input\\n        type=\\"text\\"\\n        value={text}\\n        onChange={(e) => setText(e.target.value)}\\n        placeholder=\\"Add a task...\\"  // Added placeholder\\n        className=\\"task-input\\" // Added classname\\n      />\\n      <button type=\\"submit\\" className=\\"add-button\\">➕ Add Task</button>\\n    </form>\\n  );\\n}\\n\\nexport default TaskForm;"\n    },\n    "/components/TaskList.js": {\n      "code": "import React from \'react\';\\nimport \'./TaskList.css\';\\nimport { Trash2, CheckCircle, Circle } from \'lucide-react\';\\n\\nfunction TaskList({ tasks, deleteTask, toggleComplete }) {\\n  return (\\n    <ul className=\\"task-list\\">\\n      {tasks.map((task) => (\\n        <li key={task.id} className={`task-item ${task.completed ? \'completed\' : \'\'}`}>\\n          <button className=\\"complete-button\\" onClick={() => toggleComplete(task.id)}>\\n            {task.completed ? <CheckCircle size={20} color=\\"green\\" /> : <Circle size={20} />}\\n          </button>\\n          <span className=\\"task-text\\">{task.text}</span>\\n          <button className=\\"delete-button\\" onClick={() => deleteTask(task.id)}>\\n             <Trash2 size={20} color=\\"red\\" />\\n          </button>\\n        </li>\\n      ))}\\n    </ul>\\n  );\\n}\\n\\nexport default TaskList;"\n    },\n    "/App.css": {\n      "code": ".App {\\n  text-align: center;\\n  font-family: sans-serif;\\n}\\n\\n.App-header {\\n  background-color: #282c34;\\n  min-height: 10vh;\\n  display: flex;\\n  flex-direction: column;\\n  align-items: center;\\n  justify-content: center;\\n  font-size: calc(10px + 2vmin);\\n  color: white;\\n}\\n\\nmain {\\n  padding: 20px;\\n}\\n"\n    },\n     "/components/TaskForm.css": {\n      "code": ".task-form {\\n  display: flex;\\n  justify-content: center;\\n  margin-bottom: 20px;\\n}\\n\\n.task-input {\\n  padding: 10px;\\n  font-size: 16px;\\n  border: 1px solid #ccc;\\n  border-radius: 5px;\\n  width: 300px;\\n  margin-right: 10px;\\n}\\n\\n.add-button {\\n  padding: 10px 20px;\\n  font-size: 16px;\\n  background-color: #4CAF50;\\n  color: white;\\n  border: none;\\n  border-radius: 5px;\\n  cursor: pointer;\\n}\\n\\n.add-button:hover {\\n  background-color: #3e8e41;\\n}"\n    },\n    "/components/TaskList.css": {\n      "code": ".task-list {\\n  list-style: none;\\n  padding: 0;\\n}\\n\\n.task-item {\\n  display: flex;\\n  align-items: center;\\n  padding: 10px;\\n  border-bottom: 1px solid #eee;\\n}\\n\\n.complete-button {\\n  background: none;\\n  border: none;\\n  cursor: pointer;\\n  margin-right: 10px;\\n  padding: 0;\\n}\\n\\n.delete-button {\\n  background: none;\\n  border: none;\\n  cursor: pointer;\\n  margin-left: auto;\\n  padding: 0;\\n}\\n\\n.task-text {\\n  flex-grow: 1;\\n}\\n\\n.completed {\\n  text-decoration: line-through;\\n  color: #888;\\n}\\n"\n    }\n  },\n  "generatedFiles": []\n}\n```',
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
