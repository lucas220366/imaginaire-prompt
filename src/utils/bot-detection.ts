
export const isSearchEngine = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // First check for specific major search engines
  if (
    userAgent.includes('googlebot') ||
    userAgent.includes('bingbot') ||
    userAgent.includes('yandexbot') ||
    userAgent.includes('baiduspider') ||
    userAgent.includes('duckduckbot')
  ) {
    console.log('Search engine detected:', userAgent);
    return true;
  }

  // Then check for generic crawler patterns
  const genericBotPatterns = [
    'bot',
    'crawler',
    'spider',
    'slurp',
    'search',
    'scrape',
    'archive'
  ];

  const isBot = genericBotPatterns.some(pattern => userAgent.includes(pattern));
  if (isBot) {
    console.log('Generic bot pattern detected:', userAgent);
  }
  
  return isBot;
};

