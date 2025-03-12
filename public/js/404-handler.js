
// Ultra-permissive bot detection - extremely thorough
function isBot() {
  try {
    // If running on the server or in SSR, treat as bot
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      console.log("404.html - Server side rendering detected");
      return true;
    }
    
    var userAgent = navigator.userAgent.toLowerCase() || '';
    
    // Create a comprehensive list of known bots and crawlers
    var botPatterns = [
      // Major search engines
      'googlebot', 'google', 'bingbot', 'bing', 'yandexbot', 'yandex', 'baiduspider', 'baidu', 'duckduckbot', 'duckduck',
      'yahoo', 'ask', 'aol', 'sogou', 'exabot', 'daumoa', 'naver',
      
      // Social media crawlers
      'facebook', 'twitter', 'linkedin', 'pinterest', 'slack', 'discord', 'whatsapp', 'telegram',
      
      // SEO and analytics tools
      'semrush', 'ahrefs', 'moz', 'majestic', 'sistrix', 'searchmetrics', 'screaming', 'alexa',
      
      // Generic bot indicators
      'bot', 'crawler', 'spider', 'search', 'index', 'scrape', 'monitor', 'archive', 'ia_archiver', 'huawei',
      'slurp', 'feed', 'fetch', 'scan', 'check', 'request', 'chrome-lighthouse', 'headless',
      
      // Technical indicators
      'http', 'client', 'python', 'java', 'curl', 'wget', 'mozilla', 'browser', 'phantomjs', 'webdriver'
    ];
    
    // Check for any match in the user agent
    for (var i = 0; i < botPatterns.length; i++) {
      if (userAgent.indexOf(botPatterns[i]) !== -1) {
        console.log("404.html - Bot detected via keyword:", botPatterns[i]);
        return true;
      }
    }
    
    // Additional checks for bot characteristics
    if (!navigator.languages || navigator.languages.length === 0) {
      console.log("404.html - Bot detected via missing languages");
      return true;
    }
    
    // Check for webdriver attribute (common in headless browsers)
    if (navigator.webdriver) {
      console.log("404.html - Bot detected via webdriver attribute");
      return true;
    }
    
    // More permissive - high chance of being a bot if HTTP headers are unusual
    if (navigator.platform === undefined || navigator.platform === '') {
      console.log("404.html - Bot detected via missing platform");
      return true;
    }
    
    // Treat all new browsers/visitors as potential bots
    var visitCount = sessionStorage.getItem('visitCount') || 0;
    if (visitCount < 1) {
      console.log("404.html - New visitor treated as bot for indexing");
      sessionStorage.setItem('visitCount', parseInt(visitCount) + 1);
      return true;
    }
    
    // Check referrer - treat as bot if coming from search engine
    if (document.referrer && (
        document.referrer.includes('google') || 
        document.referrer.includes('bing') || 
        document.referrer.includes('yahoo') ||
        document.referrer.includes('baidu')
    )) {
      console.log("404.html - Bot detected via search engine referrer");
      return true;
    }
    
    // Random sampling - treat some percentage as bots
    if (Math.random() < 0.3) { // 30% chance
      console.log("404.html - Random sampling: treating as bot");
      return true;
    }
    
    console.log("404.html - No bot detected in user agent:", userAgent);
    return false;
  } catch (e) {
    // If there's any error in detection, assume it's a bot to be safe
    console.log("404.html - Error in bot detection, assuming bot:", e);
    return true;
  }
}

// Enhanced logging with HTTP status code
function logPageAccess() {
  console.log("404.html - Page Access (HTTP Status: 404):", {
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    referrer: document.referrer || "none",
    language: navigator.language || "unknown",
    languages: navigator.languages || [],
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    platform: navigator.platform || "unknown",
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    statusCode: 404
  });
}

// Redirect handling
function handleRedirect() {
  var isSearchEngine = isBot();
  
  if (!isSearchEngine) {
    console.log("404.html - Human user detected, will redirect after delay");
    // Delay redirect for actual users
    setTimeout(function() {
      var pathSegmentsToKeep = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    }, 3000); // 3 second delay
  } else {
    console.log("404.html - Search engine detected, showing full content");
    // Update document title to reflect 404 status
    document.title = "404 Page Not Found - Free AI Image Generator - vraho.com";
    
    // Show the content intended for search engines
    document.getElementById('content-for-search-engines').style.display = "block";
  }
}

// Initialize on page load
window.onload = function() {
  logPageAccess();
  handleRedirect();
};
