import { useEffect } from "react";
import { useThemeStore } from "./components/hooks/useThemeStore";
import AppRouter from "./router/AppRouter";

function App() {

  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <div className="bg-[#FAF9F6] dark:bg-gray-800 text-black dark:text-gray-200 min-h-screen">
    <AppRouter />
  </div>;
}

export default App;