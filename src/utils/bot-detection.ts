
export const isSearchEngine = () => {
  // For development and testing, check if we want to simulate a bot
  if (process.env.NODE_ENV === 'development' && localStorage.getItem('simulateBot') === 'true') {
    console.log('Bot simulation mode active');
    return true;
  }

  try {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // If no user agent at all, consider it a bot to be safe
    if (!userAgent) {
      console.log('No user agent - treating as bot');
      return true;
    }

    // Check headers that might indicate automated browsing
    const isAutomated = navigator.webdriver || 
                       !navigator.cookieEnabled ||
                       document.documentElement.hasAttribute('webdriver') ||
                       !navigator.languages ||
                       navigator.languages.length === 0;

    if (isAutomated) {
      console.log('Automated browser detected:', { userAgent, isAutomated });
      return true;
    }

    // Very permissive bot check - if it contains ANY common bot-related term
    if (userAgent.match(/bot|crawl|spider|search|index|archive|preview|fetch|monitor|check|validator|chrome-lighthouse/i)) {
      console.log('Bot pattern detected in user agent:', userAgent);
      return true;
    }

    // Check for empty or suspicious navigator properties (common in bots)
    if (!navigator.plugins || 
        navigator.plugins.length === 0 || 
        !navigator.platform || 
        !navigator.vendor) {
      console.log('Suspicious navigator properties - treating as bot');
      return true;
    }

    // Alternative: if it doesn't seem like a standard browser at all, treat as bot
    const commonBrowsers = ['chrome', 'firefox', 'safari', 'edge', 'opera'];
    const looksLikeRegularBrowser = commonBrowsers.some(browser => 
      userAgent.includes(browser)
    );

    if (!looksLikeRegularBrowser) {
      console.log('Does not match common browser patterns - treating as bot');
      return true;
    }

    console.log('Not identified as bot:', { userAgent });
    return false;
  } catch (e) {
    // If ANY error occurs during detection, assume it's a bot to be safe
    console.log('Error in bot detection, treating as bot:', e);
    return true;
  }
};

