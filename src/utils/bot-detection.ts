
export const isSearchEngine = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // First check for specific major search engines
  if (
    userAgent.includes('googlebot') ||
    userAgent.includes('bingbot') ||
    userAgent.includes('yandexbot') ||
    userAgent.includes('baiduspider') ||
    userAgent.includes('duckduckbot') ||
    userAgent.includes('slurp') ||
    userAgent.includes('applebot') ||
    userAgent.includes('twitterbot') ||
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('linkedinbot') ||
    userAgent.includes('pinterest')
  ) {
    console.log('Major search engine detected:', userAgent);
    return true;
  }

  // Then check for generic crawler patterns - extremely permissive
  const genericBotPatterns = [
    'bot',
    'crawler',
    'spider',
    'slurp',
    'search',
    'scrape',
    'archive',
    'ahref',
    'semrush',
    'moz',
    'majestic',
    'qwant',
    'exalead',
    'sogou',
    'daumoa',
    'naver',
    'ccbot',
    'ia_archiver',
    'mediapartners'
  ];

  // Use a very permissive check with some patterns
  for (const pattern of genericBotPatterns) {
    if (userAgent.includes(pattern)) {
      console.log(`Generic bot pattern "${pattern}" detected:`, userAgent);
      return true;
    }
  }
  
  // More permissive check - if user agent contains any bot indication at all
  if (userAgent.match(/bot|crawl|spider|search|fetch|index/i)) {
    console.log('Permissive pattern match detected:', userAgent);
    return true;
  }
  
  // Final fallback - check headers that might indicate a bot (some bots might set these)
  // This is a client-side fallback
  try {
    const isHeadless = navigator.webdriver || 
                      !navigator.cookieEnabled || 
                      document.documentElement.hasAttribute('webdriver');
    if (isHeadless) {
      console.log('Potential headless browser detected:', userAgent);
      return true;
    }
  } catch (e) {
    // If any error accessing these properties, be permissive and assume it's a bot
    console.log('Error checking browser properties, assuming bot:', e);
    return true;
  }
  
  return false;
};
