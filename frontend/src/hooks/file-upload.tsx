import { useState } from "react";
import { Keys } from "@/data/localStorage";
import { getItem } from "@/utils/Storage";

const useFileUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    status?: number;
    data?: any;
  } | null>(null);

  const uploadFile = async (
    file: File,
    endpoint: string,
    fieldName: string = 'file',
    type : string,
    formData: Record<string, any> = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Append the file
      formDataToSend.append(fieldName, file);
      
      // Append other form data
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            formDataToSend.append(`${key}.${subKey}`, subValue as string);
          });
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      const token = localStorage.getItem('authToken');

      const response = await fetch(endpoint, {
        method: type,
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          // Try to parse the error response as JSON
          errorData = await response.json();
        } catch (e) {
          // If JSON parsing fails, use the status text
          errorData = { message: response.statusText };
        }
        
        // Throw an error with all available information
        throw {
          message: errorData.message || 'Upload failed',
          status: response.status,
          data: errorData,
        };
      }

      return await response.json();
    } catch (err) {
      // Capture all error information
      const errorInfo = {
        message: (err as Error).message || 'Upload failed',
        ...(err as any).status && { status: (err as any).status },
        ...(err as any).data && { data: (err as any).data },
      };
      
      setError(errorInfo);
      throw errorInfo; // Re-throw with all details
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, loading, error };
};

export default useFileUpload;