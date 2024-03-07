import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import cx from "classnames";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";

import { TreeView } from "@_components/common";
import { TreeViewData } from "@_components/common/treeView/types";
import { DargItemImage, RootNodeUid } from "@_constants/main";
import { StageNodeIdAttr } from "@_node/file/handlers/constants";
import { THtmlNodeData } from "@_node/index";
import { TNode, TNodeUid } from "@_node/types";
import {
  isWebComponentDblClicked,
  onWebComponentDblClick,
  scrollToElement,
} from "@_pages/main/helper";
import { MainContext } from "@_redux/main";

import { setHoveredNodeUid } from "@_redux/main/nodeTree";
import {
  setActivePanel,
  setNavigatorDropdownType,
} from "@_redux/main/processor";
import { useAppState } from "@_redux/useAppState";
import { getCommandKey } from "@_services/global";
import { addClass, removeClass } from "@_services/main";
import { THtmlElementsReference } from "@_types/main";

import { useCmdk } from "./hooks/useCmdk";
import { useNodeTreeCallback } from "./hooks/useNodeTreeCallback";
import { useNodeViewState } from "./hooks/useNodeViewState";
import { Container } from "./nodeTreeComponents/Container";
import { DragBetweenLine } from "./nodeTreeComponents/DragBetweenLine";
import { ItemArrow } from "./nodeTreeComponents/ItemArrow";
import { ItemTitle } from "./nodeTreeComponents/ItemTitle";
import { NodeIcon } from "./nodeTreeComponents/NodeIcon";

const AutoExpandDelayOnDnD = 1 * 1000;
const dragAndDropConfig = {
  canDragAndDrop: true,
  canDropOnFolder: true,
  canDropOnNonFolder: true,
  canReorderItems: true,
};
const searchConfig = {
  canSearch: false,
  canSearchByStartingTyping: false,
  canRename: false,
};

const NodeTreeView = () => {
  const dispatch = useDispatch();
  const {
    osType,
    navigatorDropdownType,
    fileTree,
    currentFileUid,

    validNodeTree,

    nFocusedItem: focusedItem,
    nExpandedItems: expandedItems,
    nSelectedItems: selectedItems,
    hoveredNodeUid,

    fExpandedItemsObj: expandedItemsObj,
    htmlReferenceData,
  } = useAppState();
  const { addRunningActions } = useContext(MainContext);

  // ------ sync ------
  // cmdk
  useCmdk();

  // outline the hovered item
  const hoveredItemRef = useRef<TNodeUid>(hoveredNodeUid);
  useEffect(() => {
    if (hoveredItemRef.current === hoveredNodeUid) return;

    const curHoveredElement = document.querySelector(
      `#NodeTreeView-${hoveredItemRef.current}`,
    );
    curHoveredElement?.setAttribute(
      "class",
      removeClass(curHoveredElement.getAttribute("class") || "", "outline"),
    );
    const newHoveredElement = document.querySelector(
      `#NodeTreeView-${hoveredNodeUid}`,
    );
    newHoveredElement?.setAttribute(
      "class",
      addClass(newHoveredElement.getAttribute("class") || "", "outline"),
    );

    hoveredItemRef.current = hoveredNodeUid;
  }, [hoveredNodeUid]);

  // scroll to the focused item
  const focusedItemRef = useRef<TNodeUid>(focusedItem);
  useEffect(() => {
    if (focusedItemRef.current === focusedItem) return;

    const focusedElement = document.querySelector(
      `#NodeTreeView-${focusedItem}`,
    );
    focusedElement && scrollToElement(focusedElement, "auto");

    focusedItemRef.current = focusedItem;
  }, [focusedItem]);

  // build nodeTreeViewData
  const nodeTreeViewData = useMemo(() => {
    const data: TreeViewData = {};
    for (const uid in validNodeTree) {
      const node = validNodeTree[uid];
      data[uid] = {
        index: node.uid,
        data: node,
        children: node.children,
        isFolder: !node.isEntity,
        canMove: uid !== RootNodeUid,
        canRename: uid !== RootNodeUid,
      };
    }

    return data;
  }, [validNodeTree, expandedItems]);

  // node view state handlers
  const { cb_expandNode } = useNodeViewState();
  const [nextToExpand, setNextToExpand] = useState<TNodeUid | null>(null);

  const onPanelClick = useCallback(() => {
    dispatch(setActivePanel("node"));
    navigatorDropdownType && dispatch(setNavigatorDropdownType(null));
  }, [navigatorDropdownType]);

  // open web component
  const openWebComponent = useCallback(
    (item: TNodeUid) => {
      const nodeData = validNodeTree[item].data as THtmlNodeData;
      // check the element is wc
      if (
        isWebComponentDblClicked({
          nodeData,
          htmlReferenceData,
        })
      ) {
        onWebComponentDblClick({
          wcName: nodeData.nodeName,
          validNodeTree,
          dispatch,
          expandedItemsObj,
          fileTree,
        });
      }
    },
    [htmlReferenceData, validNodeTree, fileTree],
  );

  const isDragging = useRef<boolean>(false);
  const callbacks = useNodeTreeCallback(isDragging);

  const debouncedExpand = useCallback(
    debounce((uid) => {
      if (uid === nextToExpand) {
        cb_expandNode(uid);
      }
    }, AutoExpandDelayOnDnD),
    [cb_expandNode, nextToExpand],
  );

  return currentFileUid !== "" ? (
    <div
      id="NodeTreeView"
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        paddingBottom:"16px",
        maxHeight: "calc(100vh - 42px)",
      }}
      onClick={onPanelClick}
    >
      <TreeView
        width={"100%"}
        height={"auto"}
        info={{ id: "node-tree-view" }}
        data={nodeTreeViewData}
        focusedItem={focusedItem}
        selectedItems={selectedItems}
        expandedItems={expandedItems}
        renderers={{
          renderTreeContainer: (props) => <Container {...props} />,
          renderItemsContainer: (props) => <Container {...props} />,
          renderItem: (props) => {
            const htmlElementReferenceData =
              useMemo<THtmlElementsReference>(() => {
                const node = props.item.data as TNode;
                const nodeData = node.data as THtmlNodeData;
                const refData =
                  htmlReferenceData.elements[
                    nodeData.nodeName === "!doctype"
                      ? "!DOCTYPE"
                      : nodeData.nodeName
                  ];
                return refData;
              }, [props.item.data, cb_expandNode]);

            const onClick = useCallback(
              (e: React.MouseEvent) => {
                e.stopPropagation();

                !props.context.isFocused &&
                  addRunningActions(["nodeTreeView-focus"]);
                addRunningActions(["nodeTreeView-select"]);

                !props.context.isFocused && props.context.focusItem();

                e.shiftKey
                  ? props.context.selectUpTo()
                  : getCommandKey(e, osType)
                    ? props.context.isSelected
                      ? props.context.unselectItem()
                      : props.context.addToSelectedItems()
                    : props.context.selectItem();

                dispatch(setActivePanel("node"));

                navigatorDropdownType !== null &&
                  dispatch(setNavigatorDropdownType(null));
              },
              [props.context, navigatorDropdownType],
            );

            const onDoubleClick = useCallback(
              (e: React.MouseEvent) => {
                e.stopPropagation();
                openWebComponent(props.item.index as TNodeUid);
              },
              [props.item],
            );

            const onMouseEnter = useCallback((e: React.MouseEvent) => {
              const ele = e.target as HTMLElement;
              let _uid: TNodeUid | null = ele.getAttribute("id");
              // for the elements which are created by js. (ex: Web Component)
              let newHoveredElement: HTMLElement = ele;
              if (_uid === null || _uid === undefined) return;
              _uid = _uid?.substring(13, _uid.length);
              while (!_uid) {
                const parentEle = newHoveredElement.parentElement;
                if (!parentEle) break;

                _uid = parentEle.getAttribute(StageNodeIdAttr);
                !_uid ? (newHoveredElement = parentEle) : null;
              }

              // set hovered item
              if (_uid && _uid !== hoveredNodeUid) {
                dispatch(setHoveredNodeUid(_uid));
              }
            }, []);

            const onMouseLeave = useCallback(() => {
              dispatch(setHoveredNodeUid(""));
            }, []);

            const onDragStart = (e: React.DragEvent) => {
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setDragImage(DargItemImage, 0, 0);
              props.context.startDragging();

              isDragging.current = true;
            };

            const onDragEnter = (e: React.DragEvent) => {
              if (!props.context.isExpanded) {
                setNextToExpand(props.item.index as TNodeUid);
                debouncedExpand(props.item.index as TNodeUid);
              }
            };

            return (
              <li
                className={cx(
                  props.context.isSelected && "background-secondary",

                  props.context.isDraggingOver && "",
                  props.context.isDraggingOverParent && "",

                  props.context.isFocused && "",
                )}
                {...props.context.itemContainerWithChildrenProps}
              >
                <div
                  key={`NodeTreeView-${props.item.index}${props.item.data.data.nodeName}`}
                  id={`NodeTreeView-${props.item.index}`}
                  className={cx(
                    "justify-stretch",
                    "padding-xs",
                    "outline-default",

                    props.context.isSelected &&
                      "background-tertiary outline-none",
                    !props.context.isSelected &&
                      props.context.isFocused &&
                      "outline",

                    props.context.isDraggingOver && "outline",
                    props.context.isDraggingOverParent && "",
                  )}
                  style={{
                    flexWrap: "nowrap",
                    paddingLeft: `${props.depth * 18}px`,
                  }}
                  {...props.context.itemContainerWithoutChildrenProps}
                  {...props.context.interactiveElementProps}
                  onClick={onClick}
                  onDoubleClick={onDoubleClick}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  onFocus={() => {}}
                  onDragStart={onDragStart}
                  onDragEnter={onDragEnter}
                >
                  <div className="gap-s padding-xs" style={{ width: "100%" }}>
                    {props.arrow}

                    <NodeIcon
                      {...{
                        htmlElementReferenceData,
                        nodeName: props.item.data.data.nodeName,
                        componentTitle: props.title,
                      }}
                    />
                  </div>
                </div>

                {props.context.isExpanded ? <div>{props.children}</div> : null}
              </li>
            );
          },

          renderItemArrow: (props) => (
            <ItemArrow {...props} addRunningActions={addRunningActions} />
          ),
          renderItemTitle: (props) => <ItemTitle {...props} />,
          renderDragBetweenLine: (props) => <DragBetweenLine {...props} />,
        }}
        props={{
          ...dragAndDropConfig,
          ...searchConfig,
        }}
        callbacks={callbacks}
      />
    </div>
  ) : (
    <></>
  );
};

export default NodeTreeView;
