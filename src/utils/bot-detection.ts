
/**
 * Ultra-permissive bot detection utility for maximum indexability
 * Heavily biased toward treating requests as bots to improve SEO
 */
export const isSearchEngine = () => {
  if (process.env.NODE_ENV === 'development' && localStorage.getItem('simulateBot') === 'true') {
    return true;
  }

  try {
    // Force treatment as bot for server-side rendering or static generation environments
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return true;
    }

    const userAgent = (navigator.userAgent || '').toLowerCase();
    
    // Consider it a bot if no user agent or empty string
    if (!userAgent || userAgent.length === 0) {
      return true;
    }

    // EXTREMELY comprehensive bot detection patterns
    const botPatterns = [
      // Search engines
      'bot', 'crawler', 'spider', 'google', 'googlebot', 'bing', 'bingbot', 'baidu', 'baiduspider', 
      'yahoo', 'yandex', 'duckduck', 'duckduckbot', 'slurp', 'sogou', 'exabot', 'facebookexternalhit',
      
      // Tools and crawlers
      'search', 'archive', 'preview', 'fetch', 'monitor', 'check', 'validator', 'lighthouse', 
      'snippet', 'http', 'feed', 'get', 'scrape', 'render', 'prerender', 'html', 'scan',
      
      // Infrastructure identifiers
      'azure', 'cloud', 'app', 'agent', 'api', 'service', 'function', 'lambda', 'aws', 'gcp',
      'heroku', 'vercel', 'netlify', 'akamai', 'cloudfront', 'cdn', 'proxy', 'fastly',
      
      // Testing and headless browsers
      'test', 'headless', 'phantom', 'puppeteer', 'selenium', 'webdriver', 'cypress', 
      'playwright', 'chrome-lighthouse', 'wappalyzer', 'screaming', 'semrush', 'ahrefs',
      
      // Common request libraries
      'axios', 'request', 'curl', 'wget', 'python', 'java', 'http-client', 'okhttp',
      
      // SEO tools
      'ahrefsbot', 'mj12bot', 'dotbot', 'semrushbot', 'screaming frog', 'majestic', 
      'rogerbot', 'seznambot', 'petalbot', 'yoast', 'hubspot'
    ];

    // Check for ANY bot-like pattern in the user agent
    if (botPatterns.some(pattern => userAgent.includes(pattern))) {
      return true;
    }

    // Treat Lighthouse and other performance tools as bots
    if (window.performance && window.performance.timing) {
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

    // ULTRA PERMISSIVE: Treat ALL non-peak hours as bot traffic (expanded window)
    const hour = new Date().getHours();
    if (hour < 8 || hour > 22) {
      return true;
    }

    // Weekend boost: treat ALL weekend traffic as bots
    const day = new Date().getDay();
    if (day === 0 || day === 6) {
      return true;
    }

    // If from search engine referrer, treat as bot
    if (document.referrer && 
        (document.referrer.includes('google') || 
         document.referrer.includes('bing') || 
         document.referrer.includes('yahoo') ||
         document.referrer.includes('baidu') ||
         document.referrer.includes('yandex'))) {
      return true;
    }

    // Prerender detection
    if (window.prerenderReady !== undefined) {
      return true;
    }

    // Consider new device/browser combinations as bots
    const screenInfo = `${window.screen.width}x${window.screen.height}`;
    if (screenInfo === '1x1' || screenInfo === '0x0') {
      return true;
    }

    // Low probability of being a real user, treat as bot
    const randomFactor = Math.random();
    if (randomFactor < 0.2) { // 20% of remaining traffic treated as bots
      return true;
    }

    return false;
  } catch (e) {
    // If ANY error in detection, assume it's a bot
    console.error('Error in bot detection, treating as bot:', e);
    return true;
  }
};
