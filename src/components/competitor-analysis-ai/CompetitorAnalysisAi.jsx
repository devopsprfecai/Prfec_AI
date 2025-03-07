"use client";
import '@styles/ai/CompetitorAi.css'
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { database } from "@firebase";
import { getDatabase, ref, set, get, push } from "firebase/database";
import { useCompetitorPrompt } from "@context/CompetitorPromptCount";
import { useRouter } from 'next/navigation';
import analyzeBtn from '@public/Images/ai/prfec button.svg';
import AiDashboard from '@components/ai/Dashboard';
import DashboardRightUpdate from '@components/ai/DashboardRightUpdate';
import CompetitorTable from './CompetitorTable';
import { getAuth } from "firebase/auth";
import { UserAuth } from '@context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { RiMenu4Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import Link from 'next/link';
export default function CompetitorAnalysisAi({contentId}) {
  const { competitorPromptCount, setCompetitorPromptCount } = useCompetitorPrompt(); // Use the keyword prompt context
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 800);
  const auth = getAuth();
  const router = useRouter();
  const {user} = UserAuth();

  useEffect(() => {
    const fetchCompetitorData = async () => {
      if (!contentId) return;
  
      if (!user) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const userId = user.uid;
      const db = getDatabase();
  
      try {
        // Fetch id and country from 'keyword-research-prompts/{userId}/{contentId}'
        const competitorRef = ref(db, `competitor-analysis-prompts/${userId}/${contentId}`);

        const competitorSnapshot = await get(competitorRef);

        if (!competitorSnapshot.exists()) {
          console.error("No keyword data found.");
          return;
        }
  
        const { id} = competitorSnapshot.val(); // Extract id and country
        const competitorAnalysisRef = ref(db, `domains/${id}`);
        const analysisSnapshot = await get(competitorAnalysisRef);
        if (analysisSnapshot.exists()) {
          setResult(analysisSnapshot.val());
          setDomain(id.replace(/_/g, ".")); 

        } else {
          console.error("No analysis data found.");
        }
      } catch (error) {
        console.error("Error fetching keyword data:", error);
        setError(error.message);
      }
    };
  
    fetchCompetitorData();
  }, [contentId,user]); // Runs when keywordId changes

const sanitizeKeys = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(sanitizeKeys);
    } else if (obj && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key.replace(/[.#$/\[\]]/g, "_"), // Replace invalid characters
          sanitizeKeys(value),
        ])
      );
    }
    return obj;
  };
  
  const validateDomainWithWhois = async (domain) => {
    try {
      const response = await fetch(
        `https://www.whoisxmlapi.com/whoisserver/WhoisService?domainName=${domain}&apiKey=at_GCMzcCA0NnhPNEqb52WYDbQruMfDn&outputFormat=JSON`
      );
  
      if (!response.ok) {
        throw new Error("Failed to validate domain using WHOIS API");
      }
  
      const data = await response.json();
  
      // Check for missing WHOIS data
      if (data.WhoisRecord && data.WhoisRecord.dataError === "MISSING_WHOIS_DATA") {
        return false; // Invalid domain
      }
  
      if (
        data.WhoisRecord &&
        data.WhoisRecord.registryData &&
        data.WhoisRecord.registryData.domainAvailability === "AVAILABLE"
      ) {
        return false; // Domain is available (not registered)
      }
  
      if (!data.WhoisRecord) {
        return false; // Invalid domain
      }
  
      return true; // Domain exists and has valid WHOIS data
    } catch (err) {
      return false; // WHOIS validation failed
    }
  };
  const validateDomainFormat = (domain) => {
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const analyzeDomain = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    if (!domain) {
      setError("Please enter a domain.");
      setLoading(false);
      return;
    }
  
    if (!validateDomainFormat(domain)) {
      setError("Invalid domain format. Example: example.com, google.co.uk");
      setLoading(false);
      return;
    }
    const user = auth.currentUser;
  
    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }
  
    const userId = user.uid;
    const db = getDatabase();
    const planRef = ref(db, `subscriptions/${userId}/planType`);
    const snapshot = await get(planRef);
  
    let planType = snapshot.exists() ? snapshot.val() : null;
    let maxPrompts = planType === "starter" ? 50 : planType === "pro" ? 150 : 3;
  
    if (competitorPromptCount >= maxPrompts)
       {
      alert(`You have reached your daily prompt limit of ${maxPrompts}. Please try again tomorrow.`);
      setLoading(false);
      return;
    }
  
    setCompetitorPromptCount((prev) => prev + 1);
  
    try {
      // Validate domain using WHOIS API
      const isValidDomain = await validateDomainWithWhois(domain);
  
      if (!isValidDomain) {
        setError("The entered domain is invalid.");
        return;
      }
  
      const sanitizedDomain = domain.replace(/[\.\#\$\[\]\/:]/g, "_");

      const domainRef = ref(database, `domains/${sanitizedDomain}`);
      const snapshot = await get(domainRef);
      let analysisResult;
      if (snapshot.exists()) {
        analysisResult = snapshot.val();

      } else {
        const response = await fetch("/api/competitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
        });
        console.log("Not available")
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "An unknown error occurred");
        }

        const data = await response.json();
        const jsonData = data.analysisResult.replace(/```json\n|\n```/g, "");
        analysisResult = sanitizeKeys(JSON.parse(jsonData));
  
        // Store sanitized result in Firebase
        await set(domainRef, analysisResult);
      }
  
      // Generate UUID and store the result under competitor-analysis-prompts
      const resultID = uuidv4();
      const timestamp = Date.now();
      const userPromptRef = ref(db, `competitor-analysis-prompts/${userId}/`);
      const checkSnapshot = await get(userPromptRef);

    if(!checkSnapshot.exists()){
      const checkDomainRef = ref(db, `competitor-analysis-prompts/${userId}/${resultID}`);

      await set(checkDomainRef, {
        id: sanitizedDomain,
        timestamp,
      });
      setResult(analysisResult);
      router.push(`/competitor/${resultID}`);
    }
    else{

      const pastDomainRef = ref(db, `/competitor-analysis-prompts/${userId}/`);
      const pastSnapshot = await get(pastDomainRef);

      if (pastSnapshot.exists()) {
        const data = pastSnapshot.val();
        let pastDomainId = null;

        Object.entries(data).forEach(([id, details]) => {

            if (details.id === sanitizedDomain) {
                pastDomainId = id;
            }
        });

        if (pastDomainId) {
            setResult(snapshot.val());
            router.push(`/competitor/${pastDomainId}`);
        } else {
          const newUid = uuidv4();
          const newDomainRef = ref(db, `competitor-analysis-prompts/${userId}/${newUid}`);

          await set(newDomainRef, {
            id: sanitizedDomain,
            timestamp,
          });
          setResult(analysisResult);
          router.push(`/competitor/${newUid}`);
            // console.log("Keyword not found");
        }
    }
    else{
      
    }
  
  }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


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
         document.querySelector('.competitor-analysis').style.height = `${viewportHeight}px`;
       } else {
         document.querySelector('.competitor-analysis').style.height = 'auto';
       }
     };
 
     adjustHeight();
     window.addEventListener('resize', adjustHeight);
 
     return () => window.removeEventListener('resize', adjustHeight);
   }, []);
 
   const handleMenuOpen = () => {
     setMenuOpen(!menuOpen);
   };
 

  const currentPath = '/competitor';
  return (
    <div className="competitor-analysis" >
      {/* <AiDashboard currentPath={currentPath}/> */}
         {/* <AiDashboard currentPath={currentPath}/> */}
         {isDesktop && <AiDashboard />}

      <div className="competitor-analysis-container">
        <h1 className='competitor-analysis-container-heading'>Competitor Analysis</h1>

        <div className="competitor-analysis-search">
          <h1>Analyze Your Competitors and Gain Actionable SEO Insights</h1>
          <div className="competitor-analysis-search-input">
            <input type="text" id="domain" value={domain} onChange={(e) => setDomain(e.target.value.toLowerCase())}
            onKeyDown={(e) => e.key === "Enter" && analyzeDomain()} placeholder="Enter Domain (e.g., example.com)"/>

            <div className={`competitor-analysis-search-input-button ${loading ? "loading" : ""}`}  onClick={analyzeDomain} disabled={!domain || loading}>
              Analyze
              <Image src={analyzeBtn} alt="Analyze" />
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}

        </div>

        <div className='competitor-result-canvas'>

        {result && domain && (
  <h2 style={{ fontSize: "20px", fontFamily: "var(--h-font)", color: "var(--h-color)", fontWeight: "500" }}>
    Domain: {domain}
  </h2>
)}          
          <div className='competitor-result-keyword'>
          {result && <CompetitorTable 
                users={result["Keyword Opportunities"] || []} 
                heading={[
                  { id: "Keyword", title: "Keyword" },
                  { id: "Traffic Lift", title: "Traffic Lift" }
                ]}
              />}
            {result &&<CompetitorTable 
                users={result["Top Keywords"] || []} 
                heading={[
                  { id: "Keyword", title: "Keyword" },
                  { id: "Position", title: "Position" }
                ]}
              />}

              {/* Keyword Opportunities Table */}

          </div>

         {result && <div className='competitor-result-score'>
            <div className='competitor-result-score-domain'>
              <p>Domain Authority</p>
              <span>{result["Domain Authority"] ? `${result["Domain Authority"]}%` : "N/A"}</span>
            </div>
            <div className='competitor-result-score-page'>
              <p>Page Authority</p>
              <span>{result["Page Authority"] ? `${result["Page Authority"]}%` : "N/A"}</span>
            </div>
            <div className='competitor-result-score-spam'>
              <p>Spam Score</p>
              <span>{result["Spam Score"] !== undefined ? `${result["Spam Score"]}%` : "N/A"}</span>
            </div>
            <div className='competitor-result-score-rank'>
              <p>Ranking Keywords</p>
              <span>{result["Ranking Keywords"] !== undefined ? result["Ranking Keywords"] : "N/A"}</span>
            </div>
          </div>}


          <div className='competitor-result-top-competitor'>
          {result &&<CompetitorTable 
                users={result["Top Competitors"] || []} 
                heading={[
                  { id: "Competitor", title: "Competitor" },
                  { id: "Domain Authority", title: "Domain Authority" }
                ]}
              />}
          </div>

        </div>
      </div>
    </div>
  );
}










