'use client';
import '@styles/ai/BetaAi.css'
import Image from 'next/image';
import refresh2 from '@public/Images/ai/refresh-dash.svg';
const DashboardRight = ({
    formattedTitle,
    setFormattedTitle,
    metaDescription,
    setMetaDescription,
    formattedContent,
    setFormattedContent,
    handleRestructureClick,
    category,
    setCategory,
    categoryBadges,
    keyword,
    setKeyword,
    keywordBadges,
    handleCategoryChange,
    handleCategoryKeyDown,
    handleKeywordChange,
    handleKeywordKeyDown,
    isDashboardActive,
    dashboardRef
  }) => {
      function stripHtmlTags(html) {
          const div = document.createElement('div');
          div.innerHTML = html;
          return div.textContent || div.innerText || '';
        }
  return (
    <div className={`ai-dashboard ${isDashboardActive ? "active" : ""}`} ref={dashboardRef}>
    <div className="ai-dashboard-container">
      <h1 className='ai-chat-heading'>AI Content Generation</h1>
      <div className="ai-dashboard-contents">
      <div className="ai-dashboard-title">
          <label htmlFor="ai-title" className='dashboard-label'>Title</label>  
          <div className='ai-dashboard-title-input'>
            <input type="text" id="ai-title" value={stripHtmlTags(formattedTitle)} readOnly />
            <div className="refresh-title-button" onClick={() => handleRestructureClick('title')}>
              <Image src={refresh2} height={12} alt='refresh'/>
            </div>
          </div>
        </div>
        <div className="ai-dashboard-description">
          <label htmlFor="ai-description" className='dashboard-label'>Meta description</label>
          <div className='ai-dashboard-title-input'>
            <input type="text" id="ai-description"  value={stripHtmlTags(metaDescription)} readOnly/>
            <div className="refresh-description-button" onClick={() => handleRestructureClick('description')}>
              <Image src={refresh2} height={12} alt='refresh'/>
            </div>
          </div>
        </div>
        <div className="ai-dashboard-category">
          <label htmlFor="category" className='dashboard-label'>Category</label>
          <div className='ai-dashboard-title-input'>
            <input type="text" id="category" value={category} onChange={handleCategoryChange} onKeyDown={handleCategoryKeyDown}/>
          </div>
          {categoryBadges &&
          <div className="badges-container">
            {categoryBadges.map((badge, index) => (
              <span key={index} className="badge"> {badge} </span>
            ))}
          </div>}
        </div>

        <div className="ai-dashboard-category">
          <label htmlFor="keyword" className='dashboard-label'>Keyword</label>
          <div className='ai-dashboard-title-input'>
            <input type="text" id="keyword" value={keyword} onChange={handleKeywordChange} onKeyDown={handleKeywordKeyDown}/>
          </div>
          {keywordBadges && <div className="badges-container">
            {keywordBadges.map((badge, index) => (
              <span key={index} className="badge"> {badge} </span>
            ))}
          </div>}
        </div>

      </div>
    </div>
  </div>
  )
}

export default DashboardRight