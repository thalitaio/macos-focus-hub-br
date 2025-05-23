
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from "@/hooks/use-toast";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

const Weather: React.FC = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useLocalStorage<WeatherData | null>('weather-data', null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchWeatherData = async (searchCity: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=80c2ee74b45f4dcfabb33351241306&q=${searchCity}&aqi=no`);
      
      if (!response.ok) {
        throw new Error('Cidade não encontrada');
      }
      
      const data = await response.json();
      
      // Process API data
      const weatherInfo: WeatherData = {
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        description: data.current.condition.text,
        icon: data.current.condition.code.toString(),
      };
      
      setWeatherData(weatherInfo);
      toast({
        title: "Clima atualizado",
        description: `Dados de ${weatherInfo.city} carregados com sucesso`,
      });
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Erro ao buscar dados do clima. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível obter os dados do clima",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Initial weather data load
  useEffect(() => {
    if (!weatherData) {
      fetchWeatherData('São Paulo');
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };
  
  // Weather icon based on condition
  const getWeatherIcon = (iconCode: string) => {
    // WeatherAPI condition codes mapping to emojis
    const iconMap: Record<string, string> = {
      '1000': '☀️', // Clear/Sunny
      '1003': '⛅', // Partly cloudy
      '1006': '☁️', // Cloudy
      '1009': '☁️', // Overcast
      '1030': '🌫️', // Mist
      '1063': '🌦️', // Patchy rain
      '1066': '🌨️', // Patchy snow
      '1069': '🌧️', // Patchy sleet
      '1072': '🌧️', // Patchy freezing drizzle
      '1087': '⛈️', // Thundery outbreaks
      '1114': '❄️', // Blowing snow
      '1117': '❄️', // Blizzard
      '1135': '🌫️', // Fog
      '1147': '🌫️', // Freezing fog
      '1150': '🌧️', // Patchy light drizzle
      '1153': '🌧️', // Light drizzle
      '1168': '🌧️', // Freezing drizzle
      '1171': '🌧️', // Heavy freezing drizzle
      '1180': '🌧️', // Patchy light rain
      '1183': '🌧️', // Light rain
      '1186': '🌧️', // Moderate rain
      '1189': '🌧️', // Moderate rain
      '1192': '🌧️', // Heavy rain
      '1195': '🌧️', // Heavy rain
      '1198': '🌧️', // Light freezing rain
      '1201': '🌧️', // Moderate/Heavy freezing rain
      '1204': '🌨️', // Light sleet
      '1207': '🌨️', // Moderate/Heavy sleet
      '1210': '🌨️', // Patchy light snow
      '1213': '🌨️', // Light snow
      '1216': '🌨️', // Patchy moderate snow
      '1219': '🌨️', // Moderate snow
      '1222': '🌨️', // Patchy heavy snow
      '1225': '❄️', // Heavy snow
      '1237': '🌨️', // Ice pellets
      '1240': '🌧️', // Light rain shower
      '1243': '🌧️', // Moderate/Heavy rain shower
      '1246': '🌧️', // Torrential rain shower
      '1249': '🌨️', // Light sleet showers
      '1252': '🌨️', // Moderate/Heavy sleet showers
      '1255': '🌨️', // Light snow showers
      '1258': '🌨️', // Moderate/Heavy snow showers
      '1261': '🌨️', // Light showers of ice pellets
      '1264': '🌨️', // Moderate/Heavy showers of ice pellets
      '1273': '⛈️', // Patchy light rain with thunder
      '1276': '⛈️', // Moderate/Heavy rain with thunder
      '1279': '⛈️', // Patchy light snow with thunder
      '1282': '⛈️', // Moderate/Heavy snow with thunder
    };
    
    return iconMap[iconCode] || '☁️';
  };
  
  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="mb-6 flex space-x-2">
        <Input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Digite o nome da cidade..."
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          <Search size={18} />
        </Button>
      </form>
      
      {error ? (
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error}
        </div>
      ) : loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Carregando...</div>
        </div>
      ) : weatherData ? (
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center mb-2">
            <MapPin size={18} className="text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">
              {weatherData.city}, {weatherData.country}
            </h2>
          </div>
          
          <div className="text-6xl my-4">
            {getWeatherIcon(weatherData.icon)}
          </div>
          
          <div className="text-4xl font-bold mb-2">
            {weatherData.temperature}°C
          </div>
          
          <div className="text-gray-500 mb-6">
            {weatherData.description}
          </div>
          
          <div className="w-full flex justify-around">
            <div className="flex flex-col items-center">
              <Wind size={24} className="text-gray-500 mb-1" />
              <div className="text-sm font-medium">{weatherData.windSpeed} km/h</div>
              <div className="text-xs text-gray-500">Vento</div>
            </div>
            
            <div className="flex flex-col items-center">
              <Droplets size={24} className="text-gray-500 mb-1" />
              <div className="text-sm font-medium">{weatherData.humidity}%</div>
              <div className="text-xs text-gray-500">Umidade</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Weather;
