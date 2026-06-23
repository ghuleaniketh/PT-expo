import { useEffect, useRef, useState } from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";
import { getAllStocks } from "../../api/market";

const SOCKET_URL = "http://127.0.0.1:3000";
const SYMBOL = "RELIANCE";

export default function Trading() {
  const [historyData, setHistoryData] = useState<any>(null);
  const [liveData, setLiveData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        const data = await getAllStocks(SYMBOL, "1y");
        if (!cancelled) setHistoryData(data);
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? "Failed to fetch historical data");
      }
    }

    loadHistory();

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("socket connected:", socket.id);
      socket.emit("subscribe", SYMBOL);
    });

    socket.on("priceUpdate", (payload) => {
      console.log("priceUpdate:", payload);
      setLiveData(payload);
    });

    socket.on("connect_error", (err) => {
      console.error("socket connect error:", err.message);
      setError(err.message);
    });

    return () => {
      cancelled = true;
      socket.emit("unsubscribe", SYMBOL);
      socket.disconnect();
    };
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Trading — {SYMBOL}</Text>

        {error && (
          <Text selectable style={{ color: "red" }}>
            Error: {error}
          </Text>
        )}

        <Text style={{ fontWeight: "bold" }}>Live price (socket):</Text>
        <Text selectable>
          {liveData ? JSON.stringify(liveData, null, 2) : "waiting for socket data..."}
        </Text>

        <Text style={{ fontWeight: "bold" }}>Historical meta (REST):</Text>
        <Text selectable>
          {historyData
            ? JSON.stringify(historyData.chart.result[0].meta, null, 2)
            : "loading..."}
        </Text>

        <Text style={{ fontWeight: "bold" }}>Close prices (first 10):</Text>
        <Text selectable>
          {historyData
            ? JSON.stringify(
                historyData.chart.result[0].indicators.quote[0].close.slice(0, 10),
                null,
                2
              )
            : "loading..."}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}