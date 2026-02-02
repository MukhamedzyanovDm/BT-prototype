import { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ResultsDisplay from './components/ResultsDisplay';
import tireImage from '/933-continental-icecontact-2-suv_zoom_1701698138.jpg';

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogState, setDialogState] = useState('awaiting_model'); // awaiting_model, awaiting_budget, awaiting_season
  const [searchParams, setSearchParams] = useState({ model: '', budget: '', season: '' });
  
  const isInitialState = () => chatHistory.length === 0 || (chatHistory.length === 1 && chatHistory[0].type === 'welcome');

  useEffect(() => {
    setChatHistory([{ id: 'welcome-001', type: 'welcome', content: 'Ассистент по подбору шин и дисков' }]);
  }, []);

  const handleSearch = (query) => {
    if (dialogState !== 'awaiting_model') return; // Only allow text search for the first step

    const userMessage = { id: `user-${Date.now()}`, type: 'user', content: query };
    const currentHistory = isInitialState() ? [userMessage] : [...chatHistory, userMessage];
    setChatHistory(currentHistory);
    setLoading(true);

    setTimeout(() => {
      setSearchParams({ ...searchParams, model: query });
      const botMessage = { 
        id: `bot-q1-${Date.now()}`, 
        type: 'bot_chips', 
        content: 'На какой бюджет вы рассчитываете?',
        chips: ['до 5 000р', '5 000 - 10 000р', 'свыше 10 000р']
      };
      setChatHistory(prev => [...prev, botMessage]);
      setDialogState('awaiting_budget');
      setLoading(false);
    }, 1000);
  };

  const handleChipClick = (label) => {
    const userMessage = { id: `user-${Date.now()}`, type: 'user', content: label };
    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);

    setTimeout(() => {
      if (dialogState === 'awaiting_budget') {
        setSearchParams({ ...searchParams, budget: label });
        const botMessage = { 
          id: `bot-q2-${Date.now()}`, 
          type: 'bot_chips', 
          content: 'Вас интересуют зимние или летние шины?',
          chips: ['летние', 'зимние шипованные', 'зимние нешипованные', 'всесезонные']
        };
        setChatHistory(prev => [...prev, botMessage]);
        setDialogState('awaiting_season');
      } else if (dialogState === 'awaiting_season') {
        const finalParams = { ...searchParams, season: label };
        const resultsHeader = { id: `bot-header-${Date.now()}`, type: 'bot_text', content: `Вот результаты по вашему запросу: ${finalParams.model}`};
        
        const mockData = [
          { id: 1, name: 'Continental IceContact 2 SUV 275/45 R20 110T XL', price: '8500 руб.', description: 'Премиальные зимние шины для максимального сцепления на льду и снегу.', image: tireImage },
          { id: 2, name: 'Pirelli Scorpion Winter 235/55 R19 105H', price: '7200 руб.', description: 'Сбалансированные зимние шины, обеспечивают отличную управляемость.', image: tireImage },
          { id: 3, name: 'Nokian Hakkapeliitta R3 SUV 225/60 R18 104R', price: '9800 руб.', description: 'Высокотехнологичные шины для суровых зимних условий. Нешипованные.', image: tireImage },
          { id: 4, name: 'Kama Alga 215/65 R17 99T', price: '4100 руб.', description: 'Надежный и доступный вариант для зимней эксплуатации в городе.', image: tireImage },
        ];

        const results = { id: `bot-results-${Date.now()}`, type: 'bot', content: mockData };
        setChatHistory(prev => [...prev, resultsHeader, results]);

        // Reset for next search
        setDialogState('awaiting_model');
        setSearchParams({ model: '', budget: '', season: '' });
      }
      setLoading(false);
    }, 1000);
  };

  const showSearchBar = dialogState === 'awaiting_model';
  const placeholder = 'Введите модель авто (Lada Vesta)';
  const currentIsInitialState = isInitialState();
  
  return (
    <div className="app-container">
      <main className="main-content">
        {currentIsInitialState ? (
          <div className="initial-view-container">
            <ResultsDisplay chatHistory={chatHistory} loading={loading} onChipClick={handleChipClick} />
            {showSearchBar && <SearchBar onSearch={handleSearch} placeholder={placeholder} />}
          </div>
        ) : (
          <ResultsDisplay chatHistory={chatHistory} loading={loading} onChipClick={handleChipClick} />
        )}
      </main>
      {!currentIsInitialState && showSearchBar && (
        <footer className="search-container">
          <SearchBar onSearch={handleSearch} placeholder={placeholder} />
        </footer>
      )}
    </div>
  );
}

export default App;
