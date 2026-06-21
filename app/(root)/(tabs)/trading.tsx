import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllStocks } from "../../api/market";

export default function Trading() {

  const [stocks, setStocks] = useState<any[]>([]);

  const fetchStocks = async () => {
    try {
      const data = await getAllStocks('RELIANCE'); // Replace 'AAPL' with the desired stock symbol
      console.log('Fetched stocks:', data.chart.result[0].indicators.quote[0].close); // Log the fetched stocks
      setStocks(data.chart.result[0].meta.symbol); // Assuming the API response has a 'stocks' field
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Text>This is the Trading page</Text>
        <Button
          title="Fetch Stocks"
          onPress={() => fetchStocks()}
        />
        <Text>{`Stocks fetched: ${stocks?.length ?? 0}`}</Text>
        <Text>{JSON.stringify(stocks, null, 2)}</Text>
      </View>
    </SafeAreaView>
  );
}