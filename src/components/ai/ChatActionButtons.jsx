// components/ChatActionButtons.js
import React from 'react';
import Image from 'next/image';
import copy from '@public/Images/ai/copy.svg';
import refresh from '@public/Images/ai/refresh.svg';
import filter from '@public/Images/ai/filter.svg';

import download from '@public/Images/ai/download.svg';

export default function ChatActionButtons({
  isCopied, 
  setIsCopied, 
  handleCopyChat,
  copyHover, 
  setCopyHover, 
  handleRefreshContent, 
  formattedContent,
  formattedTitle,
  handleFilterButtonClick,
  handleDownloadChat,
  setIsDashboardActive
}) {
  return (

    <>
    <div className="chat-action-buttons">
      <div className='chat-action-buttons-left'>
          <div className="filter-chat-button" onClick={handleFilterButtonClick}>
            <Image src={filter} height={19} alt='filter'/>
          </div>
          {/* <div>1/3 left</div> */}
      </div>
      <div className='chat-action-buttons-right'>
          <div className="copy-chat-button" onClick={() => {setIsCopied(!isCopied); handleCopyChat()}} onMouseEnter={() => setCopyHover(true)} onMouseLeave={() => setCopyHover(false)}>
            <Image src={copy}  height={14}  alt='copy'/>
            <div className="chat-button-label">
              {isCopied && (
                <div className="chat-button-label-copied">Copied</div>
              )}
            </div>
          </div>
          <div className="download-chat-button">
            <Image src={download} height={14}    onClick={() => formattedTitle && handleDownloadChat()} alt='download'/>
          </div>
          <div className="refresh-chat-button" onClick={handleRefreshContent}>
            <Image src={refresh} height={13} alt='refresh'/>
          </div>
      </div>
    </div>
    {formattedContent && <div className="chat-action-buttons-mobile">
      <div className='chat-action-buttons-left'>
      {/* <div className="filter-chat-button" onClick={handleFilterButtonClick}>
            <Image src={filter} height={19} alt='download'/>
          </div> */}
      </div>
      <div className='chat-action-buttons-right'>
      <div className="copy-chat-button" onClick={() => {setIsCopied(!isCopied); handleCopyChat()}} onMouseEnter={() => setCopyHover(true)} onMouseLeave={() => setCopyHover(false)}>
      <Image src={copy}  height={14}  alt='copy'/>
            <div className="chat-button-label">
              {isCopied && (
                <div className="chat-button-label-copied">Copied</div>
              )}
            </div>
          </div>
          <div className="download-chat-button">
            <Image src={download} height={14}    onClick={() => formattedTitle && handleDownloadChat()} alt='download'/>
          </div>
          <div className="refresh-chat-button" onClick={handleRefreshContent}>
            <Image src={refresh} height={13} alt='refresh'/>
          </div>
      </div>
    </div>}
    </>
  );
}
