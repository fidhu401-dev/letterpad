import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Type, Table as TableIcon, Image as ImageIcon, Calendar, 
  Download, Save, Upload, ZoomIn, ZoomOut, Settings, FolderOpen
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import TextElement from './components/TextElement';
import TableElement from './components/TableElement';
import ImageElement from './components/ImageElement';
import DateElement from './components/DateElement';

function App() {
  const [backgroundImg, setBackgroundImg] = useState('/letterpad-default.jpg?v=' + Date.now());
  const [elements, setElements] = useState([
    {
      id: uuidv4(),
      type: 'text',
      x: 48,
      y: 190,
      width: 698,
      height: 'auto',
      zIndex: 1,
      content: '',
      properties: {
        fontSize: 16,
        fontFamily: '"Times New Roman", Times, serif',
        color: '#000000',
        bold: false,
        italic: false,
        underline: false,
        textAlign: 'left'
      }
    }
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef(null);
  const projectInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Auto-fit smart zoom on load and resize
  useEffect(() => {
    const calculateZoom = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        // Fit width perfectly on mobile (16px padding each side = 32px)
        setZoom(Math.max(0.1, (window.innerWidth - 32) / 794));
      } else {
        const workspaceHeight = window.innerHeight - 64; // minus topbar
        if (workspaceHeight < 1123) {
          setZoom(Math.max(0.2, (workspaceHeight - 80) / 1123));
        } else {
          setZoom(1);
        }
      }
    };
    
    calculateZoom();
    window.addEventListener('resize', calculateZoom);
    return () => window.removeEventListener('resize', calculateZoom);
  }, []);

  // Deselect when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest('.canvas-wrapper') && !e.target.closest('.react-draggable')) {
        setSelectedId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setBackgroundImg(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddElement = (type) => {
    const stagger = elements.length * 20;
    const newElement = {
      id: uuidv4(),
      type,
      x: type === 'text' ? 48 : 100,
      y: type === 'text' ? 190 : 250 + (stagger % 200),
      width: type === 'table' ? 300 : type === 'image' ? 400 : (type === 'text' ? 698 : 150),
      height: type === 'table' ? 200 : type === 'image' ? 400 : 'auto',
      zIndex: elements.length + 1,
      content: '',
      properties: {
        fontSize: 16,
        fontFamily: '"Times New Roman", Times, serif',
        color: '#000000',
        bold: false,
        italic: false,
        underline: false,
        textAlign: 'left'
      }
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const updateElement = (id, updates) => {
    setElements(elements.map(el => {
      if (el.id === id) {
        if (updates.properties) {
          return { ...el, properties: { ...el.properties, ...updates.properties } };
        }
        return { ...el, ...updates };
      }
      return el;
    }));
  };

  const deleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateElement = (id) => {
    const elementToDup = elements.find(el => el.id === id);
    if (elementToDup) {
      const newElement = {
        ...elementToDup,
        id: uuidv4(),
        x: elementToDup.x + 20,
        y: elementToDup.y + 20,
        zIndex: elements.length + 1
      };
      setElements([...elements, newElement]);
      setSelectedId(newElement.id);
    }
  };

  const moveZIndex = (id, direction) => {
    setElements(elements.map(el => {
      if (el.id === id) {
        return { ...el, zIndex: Math.max(1, el.zIndex + direction) };
      }
      return el;
    }));
  };

  const handleSaveProject = () => {
    const project = { backgroundImg, elements };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "letterpad_project.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleLoadProject = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const project = JSON.parse(event.target.result);
          if (project.backgroundImg !== undefined) setBackgroundImg(project.backgroundImg);
          if (project.elements) setElements(project.elements);
        } catch (err) {
          alert('Invalid project file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current) return;
    
    // Temporarily deselect element for clean export
    const currentSelectedId = selectedId;
    setSelectedId(null);
    
    // Wait a tick for UI to update (remove borders)
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(canvasRef.current, { 
          scale: 4, 
          useCORS: true,
          logging: false,
          allowTaint: true
        });
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // A4 proportions (210x297mm)
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        pdf.save('letterpad_document.pdf');
      } catch (err) {
        console.error("PDF Export failed", err);
        alert("Failed to export PDF.");
      } finally {
        setSelectedId(currentSelectedId);
      }
    }, 100);
  };

  const selectedElement = elements.find(el => el.id === selectedId);

  return (
    <div className="app-container">
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-title">Letterpad Builder</div>
        <div className="topbar-actions">
          <button className="btn btn-outline" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
            <ZoomOut size={16} />
          </button>
          <span style={{ display: 'inline-flex', alignItems: 'center', minWidth: '4ch', justifyContent: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button className="btn btn-outline" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>
            <ZoomIn size={16} />
          </button>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 8px' }}></div>
          
          <input 
            type="file" 
            accept=".json" 
            className="visually-hidden" 
            ref={projectInputRef}
            onChange={handleLoadProject}
          />
          <button className="btn btn-outline" onClick={() => projectInputRef.current.click()}>
            <FolderOpen size={16} /> Open
          </button>
          <button className="btn btn-outline" onClick={handleSaveProject}>
            <Save size={16} /> Save
          </button>
          <button className="btn btn-primary" onClick={handleExportPDF}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </header>

      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">Tools</div>
          <div className="sidebar-content">
            <div className="tools-grid">
              <button className="tool-btn" onClick={() => handleAddElement('text')}>
                <Type size={24} />
                <span>Text</span>
              </button>
              <button className="tool-btn" onClick={() => handleAddElement('table')}>
                <TableIcon size={24} />
                <span>Table</span>
              </button>
              <button className="tool-btn" onClick={() => handleAddElement('image')}>
                <ImageIcon size={24} />
                <span>Image</span>
              </button>
              <button className="tool-btn" onClick={() => handleAddElement('date')}>
                <Calendar size={24} />
                <span>Date</span>
              </button>
            </div>
            
            <div className="sidebar-header" style={{ padding: '16px 0', marginTop: '16px' }}>Properties</div>
            
            {selectedElement ? (
              <div style={{ padding: '16px', background: '#1e293b', borderRadius: '12px', border: '1px solid var(--sidebar-border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(selectedElement.type === 'text' || selectedElement.type === 'date' || selectedElement.type === 'table') && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-sidebar-secondary)', marginBottom: '4px' }}>Font Size</label>
                        <input 
                          type="number" 
                          value={selectedElement.properties.fontSize || 16} 
                          onChange={(e) => updateElement(selectedElement.id, { properties: { fontSize: parseInt(e.target.value) } })}
                          style={{ width: '100%', padding: '8px', background: '#0f172a', color: 'var(--text-sidebar)', border: '1px solid var(--sidebar-border)', borderRadius: '6px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-sidebar-secondary)', marginBottom: '4px' }}>Color</label>
                        <input 
                          type="color" 
                          value={selectedElement.properties.color || '#000000'} 
                          onChange={(e) => updateElement(selectedElement.id, { properties: { color: e.target.value } })}
                          style={{ width: '100%', padding: '2px', background: '#0f172a', border: '1px solid var(--sidebar-border)', borderRadius: '6px', height: '36px', cursor: 'pointer' }}
                        />
                      </div>
                    </>
                  )}
                  {selectedElement.type === 'table' && (
                    <>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
                    <button 
                      className="btn btn-outline"
                      style={{ width: '100%' }}
                      onClick={() => {
                        const newData = [...selectedElement.content];
                        newData.push(Array(newData[0]?.length || 3).fill(''));
                        updateElement(selectedElement.id, { content: newData });
                      }}
                    >
                      + Add Row
                    </button>
                    <button 
                      className="btn btn-outline"
                      style={{ width: '100%' }}
                      onClick={() => {
                        const newData = selectedElement.content.map(row => [...row, '']);
                        updateElement(selectedElement.id, { content: newData });
                      }}
                    >
                      + Add Column
                    </button>
                  </>
                )}
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '16px' }}>
                Select an element to edit its properties.
              </div>
            )}
          </div>
        </aside>

        <main className="workspace" onClick={() => setSelectedId(null)}>
          <div style={{ width: 794 * zoom, height: 1123 * zoom, position: 'relative' }}>
            <div 
              className="canvas-wrapper" 
              ref={canvasRef}
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                backgroundImage: backgroundImg ? `url(${backgroundImg})` : 'none'
              }}
            >

            
            {/* Elements */}
            {elements.map(el => {
              const props = {
                key: el.id,
                element: el,
                isSelected: selectedId === el.id,
                onSelect: setSelectedId,
                onUpdate: updateElement,
                onDelete: () => deleteElement(el.id),
                onDuplicate: () => duplicateElement(el.id),
                onMoveUp: () => moveZIndex(el.id, 1),
                onMoveDown: () => moveZIndex(el.id, -1)
              };

              switch (el.type) {
                case 'text': return <TextElement {...props} />;
                case 'table': return <TableElement {...props} />;
                case 'image': return <ImageElement {...props} />;
                case 'date': return <DateElement {...props} />;
                default: return null;
              }
            })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
