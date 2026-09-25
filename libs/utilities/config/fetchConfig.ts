export const fetchConfig = async (app: string): Promise<any> => {
  const env = process.env.REACT_APP_ENV || 'dev'; // Default to 'dev' if not set
  const baseUrl = process.env.REACT_APP_CONFIG_SERVER_URL;

  if (!baseUrl) {
    throw new Error('Config server URL is not defined in environment variables');
  }

  try {
    const response = await fetch(`${baseUrl}/config/${app}/${env}`);
    if (!response.ok) {
      throw new Error(`Failed to load configuration for app '${app}' and environment '${env}'`);
    }
    const config: any = await response.json();
    return config;
  } catch (error) {
    console.error('Error fetching configuration:', error);
    throw error; // Rethrow to handle it in your component
  }
};
