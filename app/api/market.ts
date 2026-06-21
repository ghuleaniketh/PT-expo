import axios from 'axios';


try{
    const connect = axios.defaults.baseURL = 'http://localhost:3000';
    console.log(connect);
}
catch(err){
    console.log(err);
}

export const getAllStocks = async (symbol: string) => {
    try {
        const response = await axios.get('/market/stacks', {
            headers: {
                symbol
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw error;
    }
}