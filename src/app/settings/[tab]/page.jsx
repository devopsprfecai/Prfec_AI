// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import '@styles/ai/settings/Settings.css';
// import General from '@components/ai/settings/general/General';
// import Billing from '@components/ai/settings/billing/Billing';
// import Profile from '@components/ai/settings/profile/Profile';
// import Data from '@components/ai/settings/data/Data';
// import Activity from '@components/ai/settings/activity/Activity';
// import Updates from '@components/ai/settings/updates/Updates';

// const AiSettings = () => {
//   const router = useRouter();
//   const { tab } = useParams(); // Capture the 'tab' from the URL
//   const [activeTab, setActiveTab] = useState(tab || 'general');

//   // Update URL when a tab is clicked
//   const handleTabChange = (newTab) => {
//     setActiveTab(newTab);
//     router.push(`/settings/${newTab}`); // Update the URL dynamically
//   };

//   // Sync activeTab with URL changes
//   useEffect(() => {
//     if (tab) setActiveTab(tab);
//   }, [tab]);

//   return (
//     <div className="ai-settings">
//       <div className="ai-settings-container">
//         {/* Dashboard Navigation */}
//         <div className="ai-settings-dashboard">
//           {['general', 'profile', 'data', 'billing','activity','updates'].map((item) => (
//             <div
//               key={item}
//               className={`ai-settings-dashboard-${item} ${
//                 activeTab === item ? 'active' : ''
//               }`}
//               onClick={() => handleTabChange(item)}
//             >
//               {item.charAt(0).toUpperCase() + item.slice(1)} {/* Capitalize */}
//             </div>
//           ))}
//         </div>

//         {/* Display Content Based on Active Tab */}
//         <div className="ai-settings-contents">
//           {activeTab === 'general' && <General />}
//           {activeTab === 'profile' && <Profile />}
//           {activeTab === 'data' && <Data />}
//           {activeTab === 'billing' && <Billing />}
//           {activeTab === 'activity' && <Activity />}
//           {activeTab === 'updates' && <Updates />}

//           {/* Add more tabs as needed */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AiSettings;
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '@styles/ai/settings/Settings.css';
import General from '@components/ai/settings/general/General';
import Billing from '@components/ai/settings/billing/Billing';
import Profile from '@components/ai/settings/profile/Profile';
import Data from '@components/ai/settings/data/Data';
import Activity from '@components/ai/settings/activity/Activity';
import Updates from '@components/ai/settings/updates/Updates';

const Settings = () => {
  const router = useRouter();
  const { tab } = useParams(); // Capture the 'tab' from the URL
  const [activeTab, setActiveTab] = useState(tab || 'general'); // Default to 'general' tab

  // Update URL when a tab is clicked
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    router.push(`/settings/${newTab}`); // Update the URL dynamically
  };

  // Sync activeTab with URL changes
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab('general'); // Fallback to 'general' if no tab is present in the URL
    }
  }, [tab]);

  return (
    <div className="ai-settings">
      <div className="ai-settings-container">
        {/* Dashboard Navigation */}
        <div className="ai-settings-dashboard">
          {[
            // 'general', 
          'profile', 
          // 'data', 
          // 'billing',
          //  'activity', 'updates'
          ].map((item) => (
            <div
              key={item}
              className={`ai-settings-dashboard-${item} ${
                activeTab === item ? 'active' : ''
              }`}
              onClick={() => handleTabChange(item)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)} {/* Capitalize */}
            </div>
          ))}
        </div>

        {/* Display Content Based on Active Tab */}
        <div className="ai-settings-contents">
          {/* {activeTab === 'general' && <General />} */}
          {activeTab === 'profile' && <Profile />}
          {/* {activeTab === 'data' && <Data />}
          {activeTab === 'billing' && <Billing />} */}
          {/* {activeTab === 'activity' && <Activity />}
          {activeTab === 'updates' && <Updates />} */}

          {/* Add more tabs as needed */}
        </div>
      </div>
    </div>
  );
};

export default Settings;
