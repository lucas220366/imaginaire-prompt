
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
    if (!token && fullUrl) {
      // Try to extract token from the URL using regex
      const tokenMatch = fullUrl.match(/[?&#]token=([^&#]*)/);
      if (tokenMatch && tokenMatch[1]) {
        extractedToken = tokenMatch[1];
      }
    }
    
    const finalToken = token || extractedToken;
    
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
    if (finalToken && (type === 'recovery' || !type)) {
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
