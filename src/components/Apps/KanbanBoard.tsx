
import React, { useState } from 'react';
import { Plus, MoreVertical, Trash, Edit, X } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface KanbanTask {
  id: string;
  content: string;
  columnId: string;
}

interface KanbanColumn {
  id: string;
  title: string;
}

const DEFAULT_COLUMNS: KanbanColumn[] = [
  { id: 'todo', title: 'A Fazer' },
  { id: 'in-progress', title: 'Em Progresso' },
  { id: 'done', title: 'Concluído' },
];

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useLocalStorage<KanbanColumn[]>('kanban-columns', DEFAULT_COLUMNS);
  const [tasks, setTasks] = useLocalStorage<KanbanTask[]>('kanban-tasks', []);
  
  const [newTask, setNewTask] = useState('');
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  
  // Task management
  const addNewTask = (columnId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newTask.trim() === '') return;
    
    const task = {
      id: crypto.randomUUID(),
      content: newTask,
      columnId,
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    setActiveColumn(null);
  };
  
  const updateTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingTask || editingTask.content.trim() === '') return;
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    
    setEditingTask(null);
  };
  
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  // Drag and drop
  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (columnId: string) => {
    if (!draggedTaskId) return;
    
    setTasks(tasks.map(task => 
      task.id === draggedTaskId ? { ...task, columnId } : task
    ));
    
    setDraggedTaskId(null);
  };
  
  // Column management
  const addNewColumn = () => {
    const newColumn = {
      id: crypto.randomUUID(),
      title: 'Nova Coluna',
    };
    
    setColumns([...columns, newColumn]);
    setEditingColumnId(newColumn.id);
  };
  
  const updateColumn = (columnId: string) => {
    if (newColumnTitle.trim() === '') return;
    
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, title: newColumnTitle } : col
    ));
    
    setEditingColumnId(null);
    setNewColumnTitle('');
  };
  
  const deleteColumn = (columnId: string) => {
    setColumns(columns.filter(col => col.id !== columnId));
    // Delete all tasks in this column or move them
    setTasks(tasks.filter(task => task.columnId !== columnId));
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quadro Kanban</h2>
        <Button 
          onClick={addNewColumn}
          size="sm"
          variant="outline"
        >
          <Plus size={16} className="mr-1" />
          Add Coluna
        </Button>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <div className="flex h-full space-x-4 p-1">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col bg-gray-50 rounded-lg shadow-sm w-72 min-w-72"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                {editingColumnId === column.id ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateColumn(column.id);
                    }}
                    className="flex w-full"
                  >
                    <Input
                      value={newColumnTitle}
                      onChange={e => setNewColumnTitle(e.target.value)}
                      placeholder={column.title}
                      autoFocus
                      className="text-sm"
                    />
                    <Button 
                      size="sm" 
                      type="submit"
                      className="ml-2"
                    >
                      Salvar
                    </Button>
                  </form>
                ) : (
                  <>
                    <h3 className="font-medium">{column.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setEditingColumnId(column.id);
                          setNewColumnTitle(column.title);
                        }}>
                          <Edit size={14} className="mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteColumn(column.id)}
                          className="text-red-500"
                        >
                          <Trash size={14} className="mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
              
              <div className="flex-1 p-2 overflow-y-auto">
                {tasks
                  .filter(task => task.columnId === column.id)
                  .map(task => (
                    <div
                      key={task.id}
                      className={`bg-white p-3 rounded-md shadow-sm mb-2 cursor-move ${
                        draggedTaskId === task.id ? 'opacity-50' : ''
                      }`}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                    >
                      {editingTask?.id === task.id ? (
                        <form onSubmit={updateTask}>
                          <Input
                            value={editingTask.content}
                            onChange={(e) => setEditingTask({
                              ...editingTask,
                              content: e.target.value
                            })}
                            autoFocus
                          />
                          <div className="flex justify-end mt-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setEditingTask(null)}
                              className="mr-2"
                            >
                              <X size={14} />
                            </Button>
                            <Button size="sm" type="submit">
                              Salvar
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="group relative">
                          <div className="text-sm">{task.content}</div>
                          <div className="absolute right-0 top-0 hidden group-hover:flex space-x-1">
                            <button
                              onClick={() => setEditingTask(task)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              
              {activeColumn === column.id ? (
                <form 
                  onSubmit={(e) => addNewTask(column.id, e)} 
                  className="p-2 border-t border-gray-200"
                >
                  <Input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Nova tarefa..."
                    autoFocus
                    className="mb-2"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setActiveColumn(null)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" size="sm">
                      Adicionar
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-2 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full flex items-center justify-center text-gray-500"
                    onClick={() => setActiveColumn(column.id)}
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar Tarefa
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
