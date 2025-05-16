
import React, { useState } from 'react';
import { Plus, Calendar, Trash, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLocalStorage from '@/hooks/useLocalStorage';

interface Habit {
  id: string;
  name: string;
  dates: string[];
  streak: number;
}

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [newHabitName, setNewHabitName] = useState('');
  
  // Generate days for the current week
  const generateWeekDays = () => {
    const days = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Get the start of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    
    // Generate 7 days starting from the start of the week
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push({
        date: day.toISOString().split('T')[0],
        dayName: day.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase(),
        dayNumber: day.getDate(),
        isToday: day.toDateString() === today.toDateString(),
      });
    }
    
    return days;
  };
  
  const weekDays = generateWeekDays();
  
  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim() === '') return;
    
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName,
      dates: [],
      streak: 0,
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };
  
  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };
  
  const toggleHabitDate = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;
      
      let newDates;
      let newStreak = habit.streak;
      
      // Check if date is already tracked
      if (habit.dates.includes(date)) {
        newDates = habit.dates.filter(d => d !== date);
        
        // Check if streak is affected
        const today = new Date().toISOString().split('T')[0];
        if (date === today) {
          // Reset streak if today's completion is removed
          newStreak = 0;
        }
      } else {
        // Add new date
        newDates = [...habit.dates, date];
        
        // Check if streak should be updated
        const today = new Date().toISOString().split('T')[0];
        if (date === today) {
          // Increment streak
          newStreak = habit.streak + 1;
        }
      }
      
      return {
        ...habit,
        dates: newDates,
        streak: newStreak,
      };
    }));
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Habit Tracker</h2>
        <div className="flex items-center">
          <Calendar size={18} className="text-gray-500 mr-2" />
          <div className="text-sm font-medium">
            {new Date().toLocaleDateString('pt-BR', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
      
      <form onSubmit={addHabit} className="flex space-x-2 mb-6">
        <Input
          type="text"
          placeholder="Novo hábito..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Plus size={18} />
        </Button>
      </form>
      
      <div className="flex-1 overflow-y-auto">
        {habits.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Nenhum hábito adicionado.<br />
            Adicione um acima para começar.
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pl-2 py-2 w-1/3 font-medium text-sm text-gray-500">Hábito</th>
                  {weekDays.map((day) => (
                    <th 
                      key={day.date} 
                      className={`py-2 px-0 text-center font-medium text-sm ${
                        day.isToday ? 'text-primary' : 'text-gray-500'
                      }`}
                    >
                      <div>{day.dayName}</div>
                      <div className={`rounded-full w-7 h-7 flex items-center justify-center mx-auto ${
                        day.isToday ? 'bg-primary/10' : ''
                      }`}>
                        {day.dayNumber}
                      </div>
                    </th>
                  ))}
                  <th className="pr-2 py-2 font-medium text-sm text-gray-500 text-center">Sequência</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {habits.map((habit) => (
                  <tr key={habit.id} className="border-b hover:bg-gray-50">
                    <td className="pl-2 py-4 font-medium">{habit.name}</td>
                    
                    {weekDays.map((day) => {
                      const isCompleted = habit.dates.includes(day.date);
                      return (
                        <td 
                          key={day.date} 
                          className="py-4 text-center"
                        >
                          <button
                            onClick={() => toggleHabitDate(habit.id, day.date)}
                            className={`w-7 h-7 rounded-md flex items-center justify-center mx-auto ${
                              isCompleted 
                                ? 'bg-green-500 text-white' 
                                : 'border border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {isCompleted && <Check size={16} />}
                          </button>
                        </td>
                      );
                    })}
                    
                    <td className="pr-2 py-4 text-center">
                      <span className="font-medium">
                        {habit.streak} {habit.streak === 1 ? 'dia' : 'dias'}
                      </span>
                    </td>
                    
                    <td className="py-4 px-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteHabit(habit.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
