
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useLocalStorage from '@/hooks/useLocalStorage';

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
  
  // Mock weather data for demo
  const fetchWeatherData = (searchCity: string) => {
    setLoading(true);
    setError(null);
    
    // Simulate API call delay
    setTimeout(() => {
      if (searchCity.toLowerCase() === 'error') {
        setError('Cidade não encontrada');
        setLoading(false);
        return;
      }
      
      // Mock data
      const mockWeatherData = {
        city: searchCity || 'São Paulo',
        country: 'BR',
        temperature: Math.floor(Math.random() * 15) + 15, // Random temp between 15-30
        humidity: Math.floor(Math.random() * 30) + 50, // Random humidity between 50-80%
        windSpeed: Math.floor(Math.random() * 10) + 5, // Random wind speed between 5-15 km/h
        description: ['Ensolarado', 'Parcialmente nublado', 'Nublado', 'Chuvoso'][Math.floor(Math.random() * 4)],
        icon: ['01d', '02d', '03d', '10d'][Math.floor(Math.random() * 4)],
      };
      
      setWeatherData(mockWeatherData);
      setLoading(false);
    }, 1000);
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
    const icons: Record<string, string> = {
      '01d': '☀️', // Clear sky
      '02d': '⛅', // Few clouds
      '03d': '☁️', // Scattered clouds
      '04d': '☁️', // Broken clouds
      '09d': '🌧️', // Shower rain
      '10d': '🌦️', // Rain
      '11d': '⛈️', // Thunderstorm
      '13d': '❄️', // Snow
      '50d': '🌫️', // Mist
    };
    
    return icons[iconCode] || '☁️';
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
