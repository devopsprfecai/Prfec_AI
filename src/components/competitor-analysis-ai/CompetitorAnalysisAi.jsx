// "use client";

// import { useState, useEffect, useRef } from "react";
// // import '@styles/ai/SeoAnalysis.css';
// import Image from "next/image";
// import { database } from "@firebase";
// import { ref, set, get } from "firebase/database";
// import { useCompetitorPrompt } from "@context/CompetitorPromptCount";
// import analyzeBtn from '@public/Images/ai/prfec button.svg';

// export default function CompetitorAnalysisAi() {
//   const { competitorPromptCount, setCompetitorPromptCount } = useCompetitorPrompt(); // Use the keyword prompt context
//   const [domain, setDomain] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);

// const sanitizeKeys = (obj) => {
//     if (Array.isArray(obj)) {
//       return obj.map(sanitizeKeys);
//     } else if (obj && typeof obj === "object") {
//       return Object.fromEntries(
//         Object.entries(obj).map(([key, value]) => [
//           key.replace(/[.#$/\[\]]/g, "_"), // Replace invalid characters
//           sanitizeKeys(value),
//         ])
//       );
//     }
//     return obj;
//   };
  
//   const analyzeDomain = async () => {
//     setLoading(true);
//     setError(null);
//     setResult(null);
  
//     if (competitorPromptCount >= 100) {
//       alert('You have reached the daily analysis limit. Please try again tomorrow.');
//       return;
//     }
  
//     setCompetitorPromptCount((prev) => prev + 1);
  
//     try {
//       const sanitizedDomain = domain.replace(/[\.\#\$\[\]\/:]/g, "_");
//       const domainRef = ref(database, `domains/${sanitizedDomain}`);
  
//       // Check if the domain exists in Firebase
//       const snapshot = await get(domainRef);
//       if (snapshot.exists()) {
//         setResult(snapshot.val());
//       } else {
//         const response = await fetch("/api/competitor", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ domain }),
//         });
  
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || "An unknown error occurred");
//         }
  
//         const data = await response.json();
//         const jsonData = data.analysisResult.replace(/```json\n|\n```/g, "");
//         const parsedResult = JSON.parse(jsonData);
  
//         // Sanitize keys
//         const sanitizedResult = sanitizeKeys(parsedResult);
  
//         // Store the sanitized result in Firebase
//         await set(domainRef, sanitizedResult);
//         setResult(sanitizedResult);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div className="seo-analysis" style={{ padding: "120px" }}>
//       <div className="seo-analysis-container">
//         <div className="seo-analysis-search">
//           <h1>SEO Competitor Analysis Tool</h1>
//           <div className="seo-analysis-search-input">
//             <input
//               type="text"
//               id="domain"
//               value={domain}
//               onChange={(e) => setDomain(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && analyzeDomain()}
//               placeholder="Enter Domain (e.g., example.com)"
//             />

//             <div className="button" onClick={analyzeDomain} disabled={!domain || loading}>
//               Analyze
//               <Image src={analyzeBtn} alt="Analyze" />
//             </div>
//           </div>
//         </div>

//         {error && <p className="error">Error: {error}</p>}


// {result && (
//   <div className="result">
//     <h2>Analysis Results</h2>
//     {result["Domain Authority"] === 0 ||
//     result["Page Authority"] === 0 ||
//     result["Ranking Keywords"] === 0 ? (
//       <p>The domain is not AI ready</p>
//     ) : (
//       <>
//         <p><strong>Domain Authority:</strong> {result["Domain Authority"]}</p>
//         <p><strong>Page Authority:</strong> {result["Page Authority"]}</p>
//         <p><strong>Spam Score:</strong> {result["Spam Score"]}</p>
//         <p><strong>Ranking Keywords:</strong> {result["Ranking Keywords"]}</p>
//         <p><strong>Top Keywords:</strong></p>
//         <ul>
//           {Array.isArray(result["Top Keywords"]) ? (
//             result["Top Keywords"].map((keyword, index) => (
//               <li key={index}>
//                 {keyword.Keyword} - Position: {keyword.Position}
//               </li>
//             ))
//           ) : (
//             <li>No top keywords available</li>
//           )}
//         </ul>
//         <p><strong>Top Competitors:</strong></p>
//         <ul>
//           {result["Top Competitors"]?.map((competitor, index) => (
//             <li key={index}>
//               {competitor.Competitor} - DA: {competitor["Domain Authority"]}
//             </li>
//           ))}
//         </ul>
//         <p><strong>Keyword Opportunities:</strong></p>
//         <ul>
//           {result["Keyword Opportunities"]?.map((keyword, index) => (
//             <li key={index}>
//               {keyword.Keyword} - Traffic Lift: {keyword["Traffic Lift"]}
//             </li>
//           ))}
//         </ul>
//       </>
//     )}
//   </div>
// )}


//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect, useRef } from "react";
// import '@styles/ai/SeoAnalysis.css';
import Image from "next/image";
import { database } from "@firebase";
import { ref, set, get } from "firebase/database";
import { useCompetitorPrompt } from "@context/CompetitorPromptCount";
import analyzeBtn from '@public/Images/ai/prfec button.svg';

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
  
  // const validateDomainWithWhois = async (domain) => {
  //   try {
  //     const response = await fetch(
  //       `https://www.whoisxmlapi.com/whoisserver/WhoisService?domainName=${domain}&apiKey=at_GCMzcCA0NnhPNEqb52WYDbQruMfDn&outputFormat=JSON`
  //     );
  
  //     if (!response.ok) {
  //       throw new Error("Failed to validate domain using WHOIS API");
  //     }
  
  //     const data = await response.json();
  //     console.log("data", data);
  
  //     // Check for missing WHOIS data
  //     if (data.WhoisRecord && data.WhoisRecord.dataError === "MISSING_WHOIS_DATA") {
  //       throw new Error("WHOIS data is missing for this domain.");
  //     }
  
  //     if (
  //       data.WhoisRecord &&
  //       data.WhoisRecord.registryData &&
  //       data.WhoisRecord.registryData.domainAvailability === "AVAILABLE"
  //     ) {
  //       throw new Error("The entered domain is available (not registered).");
  //     }
  
  //     if (!data.WhoisRecord) {
  //       throw new Error("The entered domain does not exist or is invalid.");
  //     }
  
  //     return true; // Domain exists and has valid WHOIS data
  //   } catch (err) {
  //     throw new Error(err.message || "WHOIS validation failed.");
  //   }
  // };
  
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
  

  // const analyzeDomain = async () => {
  //   setLoading(true);
  //   setError(null);
  //   setResult(null);
  
  //   if (competitorPromptCount >= 3) {
  //     alert('You have reached the daily analysis limit. Please try again tomorrow.');
  //     return;
  //   }
  
  //   setCompetitorPromptCount((prev) => prev + 1);
  
  //   try {
  //     // Validate domain using WHOIS API
  //     await validateDomainWithWhois(domain);
  
  //     const sanitizedDomain = domain.replace(/[\.\#\$\[\]\/:]/g, "_");
  //     const domainRef = ref(database, `domains/${sanitizedDomain}`);
  
  //     // Check if the domain exists in Firebase
  //     const snapshot = await get(domainRef);
  //     if (snapshot.exists()) {
  //       setResult(snapshot.val());
  //     } else {
  //       const response = await fetch("/api/competitor", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ domain }),
  //       });
  
  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(errorData.error || "An unknown error occurred");
  //       }
  
  //       const data = await response.json();
  //       const jsonData = data.analysisResult.replace(/```json\n|\n```/g, "");
  //       const parsedResult = JSON.parse(jsonData);
  
  //       // Sanitize keys
  //       const sanitizedResult = sanitizeKeys(parsedResult);
  
  //       // Store the sanitized result in Firebase
  //       await set(domainRef, sanitizedResult);
  //       setResult(sanitizedResult);
  //     }
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
  
  return (
    <div className="seo-analysis" style={{ padding: "120px" }}>
      <div className="seo-analysis-container">
        <div className="seo-analysis-search">
          <h1>SEO Competitor Analysis Tool</h1>
          <div className="seo-analysis-search-input">
            <input
              type="text"
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyzeDomain()}
              placeholder="Enter Domain (e.g., example.com)"
            />

            <div className="button" onClick={analyzeDomain} disabled={!domain || loading}>
              Analyze
              <Image src={analyzeBtn} alt="Analyze" />
            </div>
          </div>
        </div>

        {error && <p className="error">{error}</p>}


{result && (
  <div className="result">
    <h2>Analysis Results</h2>
    {result["Domain Authority"] === 0 ||
    result["Page Authority"] === 0 ||
    result["Ranking Keywords"] === 0 ? (
      <p>The domain is not AI ready</p>
    ) : (
      <>
        <p><strong>Domain Authority:</strong> {result["Domain Authority"]}</p>
        <p><strong>Page Authority:</strong> {result["Page Authority"]}</p>
        <p><strong>Spam Score:</strong> {result["Spam Score"]}</p>
        <p><strong>Ranking Keywords:</strong> {result["Ranking Keywords"]}</p>
        <p><strong>Top Keywords:</strong></p>
        <ul>
          {Array.isArray(result["Top Keywords"]) ? (
            result["Top Keywords"].map((keyword, index) => (
              <li key={index}>
                {keyword.Keyword} - Position: {keyword.Position}
              </li>
            ))
          ) : (
            <li>No top keywords available</li>
          )}
        </ul>
        <p><strong>Top Competitors:</strong></p>
        <ul>
          {result["Top Competitors"]?.map((competitor, index) => (
            <li key={index}>
              {competitor.Competitor} - DA: {competitor["Domain Authority"]}
            </li>
          ))}
        </ul>
        <p><strong>Keyword Opportunities:</strong></p>
        <ul>
          {result["Keyword Opportunities"]?.map((keyword, index) => (
            <li key={index}>
              {keyword.Keyword} - Traffic Lift: {keyword["Traffic Lift"]}
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
)}


      </div>
    </div>
  );
}


