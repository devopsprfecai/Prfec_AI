"use client";
import '@styles/ai/CompetitorAi.css'
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { database } from "@firebase";
import { ref, set, get } from "firebase/database";
import { useCompetitorPrompt } from "@context/CompetitorPromptCount";
import analyzeBtn from '@public/Images/ai/prfec button.svg';
import AiDashboard from '@components/ai/Dashboard';
import DashboardRightUpdate from '@components/ai/DashboardRightUpdate';
import CompetitorTable from './CompetitorTable';
export default function CompetitorAnalysisAi() {
  const { competitorPromptCount, setCompetitorPromptCount } = useCompetitorPrompt(); // Use the keyword prompt context
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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

  const analyzeDomain = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
  
    if (competitorPromptCount >= 3) {
      alert('You have reached the daily analysis limit. Please try again tomorrow.');
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
  
      // Check if the domain exists in Firebase
      const snapshot = await get(domainRef);
      if (snapshot.exists()) {
        setResult(snapshot.val());
      } else {
        const response = await fetch("/api/competitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "An unknown error occurred");
        }
  
        const data = await response.json();
        const jsonData = data.analysisResult.replace(/```json\n|\n```/g, "");
        const parsedResult = JSON.parse(jsonData);
  
        // Sanitize keys
        const sanitizedResult = sanitizeKeys(parsedResult);
  
        // Store the sanitized result in Firebase
        await set(domainRef, sanitizedResult);
        setResult(sanitizedResult);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  

console.log("Loading",loading)
  const currentPath = '/competitor';
  return (
    <div className="competitor-analysis" >
      <AiDashboard currentPath={currentPath}/>
      <div className="competitor-analysis-container">
        <h1 className='competitor-analysis-container-heading'>Competitor Analysis</h1>

        <div className="competitor-analysis-search">
          <h1>Analyze Your Competitors and Gain Actionable SEO Insights</h1>
          <div className="competitor-analysis-search-input">
            <input type="text" id="domain" value={domain} onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyzeDomain()} placeholder="Enter Domain (e.g., example.com)"/>

            <div className={`competitor-analysis-search-input-button ${loading ? "loading" : ""}`}  onClick={analyzeDomain} disabled={!domain || loading}>
              Analyze
              <Image src={analyzeBtn} alt="Analyze" />
            </div>
          </div>
        </div>

        <div className='competitor-result-canvas'>
          
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

        {/* {error && <p className="error">{error}</p>} */}


      </div>
      <DashboardRightUpdate/>
    </div>
  );
}










