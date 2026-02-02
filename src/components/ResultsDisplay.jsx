import React, { useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import ChipContainer from './ChipContainer';

function ResultsDisplay({ chatHistory, loading, onChipClick }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  return (
    <>
      {chatHistory.map(message => (
        <div key={message.id} className="message-wrapper">
          {message.type === 'welcome' && (
            <div className="welcome-message">
              <h2>{message.content}</h2>
              <p> </p>
            </div>
          )}
          {message.type === 'user' && (
            <div className="user-message-bubble">
              {message.content}
            </div>
          )}
          {message.type === 'bot' && (
            <div className="bot-response-container">
              {message.content.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {message.type === 'bot_text' && (
            <div className="bot-message-bubble">
              {message.content}
            </div>
          )}
          {message.type === 'bot_chips' && (
            <div>
              <div className="bot-message-bubble">
                {message.content}
              </div>
              <ChipContainer chips={message.chips} onChipClick={onChipClick} />
            </div>
          )}
        </div>
      ))}
      {loading && (
        <div className="result-card-wrapper">
           <div className="card-icon"></div>
           <div className="spinner-border" role="status" style={{color: 'var(--primary-color)'}}>
             <span className="visually-hidden">Loading...</span>
           </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </>
  );
}

export default ResultsDisplay;
