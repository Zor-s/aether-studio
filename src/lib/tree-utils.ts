import { CanvasElement } from "@/types/builder";

/**
 * Recursively finds all descendant element IDs under a given parent ID.
 */
export function getDescendantIds(elements: CanvasElement[], parentId: string): Set<string> {
  const deletedIds = new Set<string>([parentId]);
  let foundDescendant = true;

  while (foundDescendant) {
    foundDescendant = false;
    elements.forEach((element) => {
      if (element.parentId && deletedIds.has(element.parentId) && !deletedIds.has(element.id)) {
        deletedIds.add(element.id);
        foundDescendant = true;
      }
    });
  }

  return deletedIds;
}

/**
 * Removes an element and all of its descendants from the canvas elements tree.
 */
export function deleteElementTree(elements: CanvasElement[], id: string): {
  nextElements: CanvasElement[];
  deletedIds: Set<string>;
} {
  const deletedIds = getDescendantIds(elements, id);
  const nextElements = elements.filter((el) => !deletedIds.has(el.id));
  return { nextElements, deletedIds };
}

/**
 * Renames a specific element by ID in the canvas tree.
 */
export function renameElementTree(elements: CanvasElement[], id: string, name: string): CanvasElement[] {
  return elements.map((el) => (el.id === id ? { ...el, name } : el));
}

/**
 * Duplicates an element and all of its descendants, appending them directly after the original.
 */
export function duplicateElementTree(elements: CanvasElement[], id: string): {
  nextElements: CanvasElement[];
  clonedRoot: CanvasElement | null;
} {
  const elementMap = new Map(elements.map((el) => [el.id, el]));

  const getDescendants = (parentId: string): CanvasElement[] => {
    const result: CanvasElement[] = [];
    elements.forEach((el) => {
      if (el.parentId === parentId) {
        result.push(el);
        result.push(...getDescendants(el.id));
      }
    });
    return result;
  };

  const original = elementMap.get(id);
  if (!original) return { nextElements: elements, clonedRoot: null };

  const targetIdx = elements.findIndex((el) => el.id === id);
  if (targetIdx === -1) return { nextElements: elements, clonedRoot: null };

  const cloneIdMap = new Map<string, string>();
  const timestamp = Date.now();
  let cloneCounter = 0;

  const cloneElement = (el: CanvasElement, newParentId?: string): CanvasElement => {
    const newId = `el-${timestamp}-${cloneCounter++}`;
    cloneIdMap.set(el.id, newId);
    return {
      ...el,
      id: newId,
      parentId: newParentId,
      name: el.id === id ? (el.name ? `${el.name} copy` : undefined) : el.name,
      styles: {
        ...el.styles,
        mobile: el.styles.mobile ? { ...el.styles.mobile } : undefined,
        tablet: el.styles.tablet ? { ...el.styles.tablet } : undefined,
      },
    };
  };

  const elementsToClone = [original, ...getDescendants(id)];
  const clonedElements: CanvasElement[] = [];

  elementsToClone.forEach((el) => {
    const newParentId = el.id !== id && el.parentId ? cloneIdMap.get(el.parentId) : el.parentId;
    clonedElements.push(cloneElement(el, newParentId));
  });

  const nextElements = [...elements];
  nextElements.splice(targetIdx + 1, 0, ...clonedElements);
  return { nextElements, clonedRoot: clonedElements[0] || null };
}

/**
 * Moves an element up or down relative to its siblings under the same parent.
 */
export function moveElementTree(elements: CanvasElement[], id: string, direction: "up" | "down"): CanvasElement[] {
  const idx = elements.findIndex((el) => el.id === id);
  if (idx === -1) return elements;

  const element = elements[idx];
  const siblingIndexes = elements
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.parentId === element.parentId)
    .map(({ index }) => index);

  const siblingPosition = siblingIndexes.indexOf(idx);
  const nextSiblingPosition = direction === "up" ? siblingPosition - 1 : siblingPosition + 1;
  const newIdx = siblingIndexes[nextSiblingPosition];
  if (newIdx === undefined) return elements;

  const nextElements = [...elements];
  const [moved] = nextElements.splice(idx, 1);
  nextElements.splice(newIdx, 0, moved);
  return nextElements;
}

/**
 * Reorders elements sharing the same parentId on the canvas.
 */
export function reorderElementsTree(elements: CanvasElement[], sourceId: string, targetId: string): CanvasElement[] {
  const sourceIdx = elements.findIndex((el) => el.id === sourceId);
  const targetIdx = elements.findIndex((el) => el.id === targetId);
  if (sourceIdx === -1 || targetIdx === -1) return elements;
  if (elements[sourceIdx].parentId !== elements[targetIdx].parentId) return elements;

  const nextElements = [...elements];
  const [moved] = nextElements.splice(sourceIdx, 1);
  nextElements.splice(targetIdx, 0, moved);
  return nextElements;
}
