import React, { useEffect } from 'react';
import DraggableElement from './DraggableElement';

const TableElement = ({ element, isSelected, onSelect, onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown }) => {
  // Initialize table data if not present
  useEffect(() => {
    if (!element.content) {
      const initialData = Array(3).fill(null).map(() => Array(3).fill(''));
      onUpdate(element.id, { content: initialData });
    }
  }, [element.content, element.id, onUpdate]);

  const handleCellChange = (rIndex, cIndex, value) => {
    const newData = [...element.content];
    newData[rIndex] = [...newData[rIndex]];
    newData[rIndex][cIndex] = value;
    onUpdate(element.id, { content: newData });
  };

  const data = Array.isArray(element.content) ? element.content : Array(3).fill(null).map(() => Array(3).fill(''));
  
  const borderColor = element.properties?.borderColor || '#000000';
  const borderThickness = element.properties?.borderThickness || 1;

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
      <table 
        style={{ 
          width: '100%', 
          height: '100%', 
          borderCollapse: 'collapse',
          fontFamily: element.properties?.fontFamily || 'Inter, sans-serif',
          fontSize: `${element.properties?.fontSize || 14}px`,
        }}
      >
        <tbody>
          {data.map((row, rIndex) => (
            <tr key={`r-${rIndex}`}>
              {row.map((cell, cIndex) => (
                <td 
                  key={`c-${cIndex}`}
                  style={{
                    border: `${borderThickness}px solid ${borderColor}`,
                    padding: '4px',
                    verticalAlign: 'top'
                  }}
                >
                  <div 
                    className="cancel-drag editable-element"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleCellChange(rIndex, cIndex, e.target.innerHTML)}
                    style={{ minHeight: '1.2em', outline: 'none' }}
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </DraggableElement>
  );
};

export default TableElement;
