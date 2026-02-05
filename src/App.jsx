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
        content: 'Бюджет',
        chips: ['до 5 000 ₽', '5 000 - 10 000 ₽', 'свыше 10 000 ₽']
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
          content: 'Сезон',
          chips: ['летние', 'зимние шипованные', 'зимние нешипованные', 'всесезонные']
        };
        setChatHistory(prev => [...prev, botMessage]);
        setDialogState('awaiting_season');
      } else if (dialogState === 'awaiting_season') {
        const finalParams = { ...searchParams, season: label };
        const resultsHeader = { id: `bot-header-${Date.now()}`, type: 'bot_text', content: `Вот результаты по вашему запросу: ${finalParams.model}`};
        
        const mockData = [
          { id: 1, name: 'Continental IceContact 2 SUV 275/45 R20 110T XL', price: '8 500 ₽', description: 'Премиальные зимние шины для кроссоверов, обеспечивающие исключительное сцепление на льду и снегу.', image: tireImage },
          { id: 2, name: 'Pirelli Scorpion Winter 235/55 R19 105H', price: '7 200 ₽', description: 'Высокопроизводительные зимние шины для внедорожников, гарантирующие отличную управляемость и безопасность.', image: tireImage },
          { id: 3, name: 'Nokian Hakkapeliitta R3 SUV 225/60 R18 104R', price: '9 800 ₽', description: 'Нешипованные зимние шины, разработанные для суровых северных условий, обеспечивают комфорт и стабильность.', image: tireImage },
          { id: 4, name: 'Pirelli Ice Zero 185/65 R15 92T XL', price: '5 100 ₽', description: 'Шипованные зимние шины с улучшенными показателями сцепления и торможения на обледенелых дорогах.', image: tireImage },
          { id: 5, name: 'Ikon Tyres Nordman RS2 SUV 225/65 R17 106R XL', price: '6 579 ₽', description: 'Надежные зимние шины для SUV, предлагающие оптимальный баланс сцепления и долговечности в различных условиях.', image: tireImage },
          // { id: 6, name: 'Hankook W429A (Winter i*Pike X) 235/50 R19 103T XL', price: '7 898 ₽', description: 'Зимние шипованные шины с направленным рисунком протектора для отличной проходимости по снегу и льду.', image: tireImage },
          // { id: 7, name: 'Sailun Ice Blazer Arctic 225/50 R17 98H XL', price: '9 598 ₽', description: 'Экономичные зимние шины с хорошими характеристиками на снегу и мокрой дороге, подходят для городской езды.', image: tireImage },
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
  const placeholder = 'Введите модель автомобиля (Lada Vesta)';
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
