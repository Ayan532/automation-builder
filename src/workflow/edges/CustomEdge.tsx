import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { type EdgeProps, getBezierPath, useEdges, useReactFlow } from 'reactflow';
import { Plus } from 'lucide-react';
import { SAMPLE_APPS } from '../workflow-data';

const CustomEdge = (props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    source,
    data
  } = props;
  
  const [isHovered, setIsHovered] = useState(false);
  const [showAppMenu, setShowAppMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const edges=useEdges()
  
  const { getNode, setNodes, setEdges, getEdges } = useReactFlow();
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAppMenu(false);
        setShowTypeMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAppMenu(true);
    setShowTypeMenu(false);
    setSelectedApp(null);
  };
  
  const handleAppSelect = (appId: string) => {
    setSelectedApp(appId);
    setShowAppMenu(false);
    setShowTypeMenu(true);
  };
  
  const handleAddNode = useCallback((appId: string, nodeType: string, typeKey: string) => {
    // Get source node
    const sourceNode = getNode(source);
    if (!sourceNode) return;
    
    // Calculate position for the new node
    const middleX = (sourceX + targetX) / 2;
    const middleY = (sourceY + targetY) / 2;
    
    // Get app and action data
    const app = SAMPLE_APPS[appId as keyof typeof SAMPLE_APPS];
    let actionData = null;
    if (nodeType === 'action' && app && app.actions) {
      const appActions = app.actions as Record<string, any>;
      actionData = appActions[typeKey] || null;
    }
    
    if (!actionData) return;
    
    // Check if this is a conditional node
    const isConditional = appId === 'core' && typeKey === 'condition';
    
    // Create a new node
    const newNodeId = `${isConditional ? 'condition' : 'action'}-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: isConditional ? 'conditional' : 'action',
      position: { 
        x: middleX - 110, 
        y: middleY - 60 
      },
      data: { 
        appId,
        typeKey: typeKey,
        label: actionData.label,
        description: actionData.description,
        config: {},
        isEmpty: false,
        branches: isConditional ? [] : undefined
      }
    };
    
    // Get the current edge
    const currentEdge = getEdges().find(e => e.id === id);
    console.log({currentEdge})
    if (!currentEdge) return;
    
    const targetId = currentEdge.target;
    
    // Remove ALL edges between source and target
    // This ensures no duplicate links remain
      // Remove ONLY the specific edge being split
  const filterEdges= edges.filter(e => e.id !== currentEdge.id)

  // Add new node
  setNodes(nodes => [...nodes, newNode]);

  // Create new edges using currentEdge's source and target
  setEdges(edges => [
    ...filterEdges,
    {
      id: `e${source}-${newNodeId}`,
      source: source,
      target: newNodeId,
      type: 'custom'
    },
    {
      id: `e${newNodeId}-${targetId}`,
      source: newNodeId,
      target: targetId,
      type: 'custom'
    }
  ]);

  // Clean up
  setShowAppMenu(false);
  setShowTypeMenu(false);
  setSelectedApp(null);

  }, [id, getNode, setNodes, getEdges, setEdges]);
  
  // Safely check if this edge has condition data
  const hasCondition = data && data.condition;
  
  return (
    <>
      <path
        id={id}
        style={{
          stroke: hasCondition ? '#f59e0b' : '#6366f1', // Amber color for conditional edges
          strokeWidth: 2,
          ...style,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd="url(#react-flow__arrowend)"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Condition label */}
      {hasCondition && (
        <foreignObject
          width={120}
          height={24}
          x={labelX - 60}
          y={labelY - 30}
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div
            className="condition-label"
            style={{
              background: '#fef3c7',
              color: '#92400e',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              textAlign: 'center',
              border: '1px solid #f59e0b',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {data && data.condition === 'default' ? 'Default (else)' : data && data.condition}
          </div>
        </foreignObject>
      )}
      
      {/* Plus button */}
      {isHovered && (
        <foreignObject
          width={24}
          height={24}
          x={labelX - 12}
          y={labelY - 12}
          className="edge-button-foreignobject"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div
            className="edge-button-container"
            style={{
              background: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #6366f1',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onClick={handleAddButtonClick}
          >
            <Plus size={14} color="#6366f1" />
          </div>
        </foreignObject>
      )}
      
      {/* App selection dropdown menu */}
      {showAppMenu && (
        <foreignObject
          width={240}
          height={320}
          x={labelX - 120}
          y={labelY + 20}
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div 
            ref={menuRef}
            className="app-menu"
            style={{
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              maxHeight: '320px',
              overflowY: 'auto'
            }}
          >
            <div style={{ padding: '10px', borderBottom: '1px solid #e2e8f0', fontWeight: 500, fontSize: '14px' }}>
              Select App
            </div>
            <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {Object.values(SAMPLE_APPS).map(app => (
                  <div 
                    key={app.id} 
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    //   ':hover': { borderColor: '#6366f1' }
                    }}
                    onClick={() => handleAppSelect(app.id)}
                  >
                    <div 
                      style={{ 
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '8px'
                      }}
                      className={app.color}
                    >
                      <span style={{ fontSize: '16px' }}>{app.icon}</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{app.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </foreignObject>
      )}
      
      {/* Action selection dropdown menu */}
      {showTypeMenu && selectedApp && (
        <foreignObject
          width={240}
          height={320}
          x={labelX - 120}
          y={labelY + 20}
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div 
            ref={menuRef}
            className="action-menu"
            style={{
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              maxHeight: '320px',
              overflowY: 'auto'
            }}
          >
            <div style={{ padding: '10px', borderBottom: '1px solid #e2e8f0', fontWeight: 500, fontSize: '14px' }}>
              Select Action
            </div>
            <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '8px' }}>
              {Object.entries((SAMPLE_APPS[selectedApp as keyof typeof SAMPLE_APPS]?.actions || {}) as Record<string, any>).map(([key, action]) => (
                <div 
                  key={key} 
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    // ':hover': { borderColor: '#6366f1' }
                  }}
                  onClick={() => handleAddNode(selectedApp, 'action', key)}
                >
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>
                    {action.label}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    {action.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </foreignObject>
      )}
    </>
  );
};

export default memo(CustomEdge);