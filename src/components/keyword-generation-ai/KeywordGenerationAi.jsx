"use client";

import { useState, useEffect ,useRef} from "react";
import '@styles/ai/KeywordAi.css';
import Image from "next/image";
import { database } from "@firebase";
import { ref, set, get } from "firebase/database";
import { useKeyPrompt } from "@context/KeywordPromptContext";
import useCountryList from "react-select-country-list"; // Import the country list hook
import arrow from '@public/Images/ai/drop.svg';
import prfecBtn from '@public/Images/ai/prfec button.svg';

export default function KeywordGenerationAi() {
  const{keywordPromptCount, setKeywordPromptCount} = useKeyPrompt(); // Use the keyword prompt context
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("US"); // Default country set to 'US'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for managing dropdown visibility
  const dropdownRef = useRef(null); // Ref for the dropdown container

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Listen for clicks
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup listener on unmount
    };
  }, []);

  const countries = useCountryList(); // Use the hook to get country list
  const countryOptions = countries.getData().map(country => ({
    label: country.label, 
    value: country.value
  })); 

  const analyzeKeyword = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    if (keywordPromptCount >= 3) {
      alert('You have reached the daily prompt limit. Please try again tomorrow.');
      return;
    }

    setKeywordPromptCount((prev) => prev + 1);

    try {
      const keywordRef = ref(database, `keywords/${keyword}/${country}`);

      // Check if the keyword exists in Firebase
      const snapshot = await get(keywordRef);
      if (snapshot.exists()) {
        // If keyword exists, fetch and display the data
        setResult(snapshot.val());
      } else {
        // If keyword does not exist, make API call
        const response = await fetch("/api/keyword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword, country }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "An unknown error occurred");
        }

        const data = await response.json();
        const jsonData = data.analysisResult.replace(/```json\n|\n```/g, "");
        const parsedResult = JSON.parse(jsonData);

        // Store the result in Firebase
        await set(keywordRef, parsedResult);

        // Display the result
        setResult(parsedResult);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Handle country selection
  const handleCountrySelect = (value) => {
    setCountry(value);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="keyword-generator">
      <div className="keyword-generator-container">
        <div className="keyword-generator-search">
          <h1>Keyword Generator AI</h1>
          <div className="keyword-generator-search-input">
            <input type="text" id="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && analyzeKeyword()} placeholder="Enter Keyword"/>
            
            {/* Custom dropdown */}
            <div className="k-g-country-dropdown" onClick={toggleDropdown} ref={dropdownRef}>
              <div className="k-g-country-dropdown-toggle" >
                {countryOptions.find(option => option.value === country)?.label || "Select Country"}
              </div>
              {isDropdownOpen && (
                <div className=" ">
                  <div className="k-g-country-dropdown-menu-container">
                  {countryOptions.map(({ value, label }) => (
                    <div key={value} className="k-g-country-dropdown-item" onClick={() => handleCountrySelect(value)}>
                      {label}
                    </div>
                  ))}
                  </div>
                </div>
              )}
              <Image src={arrow} alt="Arrow"  />
            </div>
            
            <div className="button" onClick={analyzeKeyword} disabled={!keyword || loading}>
              Search
              <Image src={prfecBtn} alt="prfec" />
            </div>
          </div>

        </div>

        {error && <p className="error">Error: {error}</p>}
        {result && (
          <div className="result">
            <h2>Analysis Results</h2>
            <p><strong>Search Volume:</strong> {result["Search Volume"]}</p>
            <p><strong>Global Volume % with Countries:</strong></p>
            <ul>
              {Object.entries(result["Global Volume % with Countries"]).map(([country, percent]) => (
                <li key={country}>{country}: {percent}%</li>
              ))}
            </ul>
            <p><strong>Organic CTR:</strong> {result["Organic CTR"]}%</p>
            <p><strong>CPC:</strong> {result["Cost Per Click"]}%</p>
            <p><strong>Keyword Difficulty:</strong> {result["Keyword Difficulty"]}</p>
            <p><strong>Intent Categorization:</strong> {result["Intent Categorization"]}</p>
            <p><strong>Top Similar Keywords:</strong></p>
            <ul>
              {result["Top Similar Keywords"].map((keyword, index) => (
                <li key={index}>
                  {keyword.Keyword} - Volume: {keyword.Volume}, KD: {keyword.KD}, Intent: {keyword.Intent}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
