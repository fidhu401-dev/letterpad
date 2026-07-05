import React from 'react';
import { Rnd } from 'react-rnd';
import { Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react';

const DraggableElement = ({ 
  element, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  onMoveUp,
  onMoveDown,
  children 
}) => {
  return (
    <Rnd
      cancel=".cancel-drag"
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      onDragStop={(e, d) => {
        onUpdate(element.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate(element.id, {
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        });
      }}
      bounds="parent"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id);
      }}
      style={{
        zIndex: element.zIndex || 1,
        border: isSelected ? '2px solid var(--accent-color)' : '1px solid transparent',
      }}
      className={isSelected ? 'element-selected' : ''}
    >
      {/* Controls */}
      {isSelected && (
        <div 
          style={{
            position: 'absolute',
            top: '-42px',
            right: 0,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '24px',
            display: 'flex',
            gap: '4px',
            padding: '4px 8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            zIndex: 10,
            alignItems: 'center'
          }}
        >
          {(element.type === 'text' || element.type === 'date' || element.type === 'table') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRight: '1px solid #e2e8f0', paddingRight: '8px', marginRight: '4px' }}>
              <input 
                type="number" 
                value={element.properties?.fontSize || 16}
                onChange={(e) => onUpdate(element.id, { properties: { fontSize: parseInt(e.target.value) } })}
                onMouseDown={(e) => e.stopPropagation()}
                style={{ width: '48px', padding: '4px', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '13px', textAlign: 'center', background: 'white' }}
                title="Font Size"
              />
              <button 
                className="btn-icon" 
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); document.execCommand('bold', false, null); }} 
                title="Bold (Rich Text)" 
                style={{ padding: '6px 8px', fontWeight: 'bold', color: 'var(--text-primary)' }}
              >
                B
              </button>
            </div>
          )}
          <button className="btn-icon" onClick={(e) => { e.stopPropagation(); onMoveUp(); }} title="Bring to Front" style={{ padding: '6px' }}>
            <ArrowUp size={16} />
          </button>
          <button className="btn-icon" onClick={(e) => { e.stopPropagation(); onMoveDown(); }} title="Send to Back" style={{ padding: '6px' }}>
            <ArrowDown size={18} />
          </button>
          <button className="btn-icon" onClick={(e) => { e.stopPropagation(); onDuplicate(); }} title="Duplicate" style={{ padding: '6px' }}>
            <Copy size={18} />
          </button>
          <button className="btn-icon text-red" onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Delete" style={{ padding: '6px' }}>
            <Trash2 size={18} color="#ef4444" />
          </button>
        </div>
      )}

      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        {children}
      </div>
    </Rnd>
  );
};

export default DraggableElement;
