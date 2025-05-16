
import React, { useState, useEffect } from 'react';
import { Save, FileText, Plus, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useLocalStorage from '@/hooks/useLocalStorage';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

const Notepad: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  
  // Set the first note as active or create a new one if none exist
  useEffect(() => {
    if (notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0].id);
      setEditedTitle(notes[0].title);
      setEditedContent(notes[0].content);
    } else if (notes.length === 0) {
      createNewNote();
    }
  }, [notes]);
  
  // Update form when active note changes
  useEffect(() => {
    if (activeNoteId) {
      const activeNote = notes.find(note => note.id === activeNoteId);
      if (activeNote) {
        setEditedTitle(activeNote.title);
        setEditedContent(activeNote.content);
      }
    }
  }, [activeNoteId, notes]);
  
  const createNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Nova nota',
      content: '',
      updatedAt: Date.now(),
    };
    
    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
    setEditedTitle(newNote.title);
    setEditedContent(newNote.content);
  };
  
  const saveNote = () => {
    if (!activeNoteId) return;
    
    setNotes(notes.map(note => 
      note.id === activeNoteId
        ? { 
            ...note, 
            title: editedTitle || 'Sem título', 
            content: editedContent,
            updatedAt: Date.now(),
          }
        : note
    ));
  };
  
  const deleteNote = (id: string) => {
    // Don't delete if it's the last note
    if (notes.length <= 1) return;
    
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    
    // If active note is deleted, select another one
    if (activeNoteId === id && newNotes.length > 0) {
      setActiveNoteId(newNotes[0].id);
    }
  };
  
  // Auto-save on content change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeNoteId) {
        saveNote();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [editedContent, editedTitle]);
  
  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="h-full flex">
      {/* Note list sidebar */}
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto pr-2">
        <div className="flex justify-between items-center mb-3 px-2">
          <h3 className="font-medium">Minhas notas</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={createNewNote}
          >
            <Plus size={16} />
          </Button>
        </div>
        
        <div className="space-y-2">
          {notes.map(note => (
            <div
              key={note.id}
              className={`p-2 rounded-md cursor-pointer ${
                activeNoteId === note.id 
                  ? 'bg-primary/10' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveNoteId(note.id)}
            >
              <div className="flex justify-between">
                <div className="font-medium truncate">{note.title || 'Sem título'}</div>
                
                {notes.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash size={14} />
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(note.updatedAt)}
              </div>
              <div className="text-xs text-gray-500 mt-1 truncate">
                {note.content.substring(0, 50)}
                {note.content.length > 50 ? '...' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Note editor */}
      <div className="flex-1 flex flex-col">
        <div className="p-2 border-b border-gray-200 flex items-center">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full border-none focus:outline-none bg-transparent font-medium"
            placeholder="Título da nota"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={saveNote}
          >
            <Save size={16} />
          </Button>
        </div>
        
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          placeholder="Escreva sua nota aqui..."
          className="flex-1 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
};

export default Notepad;
