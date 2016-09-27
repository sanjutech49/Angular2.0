var common;
(function (common) {
    // Moves item to another collection of the same type.
    function moveItemTo(index, src, dest) {
        if (src) {
            dest.push(angular.copy(src[index]));
        }
    }
    common.moveItemTo = moveItemTo;
    // Delete an object from the collection
    function deleteItem(itemIndex, items) {
        items.splice(itemIndex, 1);
    }
    common.deleteItem = deleteItem;
    //            // Find the index of a given object in a collection
    function indexOfItem(obj, items, fromIndex) {
        if (fromIndex == null) {
            fromIndex = 0;
        }
        else if (fromIndex < 0) {
            fromIndex = Math.max(0, items.length + fromIndex);
        }
        for (var i = fromIndex, j = items.length; i < j; i++) {
            if (items[i] === obj)
                return i;
        }
        return -1;
    }
    common.indexOfItem = indexOfItem;
})(common || (common = {}));
//# sourceMappingURL=common.collections.js.map