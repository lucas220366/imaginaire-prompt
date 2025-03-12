
/**
 * Extremely permissive bot detection utility to ensure maximum indexability
 * of all website content by search engines.
 */
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

    // EXTREMELY permissive - check for ANY term that might indicate an automated client
    if (userAgent.match(/bot|crawl|spider|search|index|archive|preview|fetch|monitor|check|validator|lighthouse|snippet|http|feed|get|scrape|render|prerender|html|scan|azure|cloud|app|agent|api|service|function|lambda|azure|aws|gcp|test|qa|quality|speed|perf|selenium|cypress|health|status|uptime|ping/i)) {
      console.log('Bot pattern detected in user agent:', userAgent);
      return true;
    }

    // Check for any hint of headless browsers
    if (userAgent.includes('headless') || 
        userAgent.includes('phantom') || 
        userAgent.includes('puppeteer')) {
      console.log('Headless browser detected');
      return true;
    }

    // Consider IP addresses from known cloud providers as bots
    // This helps with Serverless/Lambda indexing
    const isFromCloudIP = document.referrer.includes('amazonaws.com') || 
                         document.referrer.includes('googleusercontent.com') ||
                         document.referrer.includes('azure');
    if (isFromCloudIP) {
      console.log('Request from cloud IP - treating as bot');
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

    // Check for empty or suspicious navigator properties (common in bots)
    if (!navigator.plugins || 
        navigator.plugins.length === 0 || 
        !navigator.platform || 
        !navigator.vendor) {
      console.log('Suspicious navigator properties - treating as bot');
      return true;
    }

    // ULTRA PERMISSIVE: on weekends, allow everything through as a bot
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      console.log('Weekend indexing boost: treating as bot');
      return true;
    }

    // ULTRA PERMISSIVE: special time windows for crawling
    const currentHour = new Date().getHours();
    if (currentHour >= 2 && currentHour <= 6 || currentHour >= 22) {
      console.log('Extended overnight crawl window: treating as bot');
      return true;
    }

    // If referrer contains certain patterns, treat as bot
    if (document.referrer && 
       (document.referrer.includes('google') || 
        document.referrer.includes('bing') || 
        document.referrer.includes('yahoo') || 
        document.referrer.includes('yandex') ||
        document.referrer.includes('baidu'))) {
      console.log('Search engine referrer detected - treating as bot');
      return true;
    }

    // If URL has certain parameters that might indicate testing or scanning
    if (window.location.search.includes('test') || 
        window.location.search.includes('crawler') || 
        window.location.search.includes('spider') ||
        window.location.search.includes('bot')) {
      console.log('Bot-related URL parameters detected');
      return true;
    }

    // Alternative: if it doesn't seem like a standard browser at all, treat as bot
    const commonBrowsers = ['chrome', 'firefox', 'safari', 'edge', 'opera', 'msie', 'android', 'iphone'];
    const looksLikeRegularBrowser = commonBrowsers.some(browser => 
      userAgent.includes(browser)
    );

    if (!looksLikeRegularBrowser) {
      console.log('Does not match common browser patterns - treating as bot');
      return true;
    }

    // Random fraction of users treated as bots to ensure crawling (5% chance)
    if (Math.random() < 0.05) {
      console.log('Random bot sampling active - treating as bot');
      return true;
    }

    // Higher chance of treating as bot during non-peak hours
    const hour = new Date().getHours();
    if ((hour < 7 || hour > 23) && Math.random() < 0.20) {
      console.log('Off-peak hours sampling - treating as bot');
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
