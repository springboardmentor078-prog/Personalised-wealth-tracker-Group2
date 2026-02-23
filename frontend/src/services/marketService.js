import axios from 'axios';

const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';
// Warning: This key is exposed in client-side code, typically proxy through backend
const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

export const getAlphaVantagePrice = async (symbol) => {
    if (!API_KEY) {
        console.warn('VITE_ALPHA_VANTAGE_KEY not set.');
        return null;
    }

    try {
        const response = await axios.get(ALPHA_VANTAGE_URL, {
            params: {
                function: 'GLOBAL_QUOTE',
                symbol: symbol,
                apikey: API_KEY,
            },
        });

        // Alpha vantage structure: {"Global Quote": {"05. price": "150.00", ...}}
        const globalQuote = response.data['Global Quote'];
        if (globalQuote && globalQuote['05. price']) {
            return parseFloat(globalQuote['05. price']);
        }

        console.warn(`Could not get quote for ${symbol}`, response.data);
        return null;
    } catch (error) {
        console.error('Alpha vantage fetch error', error);
        return null;
    }
};
