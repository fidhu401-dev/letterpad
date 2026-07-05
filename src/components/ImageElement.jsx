import React, { useRef } from 'react';
import DraggableElement from './DraggableElement';
import { Upload } from 'lucide-react';

const ImageElement = ({ element, isSelected, onSelect, onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown }) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate(element.id, { content: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DraggableElement
      element={element}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    >
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: element.content ? 'transparent' : '#f1f5f9' }}>
        {element.content ? (
          <img 
            src={element.content} 
            alt="element" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            draggable={false}
          />
        ) : (
          <div 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={24} />
            <span style={{ fontSize: '0.875rem' }}>Upload Image</span>
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
        )}
      </div>
    </DraggableElement>
  );
};

export default ImageElement;
