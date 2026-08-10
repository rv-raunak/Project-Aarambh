import React, { useEffect, useState } from "react";
import Home from "./Home"
import axios from "axios";
// import { json } from "react-router-dom";
// import { BiSunFill, BiMoon } from "react-icons/bi";

const Navbar = ({ onSelectCategory, onSearch }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false)
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (value) => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true)
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/search?keyword=${value}`
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
        console.log(response.data);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };


  // const handleChange = async (value) => {
  //   setInput(value);
  //   if (value.length >= 1) {
  //     setShowSearchResults(true);
  //     try {
  //       let response;
  //       if (!isNaN(value)) {
  //         // Input is a number, search by ID
  //         response = await axios.get(`http://localhost:8080/api/products/search?id=${value}`);
  //       } else {
  //         // Input is not a number, search by keyword
  //         response = await axios.get(`http://localhost:8080/api/products/search?keyword=${value}`);
  //       }

  //       const results = response.data;
  //       setSearchResults(results);
  //       setNoResults(results.length === 0);
  //       console.log(results);
  //     } catch (error) {
  //       console.error("Error searching:", error.response ? error.response.data : error.message);
  //     }
  //   } else {
  //     setShowSearchResults(false);
  //     setSearchResults([]);
  //     setNoResults(false);
  //   }
  // };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };
  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <a href="https://www.linkedin.com/in/vaibhav-mishra-rvr/">
            <i className="bi bi-box-seam sidebar-icon"></i>
            <span className="sidebar-text">Aarambh</span>
          </a>
        </div>
        <ul className="sidebar-nav">
          <li className="nav-item">
            <a href="/">
              <i className="bi bi-house-door sidebar-icon"></i>
              <span className="sidebar-text">Home</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="/add_product">
              <i className="bi bi-plus-square sidebar-icon"></i>
              <span className="sidebar-text">Add</span>
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              href="/"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-tags sidebar-icon"></i>
              <span className="sidebar-text">Categories</span>
            </a>
            <ul className="dropdown-menu sidebar-dropdown">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className="dropdown-item"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </li>
          <li className="nav-item">
            <a href="/cart">
              <i className="bi bi-cart sidebar-icon"></i>
              <span className="sidebar-text">Cart</span>
            </a>
          </li>
          <li className="nav-item">
            <button className="theme-toggle-btn" onClick={() => toggleTheme()}>
              {theme === "dark-theme" ? (
                <i className="bi bi-moon-fill sidebar-icon"></i>
              ) : (
                <i className="bi bi-sun-fill sidebar-icon"></i>
              )}
              <span className="sidebar-text">Theme</span>
            </button>
          </li>
        </ul>
      </aside>

      <header className="topbar">
        <div className="search-container">
          <i className="bi bi-search search-icon"></i>
          <input
            className="search-input"
            type="search"
            placeholder="Search Products..."
            aria-label="Search"
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          />
          {showSearchResults && (
            <ul className="list-group search-dropdown">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <li key={result.id} className="list-group-item">
                    <a href={`/product/${result.id}`} className="search-result-link">
                      <span>{result.name}</span>
                    </a>
                  </li>
                ))
              ) : (
                noResults && (
                  <p className="no-results-message">
                    No Product with such Name
                  </p>
                )
              )}
            </ul>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
