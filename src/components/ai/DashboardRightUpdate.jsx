import React from 'react'
import Link from 'next/link'
import '@styles/ai/KeywordAi.css';
const DashboardRightUpdate = () => {
  const blogs = [
    {id:"1",title:"Exploring the Transformative Power of Artificial Intelligence",desc:"Artificial Intelligence (AI) is a rapidly evolving technology that has the potential to transform our world in many ways",url:"https://blog.prfec.ai/exploring-the-transformative-power-of-artificial-intelligence"},
    {id:"2",title:"Your Guide for Technical SEO: Make Your Website Shine for Search Engines",desc:"In the ever-evolving world of digital marketing, Search Engine Optimization is a cornerstone for driving organic traffic to websites.",url:"https://blog.prfec.ai/your-guide-for-technical-seo-make-your-website-shine-for-search-engines"},
    {id:"3",title:"How to Make a Meta Ad: A Step-by-Step Guide",desc:"Meta, formerly known as Facebook, offers one of the most powerful advertising platforms in the world, allowing businesses to reach",url:"https://blog.prfec.ai/how-to-make-a-meta-ad-a-step-by-step-guide"},
    // {id:"4",title:"How to Leverage Customer Segmentation for Better Targeting",desc:"In today’s competitive marketplace, one-size-fits-all marketing no longer cuts it. ",url:"https://blog.prfec.ai/how-to-leverage-customer-segmentation-for-better-targeting"},
    // {id:"5",title:"Optimize Your Website: Let’s explore on-page and off-page SEO together",desc:"Search Engine Optimization (SEO) is essential for any website looking to rank on search engines, drive organic traffic, and build",url:"https://blog.prfec.ai/optimize-your-website-lets-explore-on-page-and-off-page-seo-together"},

  ]
  return (
       <div className='ai-right-dashboard'>
       <div className="ai-right-dashboard-container">
         <h2 className='ai-right-dashboard-heading'>Updates</h2>
         <div className='ai-right-dashboard-blogs'>
          {blogs.map((item,index)=>(
          <Link href={item.url} className='ai-right-dashboard-blogs-content' key={index}>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
          </Link>
        ))}
         </div>
       </div>
     </div> 
  )
}

export default DashboardRightUpdate