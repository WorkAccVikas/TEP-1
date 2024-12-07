import axios from 'utils/axios';

/**
 * Utility function for making GET requests using Axios.
 *
 * @param {string} url - The API endpoint.
 * @param {Object} config - The configuration options.
 * @param {Object} [config.headers] - Custom headers to be sent with the request.
 * @param {Object} [config.params] - Query parameters to be included in the request.
 * @param {Object} [config.urlParams] - URL parameters to be replaced in the endpoint.
 * @param {number} [config.timeout] - Optional timeout for the request (in ms).
 * @param {boolean} [config.withCredentials] - Whether to include credentials (cookies, etc.) in the request.
 * @returns {Promise<Object>} - The response data from the API.
 */
export const getApiResponse = async (url, config = {}) => {
  const {
    headers = {},
    params = {},
    urlParams = {},
    timeout, // No default value; if undefined, Axios will use its default behavior.
    withCredentials = false
  } = config;

  try {
    // Replace URL parameters in the endpoint if any are provided
    let processedUrl = url;
    Object.keys(urlParams).forEach((key) => {
      processedUrl = processedUrl.replace(`:${key}`, urlParams[key]);
    });

    // Perform the GET request using Axios
    const response = await axios.get(processedUrl, {
      headers,
      params,
      timeout, // Axios will only apply timeout if provided
      withCredentials
    });

    // Return response data if successful
    return response.data;
  } catch (error) {
    // Handle errors in a professional way
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Error Response:', {
        status: error.response.status,
        data: error.response.data
      });
      throw new Error(`Request failed with status ${error.response.status}: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      // Request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response received from the server. Please try again.');
    } else {
      // Something else caused the error (e.g., bad request config)
      console.error('Request Error:', error.message);
      throw new Error('Request error: ' + error.message);
    }
  }
};
