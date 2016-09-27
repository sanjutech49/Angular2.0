module common {

   // Moves item to another collection of the same type.
    export function moveItemTo<T>(index: number, src: srv.ICollection<T>, dest: srv.ICollection<T>): void {
        if (src) {
             dest.push(angular.copy(src[index]));
        }
    }
    
    // Delete an object from the collection
    export function deleteItem(itemIndex: number, items) {
        items.splice(itemIndex, 1);
    }

    //            // Find the index of a given object in a collection
    export function indexOfItem<T>(obj: T, items: T[], fromIndex?: number): number {
        if (fromIndex == null) {
            fromIndex = 0;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, items.length + fromIndex);
        }
        for (var i = fromIndex, j = items.length; i < j; i++) {
            if (items[i] === obj)
                return i;
        }
        return -1;
    }
}
