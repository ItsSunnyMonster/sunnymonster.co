function setTheme(mode) {
  localStorage.setItem("theme-storage", mode);
}

// Functions needed for the theme toggle
//

function toggleTheme() {
  if (localStorage.getItem("theme-storage") === "light") {
    setTheme("dark");
    updateItemToggleTheme();
  } else if (localStorage.getItem("theme-storage") === "dark") {
    setTheme("light");
    updateItemToggleTheme();
  }
}

function updateItemToggleTheme() {
  let mode = getSavedTheme();

  const darkModeStyle = document.getElementById("darkModeStyle");
  if (darkModeStyle) {
    darkModeStyle.disabled = mode === "light";
  }

  let htmlElement = document.querySelector("html");
  let iconElements = document.querySelectorAll(".logo");
  if (mode === "dark") {
    htmlElement.classList.remove("light");
    htmlElement.classList.add("dark");
    iconElements.forEach((img) => {
      img.style.backgroundImage = "url('icons/no_background.png')";
    });
  } else if (mode === "light") {
    htmlElement.classList.remove("dark");
    htmlElement.classList.add("light");
    iconElements.forEach((img) => {
      img.style.backgroundImage = "url('icons/light.png')";
    });
  }
}

function getSavedTheme() {
  let currentTheme = localStorage.getItem("theme-storage");
  if (!currentTheme) {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      currentTheme = "dark";
    } else {
      currentTheme = "light";
    }
  }

  return currentTheme;
}

window.onload = () => {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches: isDark }) => {
      let theme = isDark ? "dark" : "light";
      setTheme(theme);
      updateItemToggleTheme();
    });

  document.querySelector("html").style.transition =
    "background-color 400ms ease-in-out";
};

window.addEventListener("DOMContentLoaded", () => {
  updateItemToggleTheme();
});

// Update the toggle theme on page load
updateItemToggleTheme();
