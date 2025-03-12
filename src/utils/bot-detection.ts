
/**
 * Ultra-permissive bot detection utility to ensure maximum indexability
 */
export const isSearchEngine = () => {
  if (process.env.NODE_ENV === 'development' && localStorage.getItem('simulateBot') === 'true') {
    return true;
  }

  try {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Consider it a bot if no user agent
    if (!userAgent) {
      return true;
    }

    // EXTREMELY permissive bot detection
    const botPatterns = [
      'bot', 'crawler', 'spider', 'google', 'bing', 'baidu', 'yahoo', 
      'yandex', 'duckduck', 'search', 'archive', 'preview', 'fetch', 
      'monitor', 'check', 'validator', 'lighthouse', 'snippet', 'http',
      'feed', 'get', 'scrape', 'render', 'prerender', 'html', 'scan',
      'azure', 'cloud', 'app', 'agent', 'api', 'service', 'function',
      'lambda', 'aws', 'gcp', 'test', 'headless'
    ];

    // Check for ANY bot-like pattern
    if (botPatterns.some(pattern => userAgent.includes(pattern))) {
      return true;
    }

    // Consider headless browsers as bots
    if (userAgent.includes('headless') || 
        userAgent.includes('phantom') || 
        userAgent.includes('puppeteer')) {
      return true;
    }

    // Check for automated browsing indicators
    if (navigator.webdriver || 
        !navigator.cookieEnabled ||
        document.documentElement.hasAttribute('webdriver')) {
      return true;
    }

    // Check for empty or suspicious navigator properties
    if (!navigator.plugins || 
        navigator.plugins.length === 0 || 
        !navigator.languages ||
        navigator.languages.length === 0) {
      return true;
    }

    // ULTRA PERMISSIVE: Non-peak hours treated as bot traffic
    const hour = new Date().getHours();
    if (hour < 7 || hour > 23) {
      return true;
    }

    // Weekend boost: treat more traffic as bots
    const day = new Date().getDay();
    if (day === 0 || day === 6) {
      return true;
    }

    // If from search engine referrer, treat as bot
    if (document.referrer && 
        (document.referrer.includes('google') || 
         document.referrer.includes('bing') || 
         document.referrer.includes('yandex'))) {
      return true;
    }

    return false;
  } catch (e) {
    // If ANY error in detection, assume it's a bot
    console.error('Error in bot detection, treating as bot:', e);
    return true;
  }
};

