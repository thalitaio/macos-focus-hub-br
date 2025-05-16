
import React, { useState, useEffect } from 'react';
import { Check, Trash, Plus, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLocalStorage from '@/hooks/useLocalStorage';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() !== '') {
      const todo: Todo = {
        id: crypto.randomUUID(),
        text: newTodo,
        completed: false,
        priority
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };
  
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-blue-500';
      default:
        return '';
    }
  };
  
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // Sort by priority first
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by completion status
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    return 0;
  });
  
  return (
    <div className="h-full flex flex-col">
      <form onSubmit={addTodo} className="flex space-x-2 mb-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Adicionar tarefa..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="pr-20"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="flex space-x-1">
              <button 
                type="button" 
                onClick={() => setPriority('low')}
                className={`w-4 h-4 rounded-full ${priority === 'low' ? 'bg-blue-500' : 'bg-blue-200'}`}
                title="Baixa Prioridade"
              />
              <button 
                type="button" 
                onClick={() => setPriority('medium')}
                className={`w-4 h-4 rounded-full ${priority === 'medium' ? 'bg-yellow-500' : 'bg-yellow-200'}`}
                title="Média Prioridade"
              />
              <button 
                type="button" 
                onClick={() => setPriority('high')}
                className={`w-4 h-4 rounded-full ${priority === 'high' ? 'bg-red-500' : 'bg-red-200'}`}
                title="Alta Prioridade"
              />
            </div>
          </div>
        </div>
        <Button type="submit" size="icon">
          <Plus size={18} />
        </Button>
      </form>
      
      <div className="flex space-x-2 mb-4">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          onClick={() => setFilter('all')}
          size="sm"
          className="text-xs"
        >
          Todas
        </Button>
        <Button 
          variant={filter === 'active' ? 'default' : 'outline'} 
          onClick={() => setFilter('active')}
          size="sm"
          className="text-xs"
        >
          Ativas
        </Button>
        <Button 
          variant={filter === 'completed' ? 'default' : 'outline'} 
          onClick={() => setFilter('completed')}
          size="sm"
          className="text-xs"
        >
          Completas
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {sortedTodos.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            Nenhuma tarefa encontrada
          </div>
        ) : (
          <ul className="space-y-2">
            {sortedTodos.map((todo) => (
              <li 
                key={todo.id}
                className={`flex items-center p-3 bg-white rounded-lg shadow-sm ${
                  todo.completed ? 'opacity-60' : ''
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                    todo.completed 
                      ? 'bg-primary border-primary text-white' 
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {todo.completed && <Check size={12} />}
                </button>
                <span 
                  className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}
                >
                  <span className={`mr-2 ${priorityColor(todo.priority)}`}>
                    {todo.priority === 'high' && <ArrowUp size={14} className="inline" />}
                    {todo.priority === 'low' && <ArrowDown size={14} className="inline" />}
                  </span>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-500 ml-2"
                >
                  <Trash size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        {todos.filter(t => !t.completed).length} tarefas pendentes
      </div>
    </div>
  );
};

export default TodoApp;
