import classNames from 'classnames';
import React, { useRef, useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Tooltip } from '../Tooltip';

export interface TreeItem {
  id: string;
  label: string;
  value: string;
  isChecked?: boolean;
  isPartialChecked?: boolean;
  isExpanded?: boolean;
  isParent?: boolean;
  isChild?: boolean;
  parentId?: string;
  section?: string;
  children?: TreeItem[];
  isIndeterminate?: boolean;
}

interface TreeNode extends TreeItem {
  children: TreeNode[];
}

const ShowMoreTree = ({
  data,
  maxLength = 1,
  selectorType = 'parent',
  entityLabel = 'item',
  labelMaxWidth = 'max-w-[125px]',
  moreLabelClass = '',
  isBoundReq = true,
  renderInline = false,
}: {
  data: TreeItem[];
  maxLength?: number;
  selectorType?: 'parent' | 'child';
  entityLabel?: string;
  labelMaxWidth?: string;
  moreLabelClass?: string;
  isBoundReq?: boolean;
  renderInline?: boolean;
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [elBounding, setElBounding] = useState<DOMRect>();
  const [showUITooltip, setShowUITooltip] = useState(false);

  const buildTree = useCallback((items: TreeItem[]): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    const collect = (list: TreeItem[]) => {
      list.forEach((item) => {
        if (!nodeMap.has(item.id)) {
          nodeMap.set(item.id, { ...item, children: [] });
        }
        if (item.children?.length) collect(item.children);
      });
    };
    collect(items);
    const roots: TreeNode[] = [];
    nodeMap.forEach((node) => {
      if (node.parentId && nodeMap.has(node.parentId)) {
        nodeMap.get(node.parentId)!.children.push(node);
      } else if (!node.parentId) {
        roots.push(node);
      }
    });
    return roots;
  }, []);

  const displayItems = useMemo(
    () =>
      selectorType === 'parent'
        ? data.filter((item) => !item.parentId)
        : data.filter((item) => !!item.parentId),
    [data, selectorType]
  );

  const visibleItems = displayItems.slice(0, maxLength);
  const overflowItems = displayItems.slice(maxLength);

  const treeData = useMemo(() => buildTree(data), [data, buildTree]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, TreeNode>();
    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach((n) => {
        map.set(n.id, n);
        traverse(n.children);
      });
    };
    traverse(treeData);
    return map;
  }, [treeData]);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    cancelHide();
    hideTimer.current = setTimeout(() => setShowUITooltip(false), 500);
  }, [cancelHide]);

  const closeTooltip = useCallback(() => {
    cancelHide();
    setShowUITooltip(false);
  }, [cancelHide]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent | KeyboardEvent) => {
      if (event.key === 'Escape' && showUITooltip) {
        closeTooltip();
      }
    },
    [showUITooltip, closeTooltip]
  );

  const renderTreeNode = (node: TreeNode, depth: number = 0): React.ReactNode => (
    <div key={node.id} style={{ paddingLeft: depth * 10 }} className="w-full py-0.5">
      <div className={`${depth === 0 ? 'w-full border-b font-semibold' : ''}`}>{node.label}</div>
      {node.children.length > 0 && (
        <div className="text-sm">
          {node.children.map((child) => renderTreeNode(child, depth + 1))}
        </div>
      )}
    </div>
  );

  if (renderInline) {
    return <div className="w-full text-sm">{treeData.map((node) => renderTreeNode(node, 0))}</div>;
  }

  const handleMouseEnter = () => {
    cancelHide();
    setElBounding(anchorRef?.current?.getBoundingClientRect());
    setShowUITooltip(true);
  };

  const handleMouseLeave = () => {
    scheduleHide();
  };

  const renderTooltip = () => {
    const top = (elBounding?.top ?? 0) + 30;
    const left = elBounding?.left ?? 0;

    return (
      <div
        ref={tooltipRef}
        id="show_more_tree_tooltip"
        onMouseEnter={cancelHide}
        onMouseLeave={scheduleHide}
        onKeyDown={(e) => handleKeyDown(e)}
        className={classNames(
          'ui_tooltip bg-card pointer-events-auto fixed z-[9999] max-w-[450px] rounded-md p-0 text-sm break-words shadow-md transition-opacity duration-300 dark:border',
          isBoundReq && 'overflow-y-auto'
        )}
        style={isBoundReq ? { top, left, maxHeight: window.innerHeight - top - 5 } : { top, left }}
      >
        <div className="w-full p-2">{treeData.map((node) => renderTreeNode(node, 0))}</div>
      </div>
    );
  };

  const renderLabel = (item: TreeItem) => {
    const treeNode = nodeMap.get(item.id);
    const hasChildren = (treeNode?.children?.length ?? 0) > 0;

    const showSubtreeOnLabel =
      selectorType === 'parent' && hasChildren && overflowItems.length === 0;

    const triggerEl = () => (
      <div className="truncate">
        <span className="truncate-content">{item.label}</span>
      </div>
    );

    if (showSubtreeOnLabel && treeNode) {
      const subtreeTooltip = () => <div className="w-full p-2">{renderTreeNode(treeNode, 0)}</div>;
      return (
        <div className={labelMaxWidth}>
          <Tooltip triggerElement={triggerEl} tooltip={subtreeTooltip} tabIndex={0} />
        </div>
      );
    }

    const truncationTooltip = () => (
      <div className="w-full p-2">
        <span>{item.label}</span>
      </div>
    );

    return (
      <div className={labelMaxWidth}>
        <Tooltip
          triggerElement={triggerEl}
          tooltip={truncationTooltip}
          truncate={true}
          tabIndex={0}
        />
      </div>
    );
  };

  return (
    <div className="flex w-full flex-wrap gap-1">
      {visibleItems.map((item, i) => (
        <div
          key={`show_more_tree_${item.id}_${i}`}
          className={classNames('flex flex-row items-center justify-start')}
        >
          {renderLabel(item)}
          {i !== maxLength - 1 && i !== visibleItems.length - 1 ? ',' : ''}
        </div>
      ))}

      {overflowItems.length > 0 && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
          onKeyDown={(e) => handleKeyDown(e)}
          ref={anchorRef}
          id="show_more_tree_icon"
          tabIndex={0}
          role="button"
          aria-describedby="show_more_tree_tooltip"
          aria-expanded={showUITooltip}
          aria-label={`View ${overflowItems.length} more ${entityLabel}`}
          className={classNames(
            moreLabelClass,
            'focus-outline-primary focus-visible:outline-primary cursor-pointer rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
          )}
        >
          <div style={{ textWrap: 'nowrap' }} aria-hidden="true">
            +{overflowItems.length}
          </div>

          {showUITooltip && elBounding !== undefined && (
            <>{ReactDOM.createPortal(renderTooltip(), document.body)}</>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowMoreTree;
