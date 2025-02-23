
import { useEffect } from 'react';
import { toast } from "sonner";

interface APIKeyValidatorProps {
  apiKey: string;
  onInvalidKey: () => void;
}

const APIKeyValidator = ({ apiKey, onInvalidKey }: APIKeyValidatorProps) => {
  useEffect(() => {
    const validateStoredApiKey = async () => {
      if (apiKey) {
        try {
          const ws = new WebSocket('wss://ws-api.runware.ai/v1');
          
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              ws.close();
              reject(new Error('Connection timeout'));
            }, 5000);

            ws.onopen = () => {
              ws.send(JSON.stringify([{
                taskType: "authentication",
                apiKey
              }]));
            };

            ws.onmessage = (event) => {
              const response = JSON.parse(event.data);
              if (response.error || response.errors) {
                reject(new Error('Invalid API key'));
              } else if (response.data?.[0]?.taskType === "authentication") {
                clearTimeout(timeout);
                resolve(true);
              }
            };

            ws.onerror = () => {
              clearTimeout(timeout);
              reject(new Error('Connection failed'));
            };
          });
        } catch (error) {
          console.error('API key validation error:', error);
          localStorage.removeItem('runwareApiKey');
          onInvalidKey();
          toast.error("Invalid API key. Please enter a valid key.");
        }
      }
    };

    validateStoredApiKey();
  }, [apiKey, onInvalidKey]);

  return null;
};

export default APIKeyValidator;
