// keep track of which Meshes are under the pointer, help ensure only one handles each click/drag
import { Mesh } from 'three'

// todo: trigger color animation back to unfocused when moved from top of queue

export const addToHoverQueue = (hoverQueue: Mesh[], meshToAdd: Mesh) => {
    if (hoverQueue.includes(meshToAdd)) {
        console.log('WARNING: mesh already in hover queue -> ignoring');
        return hoverQueue;
    }
    return [...hoverQueue, meshToAdd];
}

export const removeFromHoverQueue = (hoverQueue: Mesh[], meshToRemove: Mesh) => {
    return hoverQueue.filter((mesh) => mesh !== meshToRemove);
}

export const isOnTopOfHoverQueue = (hoverQueue: Mesh[], meshToCheck: Mesh) => {
    if (hoverQueue[0] == meshToCheck) {
        return true;
    } else {
        return false;
    }
}
