import React, { useEffect } from 'react';
import DraggableElement from './DraggableElement';

const DateElement = ({ element, isSelected, onSelect, onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown }) => {
  // Set default date if none exists
  useEffect(() => {
    if (!element.content) {
      const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      onUpdate(element.id, { content: today });
    }
  }, [element.content, element.id, onUpdate]);

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
      <div 
        className="cancel-drag editable-element"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onUpdate(element.id, { content: e.target.innerText })}
        style={{
          width: '100%',
          height: '100%',
          outline: 'none',
          cursor: 'text',
          fontFamily: element.properties?.fontFamily || 'Inter, sans-serif',
          fontSize: `${element.properties?.fontSize || 16}px`,
          fontWeight: element.properties?.bold ? 'bold' : 'normal',
          fontStyle: element.properties?.italic ? 'italic' : 'normal',
          color: element.properties?.color || '#000000',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        {element.content}
      </div>
    </DraggableElement>
  );
};

export default DateElement;
