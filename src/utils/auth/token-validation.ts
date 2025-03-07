
import { supabase } from "@/integrations/supabase/client";

export interface TokenValidationResult {
  isValid: boolean;
  userEmail: string | null;
  error: string | null;
  tokenInfo: any;
}

export interface TokenParams {
  accessToken?: string | null;
  token?: string | null;
  type?: string | null;
  hash?: string;
  search?: string;
  fullUrl?: string;
}

/**
 * Validate a password reset token
 */
export const validateResetToken = async (resetParams: Record<string, string | null> = {}): Promise<TokenValidationResult> => {
  try {
    // Get parameters from both props and URL
    const fragment = window.location.hash;
    const search = window.location.search;
    const fullUrl = window.location.href;
    
    // Parse parameters
    const fragmentParams = new URLSearchParams(fragment.substring(1));
    const queryParams = new URLSearchParams(search);
    
    // Extract tokens and types from different sources
    const accessToken = resetParams?.accessToken || fragmentParams.get('access_token');
    const token = resetParams?.token || fragmentParams.get('token') || queryParams.get('token');
    const type = resetParams?.type || fragmentParams.get('type') || queryParams.get('type');
    
    // Use full URL to extract token if other methods failed
    let extractedToken = null;
    
    // Try to extract token from the URL using regex for various formats
    if (!token && fullUrl) {
      const tokenMatches = [
        fullUrl.match(/[?&#]token=([^&#]*)/),              // Standard token format
        fullUrl.match(/[?&#]access_token=([^&#]*)/),      // OAuth access token format
        fullUrl.match(/\/supabase\/auth\/callback\?(.*)/) // Supabase callback format
      ];
      
      for (const match of tokenMatches) {
        if (match && match[1]) {
          extractedToken = match[1];
          break;
        }
      }
    }
    
    // Extract token from hash fragment 
    if (!token && !extractedToken && fragment) {
      try {
        // Sometimes token may be in a different format in the hash
        const hashData = JSON.parse(decodeURIComponent(fragment.substring(1)));
        if (hashData.token) {
          extractedToken = hashData.token;
        } else if (hashData.access_token) {
          extractedToken = hashData.access_token;
        }
      } catch (e) {
        // Ignore parsing errors, we'll try other methods
      }
    }
    
    const finalToken = token || extractedToken;
    
    // Check if we're in a recovery flow through various means
    const isRecoveryFlow = 
      (type === 'recovery') || 
      (fragment.includes('type=recovery')) || 
      (search.includes('type=recovery')) || 
      (fullUrl.includes('type=recovery')) ||
      (resetParams?.type === 'recovery') ||
      (fullUrl.includes('/auth/reset-password'));
    
    // Store token info for debugging
    const tokenInfo = {
      currentUrl: fullUrl,
      urlHash: fragment,
      urlSearch: search,
      accessToken: accessToken ? "present" : null,
      token: finalToken ? "present" : null,
      extractedToken: extractedToken ? "extracted from URL" : null,
      type: type,
      isHashRecovery: fragment.includes('type=recovery'),
      isQueryRecovery: search.includes('type=recovery'),
      isFullUrlRecovery: fullUrl.includes('type=recovery'),
      isRecoveryFlow,
      resetParams: resetParams,
      supabaseConfig: {
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    };
    
    console.log("Password reset validation attempt:", tokenInfo);
    
    // First, check if user is already authenticated
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();
    
    console.log("Current auth state:", {
      hasSession: !!session,
      hasUser: !!user,
      userEmail: user?.email
    });
    
    if (user && user.email) {
      // User is already authenticated, good to proceed
      console.log("User already authenticated:", user.email);
      return {
        isValid: true,
        userEmail: user.email,
        error: null,
        tokenInfo
      };
    }
    
    // Try with access token if available
    if (accessToken) {
      try {
        console.log("Trying to get user with access token");
        const { data, error } = await supabase.auth.getUser(accessToken);
        
        if (!error && data && data.user) {
          console.log("Valid user from access token:", data.user.email);
          return {
            isValid: true,
            userEmail: data.user.email,
            error: null,
            tokenInfo
          };
        } else {
          console.error("Error getting user with access token:", error);
        }
      } catch (accessError: any) {
        console.error("Error processing access token:", accessError);
      }
    }
    
    // Try with recovery token if available
    if (finalToken && (isRecoveryFlow || !type)) {
      try {
        console.log("Attempting to verify recovery token:", finalToken);
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: finalToken,
          type: 'recovery'
        });
        
        console.log("Token verification result:", { data, error });
        
        if (error) {
          console.error("Token verification failed:", error);
          return {
            isValid: false,
            userEmail: null,
            error: `Token verification failed: ${error.message}`,
            tokenInfo
          };
        }
        
        // Get user after verification
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user?.email) {
          console.log("Valid user from token verification:", userData.user.email);
          return {
            isValid: true,
            userEmail: userData.user.email,
            error: null,
            tokenInfo
          };
        }
      } catch (verifyError: any) {
        console.error("Error during OTP verification:", verifyError);
        return {
          isValid: false,
          userEmail: null,
          error: `OTP verification error: ${verifyError.message || "Unknown error"}`,
          tokenInfo
        };
      }
    }
    
    // If we got here, no valid token or session was found
    console.error("No valid token or session found");
    
    // Set appropriate error message with detailed debugging info
    let errorMessage = "Invalid or expired reset link";
    if (!type && !finalToken && !accessToken) {
      errorMessage = "Missing password reset parameters. No token found in URL.";
    }
    
    return {
      isValid: false,
      userEmail: null,
      error: errorMessage,
      tokenInfo
    };
  } catch (error: any) {
    console.error("Token validation error:", error);
    return {
      isValid: false,
      userEmail: null,
      error: `Error validating reset link: ${error.message || "Unknown error"}`,
      tokenInfo: { error: error.message }
    };
  }
};
