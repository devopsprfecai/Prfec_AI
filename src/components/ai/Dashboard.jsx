'use client';
import '@styles/ai/BetaAi.css';
import Link from 'next/link';

const AiDashboard = ({currentPath}) => {
  return (
    <div className='ai-left-dashboard'>
      <div className='ai-left-dashboard-container'>
        <h2>Tools</h2>
        <Link 
          href='/' 
          className={`ai-left-dashboard-contents ${currentPath === '/' ? 'active' : ''}`}
        >
          Content Generation
        </Link>
        <Link 
          href='/keyword' 
          className={`ai-left-dashboard-contents ${currentPath === '/keyword' ? 'active' : ''}`}
        >
          Keyword Research
        </Link>
        <Link 
          href='/competitor' 
          className={`ai-left-dashboard-contents ${currentPath === '/competitor' ? 'active' : ''}`}
        >
          Competitor Analysis
        </Link>
      </div>
    </div>
  );
};

export default AiDashboard;
