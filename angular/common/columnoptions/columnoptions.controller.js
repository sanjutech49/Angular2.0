(function () {
    'use strict';
    angular.module('common')
        .controller('columnOptionsController', columnOptionsController);

    columnOptionsController.$inject = ['$scope', '$modalStack', 'modalObject'];

    function columnOptionsController($scope, $modalStack, modalObject) {
            
            //shallow copy of an array is enough since we expect array of strings
            var availableColumns = convertToArrayOfObjects(removeElementsFromArray(modalObject.availableColumns.slice(), modalObject.selectedColumns));
            var selectedColumns = convertToArrayOfObjects(modalObject.selectedColumns);
            var currentlySelectedColumn = {
                available: -1, selected: -1
            }
            //shift section is defined for section that is expanding/shrinking with shift + arrow up/arrow down
            var shiftSection = {
                available: { startIndex: -1, endIndex: -1 },
                selected: {startIndex: -1, endIndex: -1}
            }
            var listInFocus = '';
            sortByColumnName(availableColumns);

            var vm = this;
            vm.modalTitle = modalObject.modalTitle;
            vm.availableColumnsTitle = modalObject.availableColumnsTitle;
            vm.selectedColumnsTitle = modalObject.selectedColumnsTitle;
            vm.availableColumns = availableColumns;
            vm.selectedColumns = selectedColumns;
            vm.removeElementsFromArray = removeElementsFromArray;
            vm.sortByColumnName = sortByColumnName;
            vm.convertToArrayOfObjects = convertToArrayOfObjects;
            vm.convertToArrayOfStrings = convertToArrayOfStrings;
            vm.columnOptionsHandler = columnOptionsHandler;
            vm.moveElementInArray = moveElementInArray;
            vm.moveTo = moveTo;
            vm.moveUp = moveUp;
            vm.moveDown = moveDown;
            vm.close = close;
            vm.update = update;

            function removeElementsFromArray(removeFrom, elements)
            {
                for (var i = 0; i < elements.length; i++)
                {
                    if (removeFrom.indexOf(elements[i]) != -1)
                    {
                        removeFrom.splice(removeFrom.indexOf(elements[i]), 1);
                    }
                }
                return removeFrom;
            }

            function sortByColumnName(array)
            {
                array.sort(function (a, b) {
                    if (a.columnName >= b.columnName) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                });
            }

            function moveElementInArray(array, old_index, new_index) {
                //this function moves one element in array from old_index to new_index
                if (new_index < 0 || new_index >= array.length || old_index < 0 || old_index >= array.length) return;
                array.splice(new_index, 0, array.splice(old_index, 1)[0]);
            };

            function convertToArrayOfObjects(arrayOfStrings)
            {
                var arrayOfObjects = [arrayOfStrings.length];
                for (var i = 0; i < arrayOfStrings.length; i++) {
                    arrayOfObjects[i] = {};
                    arrayOfObjects[i].columnName = arrayOfStrings[i];
                }
                return arrayOfObjects;
            }

            function convertToArrayOfStrings(arrayOfObjects)
            {
                var arrayOfStrings = [arrayOfObjects.length];
                for (var i = 0; i < arrayOfObjects.length; i++) {
                    arrayOfStrings[i] = arrayOfObjects[i].columnName;
                }
                return arrayOfStrings;
            }

            function moveUp()
            {
                if (!selectedColumns[0] || selectedColumns[0].selected) return;
                for (var i = 1; i < selectedColumns.length; i++) {
                    if (selectedColumns[i].selected) {
                        moveElementInArray(selectedColumns, i, i - 1);
                    }
                }
            }

            function moveDown() {
                if (!selectedColumns[selectedColumns.length - 1] || selectedColumns[selectedColumns.length - 1].selected) return;
                for (var i = selectedColumns.length - 1; i >= 0; i--) {
                    if (selectedColumns[i].selected) {
                        moveElementInArray(selectedColumns, i, i + 1);
                    }
                }
            }

            function moveTo(event, moveFrom, moveTo, doSort, index) {
                //this function moves all selected elements from moveFrom to moveTo array, and sort moveTo array if doSort flag is set to true
                //stopPropagation() is called to prevent calling event handler for mouse click on row when we click on array left/right
                event.stopPropagation();

                moveFrom[index].selected = moveFrom[index].selected ? !moveFrom[index].selected : true;
                moveFrom[index].selected = false;
                moveFrom[index].hover = false;
                moveTo.push(moveFrom.splice(index, 1)[0]);

                if (doSort)
                {
                    sortByColumnName(moveTo);
                }
            }

            function selectShiftSection(list, listFlag)
            {
                //startIndex can be smaller or greater than endIndex
                var smallerIndex = shiftSection[listFlag].startIndex <= shiftSection[listFlag].endIndex ? shiftSection[listFlag].startIndex : shiftSection[listFlag].endIndex;
                var greaterIndex = shiftSection[listFlag].startIndex <= shiftSection[listFlag].endIndex ? shiftSection[listFlag].endIndex : shiftSection[listFlag].startIndex;
                for (var i = 0; i < list.length; i++)
                {
                    //selecting all elements between smaller and greaterIndex, and deselecting elements outside of that range
                    list[i].selected = (i >= smallerIndex && i <= greaterIndex);
                }
            }
           
            function columnOptionsHandler(event, listFlag, index)
            {
                if (common.string.isNullOrWhiteSpace(listFlag)) return;

                listInFocus = listFlag;
                var list = listFlag == 'available' ? availableColumns : selectedColumns;
                
                if (event.keyCode == 38 && event.shiftKey) {
                    //arrow up + shift
                    if (currentlySelectedColumn[listFlag] <= 0) return;
                    currentlySelectedColumn[listFlag] = currentlySelectedColumn[listFlag] - 1;
                    shiftSection[listFlag].endIndex--;
                    selectShiftSection(list, listFlag);
                }
                else if (event.keyCode == 40 && event.shiftKey) {
                    //arrow down + shift
                    if (currentlySelectedColumn[listFlag] >= list.length - 1) return;
                    currentlySelectedColumn[listFlag] = currentlySelectedColumn[listFlag] + 1;
                    shiftSection[listFlag].endIndex++;
                    selectShiftSection(list, listFlag);
                }
                else if (event.shiftKey) {
                    //mouse click + shift
                    if (currentlySelectedColumn[listFlag] == -1) return;
                    //we need to define smaller and greater indexes since newly clicked row can be above or below currently clicked row
                    var smallerIndex = currentlySelectedColumn[listFlag] < index ? currentlySelectedColumn[listFlag] : index;
                    var greaterIndex = currentlySelectedColumn[listFlag] < index ? index + 1 : currentlySelectedColumn[listFlag] + 1;
                    for (var i = 0; i < list.length; i++)
                    {
                        //selecting all elements between smaller and greaterIndex, and deselecting elements outside of that range
                        list[i].selected = (i >= smallerIndex && i < greaterIndex);
                    }
                    shiftSection[listFlag].startIndex = currentlySelectedColumn[listFlag];
                    shiftSection[listFlag].endIndex = index;
                    currentlySelectedColumn[listFlag] = index;
                }
                else if (event.ctrlKey) {
                    //mouse click + ctrl
                    list[index].selected = list[index].selected ? !list[index].selected : true;
                    currentlySelectedColumn[listFlag] = list[index].selected ? index : -1;
                    //we need to define beginning index of shift section (shift section is global) in case next event is shift + click
                    if (currentlySelectedColumn[listFlag] != -1 && ((list[index - 1] && list[index - 1].selected) || (list[index + 1] && list[index + 1].selected)))
                    {
                        //this is special case when there exist previous or next selected row regarding to newly clicked row
                        //in this special case shiftSection expands and will include previous/next element, so we define just endIndex
                        shiftSection[listFlag].endIndex = currentlySelectedColumn[listFlag];
                    }
                    else if (currentlySelectedColumn[listFlag] != -1)
                    {
                        //in this case where there is no consecutive selected row shiftSection will containt just one element (newly clicked row)
                        shiftSection[listFlag].startIndex = currentlySelectedColumn[listFlag];
                        shiftSection[listFlag].endIndex = currentlySelectedColumn[listFlag];
                    }
                    else
                    {
                        //this is default case which shiftSection sets to undefined
                        shiftSection[listFlag].startIndex = -1;
                        shiftSection[listFlag].endIndex = -1;
                    }
                }
                else {
                    //just mouse click
                    list[index].selected = list[index].selected ? !list[index].selected : true;
                    for (var i = 0; i < list.length; i++) {
                        if (i != index) list[i].selected = false;
                    }
                    currentlySelectedColumn[listFlag] = list[index].selected ? index : -1;
                    shiftSection[listFlag].startIndex = currentlySelectedColumn[listFlag];
                    shiftSection[listFlag].endIndex = currentlySelectedColumn[listFlag];
                }
               
            };
            function close() {
                $modalStack.dismissAll('close');
            };
            function update() {
                if (modalObject.update)
                {
                    modalObject.update(convertToArrayOfStrings(selectedColumns));
                }        
                close();
            };
        }
})();