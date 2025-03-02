
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthForm } from '@/components/auth/AuthForm';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isReset, setIsReset] = useState(false);
  const navigate = useNavigate();

  
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-white to-blue-50">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          {isReset ? (
            <PasswordResetForm onCancel={() => setIsReset(false)} />
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <div className="space-y-4 py-4">
                  <AuthForm 
                    mode="login" 
                    onResetPassword={() => setIsReset(true)}
                    onSuccess={() => navigate('/generator')} 
                  />
                </div>
              </TabsContent>
              <TabsContent value="register">
                <div className="space-y-4 py-4">
                  <AuthForm 
                    mode="register" 
                    onSuccess={() => navigate('/generator')} 
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
