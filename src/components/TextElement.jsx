import React, { useRef, useEffect } from 'react';
import DraggableElement from './DraggableElement';

const TextElement = ({ element, isSelected, onSelect, onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!element.content && contentRef.current) {
      contentRef.current.focus();
    }
  }, []);

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
        ref={contentRef}
        className="cancel-drag editable-element"
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Type something..."
        onBlur={(e) => onUpdate(element.id, { content: e.target.innerHTML })}
        style={{
          width: '100%',
          height: '100%',
          outline: 'none',
          cursor: 'text',
          fontFamily: element.properties?.fontFamily || 'Inter, sans-serif',
          fontSize: `${element.properties?.fontSize || 16}px`,
          color: element.properties?.color || '#000000',
          textAlign: element.properties?.textAlign || 'left',
          lineHeight: element.properties?.lineHeight || 1.5,
          padding: '4px',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
        dangerouslySetInnerHTML={{ __html: element.content || '' }}
      />
    </DraggableElement>
  );
};

export default TextElement;
