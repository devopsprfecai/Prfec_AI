
"use client";

import { useState, useEffect ,useRef} from "react";
import '@styles/ai/KeywordAi.css';
import Image from "next/image";
import { database } from "@firebase";
import { getDatabase,ref, set, get ,push} from "firebase/database";
import { useKeyPrompt } from "@context/KeywordPromptContext";
import useCountryList from "react-select-country-list"; // Import the country list hook
import arrow from '@public/Images/ai/drop.svg';
import prfecBtn from '@public/Images/ai/prfec button.svg';
import AiDashboard from "@components/ai/Dashboard";
import DashboardRightUpdate from "@components/ai/DashboardRightUpdate";
import LinearProgress from "@mui/material/LinearProgress";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { UserAuth } from "@context/AuthContext";
import { RiMenu4Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import Link from 'next/link';
export default function KeywordGenerationAi({contentId}) {
  const{keywordPromptCount, setKeywordPromptCount} = useKeyPrompt(); // Use the keyword prompt context
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("US"); // Default country set to 'US'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [countrySearch, setCountrySearch] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);// Ref for the dropdown container
  const auth = getAuth();
  const router = useRouter();
  const { user } = UserAuth();

  let planType="free";
  let maxPrompts = 3; 
  useEffect(() => {
    const fetchKeywordData = async () => {
      if (!contentId) return;
  
      if (!user) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const userId = user.uid;
      const db = getDatabase();
  
      try {
        // Fetch id and country from 'keyword-research-prompts/{userId}/{contentId}'
        const keywordRef = ref(db, `keyword-research-prompts/${userId}/${contentId}`);

        const keywordSnapshot = await get(keywordRef);

        if (!keywordSnapshot.exists()) {
          console.error("No keyword data found.");
          return;
        }
  
        const { id, country } = keywordSnapshot.val(); // Extract id and country
        const keywordAnalysisRef = ref(db, `keywords/${id}/${country}`);
        const analysisSnapshot = await get(keywordAnalysisRef);
        if (analysisSnapshot.exists()) {
          setResult(analysisSnapshot.val());
          setKeyword(id)
        } else {
          console.error("No analysis data found.");
        }
      } catch (error) {
        console.error("Error fetching keyword data:", error);
        setError(error.message);
      }
    };
  
    fetchKeywordData();
  }, [contentId,user]); // Runs when keywordId changes
  
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
    const user = auth.currentUser;

    if (!user) {
        alert("User not authenticated. Please log in.");
        setLoading(false);
        return;
    }

    const userId = user.uid;
    const db = getDatabase();
    const planRef = ref(db, `subscriptions/${userId}/planType`);
    const snapshot = await get(planRef);

    planType = snapshot.exists() ? snapshot.val() : null;
    // Default limit

    if (planType === "starter") {
        maxPrompts = 50;
    } else if (planType === "pro") {
        maxPrompts = 150;
    }

    if (keywordPromptCount >= maxPrompts) {
        alert(`You have reached your daily prompt limit of ${maxPrompts}. Please try again tomorrow.`);
        setLoading(false);
        return;
    }

    setKeywordPromptCount((prev) => prev + 1);

    const keywordId = uuidv4();
    const currentDate = Date.now(); // (Stores full UTC timestamp)
    const keywordRef = ref(db, `keyword-research-prompts/${userId}/`);
    const checkSnapshot = await get(keywordRef);

    if(!checkSnapshot.exists()){
      const checkKeywordRef = ref(db, `keyword-research-prompts/${userId}/${keywordId}`);
      await set(checkKeywordRef, { id: keyword, country, date: currentDate });

    }

    try {

        const keywordAnalysisRef = ref(database, `keywords/${keyword}/${country}`);
        const snapshot = await get(keywordAnalysisRef);

        if (snapshot.exists()) {
            const pastKeywordsRef = ref(db, `/keyword-research-prompts/${userId}/`);
            const pastSnapshot = await get(pastKeywordsRef);
            if (pastSnapshot.exists()) {
              const data = pastSnapshot.val();
              let pastKeywordId = null;

              // Find the pastKeywordId where the keyword matches
              Object.entries(data).forEach(([id, details]) => {

                  if (details.id === keyword) {
                      pastKeywordId = id;
                  }
              });

              if (pastKeywordId) {
                  setResult(snapshot.val());
                  router.push(`/keyword/${pastKeywordId}`);
              } else {
                const newUid = uuidv4();
                const newKeywordRef = ref(db, `keyword-research-prompts/${userId}/${newUid}`);
      
                await set(newKeywordRef, { id: keyword, country, date: currentDate });

                setResult(snapshot.val());
                router.push(`/keyword/${newUid}`);
              }
            } else {
              console.log("No data available");
            }
         
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
            const jsonData = data.analysisResult.replace(/```[\w]*\n?|\n```/g, "").trim();
            const parsedResult = JSON.parse(jsonData);
            await set(keywordAnalysisRef, parsedResult);
            if(checkSnapshot.exists()){
            const newKeywordRef = ref(db, `keyword-research-prompts/${userId}/${keywordId}`);
  
            await set(newKeywordRef, { id: keyword, country, date: currentDate });
            }
            setResult(parsedResult);
            router.push(`/keyword/${keywordId}`);
        }
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
    if (!isDropdownOpen && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCountrySelect = (value) => {
    setCountry(value);
    setCountrySearch("");
    setIsDropdownOpen(false);
  };

  const handleCountrySearchChange = (e) => {
    setCountrySearch(e.target.value);
  };

  const filteredCountries = countryOptions.filter(option =>
    option.label.toLowerCase().includes(countrySearch.toLowerCase())
  );


 const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 800);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 800);
      if (window.innerWidth > 800) {
        setMenuOpen(false); // Ensure menu closes when resizing to desktop mode
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize state on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const adjustHeight = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      if (viewportWidth <= 600) {
        document.querySelector('.keyword-generator').style.height = `${viewportHeight}px`;
      } else {
        document.querySelector('.keyword-generator').style.height = 'auto';
      }
    };

    adjustHeight();
    window.addEventListener('resize', adjustHeight);

    return () => window.removeEventListener('resize', adjustHeight);
  }, []);

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };



  const currentPath = '/keyword';
  const shouldShowKeyword = () => keyword && keywordPromptCount >= maxPrompts;

return (
    <div className="keyword-generator">
      {/* <AiDashboard currentPath={currentPath}/> */}
      {isDesktop && <AiDashboard />}


      <div className="keyword-generator-container">
        <h1 className="keyword-generator-container-heading">Keyword Analysis</h1>
        <div className="keyword-generator-search">
        <h1>Improve your Organic Search Results</h1>
        <div className="keyword-generator-search-input">
            <input type="text" id="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value.toLowerCase())} 
              onKeyDown={(e) => e.key === "Enter" && analyzeKeyword()} placeholder="Enter Keyword" className="keyword-generator-search-input-input"/>
            
            {/* Custom dropdown */}
            <div className="k-g-country-dropdown" onClick={toggleDropdown} ref={dropdownRef}>
              <input
                type="text"
                value={countrySearch || (countrySearch === "" && !isDropdownOpen ? countryOptions.find(option => option.value === country)?.label : "")}
                onChange={handleCountrySearchChange}
                placeholder={isDropdownOpen ? "Search Country" : ""}
                className="k-g-country-input"
                ref={inputRef}
              />

              {isDropdownOpen && (
                <div className="k-g-country-dropdown-menu-container">
                  {filteredCountries.map(({ value, label }) => (
                    <div key={value} className="k-g-country-dropdown-item" onClick={() => handleCountrySelect(value)}>
                      {label}
                    </div>
                  ))}
                </div>
              )}
              <Image src={arrow} alt="Arrow" />
            </div>

            <div className={`keyword-generator-search-input-button ${loading ? "loading" : ""}`} onClick={analyzeKeyword} disabled={!keyword || loading}>
            Search
            <Image src={prfecBtn} alt="prfec" />
          </div>

          </div>
          </div>

  {result && <div className="keyword-result-canvas">
    {keyword && <h2 style={{fontSize:"20px",fontFamily:"var(--h-font)",color:"var(--h-color)",fontWeight:"500"}}>Keyword:{keyword}</h2>}

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
                      backgroundColor: "#ffffff",
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
              style={{ color: "#515BD9", backgroundColor: "#ffffff", borderRadius: "100%", width: "60px", height: "60px" }}/>
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
    </div>
  );
}


