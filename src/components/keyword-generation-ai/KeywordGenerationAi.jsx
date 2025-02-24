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
import AiDashboard from "@components/ai/Dashboard";
import DashboardRightUpdate from "@components/ai/DashboardRightUpdate";
import LinearProgress from "@mui/material/LinearProgress";


import CircularProgress from "@mui/material/CircularProgress";

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

      const snapshot = await get(keywordRef);
      if (snapshot.exists()) {
        setResult(snapshot.val());
      } else {
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
        // const jsonData = data.analysisResult.replace(/```json\n|\n```/g, "");
        const jsonData = data.analysisResult.replace(/```[\w]*\n?|\n```/g, "").trim();

        const parsedResult = JSON.parse(jsonData);

        await set(keywordRef, parsedResult);

        setResult(parsedResult);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleCountrySelect = (value) => {
    setCountry(value);
    setIsDropdownOpen(false); // Close dropdown after selection
  };
const currentPath = '/keyword';
return (
    <div className="keyword-generator">
      <AiDashboard currentPath={currentPath}/>
      <div className="keyword-generator-container">
        <h1 className="keyword-generator-container-heading">Keyword Analysis</h1>
        <div className="keyword-generator-search">
        <h1>Improve your Organic Search Results</h1>
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

  {result && <div className="keyword-result-canvas">
          <div className="keyword-result-top-canvas">
            <div className="keyword-result-volume">
              <div  className="keyword-result-volume-container">
                <div className="keyword-result-search-volume">
                  <p>Search Volume:</p>
                  <span>{result["Search Volume"]}</span>
                </div>

                <div className="keyword-result-global-volume">
                  <p>Location Breakdown</p>
                  {Object.entries(result["Global Volume % with Countries"]).map(([country, percent]) => (
                  <div className="keyword-result-global-volume-contents" key={country}>
                    {/* <p>{country}</p> */}
                    <div className="global-volume-bar">
                    <LinearProgress
                    variant="determinate"
                    value={parseFloat(String(percent).replace("%", ""))} // Remove "%" and convert to number
                    sx={{
                      height: 16,
                      backgroundColor: "#f1f1f1",
                      "& .MuiLinearProgress-bar": { backgroundColor: "#515BD9" }, // Progress color
                    }}
                  />
                    </div>
                    <p>{country}({percent})</p>
                </div>
                ))}
                </div>
              </div>
            </div>

            <div className="keyword-top-table">
              <div className="keyword-top-table-scroll">
                <table className="keyword-top-table-container">
                  <thead className="keyword-top-head">
                    <tr className="keyword-top-row">
                      <th className="keyword-top-row-contents">Top Keywords</th>
                      <th className="keyword-top-row-contents">Volume</th>
                      <th className="keyword-top-row-contents">KD</th>
                      <th className="keyword-top-row-contents">Intent</th>
                    </tr>
                  </thead>
                  <tbody className="keyword-top-body">
                    {result["Top Similar Keywords"].map((keyword, index) => (
                      <tr className="keyword-top-body-row" key={index}>
                        <td className="keyword-top-body-row-contents">{keyword.Keyword}</td>
                        <td className="keyword-top-body-row-contents">{keyword.Volume}</td>
                        <td className="keyword-top-body-row-contents">{keyword.KD}%</td>
                        <td className="keyword-top-body-row-contents">{keyword.Intent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <div className="keyword-result-bottom-canvas">
            <div className="keyword-result-cpc">
              <p className="keyword-result-cpc-heading">CPC</p>
              <span className="keyword-result-cpc-result">{result["Cost Per Click"]}%</span>
            </div>
            <div className="keyword-result-seo">
              <div className="keyword-result-seo-contents">
                <p className="keyword-result-seo-heading">SEO difficulty</p>
                <span className="keyword-result-seo-result">{result["Keyword Difficulty"]}</span>
              </div>
              <CircularProgress variant="determinate" value={parseFloat(String(result["Keyword Difficulty"]).replace("%", ""))} 
              size={80} thickness={22} 
              style={{ color: "#515BD9", backgroundColor: "#f1f1f1", borderRadius: "100%", width: "60px", height: "60px" }}/>
          </div>
            <div className="keyword-result-ctr">
            <p className="keyword-result-ctr-heading">Organic CTR</p>
            <span className="keyword-result-ctr-result">{result["Organic CTR"]}%</span>
            </div>
            <div className="keyword-result-intent">
            <p className="keyword-result-intent-heading">Intent</p>
            <span className="keyword-result-intent-result">{result["Intent Categorization"]}</span>

            </div>
          </div>

        </div>}
        {error && <p className="error">Error: {error}</p>}


          
      </div>
      <DashboardRightUpdate/>
    </div>
  );
}
