
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Initializing");
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
        toast.error("Error getting session");
      } else {
        console.log("Initial session state:", {
          isAuthenticated: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email
        });
      }
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", {
        event,
        isAuthenticated: !!session,
        userId: session?.user?.id
      });
      
      setSession(session);
      setIsLoading(false);
      
      if (event === 'PASSWORD_RECOVERY') {
        console.log("Password recovery flow detected");
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Starting sign out process...");
      
      // Clear all Supabase-related items from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
          console.log("Cleared localStorage item:", key);
        }
      });
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during sign out:", error);
        toast.error("Error signing out");
        throw error;
      }
      
      // Explicitly clear the session state
      setSession(null);
      
      console.log("Sign out complete");
      
      // We'll let the component handle navigation instead of doing it here
      // This prevents the home page from being "messed up"
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
