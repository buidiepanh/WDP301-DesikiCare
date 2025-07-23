// src/App.tsx

import { RouterProvider } from "react-router-dom";
import router from "./routes";

const App = () => {
  // App.tsx
  console.log("✅ ENV TEST: ", import.meta.env.VITE_API_BASE_URL);

  return <RouterProvider router={router} />;
};

export default App;
