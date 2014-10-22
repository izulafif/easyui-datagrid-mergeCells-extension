/*
 * Descr: Merge equal columns which indicated by the fields param 
 *
 * Example: 
 *      $("selector").datagrid("mergeEqualCells", "colName")
 *      $("selector").datagrid("mergeEqualCells", ["colName1", "colName2"])
 */
$.extend($.fn.datagrid.methods, {
    mergeEqualCells: function(jq, fields) {
        // 参数处理
        if (!fields) {
            throw "field is not designated";
        }

        if (typeof fields === "string") {
            fields = [fields];
        }

        return jq.each(function() {
            var self = $(this),
                fieldValues = {},
                rows = self.datagrid("getRows"),
                lastIndex = rows.length - 1;

            $.each(fields, function(i, fieldName) {
                fieldValues[fieldName] = {
                    currentValue: null,
                    startIndex: -1
                };
            });

            // 遍历行数据，寻找相同的列值
            $.each(rows, function(rowIndex, row) {
                $.each(fields, function(i, fieldName) {
                    // 如果当前行的当前列与前一行的当前列值不同、或者当前行是最后一行
                    if ((fieldValues[fieldName].currentValue !== row[fieldName]) || rowIndex === lastIndex) {
                        if (fieldValues[fieldName].startIndex < (rowIndex - 1)) {
                            self.datagrid("mergeCells", {
                                index: fieldValues[fieldName].startIndex,
                                field: fieldName,
                                rowspan: rowIndex + 1 - fieldValues[fieldName].startIndex
                            });
                        }

                        if (rowIndex !== lastIndex) {
                            fieldValues[fieldName].currentValue = row[fieldName];
                            fieldValues[fieldName].startIndex = rowIndex;
                        }
                    }
                });
            });
        });
    }
});