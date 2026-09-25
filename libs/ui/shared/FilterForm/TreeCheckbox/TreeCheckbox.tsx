import { faChevronDown, faChevronUp } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { type NodeType, type TreeCheckboxProps } from './TreeCheckbox.type';

const TreeNode = ({
  node,
  onCheck,
  level,
  parentLabel,
  canHideNodes = true,
  onFocusChange,
  registerCheckbox,
  siblings,
  siblingIndex,
  maintainFocusWithinSelectionList,
  showCheckboxOnly,
  onExpand,
  isDarkTheme = false,
}: {
  node: NodeType;
  onCheck: (node: NodeType, checked: boolean) => void;
  level: number;
  parentLabel?: string;
  canHideNodes?: boolean;
  onFocusChange?: (nodeId: string) => void;
  registerCheckbox?: (id: string, ref: HTMLInputElement) => void;
  siblings?: NodeType[];
  siblingIndex?: number;
  maintainFocusWithinSelectionList?: boolean;
  showCheckboxOnly?: boolean;
  onExpand?: (node: NodeType) => void;
  isDarkTheme?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(!(node.expanded ?? false));
  const checkboxRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register this checkbox with the parent component
    if (registerCheckbox && checkboxRef?.current) {
      registerCheckbox(node.id, checkboxRef?.current);
    }
  }, [registerCheckbox, node.id]);

  // Update collapse state when node.expanded changes
  useEffect(() => {
    setIsCollapsed(!(node.expanded ?? false));
  }, [node.expanded]);

  const handleToggle = () => {
    setIsCollapsed((prevState) => !prevState);
    if (onExpand) {
      onExpand(node);
    }
  };
  const handleToggleFromLabel = (node) => {
    if (!node?.checked && isCollapsed && node?.type === 'parent') {
      setIsCollapsed(false);
      onExpand?.(node);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleToggleFromLabel(node);
    const isChecked = e.target.checked;

    // Notify parent about focus change
    if (onFocusChange) {
      onFocusChange(node.id);
    }

    onCheck(node, isChecked);

    // Only manage focus if specifically requested to do so via maintainFocusWithinSelectionList prop
    // This ensures the default tree doesn't have focus management
    if (!isChecked && siblings && siblingIndex !== undefined && maintainFocusWithinSelectionList) {
      // If we're in the selection list tree (maintainFocusWithinSelectionList is true),
      // AND node is marked as being in the selection list, manage focus
      if (node.inSelectionList) {
        // Try to find next visible sibling in selection list
        let nextFocusIndex = -1;
        for (let i = siblingIndex + 1; i < siblings.length; i++) {
          // Skip hidden nodes and nodes not in selection list
          if (siblings[i].hidden || !siblings[i].inSelectionList) {
            continue;
          }
          nextFocusIndex = i;
          break;
        }

        // If no next sibling, try previous siblings
        if (nextFocusIndex === -1) {
          for (let i = siblingIndex - 1; i >= 0; i--) {
            // Skip hidden nodes and nodes not in selection list
            if (siblings[i].hidden || !siblings[i].inSelectionList) {
              continue;
            }
            nextFocusIndex = i;
            break;
          }
        }

        // Focus the found sibling if any
        if (nextFocusIndex !== -1) {
          setTimeout(() => {
            const nextNode = siblings[nextFocusIndex];
            const nextCheckbox = document.getElementById(`checkbox_${nextNode.id}`);
            if (nextCheckbox) {
              nextCheckbox?.focus?.();
            }
          }, 0);
        }
      }
    }
  };

  // Handle keyboard navigation for the node
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        // Expand node if collapsed and has children
        if (isCollapsed && node.children && node.children.length > 0) {
          e.preventDefault();
          handleToggle();
        }
        break;
      case 'ArrowLeft':
        // Collapse if expanded, or go to parent if already collapsed
        if (!isCollapsed && node.children && node.children.length > 0) {
          e.preventDefault();
          handleToggle();
        }
        break;
      case 'Enter':
      case ' ': // Space key
        // Toggle checkbox on Enter or Space
        e.preventDefault();
        if (checkboxRef.current && !node.disabled) {
          checkboxRef.current.checked = !checkboxRef.current.checked;
          handleCheckboxChange({
            target: { checked: checkboxRef.current.checked },
          } as React.ChangeEvent<HTMLInputElement>);
        }
        break;
    }
  };

  const uniqueNodeId = `checkbox_${node.id}`;

  return (
    <div
      ref={nodeRef}
      tabIndex={-1}
      style={{ marginLeft: `${level > 0 ? '25' : '0'}px` }}
      className={`filter-text-sm my-2 ${node.hidden && canHideNodes ? 'hidden' : ''}`}
      role="listitem"
      aria-expanded={node.children && node.children.length > 0 ? !isCollapsed : undefined}
    >
      <div className="flex items-start justify-between px-4 py-1">
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={node?.checked ? true : false}
            onChange={handleCheckboxChange}
            disabled={node.disabled}
            onKeyDown={handleKeyDown}
            ref={(el) => {
              if (el) {
                checkboxRef.current = el;
                if (node.indeterminate !== undefined) {
                  el.indeterminate = node.indeterminate;
                }
              }
            }}
            id={uniqueNodeId}
            className={`checked:filter-checkbox-bg filter-text-primary mt-[1px] h-[1.1rem] w-[1.1rem] cursor-pointer rounded-[3px] border-1 ${node.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          />
          {!showCheckboxOnly && (
            <label className="ml-2" htmlFor={uniqueNodeId}>
              <div>{node.label}</div>
              {node?.children?.length > 0 && parentLabel && (
                <div className="text-xs text-[#5D5D5D]">{`${canHideNodes ? node?.children?.filter((i) => !i.hidden)?.length : node?.children?.length} ${parentLabel}`}</div>
              )}
            </label>
          )}
        </div>
        {node?.children?.length > 0 && (
          <button
            onClick={handleToggle}
            aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${node.label}`}
            aria-expanded={isCollapsed ? 'false' : 'true'}
            className="focus-indicator hover:underline"
          >
            <FontAwesomeIcon
              icon={isCollapsed ? faChevronDown : faChevronUp}
              className="font-semibold"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
      {!isCollapsed && node.children && node.children.length > 0 && (
        <div role="group" aria-label={`${node.label} children`}>
          {node.children.map((child, index) => (
            <TreeNode
              key={node.id + '-' + index}
              node={child}
              onCheck={onCheck}
              level={level + 1}
              parentLabel={parentLabel}
              onFocusChange={onFocusChange}
              registerCheckbox={registerCheckbox}
              siblings={node.children}
              siblingIndex={index}
              isDarkTheme={isDarkTheme}
              maintainFocusWithinSelectionList={maintainFocusWithinSelectionList}
              showCheckboxOnly={showCheckboxOnly}
              onExpand={onExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeCheckbox = ({
  options,
  defaultSelections = [],
  parentLabel,
  wrapperClass,
  onChange,
  requiresInitialOnChange = false,
  canHideNodes = true,
  onFocusChange,
  onEmptySelection,
  isLoading,
  expandAll,
  disableAll,
  searchTerm,
  maintainFocusWithinSelectionList,
  renderCustomNode,
  onExpand,
  showCheckboxOnly = false,
  isDarkTheme = false,
}: TreeCheckboxProps & {
  onFocusChange?: (nodeId: string) => void;
  onEmptySelection?: () => void;
  showCheckboxOnly?: boolean;
}) => {
  const [treeData, setTreeData] = useState<NodeType[]>([...options]);
  const [initialTrigger, setInitialTrigger] = useState<boolean>(requiresInitialOnChange);
  const checkboxesRef = useRef(new Map<string, HTMLInputElement>());
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

  // Handle initial expand all
  useEffect(() => {
    if (expandAll) {
      const expandNodes = (nodes: NodeType[]): NodeType[] => {
        return nodes.map((node) => ({
          ...node,
          expanded: true,
          children: node.children ? expandNodes(node.children) : undefined,
        }));
      };

      setTreeData(expandNodes([...options]));
    }
  }, [expandAll, options]);

  // Handle disable all
  useEffect(() => {
    if (disableAll !== undefined) {
      const disableNodes = (nodes: NodeType[]): NodeType[] => {
        return nodes.map((node) => ({
          ...node,
          disabled: disableAll,
          children: node.children ? disableNodes(node.children) : undefined,
        }));
      };

      setTreeData(disableNodes([...treeData]));
    }
  }, [disableAll]);

  // Handle search filtering - FIXED to properly expand parent nodes when children match
  useEffect(() => {
    if (searchTerm) {
      const findMatchingNodes = (
        nodes: NodeType[]
      ): { hasMatch: boolean; updatedNodes: NodeType[] } => {
        const updatedNodes = nodes.map((node) => {
          // Process children first to find matches in descendants
          let hasMatchingDescendants = false;
          let filteredChildren: NodeType[] = [];

          if (node.children && node.children.length > 0) {
            const childResult = findMatchingNodes(node.children);
            hasMatchingDescendants = childResult.hasMatch;
            filteredChildren = childResult.updatedNodes;
          }

          // Check if current node matches search term
          const nodeMatches = node.label?.toLowerCase().includes(searchTerm.toLowerCase());

          // Node should be visible if it matches or has matching descendants
          const visible = nodeMatches || hasMatchingDescendants;

          return {
            ...node,
            hidden: !visible,
            // Expand node if it has matching descendants to reveal them
            expanded: hasMatchingDescendants ? true : node.expanded,
            children: node.children ? filteredChildren : undefined,
          };
        });

        return {
          hasMatch: updatedNodes.some((node) => !node.hidden),
          updatedNodes,
        };
      };

      const searchResult = findMatchingNodes([...options]);
      setTreeData(searchResult.updatedNodes);
    } else {
      // Reset visibility when search term is cleared
      const resetVisibility = (nodes: NodeType[]): NodeType[] => {
        return nodes.map((node) => ({
          ...node,
          hidden: false,
          children: node.children ? resetVisibility(node.children) : undefined,
        }));
      };

      setTreeData(resetVisibility([...options]));
    }
  }, [searchTerm, options]);

  const updateParentStatus = (parentNode: NodeType) => {
    if (!parentNode.children || parentNode.children.length === 0) return;

    const allSelected = parentNode.children.every((child) => child.checked);
    const someSelected = parentNode.children.some((child) => child.checked || child.indeterminate);

    if (allSelected) {
      parentNode.checked = true;
      parentNode.indeterminate = false;
    } else if (someSelected) {
      parentNode.checked = false;
      parentNode.indeterminate = true;
    } else {
      parentNode.checked = false;
      parentNode.indeterminate = false;
    }
  };

  const setDefaultSelections = (nodes: NodeType[], selections: NodeType[]): NodeType[] => {
    return nodes.map((node) => {
      const matchingSelection = selections.find((selection) => selection.id === node.id);
      if (matchingSelection) {
        node.checked = true;
        if (matchingSelection.children && matchingSelection.children.length > 0) {
          node.children = setDefaultSelections(node.children, matchingSelection.children);
        }
      }

      if (node.children) {
        node.children = setDefaultSelections(node.children, selections);
        updateParentStatus(node);
      }

      return node;
    });
  };

  useEffect(() => {
    const updatedTreeData = setDefaultSelections([...options], defaultSelections);
    setTreeData(updatedTreeData);
    // Return selected nodes via onChange after setting default selections
    const updatedSelectedNodes = getSelectedNodes(updatedTreeData);
    if (onChange && initialTrigger) {
      onChange(updatedSelectedNodes);
    } else {
      onChange?.(updatedSelectedNodes, 'initialTrigger');
      setInitialTrigger(true);
    }
  }, [defaultSelections]);

  useEffect(() => {
    setTreeData(options);
  }, [options]);

  const updateChildSelection = (nodes: NodeType[], checked: boolean): NodeType[] => {
    return nodes.map((n) => {
      // Skip disabled nodes if they exist
      if (n.disabled) {
        return n;
      }

      const updatedNode = { ...n, checked, indeterminate: false };
      if (n.children) {
        updatedNode.children = updateChildSelection(n.children, checked); // Recursively update children
      }
      return updatedNode;
    });
  };

  const registerCheckbox = (id: string, ref: HTMLInputElement) => {
    checkboxesRef?.current.set(id, ref);
  };

  const handleCheckChange = (node: NodeType, checked: boolean) => {
    const updateTreeData = (nodes: NodeType[]): NodeType[] => {
      return nodes.map((n) => {
        if (n.id === node.id) {
          n.checked = checked;
          n.indeterminate = false;
          if (n.children) {
            n.children = updateChildSelection(n.children, checked);
          }
        }
        if (n.children) {
          n.children = updateTreeData(n.children);
          updateParentStatus(n);
        }
        return n;
      });
    };

    const updatedTreeData = updateTreeData(treeData);
    setTreeData(updatedTreeData);

    const updatedSelectedNodes = getSelectedNodes(updatedTreeData);

    // FIXED: Only call onEmptySelection if maintainFocusWithinSelectionList is true
    // This ensures only the selection list view can trigger this callback
    if (updatedSelectedNodes.length === 0 && onEmptySelection && maintainFocusWithinSelectionList) {
      setTimeout(onEmptySelection, 0);
    }

    if (onChange) {
      onChange(updatedSelectedNodes, true, node.id);
    }
  };

  const handleExpandNode = (node: NodeType) => {
    const updateNodeExpand = (nodes: NodeType[]): NodeType[] => {
      return nodes.map((n) => {
        if (n.id === node.id) {
          const newExpandedState = !n.expanded;
          n.expanded = newExpandedState;

          if (onExpand) {
            onExpand(n, newExpandedState);
          }
        }
        if (n.children) {
          n.children = updateNodeExpand(n.children);
        }
        return n;
      });
    };

    setTreeData(updateNodeExpand([...treeData]));
  };

  const getSelectedNodes = (nodes: NodeType[]): NodeType[] => {
    return nodes.reduce((acc, node) => {
      if (node.checked || node.indeterminate) {
        const selectedNode = { ...node, children: [] };
        if (node.children && node.children.length > 0) {
          selectedNode.children = getSelectedNodes(node.children);
        }
        if (selectedNode.children.length > 0 || selectedNode.checked) {
          acc.push(selectedNode);
        }
      }
      return acc;
    }, [] as NodeType[]);
  };

  // Handle focus change within TreeCheckbox
  const handleFocusChange = (nodeId: string) => {
    setFocusedNodeId(nodeId);
    if (onFocusChange) {
      onFocusChange(nodeId);
    }
  };

  // Get all visible nodes in a flat structure for keyboard navigation
  const getAllVisibleNodes = (nodes: NodeType[], result: NodeType[] = []): NodeType[] => {
    for (const node of nodes) {
      if (!node.hidden || !canHideNodes) {
        result.push(node);
        if (node.children && node.children.length > 0 && node.expanded) {
          getAllVisibleNodes(node.children, result);
        }
      }
    }
    return result;
  };

  // Handle keyboard navigation for the tree
  const handleTreeKeyDown = (e: React.KeyboardEvent) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      return;
    }

    e.preventDefault();

    const visibleNodes = getAllVisibleNodes(treeData);
    if (visibleNodes.length === 0) return;

    // Find current focused node index
    const currentIndex = focusedNodeId
      ? visibleNodes.findIndex((node) => node.id === focusedNodeId)
      : -1;

    let nextNode: NodeType | null = null;

    switch (e.key) {
      case 'ArrowUp':
        // Move to previous visible node
        if (currentIndex > 0) {
          nextNode = visibleNodes[currentIndex - 1];
        }
        break;
      case 'ArrowDown':
        // Move to next visible node
        if (currentIndex < visibleNodes.length - 1) {
          nextNode = visibleNodes[currentIndex + 1];
        } else if (currentIndex === -1) {
          // If nothing is focused, focus the first item
          nextNode = visibleNodes[0];
        }
        break;
      case 'Home':
        // Move to first visible node
        nextNode = visibleNodes[0];
        break;
      case 'End':
        // Move to last visible node
        nextNode = visibleNodes[visibleNodes.length - 1];
        break;
    }

    if (nextNode) {
      const checkboxId = `checkbox_${nextNode.id}`;
      const nextElement = document.getElementById(checkboxId);
      if (nextElement) {
        nextElement.focus();
        setFocusedNodeId(nextNode.id);
        if (onFocusChange) {
          onFocusChange(nextNode.id);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className={`flex h-full items-center justify-center ${wrapperClass}`}>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-auto py-1 ${wrapperClass}`}
      onKeyDown={handleTreeKeyDown}
      role="list"
    >
      {treeData.map((node, index) =>
        renderCustomNode ? (
          <div key={node.id} className={node.hidden ? 'hidden' : ''}>
            {renderCustomNode(node, {
              handleCheck: handleCheckChange,
              handleExpand: () => handleExpandNode(node),
            })}
          </div>
        ) : (
          <TreeNode
            key={node.id}
            node={node}
            onCheck={handleCheckChange}
            level={0}
            parentLabel={parentLabel}
            canHideNodes={canHideNodes}
            onFocusChange={handleFocusChange}
            registerCheckbox={registerCheckbox}
            siblings={treeData}
            siblingIndex={index}
            maintainFocusWithinSelectionList={maintainFocusWithinSelectionList}
            showCheckboxOnly={showCheckboxOnly}
            onExpand={handleExpandNode}
          />
        )
      )}
    </div>
  );
};

export default TreeCheckbox;
