import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);


const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("careerforge-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return "dark";
  });



  useEffect(() => {

    // Save theme
    localStorage.setItem(
      "careerforge-theme",
      theme
    );


    // Tailwind dark mode
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }


    // DaisyUI support
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );


  }, [theme]);



  const toggleTheme = () => {

    setTheme((prevTheme) =>
      prevTheme === "dark"
        ? "light"
        : "dark"
    );

  };



  const value = {

    theme,

    isDark: theme === "dark",

    toggleTheme,

    setTheme,

  };



  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};


export default ThemeProvider;