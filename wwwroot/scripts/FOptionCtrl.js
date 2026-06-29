var eWebOptionControlType = new function () {
    Object.defineProperties(this, {
        "Masters": {
            get: function () {
                return 0;
            }
        },
        "Table_View": {
            get: function () {
                return 1;
            }
        },
        "Unit": {
            get: function () {
                return 2;
            }
        }
    });
};

function WriteConsoleLog(sMessage, color, bShowTimeInColor) {
    try {
        console.log(sMessage);
    }
    catch (err) { }
}


var FCommon = new function () {
    this.compareValue = function (value1, value2, sOperator) {
        var bResult = false;
        var bString = false;

        try {
            bString = FConvert.isString(value2);

            if (sOperator === "==") {
                if (bString == true) {
                    bResult = value1.localeCompare(value2) == 0;
                }
                else {
                    bResult = (value1 == value2);
                }
            }
            else if (sOperator === "===") {
                if (bString == true) {
                    bResult = value1.localeCompare(value2) == 0;
                }
                else {
                    bResult = (value1 === value2);
                }
            }
            else if (sOperator === "!=" || sOperator === "<>") {
                if (bString == true) {
                    bResult = value1.localeCompare(value2) != 0;
                }
                else {
                    bResult = (value1 !== value2);
                }
            }
            else if (sOperator === "<") {
                if (bString == true) {
                    bResult = (FCommon.String.compare(value1, value2) < 0);
                }
                else {
                    bResult = (FConvert.toDecimal(value1) < FConvert.toDecimal(value2));
                }
            }
            else if (sOperator === ">") {
                if (bString == true) {
                    bResult = (FCommon.String.compare(value1, value2) > 0);
                }
                else {
                    bResult = (FConvert.toDecimal(value1) > FConvert.toDecimal(value2));
                }
            }
            else if (sOperator === "<=") {
                if (bString == true) {
                    bResult = (FCommon.String.compare(value1, value2) <= 0);
                }
                else {
                    bResult = (FConvert.toDecimal(value1) <= FConvert.toDecimal(value2));
                }
            }
            else if (sOperator === ">=") {
                if (bString == true) {
                    bResult = (FCommon.String.compare(value1, value2) >= 0);
                }
                else {
                    bResult = (FConvert.toDecimal(value1) >= FConvert.toDecimal(value2));
                }
            }
            else if (sOperator.toUpperCase() === "ISBLANK") {
                bResult = FCommon.String.isNullOrEmpty(value1);
            }
            else if (sOperator.toUpperCase() === "ISNOTNULL") {
                bResult = FCommon.UI.isValidObject(value1) == true;
            }
        }
        catch (err) {
            alert("Exception: {FCommon.compareValue} " + err.message);
        }

        return (bResult);
    },

    this.String = new function () {
        this.left = function (sValue, iCount) {
            var sResult = "";

            try {
                if (FCommon.String.isNullOrEmpty(sValue) == true) {
                    return ("");
                }

                if (FCommon.UI.isValidObject(iCount) == false
                    || FConvert.isInteger(iCount) == false) {
                    return (sValue);
                }

                iCount = parseInt(iCount);

                if (sValue.length < iCount) {
                    return ("");
                }

                sResult = sValue.substr(0, iCount);
            }
            catch (err) {
                alert("Exception: {FCommon.String.left} " + err.message);
            }

            return (sResult);
        },

        this.right = function (sValue, iCount) {
            var sResult = "";

            try {
                if (FCommon.String.isNullOrEmpty(sValue) == true) {
                    return ("");
                }

                if (FCommon.UI.isValidObject(iCount) == false
                    || FConvert.isInteger(iCount) == false) {
                    return (sValue);
                }

                iCount = parseInt(iCount);

                if (sValue.length < iCount) {
                    return ("");
                }

                sResult = sValue.substr((sValue.length - iCount), iCount);
            }
            catch (err) {
                alert("Exception: {FCommon.String.right} " + err.message);
            }

            return (sResult);
        },

        this.removeSpace = function (sValue) {
            try {
                if (FCommon.UI.isValidObject(sValue) == false) {
                    return (null);
                }

                sValue = sValue.replace(/\s+/g, '');
            }
            catch (err) {
                alert("Exception: {FCommon.String.removeSpace} " + err.message);
            }

            return (sValue);
        },

        this.isNullOrEmpty = function (sValue, bTrim) {
            var bResult = false;
            try {
                if (FCommon.UI.isValidObject(sValue) == false || sValue == null || sValue == "" || sValue.length <= 0) {
                    bResult = true;
                }

                if (FCommon.UI.isValidObject(bTrim) == true && bTrim == true) {
                    if ((typeof sValue).toLowerCase() == "string" && sValue.trim().length == 0) {
                        return (true);
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.String.isNullOrEmpty} " + err.message);
                bResult = true;
            }

            return (bResult);
        },

        this.startsWith = function (sValue, sSearchString) {
            var bResult = false;

            try {
                if (FCommon.String.isNullOrEmpty(sValue) == false) {
                    if (sValue.startsWith) {
                        bResult = sValue.startsWith(sSearchString);
                    }
                    else if (sValue.length >= sSearchString.length) {
                        if (sValue.substr(0, sSearchString.length) === sSearchString) {
                            bResult = true;
                        }
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.String.startsWith} " + err.message);
            }

            return (bResult);
        },

        this.endsWith = function (sValue, sSearchString) {
            var bResult = false;

            try {
                if (FCommon.String.isNullOrEmpty(sValue) == false) {
                    if (sValue.endsWith) {
                        bResult = sValue.endsWith(sSearchString);
                    }
                    else if (sValue.length >= sSearchString.length) {
                        if (sValue.substr((sValue.length - sSearchString.length), sSearchString.length) === sSearchString) {
                            bResult = true;
                        }
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.String.endsWith} " + err.message);
            }

            return (bResult);
        },

        this.includes = function (sValue, sSearchString) {
            var bResult = false;

            try {
                if (FCommon.String.isNullOrEmpty(sValue) == false) {
                    if (sValue.includes) {
                        bResult = sValue.includes(sSearchString);
                    }
                    else {
                        bResult = (sValue.indexOf(sSearchString) >= 0);
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.String.includes} " + err.message);
            }

            return (bResult);
        },

        this.compare = function (sValue, sValue1, bIgnoreCase, iLength) {
            var iResult = 0;

            try {
                if (FCommon.UI.isValidObject(bIgnoreCase) == false || bIgnoreCase == false) {
                    if (FCommon.UI.isValidObject(iLength) == false || iLength <= 0) {
                        iResult = sValue.localeCompare(sValue1);
                    }
                    else {
                        iResult = sValue.substr(0, iLength).localeCompare(sValue1.substr(0, iLength));
                    }
                }
                else {
                    if (FCommon.UI.isValidObject(iLength) == false || iLength <= 0) {
                        iResult = sValue.toLowerCase().localeCompare(sValue1.toLowerCase());
                    }
                    else {
                        iResult = sValue.substr(0, iLength).toLowerCase().localeCompare(sValue1.substr(0, iLength).toLowerCase());
                    }
                }
            }
            catch (err) {
                err.message = "Exception: {FCommon.String.compare} " + err.message;
                throw err;
            }

            return (iResult);
        }
    },

    this.UI = new function () {
        this.isValidObject = function (obj) {
            try {
                if (typeof obj == "undefined" || obj == null) {
                    return (false);
                }

                return (true);
            }
            catch (err) {
                alert("Exception: {FCommon.UI.isValidObject} " + err.message);
            }

            return (false);
        },

        this.isElementExist = function (sId) {
            var ele = null;

            try {
                if (FCommon.String.isNullOrEmpty(sId) == true) {
                    return (false);
                }

                if (typeof (sId) != "string") {
                    return (false);
                }

                ele = document.getElementById(sId);

                return (FCommon.UI.isValidObject(ele) == true);
            }
            catch (err) {
                alert("Exception: {FCommon.UI.isElementExist} " + err.message);
            }

            return (false);
        },

        this.getElement = function (sId) {
            var iCounter = 0;
            var allElements = null;
            var arrElement = null;
            var id = null;

            try {
                arrElement = [];

                allElements = document.getElementsByTagName("*");
                for (iCounter = 0; iCounter < allElements.length; iCounter++) {
                    id = allElements[iCounter].id || null;
                    if (id === sId) {
                        arrElement.push(allElements[iCounter]);
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.getElement} " + err.message);
            }

            return (arrElement);
        },

        this.calculateElementFixedLeftPosition = function (ele) {
            var iValue = 0;
            var rect = null;
            var rectParent = null;
            var sPosition = "";

            try {
                ele = FCommon.UI.getValidElement(ele);
                while (FCommon.UI.isValidObject(ele) == true) {
                    rect = ele.getBoundingClientRect();

                    ele = ele.parentElement;
                    if (FCommon.UI.isValidObject(ele) == true) {
                        sPosition = FCommon.UI.getElementStyleValue(ele, "position");
                        if (sPosition == "fixed") {
                            break;
                        }

                        rectParent = ele.getBoundingClientRect();
                        iValue += (rect.left - rectParent.left);
                    }
                    else {
                        iValue += rect.left;
                        break;
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.calculateElementFixedLeftPosition} " + err.message);
            }

            return (iValue);
        },

        this.calculateElementFixedTopPosition = function (ele) {
            var iValue = 0;
            var rect = null;
            var rectParent = null;
            var sPosition = "";

            try {
                ele = FCommon.UI.getValidElement(ele);
                while (FCommon.UI.isValidObject(ele) == true) {
                    rect = ele.getBoundingClientRect();

                    ele = ele.parentElement;
                    if (FCommon.UI.isValidObject(ele) == true) {
                        sPosition = FCommon.UI.getElementStyleValue(ele, "position");
                        if (sPosition == "fixed") {
                            break;
                        }

                        rectParent = ele.getBoundingClientRect();
                        iValue += (rect.top - rectParent.top);
                    }
                    else {
                        iValue += rect.top;
                        break;
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.calculateElementFixedTopPosition} " + err.message);
            }

            return (iValue);
        },

        this.getValidElement = function (obj) {
            var element = null;

            try {
                if (FCommon.UI.isValidObject(obj) == false) {
                    return (null);
                }

                if ((typeof obj).toLowerCase() == 'string') {
                    element = document.getElementById(obj);
                }
                else if ((typeof obj).toLowerCase() == 'object') {
                    element = obj;
                }
            }
            catch (err) {
                err.message = "Exception: {FCommon.UI.getValidElement} " + err.message;
                throw err;
            }

            return (element);
        },

        this.isElementExist = function (sId) {
            var elemnt = null;

            try {
                if ((typeof sId).toLowerCase() == "string") {
                    element = document.getElementById(sId);
                    if (FCommon.UI.isValidObject(element) == true) {
                        return (true);
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.isElementExist} " + err.message);
            }

            return (false);
        },

        this.isSameElement = function (ele1, ele2) {
            try {
                if (ele1.isSameNode) {
                    if (ele1.isSameNode(ele2) == true) {
                        return (true);
                    }
                }
                else if (ele1.isEqualNode) {
                    if (ele1.isEqualNode(ele2) == true) {
                        return (true);
                    }
                }
                else if (ele1 === ele2) {
                    return (true);
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.isSameElement} " + err.message);
            }

            return (false);
        },

        this.getWidth = function (element) {
            var rect = null;
            var iValue = 0;

            try {
                if (FCommon.UI.isValidObject(element) == true) {
                    rect = element.getBoundingClientRect();
                    iValue = rect.right - rect.left;
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.getWidth} " + err.message);
            }

            return (iValue);
        },

        this.getHeight = function (element) {
            var rect = null;
            var iValue = 0;

            try {
                if (FCommon.UI.isValidObject(element) == true) {
                    rect = element.getBoundingClientRect();
                    iValue = rect.bottom - rect.top;
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.getHeight} " + err.message);
            }

            return (iValue);
        },

        this.toggleElementDisplay = function (ele) {
            try {
                ele = FCommon.UI.getValidElement(ele);
                if (FCommon.UI.isValidObject(ele) == false) {
                    return (false);
                }

                if (ele.style.display.toLowerCase() == '' || ele.style.display.toLowerCase() == 'block') {
                    ele.style.display = 'none';
                }
                else if (ele.style.display.toLowerCase() == 'none') {
                    ele.style.display = '';
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.toggleElementDisplay} " + err.message);
            }

            return (true);
        },

        this.changeElementStyle = function (ele, stylename, value) {
            try {
                ele = FCommon.UI.getValidElement(ele);
                if (FCommon.UI.isValidObject(ele) == false) {
                    return (false);
                }

                ele.style[stylename] = value;
            }
            catch (err) {
                alert("Exception: {FCommon.UI.changeElementStyle} " + err.message);
            }

            return (true);
        },

        this.isTextSelected = function (eleInput) {
            try {
                if (typeof eleInput.selectionStart == "number") {
                    return eleInput.selectionStart == 0 && eleInput.selectionEnd == eleInput.value.length;
                }
                else if (typeof document.selection != "undefined") {
                    eleInput.focus();
                    return document.selection.createRange().text == eleInput.value;
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.isTextSelected} " + err.message);
            }

            return (false);
        }

        this.replaceSelectionRange = function (eleCtrl, sValue, evt) {
            var sNewValue = "";
            var iSelectionStart = 0;
            var iSelectionEnd = 0;

            try {
                if (FCommon.UI.isValidObject(eleCtrl.selectionStart) == true) {
                    iSelectionStart = eleCtrl.selectionStart;
                    iSelectionEnd = eleCtrl.selectionEnd;
                    if (iSelectionStart > 0) {
                        sNewValue = FCommon.String.left(eleCtrl.value, iSelectionStart);
                        sNewValue += sValue;
                        sNewValue += eleCtrl.value.substr(iSelectionEnd);

                        if (FCommon.UI.isValidObject(evt) == true) {
                            FCommon.UI.stopKeyProcess(evt);
                            eleCtrl.value = sNewValue;
                            FCommon.UI.selectTextInInput(eleCtrl, iSelectionStart + 1, iSelectionEnd + 1);

                        }
                    }
                    else if (iSelectionEnd > 0) {
                        sNewValue = sValue;
                        sNewValue += eleCtrl.value.substr(iSelectionEnd);

                        if (FCommon.UI.isValidObject(evt) == true) {
                            FCommon.UI.stopKeyProcess(evt);
                            eleCtrl.value = sNewValue;
                            FCommon.UI.selectTextInInput(eleCtrl, 1, 1);
                        }
                    }
                    else {
                        sNewValue = eleCtrl.value;
                        sNewValue += sValue;
                    }
                }
                else {
                    sNewValue = eleCtrl.value + sValue;
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.replaceSelectionRange} " + err.message);
            }

            return (sNewValue);
        },

        this.selectTextInDropdownUsingText = function (ele, sText) {
            var iCounter = 0;
            var bResult = false;

            try {
                for (iCounter = 0; iCounter < ele.options.length; iCounter++) {
                    if (FCommon.String.compare(ele.options[iCounter].text, sText) == 0) {
                        ele.selectedIndex = iCounter;
                        bResult = true;
                        break;
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.selectTextInDropdownUsingText} " + err.message);
            }

            return (bResult);
        },

        this.getDropdownValue = function (eleCtrl) {
            var result = null;

            try {
                result = COMMON.prototype.getEmptyResultObject();
                result.lValue = 0;
                result.sValue = "";
                result.data = null;

                eleCtrl = FCommon.UI.getValidElement(eleCtrl);
                if (eleCtrl.selectedIndex >= 0) {
                    result.lValue = 1;
                    result.sValue = eleCtrl.options[eleCtrl.selectedIndex].text;
                    result.data = eleCtrl.options[eleCtrl.selectedIndex].value;
                }
            }
            catch (err) {
                result.lValue = -1;
                result.sValue = err.message;
            }

            return (result);
        },

        this.setText = function (element, sText) {
            var sNodeName = "";

            try {
                element = FCommon.UI.getValidElement(element);
                if (FCommon.UI.isValidObject(element) == true) {
                    sNodeName = element.nodeName.toLowerCase();
                    if (sNodeName === "input") {
                        if (element.getAttribute("type").toLowerCase() === "text") {
                            element.value = sText;
                        }
                    }
                    else if (sNodeName === "textarea") {
                        element.value = sText;
                    }
                    else if (sNodeName === "select") {
                        FCommon.UI.selectTextInDropdownUsingText(element, sText);
                    }
                    else {
                        if (FCommon.UI.isValidObject(element.innerText) == true) {
                            element.innerText = sText;
                        }
                        else if (FCommon.UI.isValidObject(element.textContent) == true) { // Mozila
                            element.textContent = sText;
                        }
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.setText} " + err.message);
            }
        },

        this.getText = function (element) {
            var sText = "";
            var sNodeName = "";

            try {
                element = FCommon.UI.getValidElement(element);
                if (FCommon.UI.isValidObject(element) == true) {
                    sNodeName = element.nodeName.toLowerCase();
                    if (sNodeName === "input") {
                        if (element.getAttribute("type").toLowerCase() === "text") {
                            sText = element.value;
                        }
                    }
                    else if (sNodeName === "textarea") {
                        sText = element.value;
                    }
                    else if (sNodeName === "select") {
                        if (element.selectedIndex >= 0) {
                            result.sValue = element.options[element.selectedIndex].text;
                        }
                    }
                    else {
                        if (FCommon.UI.isValidObject(element.innerText) == true) {
                            sText = element.innerText;
                        }
                        else if (FCommon.UI.isValidObject(element.textContent) == true) { // Mozila
                            sText = element.textContent;
                        }
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.getText} " + err.message);
            }

            return (sText);
        },

        this.createAttributesFromObject = function (element, obj) {
            var iCounter = 0;
            var sKey = "";
            var keys = null;

            try {
                keys = Object.keys(obj);
                for (iCounter = 0; iCounter < keys.length; iCounter++) {
                    sKey = keys[iCounter];
                    if (FCommon.String.isNullOrEmpty(sKey) == true) {
                        continue;
                    }

                    element.setAttribute("data-" + sKey, obj[sKey]);
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.createAttributesFromObject} " + err.message);
            }
        },

        this.createAttributesFromArray = function (element, data) {
            var iCounter = 0;

            try {
                for (iCounter = 0; iCounter < data.length; iCounter++) {
                    FCommon.UI.createAttributesFromObject(element, data[iCounter]);
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.createAttributesFromArray} " + err.message);
            }
        },

        this.setAttributeData = function (element, key, value) {
            try {
                element = FCommon.UI.getValidElement(element);
                if (FCommon.UI.isValidObject(element) == false) {
                    return;
                }

                if (FCommon.UI.isValidObject(key) == false) {
                    return;
                }

                if (FCommon.UI.isValidObject(value) == false) {
                    if (FCommon.Array.isArray(key) == true) {
                        FCommon.UI.createAttributesFromArray(element, key);
                    }
                    else if (FConvert.isObject(key) == true) {
                        FCommon.UI.createAttributesFromObject(element, key);
                    }
                }
                else {
                    element.setAttribute("data-" + FCommon.String.removeSpace(key), value);
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.setAttributeData} " + err.message);
            }
        },

        this.getAttributeData = function (element, key) {
            var value = null;

            try {
                element = FCommon.UI.getValidElement(element);
                if (FCommon.UI.isValidObject(element) == true) {
                    if (FCommon.String.left(key, "data-".length) != "data-") {
                        key = "data-" + key;
                    }

                    value = element.getAttribute(key);
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.getAttributeData} " + err.message);
            }

            return (value);
        },

        this.setFocus = function (control) {
            var result = null;

            try {
                result = COMMON.prototype.getEmptyResultObject();
                result.lValue = 0;
                result.sValue = "";
                result.data = null;

                control = FCommon.UI.getValidElement(control);
                if (FCommon.UI.isValidObject(control) == false) {
                    result.lValue = 0;
                    result.sValue = "Invalid control.";

                    return (result);
                }

                //control.focus();
                setTimeout(function () { control.focus(); }, 0);

                if (control.select) {
                    control.select();
                }

                result.lValue = 1;
                result.data = control;
            }
            catch (err) {
                result.lValue = -1;
                result.sValue = err.message;
            }

            return (result);
        },

        this.selectTextInInput = function (control, iStart, iEnd) {
            try {
                control = FCommon.UI.getValidElement(control);
                if (FCommon.UI.isValidObject(control) == false) {
                    return;
                }

                if (control.setSelectionRange) {
                    control.focus();
                    control.setSelectionRange(iStart, iEnd);
                }
                else if (control.createTextRange) {
                    var range = control.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', iEnd);
                    range.moveStart('character', iStart);
                    range.select();
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.selectTextInInput} " + err.message);
            }
        },

        this.unselectTextInInput = function (eleInput) {
            try {
                eleInput = FCommon.UI.getValidElement(eleInput);
                if (FCommon.UI.isValidObject(eleInput) == true) {
                    FCommon.UI.selectTextInInput(eleInput, eleInput.value.length, eleInput.value.length);
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.unselectTextInInput} " + err.message);
            }
        },

        this.hasScrollBar = function (element) {
            var obj = {};

            try {
                obj.horizontal = false;
                obj.vertical = false;
                obj.scrollbarwidth = 0;
                obj.scrollbarheight = 0;

                element = FCommon.UI.getValidElement(element);
                if (FCommon.UI.isValidObject(element) == false) {
                    return (obj);
                }

                obj.vertical = (element.scrollHeight > element.clientHeight);
                obj.horizontal = (element.scrollWidth > element.clientWidth);
                obj.scrollbarwidth = (element.offsetWidth - element.clientWidth);
                obj.scrollbarheight = (element.offsetHeight - element.clientHeight);
            }
            catch (err) {
                alert("Exception: {FCommon.UI.hasScrollBar} " + err.message);
            }

            return (obj);
        },

        this.getScrollLeft = function (element, bFirstOnly) {
            var iLeft = 0;
            var obj = null;

            try {
                bFirstOnly = FConvert.toBoolean(bFirstOnly);
                while (FCommon.UI.isValidObject(element) == true) {
                    obj = FCommon.UI.hasScrollBar(element);
                    if (obj.horizontal == true) {
                        iLeft += element.scrollLeft;
                        if (bFirstOnly == true) {
                            break;
                        }
                    }

                    element = element.parentElement;
                }
            }
            catch (err) {
            }

            return (iLeft);
        },

        this.getScrollTop = function (element, bFirstOnly) {
            var iTop = 0;
            var obj = null;

            try {
                bFirstOnly = FConvert.toBoolean(bFirstOnly);
                while (FCommon.UI.isValidObject(element) == true) {
                    obj = FCommon.UI.hasScrollBar(element);
                    if (obj.vertical == true) {
                        iTop += element.scrollTop;
                        if (bFirstOnly == true) {
                            break;
                        }
                    }

                    element = element.parentElement;
                }
            }
            catch (err) {
            }

            return (iTop);
        },

        this.removeDataAttribute = function (element) {
            var sName = "";
            var iAttrCounter = 0;

            try {
                while (iAttrCounter < element.attributes.length) {
                    sName = element.attributes[iAttrCounter].name;
                    if (FCommon.String.left(sName, "data-".length) == "data-") {
                        element.removeAttribute(sName);
                        continue;
                    }

                    iAttrCounter++
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.removeDataAttribute} " + err.message);
            }
        },

        this.hasDataAttribute = function (element, sKey, bIgnoreCase) {
            var sName = "";
            var iCounter = 0;

            try {
                if (sKey.substr(0, "data-".length).toLowerCase() !== "data-") {
                    sKey = "data-" + sKey;
                }

                bIgnoreCase = FConvert.toBoolean(bIgnoreCase);
                for (iCounter = 0; iCounter < element.attributes.length; iCounter++) {
                    sName = element.attributes[iCounter].name;

                    if (bIgnoreCase == true) {
                        if (sName.toLowerCase() === sKey.toLowerCase()) {
                            return (true);
                        }
                    }
                    else {
                        if (sName === sKey) {
                            return (true);
                        }
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.hasDataAttribute} " + err.message);
            }

            return (false);
        },

        this.copyDataAttribute = function (eleSource, eleTarget) {
            var sName = "";
            var iCounter = 0;

            try {
                for (iCounter = 0; iCounter < eleSource.attributes.length; iCounter++) {
                    sName = eleSource.attributes[iCounter].name;
                    if (FCommon.String.left(sName, "data-".length) != "data-") {
                        continue;
                    }

                    eleTarget.setAttribute(eleSource.attributes[iCounter].name, eleSource.attributes[iCounter].value)
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.copyDataAttribute} " + err.message);
            }
        },

        this.removeChildren = function (element) {
            try {
                element = FCommon.UI.getValidElement(element);
                if (FCommon.UI.isValidObject(element) == true) {
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.removeChildren} " + err.message);
            }
        },

        this.removeElement = function (element) {
            try {
                element = FCommon.UI.getValidElement(element);
                if (FCommon.UI.isValidObject(element) == true) {
                    element.parentElement.removeChild(element);
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.removeElement} " + err.message);
            }
        },

        this.getElementStyleValue = function (element, sStyleName) {
            var value = "";

            try {
                element = FCommon.UI.getValidElement(element);
                if (FCommon.UI.isValidObject(element) == true) {
                    if (window.getComputedStyle) {
                        value = window.getComputedStyle(element, null).getPropertyValue(sStyleName);
                    }
                    else if (element.currentStyle) {
                        value = element.currentStyle[sStyleName];
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.getElementStyleValue} " + err.message);
            }

            return (value);
        },

        this.getVisibleWidth = function (ele) {
            var iValue = 0;

            try {
                iValue = FCommon.UI.getVisibleWidthHeight(ele).iWidth;
            }
            catch (err) {
                alert("Exception: {FCommon.UI.getVisibleWidth} " + err.message);
            }

            return (iValue);
        },

        this.getVisibleHeight = function (ele) {
            var iValue = 0;

            try {
                iValue = FCommon.UI.getVisibleWidthHeight(ele).iHeight;
            }
            catch (err) {
                alert("Exception: {FCommon.UI.getVisibleHeight} " + err.message);
            }

            return (iValue);
        },

        this.getVisibleWidthHeight = function (ele) {
            var iValue = 0;
            var iTemp = 0;
            var rectElement = null;
            var rectContainer = null;
            var obj = null;

            try {
                obj = {};
                obj.iWidth = 0;
                obj.iHeight = 0;
                obj.iVisibleWidth = 0;
                obj.iVisibleHeight = 0;

                ele = FCommon.UI.getValidElement(ele);
                if (FCommon.UI.isValidObject(ele) == false) {
                    return (obj);
                }

                rectElement = ele.getBoundingClientRect();
                obj.iWidth = rectElement.width;
                obj.iHeight = rectElement.height;
                obj.iVisibleWidth = obj.iWidth;
                obj.iVisibleHeight = obj.iHeight;

                do {
                    ele = ele.parentElement;
                    if (FCommon.UI.isValidObject(ele) == false) {
                        break;
                    }

                    rectContainer = ele.getBoundingClientRect();

                    //if (ele.scrollLeft > 0) {                        
                    //    if (rectContainer.left > rectElement.left) {
                    //        iTemp = rectElement.width - (rectContainer.left - rectElement.left);
                    //        if (iTemp < obj.iVisibleWidth) {
                    //            obj.iVisibleWidth = iTemp;
                    //        }
                    //    }
                    //}

                    //if (ele.scrollTop > 0) {
                    //    if (rectContainer.top > rectElement.top) {
                    //        iTemp = rectElement.height - (rectContainer.top - rectElement.top);
                    //        if (iTemp < obj.iVisibleHeight) {
                    //            obj.iVisibleHeight = iTemp;
                    //        }
                    //    }
                    //}

                    if (rectContainer.width < ele.scrollWidth) {
                        if (rectElement.left >= rectContainer.left && rectElement.right <= rectContainer.right) {
                            iTemp = obj.iVisibleWidth;
                        }
                        else if (rectElement.left <= rectContainer.left) {
                            iTemp = rectElement.width - (rectContainer.left - rectElement.left);
                        }
                        else if (rectElement.right >= rectContainer.right) {
                            iTemp = rectElement.width - (rectElement.right - rectContainer.right);
                        }

                        if (iTemp < obj.iVisibleWidth) {
                            obj.iVisibleWidth = iTemp;
                        }
                    }


                    if (rectContainer.height < ele.scrollHeight) {
                        if (rectElement.top >= rectContainer.top && rectElement.bottom <= rectContainer.bottom) {
                            iTemp = obj.iVisibleHeight;
                        }
                        else if (rectElement.top <= rectContainer.top) {
                            iTemp = rectElement.height - (rectContainer.top - rectElement.top);
                        }
                        else if (rectElement.bottom >= rectContainer.bottom) {
                            iTemp = rectElement.height - (rectElement.bottom - rectContainer.bottom);
                        }

                        if (iTemp < obj.iVisibleHeight) {
                            obj.iVisibleHeight = iTemp;
                        }
                    }
                } while (true);
            }
            catch (err) {
                alert("Exception: {FCommon.UI.getVisibleWidthHeight} " + err.message);
            }

            return (obj);
        },

        this.setFocusDropdownPopupPosition = function (eleInput, elePopup) {
            var iValue = 0;
            var iInputTop = 0;
            var iPopupWidth = 0;
            var iInputWidth = 0;
            var rectPopup = null;
            var rectInput = null;
            var arrValue = null;

            try {
                if (FCommon.UI.isValidObject(eleInput) == false || FCommon.UI.isValidObject(elePopup) == false) {
                    return;
                }

                elePopup.style.position = "fixed";

                rectPopup = elePopup.getBoundingClientRect();
                iPopupWidth = (rectPopup.right - rectPopup.left);

                rectInput = eleInput.getBoundingClientRect();
                iInputWidth = rectInput.right - rectInput.left;

                iInputTop = FCommon.UI.calculateElementFixedTopPosition(eleInput);
                if ((iInputTop + rectInput.height + rectPopup.height) >= window.innerHeight) {
                    iValue = iInputTop - rectPopup.height;
                }
                else {
                    iValue = iInputTop + rectInput.height;
                }
                elePopup.style.top = iValue + "px";

                //if (rectPopup.bottom >= window.innerHeight) {
                //    iValue = (rectPopup.top - rectPopup.height) - eleInput.getBoundingClientRect().height;
                //    elePopup.style.top = iValue + "px";
                //}
                //else {
                //    elePopup.style.top = FCommon.UI.calculateElementFixedTopPosition(eleInput) + rectInput.height + "px";
                //}

                iValue = FCommon.UI.calculateElementFixedLeftPosition(eleInput);
                if (FCommon.UI.getElementStyleValue(eleInput, "direction").toLowerCase() == "rtl") {
                    //rectInput = eleInput.getBoundingClientRect();
                    //if (rectPopup.width > rectInput.width) {
                    //    arrValue = elePopup.style.left.split("px");
                    //    if (FCommon.UI.isValidObject(arrValue) == true && arrValue.length > 0) {
                    //        iValue = FConvert.toInt(arrValue[0]);
                    //    }

                    //    if (iValue > 0) {
                    //        elePopup.style.left = iValue - (rectPopup.width - rectInput.width) + "px";
                    //    }                    
                    //}

                    iInputWidth = rectInput.right - rectInput.left;

                    if (iPopupWidth >= iInputWidth) {
                        iValue -= (iPopupWidth - iInputWidth);
                    }
                    else {
                        iValue += (iInputWidth - iPopupWidth);
                    }

                    if ((iValue + iPopupWidth) < iPopupWidth) {
                        iValue += (iPopupWidth - iInputWidth);
                    }
                }
                else {
                    if ((iValue + iPopupWidth) > window.innerWidth) {
                        iValue -= (iPopupWidth - iInputWidth);
                    }
                }

                elePopup.style.left = iValue + "px";
            }
            catch (err) {
                alert("Exception: {FCommon.UI.setFocusDropdownPopupPosition} " + err.message);
            }
        },

        this.hasClass = function (ele, sClassName, bCheckAncestor) {
            var iCounter = 0;
            var arrClass = null;
            var bValue = false;

            try {
                if (FCommon.String.isNullOrEmpty(sClassName) == true) {
                    return (false);
                }

                bCheckAncestor = FConvert.toBoolean(bCheckAncestor);

                if (bCheckAncestor == true) {
                    ele = FCommon.UI.getValidElement(ele);
                    if (FCommon.UI.isValidObject(ele) == false) {
                        return (false);
                    }

                    while (ele.parentElement) {
                        if (FCommon.UI.hasClass(ele.parentElement, sClassName, false) == true) {
                            bValue = true;
                            break;
                        }

                        ele = ele.parentElement;
                    }
                }
                else {
                    if (ele.classList) {
                        bValue = ele.classList.contains(sClassName);
                    }
                    else {
                        arrClass = ele.className.split(' ');
                        for (iCounter = 0; iCounter < arrClass.length; iCounter++) {
                            if (arrClass[iCounter] === sClassName) {
                                bValue = true;
                                break;
                            }
                        }
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.hasClass} " + err.message);
            }

            return (bValue);
        },

        this.removeClass = function (ele, sClassName) {
            $(ele).removeClass(sClassName);
        },

        this.addClass = function (ele, sClassName) {
            $(ele).addClass(sClassName);
        },

        this.findAncestorElementsUsingClass = function (ele, sClassName, bAllAncestors) {
            var arrElements = [];

            try {
                ele = FCommon.UI.getValidElement(ele);
                if (FCommon.UI.isValidObject(ele) == false) {
                    return (arrElements);
                }

                bAllAncestors = FConvert.toBoolean(bAllAncestors);
                while (ele.parentElement) {
                    if (FCommon.UI.hasClass(ele.parentElement, sClassName, false) == true) {
                        arrElements.push(ele.parentElement);
                        if (bAllAncestors == false) {
                            break;
                        }
                    }

                    ele = ele.parentElement;
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.findAncestorElementsUsingClass} " + err.message);
            }

            return (arrElements);
        },

        this.stopKeyProcess = function (evt) {
            try {
                if (FCommon.UI.isValidObject(evt) == false) {
                    return;
                }

                if (evt.preventDefault) {
                    evt.preventDefault();
                }
                else {
                    evt.returnValue = false;
                }

                if (evt.bubbles == true) {
                    evt.stopPropagation();
                }
            }
            catch (err) {
                alert("Exception: {FCommon.UI.stopKeyProcess} " + err.message);
            }
        }
    },

    this.Array = new function () {
        this.insertRange = function (arrData, iInsertAfter, arrNewData) {
            var iCounter = 0;

            try {
                if (FCommon.UI.isValidObject(arrNewData) == false) {
                    return (arrData);
                }

                for (iCounter = 0; iCounter < arrNewData.length; iCounter++) {
                    arrData.splice(iInsertAfter, 0, arrNewData[iCounter]);
                    iInsertAfter++;
                }
            }
            catch (err) {
                alert("Exception: {FCommon.Array.insertRange} " + err.message);
            }

            return (arrData);
        },

        this.contains = function (arrData, value, sPropertyName, bIgnoreCase) {
            var iCounter = 0;
            var iIndex = -1;
            var bFlag = false;
            var bPropertyName = false;
            var currentvalue = null;

            try {
                if (FCommon.String.isNullOrEmpty(sPropertyName, true) == false) {
                    bPropertyName = true;
                }

                if (FConvert.isString(value) == true && FConvert.toBoolean(bIgnoreCase) == true) {
                    bFlag = true;
                }

                if (FCommon.Array.getLength(arrData) > 0) {
                    for (iCounter = 0; iCounter < arrData.length; iCounter++) {
                        if (bPropertyName == true) {
                            currentvalue = arrData[iCounter][sPropertyName];
                        }
                        else {
                            currentvalue = arrData[iCounter];
                        }

                        if (bFlag == true) {
                            if (currentvalue.toLowerCase() === value.toLowerCase()) {
                                iIndex = iCounter;
                                break;
                            }
                        }
                        else {
                            if (currentvalue === value) {
                                iIndex = iCounter;
                                break;
                            }
                        }
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.Array.contains} " + err.message);
            }

            return (iIndex);
        },

        this.filterDataIndex = function (arrData, PropertyName, value, Operator) {
            var sProperty = "";
            var iCounter = 0;
            var iIndex = 0;
            var bValid = false;
            var bArray = false;
            var bOperatorArray = false;
            var arrResult = null;

            try {
                arrResult = [];

                if (FCommon.Array.getLength(arrData) == 0) {
                    return ([]);
                }

                bOperatorArray = FCommon.Array.isArray(Operator);

                if (FConvert.isString(PropertyName) == true) {
                    if (FCommon.String.isNullOrEmpty(PropertyName, true) == true) {
                        return ([]);
                    }

                    if (bOperatorArray == true) {
                        return ([]);
                    }
                }
                else {
                    bArray = FCommon.Array.isArray(PropertyName);
                    if (bArray == false) {
                        return ([]);
                    }
                }

                if (bArray == true &&
                    (FCommon.Array.isArray(value) == false
                        || PropertyName.length != value.length
                        || (bOperatorArray == true && Operator.length != PropertyName.length))
                    ) {
                    return ([]);
                }

                for (iCounter = 0; iCounter < arrData.length; iCounter++) {
                    bValid = false;

                    if (bArray == true) {
                        for (iIndex = 0; iIndex < PropertyName.length; iIndex++) {
                            sProperty = PropertyName[iIndex];
                            if ((typeof arrData[iCounter][sProperty]) == "undefined") {
                                bValid = false;
                                break;
                            }

                            if (bOperatorArray == true) {
                                bValid = FCommon.compareValue(arrData[iCounter][sProperty], value[iIndex], Operator[iIndex]);
                            }
                            else {
                                bValid = FCommon.compareValue(arrData[iCounter][sProperty], value[iIndex], Operator);
                            }

                            if (bValid == false) {
                                break;
                            }
                        }
                    }
                    else {
                        if ((typeof arrData[iCounter][PropertyName]) == "undefined") {
                            continue;
                        }

                        bValid = FCommon.compareValue(arrData[iCounter][PropertyName], value, Operator);
                    }

                    if (bValid == true) {
                        arrResult.push(iCounter);
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.Array.filterDataIndex} " + err.message);
            }

            return (arrResult);
        },

        this.filterData = function (arrData, PropertyName, value, Operator) {
            var arrIndex = null;
            var iCounter = 0;
            var iIndex = 0;
            var arrResult = null;

            try {
                arrResult = [];

                arrIndex = FCommon.Array.filterDataIndex(arrData, PropertyName, value, Operator);
                for (iCounter = 0; iCounter < arrIndex.length; iCounter++) {
                    iIndex = arrIndex[iCounter];
                    arrResult.push(arrData[iIndex]);
                }
            }
            catch (err) {
                alert("Exception: {FCommon.Array.filterData} " + err.message);
            }

            return (arrResult);
        },

        this.addRange = function (arrData, arrNewData) {
            var iCounter = 0;

            try {
                if (FCommon.UI.isValidObject(arrNewData) == false) {
                    return (arrData);
                }

                for (iCounter = 0; iCounter < arrNewData.length; iCounter++) {
                    arrData.push(arrNewData[iCounter]);
                }
            }
            catch (err) {
                alert("Exception: {FCommon.Array.addRange} " + err.message);
            }

            return (arrData);
        },

        this.convertArrayToCSVFormat = function (arrData) {
            var iCounter = 0;
            var sResult = "";

            try {
                for (iCounter = 0; iCounter < arrData.length; iCounter++) {
                    if (iCounter > 0) {
                        sResult += ",";
                    }

                    sResult += arrData[iCounter];
                }
            }
            catch (err) {
                alert("Exception: {FCommon.Array.convertArrayToCSVFormat} " + err.message);
            }

            return (sResult);
        },

        this.convertCSVFormatToArray = function (sCSVData) {
            var arrData = null;

            try {
                sCSVData = FConvert.toString(sCSVData);
                if (FCommon.String.isNullOrEmpty(sCSVData, true) == true) {
                    arrData = [];
                }
                else {
                    arrData = sCSVData.split(',');
                }
            }
            catch (err) {
                alert("Exception: {FCommon.Array.convertCSVFormatToArray} " + err.message);
            }

            return (arrData);
        },

        this.existInStringArray = function (iIndex, arrStringIndex) {
            var iCounter = 0;
            var obj = null;

            try {
                for (iCounter = 0; iCounter < arrStringIndex.length; iCounter++) {
                    obj = arrStringIndex[iCounter];
                    if (iIndex >= obj.Start && iIndex <= obj.End) {
                        return (true);
                    }
                }
            }
            catch (err) {
                WriteConsoleLog("Exception: {FCommon.Array.existInStringArray} " + err.message, "red");
            }

            return (false);
        },

        this.isArray = function (arrData) {
            var bValue = false;

            try {
                if (FCommon.UI.isValidObject(arrData) == true) {
                    if (Array.isArray(arrData) == true) {
                        bValue = true;
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.Array.isArray} " + err.message);
            }

            return (bValue);
        },

        this.getLength = function (arrData) {
            var iValue = 0;

            try {
                if (FCommon.Array.isArray(arrData) == true) {
                    iValue = arrData.length;
                }
            }
            catch (err) {
                alert("Exception: {FCommon.Array.getLength} " + err.message);
            }

            return (iValue);
        }
    },

    this.Object = new function () {
        this.getValueInObjectArray = function (sProperty, arrObject) {
            var iCounter = 0;
            var obj = null;
            var data = null;

            try {
                data = {};
                data.iIndex = -1;
                data.sKey = sProperty;
                data.Value = null;

                sProperty = sProperty.toLowerCase();
                for (iCounter = 0; iCounter < arrObject.length; iCounter++) {
                    obj = arrObject[iCounter];

                    for (sKey in obj) {
                        if (FCommon.String.isNullOrEmpty(sKey) == false && sKey.toLowerCase() == sProperty) {
                            data.iIndex = iCounter;
                            data.Value = obj[sKey];
                            break;
                        }
                    }

                    if (data.iIndex >= 0) {
                        break;
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.Object.getValueInObjectArray} " + err.message);
            }

            return (data);
        },

        this.getFirstPropertyValue = function (obj, bIgnoreBlankKey) {
            var value = "";

            try {
                if (FCommon.UI.isValidObject(obj) == true) {
                    bIgnoreBlankKey = FConvert.toBoolean(bIgnoreBlankKey);

                    for (skey in obj) {
                        if (bIgnoreBlankKey == false || FCommon.String.isNullOrEmpty(skey) == false) {
                            value = obj[skey];
                            break;
                        }
                    }
                }
            }
            catch (err) {
                alert("Exception: {FCommon.Object.getFirstPropertyValue} " + err.message);
            }

            return (value);
        }
    }
}();

var FConvert = new function () {
    this.isNumeric = function (sValue) {
        var bResult = false;
        var patt = new RegExp("^-?\\d+(\\.(\\d+))?$");

        bResult = patt.test(sValue);
        if (bResult == false) {
            patt = new RegExp("^-?\\.?\\d+$");
            bResult = patt.test(sValue);
        }

        return (bResult);
    },

    this.isInteger = function (sValue) {
        var patt = null;
        var result = false;

        try {
            if (FCommon.String.isNullOrEmpty(sValue) == true) {
                return (false);
            }

            patt = /^[+-]?\d+$/;
            result = patt.test(sValue);
        }
        catch (err) {
            alert("Exception: {FConvert.isInteger} " + err.message);
        }

        return (result);
    },

    this.isBoolean = function (value) {
        var bResult = false;

        if ((typeof value).toLowerCase() == "boolean") {
            bResult = true;
        }

        return (bResult);
    },

    this.isString = function (value) {
        var bResult = false;

        if ((typeof value).toLowerCase() == "string") {
            bResult = true;
        }

        return (bResult);
    },

    this.isObject = function (value) {
        var bResult = false;

        if ((typeof value).toLowerCase() == "object" && value != null) {
            bResult = true;
        }

        return (bResult);
    },

    this.toInt = function (value) {
        if (FCommon.UI.isValidObject(value) == false) {
            return (0);
        }

        value = parseInt(value);
        if (isNaN(value) == true) {
            return (0);
        }

        return (value);
    },

    this.toBoolean = function (value) {
        if (FCommon.UI.isValidObject(value) == false) {
            return (false);
        }

        if (FConvert.isString(value) == true) {
            if (FCommon.String.isNullOrEmpty(value) == true) {
                return (false);
            }

            if (value.toLowerCase().trim() == "true" || value == "1") {
                return (true);
            }
        }
        else if (FConvert.isBoolean(value) == true) {
            return (eval(value));
        }
        else if ((typeof value).toLowerCase() == "number") {
            if (FConvert.toDecimal(value) > 0) {
                return (true);
            }
        }

        return (false);
    },

    this.toDecimal = function (value, iNoDecimal, bConvert, bNearestRoundOff) {
        var iCounter = 0;
        var result = 0;
        var iAscValue = 0;
        var temp = null;

        if (FCommon.UI.isValidObject(value) == false) {
            result = 0;

            if (FCommon.UI.isValidObject(iNoDecimal) == true) {
                result = result.toFixed(iNoDecimal);
            }

            return (result);
        }

        if ((typeof value).toLowerCase() == "string") {
            temp = "";
            for (iCounter = 0; iCounter < value.length; iCounter++) {
                iAscValue = value.charCodeAt(iCounter);
                if (iAscValue >= 48 && iAscValue <= 57) {
                    temp += value.charAt(iCounter);
                }
                else if (iAscValue == 45) { // -
                    temp += value.charAt(iCounter);
                }
                else if (iAscValue == 46) { //.
                    temp += value.charAt(iCounter);
                }
            }

            value = temp;
        }

        result = parseFloat(value);
        if (isNaN(result) == true) {
            result = 0;
        }

        if (FCommon.UI.isValidObject(iNoDecimal) == true) {
            if (FConvert.toBoolean(bNearestRoundOff) == true) {
                result = FConvert.roundOffToDecimalPlaces(result, iNoDecimal, eRoundingType.Nearest);
            }

            result = result.toFixed(iNoDecimal);
            if (FConvert.toBoolean(bConvert) == true) {
                result = parseFloat(result);
            }
        }

        return (result);
    },

    this.toString = function (value) {
        var sType = "";

        if (FCommon.UI.isValidObject(value) == false) {
            return ("");
        }

        if (FConvert.isString(value) == true) {
            return (value);
        }
        else if (FConvert.isBoolean(value) == true) {
            value = value.toString();
        }
        else if (FConvert.isObject(value) == true) {
            value = JSON.stringify(value);
        }
        else {
            sType = (typeof value).toLowerCase();
            if (sType == "number") {
                value = value.toString();
            }
            else {
                value = "";
            }
        }

        return (value);
    },

    this.stringToObject = function (sValue) {
        var result = null;

        try {
            result = COMMON.prototype.getEmptyResultObject();
            result.lValue = 0;
            result.sValue = "";
            result.data = null;

            if (FCommon.String.isNullOrEmpty(sValue, true) == true) {
                return (result);
            }

            result.data = JSON.parse(sValue);
            if (FConvert.isObject(result.data) == true) {
                result.lValue = 1;
            }
        }
        catch (err) {
            result.lValue = -1;
            result.sValue = err.message;
        }

        return (result);
    }
}();

var eKeyCode = new function () {
    Object.defineProperties(this, {
        "Backspace": {
            get: function () {
                return 8;
            }
        },
        "Tab": {
            get: function () {
                return 9;
            }
        },
        "LF": {
            get: function () {
                return 10; // Line Feed
            }
        },
        "CR": {
            get: function () {
                return 13; // Carriage Return
            }
        },
        "Esc": {
            get: function () {
                return 27;
            }
        },
        "Space": {
            get: function () {
                return 32;
            }
        },
        "PageUp": {
            get: function () {
                return 33;
            }
        },
        "PageDown": {
            get: function () {
                return 34;
            }
        },
        "End": {
            get: function () {
                return 35;
            }
        },
        "Home": {
            get: function () {
                return 36;
            }
        },
        "Left": {
            get: function () {
                return 37;
            }
        },
        "Up": {
            get: function () {
                return 38;
            }
        },
        "Right": {
            get: function () {
                return 39;
            }
        },
        "Down": {
            get: function () {
                return 40;
            }
        },
        "PrintScreen": {
            get: function () {
                return 44;
            }
        },
        "Insert": {
            get: function () {
                return 45;
            }
        },
        "Del": {
            get: function () {
                return 46;
            }
        },
        "D0": {
            get: function () {
                return 48;
            }
        },
        "D1": {
            get: function () {
                return 49;
            }
        },
        "D2": {
            get: function () {
                return 50;
            }
        },
        "D3": {
            get: function () {
                return 51;
            }
        },
        "D4": {
            get: function () {
                return 52;
            }
        },
        "D5": {
            get: function () {
                return 53;
            }
        },
        "D6": {
            get: function () {
                return 54;
            }
        },
        "D7": {
            get: function () {
                return 55;
            }
        },
        "D8": {
            get: function () {
                return 56;
            }
        },
        "D9": {
            get: function () {
                return 57;
            }
        },
        "A": {
            get: function () {
                return 65;
            }
        },
        "B": {
            get: function () {
                return 66;
            }
        },
        "C": {
            get: function () {
                return 67;
            }
        },
        "D": {
            get: function () {
                return 68;
            }
        },
        "E": {
            get: function () {
                return 69;
            }
        },
        "F": {
            get: function () {
                return 70;
            }
        },
        "G": {
            get: function () {
                return 71;
            }
        },
        "H": {
            get: function () {
                return 72;
            }
        },
        "I": {
            get: function () {
                return 73;
            }
        },
        "J": {
            get: function () {
                return 74;
            }
        },
        "K": {
            get: function () {
                return 75;
            }
        },
        "L": {
            get: function () {
                return 76;
            }
        },
        "M": {
            get: function () {
                return 77;
            }
        },
        "N": {
            get: function () {
                return 78;
            }
        },
        "O": {
            get: function () {
                return 79;
            }
        },
        "P": {
            get: function () {
                return 80;
            }
        },
        "Q": {
            get: function () {
                return 81;
            }
        },
        "R": {
            get: function () {
                return 82;
            }
        },
        "S": {
            get: function () {
                return 83;
            }
        },
        "T": {
            get: function () {
                return 84;
            }
        },
        "U": {
            get: function () {
                return 85;
            }
        },
        "V": {
            get: function () {
                return 86;
            }
        },
        "W": {
            get: function () {
                return 87;
            }
        },
        "X": {
            get: function () {
                return 88;
            }
        },
        "Y": {
            get: function () {
                return 89;
            }
        },
        "Z": {
            get: function () {
                return 90;
            }
        },
        "NumPad0": {
            get: function () {
                return 96;
            }
        },
        "NumPad1": {
            get: function () {
                return 97;
            }
        },
        "NumPad2": {
            get: function () {
                return 98;
            }
        },
        "NumPad3": {
            get: function () {
                return 99;
            }
        },
        "NumPad4": {
            get: function () {
                return 100;
            }
        },
        "NumPad5": {
            get: function () {
                return 101;
            }
        },
        "NumPad6": {
            get: function () {
                return 102;
            }
        },
        "NumPad7": {
            get: function () {
                return 103;
            }
        },
        "NumPad8": {
            get: function () {
                return 104;
            }
        },
        "NumPad9": {
            get: function () {
                return 105;
            }
        },
        "F1": {
            get: function () {
                return 112;
            }
        },
        "F2": {
            get: function () {
                return 113;
            }
        },
        "F3": {
            get: function () {
                return 114;
            }
        },
        "F4": {
            get: function () {
                return 115;
            }
        },
        "F5": {
            get: function () {
                return 116;
            }
        },
        "F6": {
            get: function () {
                return 117;
            }
        },
        "F7": {
            get: function () {
                return 118;
            }
        },
        "F8": {
            get: function () {
                return 119;
            }
        },
        "F9": {
            get: function () {
                return 120;
            }
        },
        "F10": {
            get: function () {
                return 121;
            }
        },
        "F11": {
            get: function () {
                return 122;
            }
        },
        "F12": {
            get: function () {
                return 123;
            }
        }
    });
};

var NETWORK = new function () {
    this.createParameterForHTTPPostRequest = function (sVariable, sValue, sExistingParameter) {
        try {
            if (FCommon.String.isNullOrEmpty(sExistingParameter) == false) {
                sExistingParameter += "&";
            }

            sExistingParameter += sVariable + "=" + encodeURIComponent(sValue);
        }
        catch (err) {
            err.message = "Exception: {NETWORK.createParameterForHTTPPostRequest} " + err.message;
            throw err;
        }

        return (sExistingParameter);
    },

    this.createParameterForServerMethod = function (arrParam) {
        var iCounter = 0;
        var parameter = "";
        var obj = null;

        try {
            if (FCommon.UI.isValidObject(arrParam) == false || Array.isArray(arrParam) == false) {
                return (null);
            }

            for (iCounter = 0; iCounter < arrParam.length; iCounter++) {
                obj = arrParam[iCounter];

                parameter = NETWORK.createParameterForHTTPPostRequest(obj.name, obj.value, parameter);
            }
        }
        catch (err) {
            alert("Exception: {NETWORK.createParameterForHTTPPostRequest} " + err.message);
            parameter = null;
        }

        return (parameter);
    },

    this.executeServerMethod = function (ServerURL, bMethodType, arrParam, retType, bAsync, fnCallback_success, fnCallback_beforeSend, fnCallback_complete, tag, evt) {
        WriteConsoleLog("Enter: {NETWORK.executeServerMethod} [URL='" + ServerURL + "'][CallType='" + bMethodType + "'][ReturnType='" + retType + "'][Async='" + bAsync + "']");

        var iCounter = 0;
        var parameter = null;
        var result = null;
        var bAsynchronousCall = false;
        var jqParam = null;
        var sServerURL = "";
        var sMenuText = "";
        var sDataCallback = "";
        var objCallbackData = null;
        var header = null;
        var iCounter = 0;
        var bURLFound = false;
        var arrLog = null;

        try {
            result = COMMON.prototype.getEmptyResultObject();
            if (FCommon.UI.isValidObject(ServerURL) == false) {
                result.lValue = 0;
                result.sValue = "Error: Server url is mandatory.";
                result.data = null;

                return (result);
            }

            if ((typeof ServerURL).toLowerCase() == "string") {
                sServerURL = ServerURL;
            }
            else if ((typeof ServerURL).toLowerCase() == "object") {
                bURLFound = false;
                header = COMMON.prototype.getObjectPropertyValueArray(ServerURL, false);
                for (iCounter = 0; iCounter < header.property.length; iCounter++) {
                    if (header.property[iCounter].toLowerCase() == "url") {
                        sServerURL = header.value[iCounter];

                        header.property.splice(iCounter, 1);
                        header.value.splice(iCounter, 1);

                        bURLFound = true;
                        iCounter--;
                        //break;
                    }
                    else if (header.property[iCounter].toLowerCase() == "sdatacallback") {
                        sDataCallback = header.value[iCounter];

                        header.property.splice(iCounter, 1);
                        header.value.splice(iCounter, 1);
                        iCounter--;
                    }
                    else if (header.property[iCounter].toLowerCase() == "callbackdata") {
                        objCallbackData = header.value[iCounter];

                        header.property.splice(iCounter, 1);
                        header.value.splice(iCounter, 1);
                        iCounter--;
                    }
                    else if (header.property[iCounter].toLowerCase() == "menutext") {
                        sMenuText = header.value[iCounter];

                        header.property.splice(iCounter, 1);
                        header.value.splice(iCounter, 1);

                        iCounter--;
                        //break;
                    }
                }

                if (bURLFound == false) {
                    result.lValue = 0;
                    result.sValue = "Error: 'url' key is mandatory if object is passed.";
                    result.data = null;

                    return (result);
                }
            }

            if (FCommon.String.isNullOrEmpty(sServerURL) == true) {
                result.lValue = 0;
                result.sValue = "Error: Server url is mandatory.";
                result.data = null;

                return (result);
            }

            if (FCommon.UI.isValidObject(bMethodType) == false) {
                result.lValue = 0;
                result.sValue = "Error: Method type is mandatory.";
                result.data = null;

                return (result);
            }

            if (FCommon.UI.isValidObject(bAsync) == true && eval(bAsync) === true) {
                bAsynchronousCall = true;
            }

            if (FCommon.UI.isValidObject(arrParam) == true) {
                if (Array.isArray(arrParam) == true) {
                    parameter = NETWORK.createParameterForServerMethod(arrParam);
                }
                else if (typeof arrParam == 'string') {
                    parameter = arrParam;
                }
                else {
                    parameter = null;
                }
            }

            if (FCommon.UI.isValidObject(arrParam) == false) {
                jqParam = {};
            }
            else if (parameter != null && typeof parameter == 'string') {
                jqParam = {};

                if (FCommon.String.isNullOrEmpty(parameter) == false) {
                    jqParam.data = parameter;
                }
            }
            else if (parameter == null && typeof arrParam == 'object') {
                jqParam = {};

                if (bMethodType == true) {
                    jqParam.data = JSON.stringify(arrParam);
                    jqParam.contentType = "application/json; charset=UTF-8";
                }
                else {
                    jqParam.data = jQuery.param(arrParam, false);
                }
            }

            if (jqParam != null) {
                jqParam.url = sServerURL;
                jqParam.type = bMethodType == true ? 'POST' : 'GET';
                jqParam.async = bAsynchronousCall;
                jqParam.traditional = true;

                if (FCommon.UI.isValidObject(retType) == true && FCommon.String.isNullOrEmpty(retType) == false) {
                    jqParam.dataType = retType;
                }

                jqParam.beforeSend = function (jqXHR, settings) {
                    WriteConsoleLog("{NETWORK.executeServerMethod:beforeSend} [URL='" + sServerURL + "']");
                    var sSessionId = "";
                    var iCompanyId = 0;
                    var iLoginId = 0;
                    var ele = null;

                    if (header != null) {
                        for (iCounter = 0; iCounter < header.property.length; iCounter++) {
                            jqXHR.setRequestHeader(header.property[iCounter], header.value[iCounter]);
                        }
                    }

                    ele = document.getElementById("id_global_value");
                    if (ele != null) {
                        sSessionId = ele.getAttribute("data-sessionid");
                        iCompanyId = FConvert.toInt(ele.getAttribute("data-companyid"));
                        iLoginId = FConvert.toInt(ele.getAttribute("data-loginid"));
                    }

                    jqXHR.setRequestHeader("sRedisSessionId", sSessionId);
                    jqXHR.setRequestHeader("FOCUS_CURRENTTABID", NETWORK.getCurrentTabId());

                    if (iCompanyId != 0 && iLoginId != 0) {
                        jqXHR.setRequestHeader("CurrentInfo", iCompanyId + "_" + iLoginId);
                    }

                    if (FCommon.String.isNullOrEmpty(fnCallback_beforeSend) == false) {
                        if ((typeof fnCallback_beforeSend).toLowerCase() === "function") {
                            fnCallback_beforeSend(jqXHR, settings);
                        }
                        else {
                            if (FCommon.String.includes(fnCallback_beforeSend, "(") == true) {
                                eval(fnCallback_beforeSend);
                            }
                            else {
                                eval(fnCallback_beforeSend)(jqXHR, settings);
                            }
                        }
                    }
                };

                jqParam.success = function (data, textStatus, jqXHR) {
                    WriteConsoleLog("{NETWORK.executeServerMethod:success} [URL='" + sServerURL + "'][textStatus='" + textStatus + "']");

                    var sMenuText = "";
                    var objHeaderInfo = NETWORK.getResponseHeaderInfo(jqXHR);
                    if (FCommon.String.isNullOrEmpty(objHeaderInfo.CurrentTabId) == true) {
                        objHeaderInfo.CurrentTabId = "";
                    }
                    window.name = objHeaderInfo.CurrentTabId;

                    if (FCommon.UI.isValidObject(tag) == true && FCommon.UI.isValidObject(tag.NetWorkData) == true) {
                        sMenuText = tag.NetWorkData.MenuText;
                        delete tag.NetWorkData;
                    }

                    if (objHeaderInfo.SessionExpire != null || objHeaderInfo.PageRefresh != null) {
                        GLOBAL.pageRefresh();
                        return;
                    }

                    if (objHeaderInfo.ClientLog != null) {
                        arrLog = objHeaderInfo.ClientLog.split(", ");
                        for (iCounter = 0; iCounter < arrLog.length; iCounter++) {
                            WriteConsoleLog(arrLog[iCounter], "#0073AA");
                        }
                    }

                    if (FConvert.toInt(objHeaderInfo.FocusMessage) > 0) {
                        if ((typeof data).toLowerCase() == "object") {
                            COMMON.prototype.showMessage(data.sValue, NETWORK.getErrorTitle(data.lValue));
                        }
                        else {
                            data = FConvert.stringToObject(data);
                            if (data.lValue > 0) {
                                data = data.data;
                                COMMON.prototype.showMessage(data.sValue, NETWORK.getErrorTitle(data.lValue));
                            }
                        }

                        if (FCommon.String.isNullOrEmpty(fnCallback_success) == false) {
                            if ((typeof fnCallback_success).toLowerCase() === "function") {
                                fnCallback_success(false, data, tag, true, evt);
                            }
                            else {
                                eval(fnCallback_success)(false, data, tag, true, evt);
                            }
                        }

                        return;
                    }
                    else if (FConvert.toInt(objHeaderInfo.FocusData) > 0) {
                        if (FCommon.String.isNullOrEmpty(sDataCallback) == false) {
                            eval(sDataCallback)(data, objCallbackData, tag);
                        }
                        return;
                    }

                    result.lValue = 1;
                    result.sValue = "";
                    result.data = data;

                    if (FCommon.String.isNullOrEmpty(sMenuText, true) == true) {
                        sMenuText = objHeaderInfo.MenuText;
                    }


                    if (FCommon.String.isNullOrEmpty(sMenuText, true) == false) {
                        GLOBAL.setTitle("Focus-" + sMenuText);
                    }

                    if (FCommon.String.isNullOrEmpty(fnCallback_success) == false) {
                        if ((typeof fnCallback_success).toLowerCase() === "function") {
                            fnCallback_success(true, data, tag, evt, jqXHR);
                        }
                        else {
                            eval(fnCallback_success)(true, data, tag, evt, jqXHR);
                        }
                    }
                };

                jqParam.complete = function (jqXHR, textStatus) {
                    WriteConsoleLog("{NETWORK.executeServerMethod:complete} [URL='" + sServerURL + "'][textStatus='" + textStatus + "']");

                    if (FCommon.String.isNullOrEmpty(fnCallback_complete) == false) {
                        if ((typeof fnCallback_complete).toLowerCase() === "function") {
                            fnCallback_complete(jqXHR, textStatus);
                        }
                        else if (FConvert.isString(fnCallback_complete) == true) {
                            if (FCommon.String.includes(fnCallback_complete, "(") == true) {
                                eval(fnCallback_complete);
                            }
                            else {
                                eval(fnCallback_complete)(jqXHR, textStatus);
                            }
                        }
                    }
                };

                jqParam.error = function (jqXHR, textStatus, errorThrown) {
                    WriteConsoleLog("{NETWORK.executeServerMethod:error} [URL='" + sServerURL + "'][status='" + jqXHR.status + "'][textStatus='" + textStatus + "'][errorThrown='" + errorThrown + "']");

                    var objHeaderInfo = NETWORK.getResponseHeaderInfo(jqXHR);
                    if (FCommon.String.isNullOrEmpty(objHeaderInfo.CurrentTabId) == true) {
                        objHeaderInfo.CurrentTabId = "";
                    }
                    window.name = objHeaderInfo.CurrentTabId;

                    if (objHeaderInfo.SessionExpire != null || objHeaderInfo.PageRefresh != null) {
                        GLOBAL.pageRefresh();
                        return;
                    }

                    result.lValue = 0;
                    result.sValue = "Error: [textstatus='" + textStatus + "'][errorThrown='" + errorThrown + "']";

                    result.data = {};
                    result.data.sURL = sServerURL;
                    result.data.jqXHR = jqXHR;
                    result.data.textstatus = textStatus;
                    result.data.errorThrown = errorThrown;

                    if (FCommon.UI.isValidObject(jqXHR.responseText) == true) {
                        result.data.responseText = jqXHR.responseText;
                        COMMON.prototype.showMessageBootstrap(jqXHR.responseText, "Error");
                    }

                    if (FCommon.String.isNullOrEmpty(fnCallback_success) == false) {
                        if ((typeof fnCallback_success).toLowerCase() === "function") {
                            fnCallback_success(false, result, tag, evt);
                        }
                        else {
                            eval(fnCallback_success)(false, result, tag, evt);
                        }


                        //if (FCommon.UI.isValidObject(tag) == true) {
                        //    if ((typeof fnCallback_success).toLowerCase() === "function") {
                        //        fnCallback_success(false, result, tag);
                        //    }
                        //    else {
                        //        eval(fnCallback_success)(false, result, tag);
                        //    }
                        //}
                        //else {
                        //    if ((typeof fnCallback_success).toLowerCase() === "function") {
                        //        fnCallback_success(false, result);
                        //    }
                        //    else {
                        //        eval(fnCallback_success)(false, result);
                        //    }
                        //}
                    }
                };

                if (FCommon.String.isNullOrEmpty(sMenuText, true) == false) {
                    if (FCommon.UI.isValidObject(tag) == false) {
                        tag = {};
                    }

                    tag.NetWorkData = {};
                    tag.NetWorkData.MenuText = sMenuText;
                }

                $.ajax(jqParam);
            }
        }
        catch (err) {
            result.lValue = -1;
            result.sValue = "Exception: " + err.message;
            result.data = null;
        }

        return (result);
    },

    this.getResponseHeaderInfo = function (jqXHR) {
        var iIndex = 0;
        var value = null;
        var obj = null;

        try {
            obj = {};
            obj.SessionExpire = null;
            obj.PageRefresh = null;
            obj.FocusMessage = null;
            obj.FocusData = null;
            obj.CurrentTabId = null;
            obj.FileType = null;
            obj.FileName = null;
            obj.MenuText = null;
            obj.ClientLog = null;

            value = jqXHR.getResponseHeader("SESSION_EXPIRE");
            if (FCommon.UI.isValidObject(value) == true && value == 1) {
                obj.SessionExpire = value;
            }

            value = jqXHR.getResponseHeader("PAGE_REFRESH");
            if (FCommon.UI.isValidObject(value) == true && value == 1) {
                obj.PageRefresh = value;
            }

            value = jqXHR.getResponseHeader("FOCUS_MESSAGE");
            if (FConvert.toInt(value) > 0) {
                obj.FocusMessage = value;
            }

            value = jqXHR.getResponseHeader("FOCUS_DATA");
            if (FConvert.toInt(value) > 0) {
                obj.FocusData = value;
            }

            value = jqXHR.getResponseHeader("FOCUS_CURRENTTABID");
            if (FCommon.String.isNullOrEmpty(value) == false) {
                obj.CurrentTabId = value;
            }

            value = jqXHR.getResponseHeader("FOCUS_MENUTEXT");
            if (FCommon.String.isNullOrEmpty(value) == false) {
                obj.MenuText = value;
            }

            value = jqXHR.getResponseHeader("FOCUS_CLIENTLOG");
            if (FCommon.String.isNullOrEmpty(value) == false) {
                obj.ClientLog = value;
            }

            value = jqXHR.getResponseHeader("content-type");
            if (FCommon.String.isNullOrEmpty(value) == false) {
                obj.FileType = value;
            }

            value = jqXHR.getResponseHeader("Content-Disposition");
            if (FCommon.String.isNullOrEmpty(value) == false) {
                iIndex = value.indexOf("filename=");
                if (iIndex >= 0) {
                    obj.FileName = value.substr(iIndex + "filename=".length);
                }
            }
        }
        catch (err) {
            alert("Exception: {NETWORK.getResponseHeaderInfo} " + err.message);
        }

        return (obj);
    },

    this.getCurrentTabId = function () {
        var sValue = "";

        try {
            sValue = FConvert.toString(window.name);
            sValue = sValue.split(",");
            if (sValue.length > 0) {
                sValue = sValue[0];
            }
            else {
                sValue = "";
            }
        }
        catch (err) {

        }

        return (sValue);
    },

    this.getErrorTitle = function (lValue) {
        var sTitle = "";
        var ele = null;

        if (lValue > 0) {
            return ("");
        }

        if (lValue < 0) {
            ele = document.getElementById("id_resource_message_exception");
        }
        else if (lValue == 0) {
            ele = document.getElementById("id_resource_message_error");
        }

        if (FCommon.UI.isValidObject(ele) == true) {
            sTitle = ele.value;
        }
        else {
            if (lValue < 0) {
                sTitle = "Error";
            }
            else if (lValue == 0) {
                sTitle = "Exception";
            }
        }

        return (sTitle);
    }
}();

var OPTIONCONTROL = new function () {
    this.createControl = function (sControlId, iValue, sWidth, sURL, iMasterTypeId, iGroupType, sFilter, sMandatoryField, sOnLeave, sOnDataLoaded, sClassName) {
        var parameter = "";
        var value = null;
        var data = null;

        try {
            if (FCommon.UI.isValidObject(sControlId) == false || FCommon.String.isNullOrEmpty(sControlId) == true) {
                alert("Error: Control id is mandatory.");

                return (null);
            }

            //////// Control Id
            parameter = NETWORK.createParameterForHTTPPostRequest("sId", sControlId, parameter);

            //////// Value
            value = 0;
            if (FCommon.UI.isValidObject(iValue) == true) {
                value = iValue;
            }
            parameter = NETWORK.createParameterForHTTPPostRequest("iValue", value, parameter);

            //////// Width
            value = "";
            if (FCommon.UI.isValidObject(sWidth) == true && FCommon.String.isNullOrEmpty(sWidth) == false) {
                value = sWidth;
            }
            parameter = NETWORK.createParameterForHTTPPostRequest("sWidth", value, parameter);

            //////// URL
            parameter = NETWORK.createParameterForHTTPPostRequest("sURL", FCommon.String.isNullOrEmpty(sURL) == true ? "" : sURL, parameter);

            //////// MasterTypeId
            value = 0;
            if (FCommon.UI.isValidObject(iMasterTypeId) == true && FConvert.isInteger(iMasterTypeId) == true) {
                value = parseInt(iMasterTypeId);
            }
            parameter = NETWORK.createParameterForHTTPPostRequest("iMasterTypeId", value, parameter);

            //////// GroupType
            value = 0;
            if (FCommon.UI.isValidObject(iGroupType) == true && FConvert.isInteger(iGroupType) == true) {
                value = parseInt(iGroupType);
            }
            parameter = NETWORK.createParameterForHTTPPostRequest("iGroupType", value, parameter);

            ///////// Table Name
            value = "";
            parameter = NETWORK.createParameterForHTTPPostRequest("sTableName", value, parameter);


            ///////// Primary Field
            value = "";
            parameter = NETWORK.createParameterForHTTPPostRequest("sPrimaryField", value, parameter);


            ///////// Display Field
            value = "";
            parameter = NETWORK.createParameterForHTTPPostRequest("sDisplayField", value, parameter);

            //////// Filter
            value = "";
            if (FCommon.UI.isValidObject(sFilter) == true && FCommon.String.isNullOrEmpty(sFilter) == false) {
                value = sFilter;
            }
            parameter = NETWORK.createParameterForHTTPPostRequest("sFilter", value, parameter);

            /////////// Exact Match
            value = true;
            parameter = NETWORK.createParameterForHTTPPostRequest("bExactMatch", value, parameter);

            //////// Mandatory Field
            value = "";
            if (FCommon.String.isNullOrEmpty(sMandatoryField) == false) {
                value = sMandatoryField;
            }
            parameter = NETWORK.createParameterForHTTPPostRequest("sMandatoryField", value, parameter);

            //////// Class Name
            value = "";
            if (FCommon.String.isNullOrEmpty(sClassName) == false) {
                value = sClassName;
            }
            parameter = NETWORK.createParameterForHTTPPostRequest("sClassName", value, parameter);

            //////// OnLeave
            value = "";
            if (FCommon.String.isNullOrEmpty(sOnLeave) == false) {
                value = sOnLeave;
            }
            parameter = NETWORK.createParameterForHTTPPostRequest("sOnLeave", value, parameter);

            //////// OnDataLoaded
            value = "";
            if (FCommon.String.isNullOrEmpty(sOnDataLoaded) == false) {
                value = sOnDataLoaded;
            }
            parameter = NETWORK.createParameterForHTTPPostRequest("sOnDataLoaded", value, parameter);

            data = NETWORK.executeServerMethod(OPTIONCONTROL_INTERNAL.getContextPath("CreateOptionControl", "RD", "RD"), true, parameter, 'json');
            if (data != null) {
                if (data.lValue < 1 && FCommon.String.isNullOrEmpty(data.sValue) == false) {
                    alert(data.sValue);
                }

                if (data.lValue > 0) {
                    data = data.data;
                }
                else {
                    data = null;
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL::createControl} " + err.message);
        }

        return (data);
    },

    this.setDataContainerLeftPosition = function (id) {
        var container = null;
        var inputcontainer = null;
        var iLeft = 0;

        try {
            //return; // If parent has relative position below code has problem 10-Sep-2015
            id = FCommon.UI.getValidElement(id);

            container = OPTIONCONTROL_INTERNAL.getDataContainerElement(id);
            iLeft = FCommon.UI.getScrollLeft(id, true);


            inputcontainer = document.getElementById(OPTIONCONTROL_INTERNAL.getInputContainerId(id));
            if (iLeft > 0 && FCommon.UI.isValidObject(inputcontainer) == true && FCommon.UI.isValidObject(inputcontainer.parentElement) == true) {
                //container.style.left = (FConvert.toInt(inputcontainer.parentElement.offsetLeft) - iLeft) + "px";
                container.style.left = inputcontainer.getBoundingClientRect().left + "px";
            }
            else {
                container.style.left = "";
            }
            container.style.position = "fixed";
            return;


            if (FCommon.UI.isValidObject(container) == true && FCommon.UI.isValidObject(inputcontainer) == true) {
                container.style.position = "fixed";
                container.style.left = inputcontainer.getBoundingClientRect().left + "px";

            }
        }
        catch (err) {
            err.message = "Exception: {setDataContainerLeftPosition} " + err.message;
            throw err;
        }
    },

    this.setDataContainerTopPosition = function (id) {
        var container = null;
        var inputcontainer = null;
        var iTop = 0;

        try {
            id = FCommon.UI.getValidElement(id);

            container = OPTIONCONTROL_INTERNAL.getDataContainerElement(id);

            iTop = FCommon.UI.getScrollTop(id);
            inputcontainer = document.getElementById(OPTIONCONTROL_INTERNAL.getInputContainerId(id));
            if (iTop > 0 && FCommon.UI.isValidObject(inputcontainer) == true) {
                container.style.top = inputcontainer.getBoundingClientRect().bottom + "px";
            }
            else {
                container.style.top = "";
            }
            container.style.position = "fixed";
            return;
        }
        catch (err) {
            err.message = "Exception: {setDataContainerTopPosition} " + err.message;
            throw err;
        }
    },

    this.setDataContainerPosition = function (id) {
        var container = null;
        var heading = null;
        var inputcontainer = null;
        var inputbox = null;
        var inputimage = null;
        var iWidth = 0;

        try {
            id = FCommon.UI.getValidElement(id);

            container = OPTIONCONTROL_INTERNAL.getDataContainerElement(id);
            heading = OPTIONCONTROL_INTERNAL.getDataHeadingTableElement(id);
            inputcontainer = document.getElementById(OPTIONCONTROL_INTERNAL.getInputContainerId(id));
            inputbox = document.getElementById(id.id);
            inputimage = document.getElementById(OPTIONCONTROL_INTERNAL.getInputImageId(id));

            if (FCommon.UI.isValidObject(container) == true && FCommon.UI.isValidObject(heading) == true) {
                iWidth = FCommon.UI.getWidth(heading);
                if (iWidth == 0) {
                    var ele = $(heading).find("colgroup > col");
                    for (var iCounter = 0; iCounter < ele.length; iCounter++) {
                        iWidth += $(ele[iCounter]).width();
                    }
                }

                container.style.width = iWidth + "px";
            }

            OPTIONCONTROL.setDataContainerTopPosition(id);
            OPTIONCONTROL.setDataContainerLeftPosition(id);
        }
        catch (err) {
            err.message = "Exception: {setDataContainerPosition} " + err.message;
            throw err;
        }
    },

    // {Internal} Called when table row is clicked
    this.rowClick = function (row, id, event) {
        var sCallback = "";
        var obj = null;
        var element = null;
        var retValue = null;

        try {
            element = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
            if (element != null) {
                OPTIONCONTROL_INTERNAL.unselectRow(element);
            }

            OPTIONCONTROL_INTERNAL.selectRow(row, id);
            OPTIONCONTROL_INTERNAL.setSelectedValue(id);

            obj = OPTIONCONTROL_INTERNAL.hasPartialData(row, id);
            if (obj.iMasterId > 0) {
                OPTIONCONTROL_INTERNAL.startLoadingPartialData(id, row, obj);
                OPTIONCONTROL_INTERNAL.setSelectedValue(id);
            }

            obj = OPTIONCONTROL_INTERNAL.getCallbackDataObject(id, null, false);
            obj.OldValue = FConvert.toInt(FCommon.UI.getAttributeData(id, "lastvalue"));

            obj.Data = OPTIONCONTROL.getControlData(id);
            if (FCommon.UI.isValidObject(obj.Data) == true) {
                obj.Value = FConvert.toInt(FCommon.Object.getFirstPropertyValue(obj.Data[0]));
            }

            if (obj.OldValue == obj.Value) {
                return;
            }
            FCommon.UI.setAttributeData(id, "lastvalue", obj.Value);

            sCallback = OPTIONCONTROL.getOnDataChangeCallback(id);
            if (FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                obj.Event = event;
                obj.Flag.bLeave = false;
                obj.Flag.bDataLoad = false;
                obj.Flag.bDataChange = true;
                retValue = eval(sCallback)(obj.Control, obj.Data, obj);
                if (COMMON.prototype.isBoolean(retValue) == true && FConvert.toBoolean(retValue) == false) {
                    return;
                }
            }

            FCommon.UI.setAttributeData(id, "focusvalue", obj.Value);
            OPTIONCONTROL.focusText(id, id.value);
            //FCommon.UI.setAttributeData(id, "focustext", id.value);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.rowClick} " + err.message);
        }
    },

    this.isValidStoredData = function (id, key) {
        var iCompareValueIndex = 0;
        var arrData = null;
        var obj = null;

        try {
            arrData = OPTIONCONTROL_INTERNAL.getMemoryData(id);
            if (arrData.length == 0) {
                return (true);
            }

            if (FCommon.String.isNullOrEmpty(key) == true) {
                return (false);
            }

            iCompareValueIndex = OPTIONCONTROL_INTERNAL.getCompareValueIndex(id);
            obj = arrData[0];
            if (FCommon.UI.isValidObject(obj) == false || obj.length <= iCompareValueIndex) {
                return (false);
            }

            if (FCommon.String.isNullOrEmpty(obj[iCompareValueIndex].sValue) == true) {
                return (false);
            }

            if (FCommon.String.compare(key, obj[iCompareValueIndex].sValue, true, 1) == 0) {
                return (true);
            }
        }
        catch (err) {
            err.message = "Exception: {isValidStoredData} " + err.message;
            throw err;
        }

        return (false);
    },

    this.isInputBarcodeEnabled = function (id) {
        var iMasterTypeId = 0;
        var bValue = false;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return (false);
            }

            iMasterTypeId = OPTIONCONTROL.getMasterTypeId(id);
            if (iMasterTypeId != 2) {
                return (false);
            }

            bValue = FConvert.toBoolean(FCommon.UI.getAttributeData(id, "isbarcode"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.isInputBarcodeEnabled} " + err.message);
        }

        return (bValue);
    },

    // {Internal} Sets control selected data into hidden element
    this.setControlData = function (id, objData) {
        OPTIONCONTROL_INTERNAL.setControlData(id, objData);
    },

    // {Public} Returns option control class name
    this.getClassName = function () {
        return ("FOptionControl");
    },

    this.getBarcodeProductURL = function (id) {
        var value = "";

        try {
            id = FCommon.UI.getValidElement(id);
            value = FConvert.toString(FCommon.UI.getAttributeData(id, "barcodeproducturl"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getBarcodeProductURL} " + err.message);
        }

        return (value);
    },

    this.getSearchUIURL = function (id) {
        var value = "";

        try {
            id = FCommon.UI.getValidElement(id);
            value = FConvert.toString(FCommon.UI.getAttributeData(id, "searchuiurl"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getSearchUIURL} " + err.message);
        }

        return (value);
    },

    // {Public} Returns selected control Raw data
    this.getControlData = function (id) {
        var iCounter = 0;
        var iIndex = 0;
        var element = null;
        var jsondata = {};
        var data = [];
        var arrMetaData = null;

        try {
            id = FCommon.UI.getValidElement(id);

            element = OPTIONCONTROL_INTERNAL.getDataElement(id);
            if (FCommon.UI.isValidObject(element) == false) {
                return (data);
            }

            arrMetaData = OPTIONCONTROL_INTERNAL.getMetaData(id);
            for (iCounter = 0; iCounter < arrMetaData.length; iCounter++) {
                sProperty = arrMetaData[iCounter].Name;
                if (FCommon.UI.hasDataAttribute(element, sProperty, true) == true) {
                    jsondata[sProperty] = element.getAttribute("data-" + sProperty.toLowerCase());
                    data.push(jsondata);
                    jsondata = {};
                    iIndex++;
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getControlData} " + err.message);
        }

        return (data);
    },

    // {Public} Returns selected control data
    this.getControlDataObject = function (id) {
        var sProperty = "";
        var iCounter = 0;
        var arrMetaData = null;
        var element = null;
        var data = {};

        try {
            id = FCommon.UI.getValidElement(id);
            element = OPTIONCONTROL_INTERNAL.getDataElement(id);

            arrMetaData = OPTIONCONTROL_INTERNAL.getMetaData(id);
            for (iCounter = 0; iCounter < arrMetaData.length; iCounter++) {
                sProperty = arrMetaData[iCounter].Name;
                if (FCommon.String.includes(sProperty, " ") == true) {
                    WriteConsoleLog("Error: {OPTIONCONTROL.getControlDataObject} [id=" + id.id + "][Property=" + sProperty + "] Property cannot have space.");
                }

                data[sProperty] = element.getAttribute("data-" + sProperty.toLowerCase());
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL::getControlDataObject} " + err.message;
            throw err;
        }

        return (data);
    },

    // {Public} Returns selected value
    this.getControlValue = function (id, sField) {
        var element = null;
        var value = null;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return (value);
            }

            element = OPTIONCONTROL_INTERNAL.getDataElement(id);
            if (FCommon.UI.isValidObject(element) == false) {
                return (value);
            }

            if (FCommon.String.isNullOrEmpty(sField, true) == true) {
                value = element.getAttribute("value");
            }
            else {
                value = element.getAttribute("data-" + sField.toLowerCase());
            }
        }
        catch (err) {
            WriteConsoleLog("Exception: {OPTIONCONTROL::getControlValue} " + err.message);

            err.message = "Exception: {OPTIONCONTROL::getControlValue} " + err.message;
            throw err;
        }

        return (value);
    },

    // {Public} Sets control value 
    this.setControlValue = function (id, value, tag, bLoadAll, bIgnoreChangeCallback, bFromF2, bAsync, bDoNotShowPopup) {
        var sCallback = "";
        var sURL = "";
        var sValueFilter = "";
        var arrLoadedData = null;
        var obj = null;
        var objParam = null;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return ("Invalid id.");
            }

            if (OPTIONCONTROL_INTERNAL.isTextSelectionType(id) == true) {
                id.value = value;
                return;
            }

            bIgnoreChangeCallback = FConvert.toBoolean(bIgnoreChangeCallback);
            if (OPTIONCONTROL_COMBO.isWorkAsComboBox(id) == true) {
                OPTIONCONTROL_COMBO.setControlValue(id, value, bIgnoreChangeCallback);

                return;
            }

            bLoadAll = FConvert.toBoolean(bLoadAll);

            bFromF2 = FConvert.toBoolean(bFromF2);
            if (Array.isArray(value) == true) {
                arrLoadedData = OPTIONCONTROL_INTERNAL.fillValueInMemory(id, value, tag, bLoadAll, bIgnoreChangeCallback);

                if (arrLoadedData.length > 0) {
                    sCallback = OPTIONCONTROL.getOnDataLoadedCallback(id);
                    if (FCommon.String.isNullOrEmpty(sCallback) == false) {
                        obj = OPTIONCONTROL_INTERNAL.getCallbackDataObject(id, tag, false);
                        obj.Data = arrLoadedData;
                        obj.bDataArray = true;
                        obj.Flag.bLeave = false;
                        obj.Flag.bDataLoad = true;
                        obj.Flag.bDataChange = false;

                        eval(sCallback)(id, arrLoadedData, obj);
                    }
                }

                return;
            }

            if (OPTIONCONTROL.getMasterTypeId(id) > 0 && value == 0) {
                if (bIgnoreChangeCallback == false) {
                    obj = OPTIONCONTROL_INTERNAL.getCallbackDataObject(id, null, true);
                    obj.Event = null;
                    sCallback = OPTIONCONTROL.getOnDataChangeCallback(id);
                }

                OPTIONCONTROL.clear(id);

                if (bIgnoreChangeCallback == false && FCommon.String.isNullOrEmpty(sCallback, true) == false && obj.OldValue != 0) {
                    obj.Flag.bLeave = false;
                    obj.Flag.bDataLoad = false;
                    obj.Flag.bDataChange = true;
                    eval(sCallback)(obj.Control, obj.Data, obj);
                }

                return (true);
            }

            OPTIONCONTROL_INTERNAL.removePartialData(id);
            if (OPTIONCONTROL_INTERNAL.selectValueInControl(id, value, tag, bIgnoreChangeCallback) == true) {
                return (true);
            }

            sURL = FCommon.UI.getAttributeData(id, "url");
            // debugger
            objParam = OPTIONCONTROL_INTERNAL.getServerCommunicationParameterObject(id, sURL);
            objParam.bShowAllCols = true;
            //objParam.SelectedData = value;
            objParam.bLoadAll = bLoadAll;
            objParam.bIgnoreChangeCallback = bIgnoreChangeCallback;

            if (bFromF2 == true) {
                objParam.iSelectedId = value;
            }
            else {
                sValueFilter = FCommon.UI.getAttributeData(id, "valuefilterfield");
                if (FCommon.String.isNullOrEmpty(sValueFilter) == true) {
                    if (FCommon.String.isNullOrEmpty(OPTIONCONTROL.getTableName(id)) == true) {
                        sValueFilter = "a.iMasterId=" + value;
                    }
                    else {
                        sValueFilter = OPTIONCONTROL.getPrimaryField(id) + "=" + value;
                    }
                }
                else {
                    sValueFilter += "=";
                    sValueFilter += '\'' + value + '\'';
                }

                objParam.sFilter = sValueFilter;
                objParam.SelectedData = value;
                OPTIONCONTROL_INTERNAL.setSearchBy(id, -1);
            }

            //OPTIONCONTROL_INTERNAL.setSearchBy(id, -1);
            OPTIONCONTROL_INTERNAL.setFirstField(id, -1);

            if (FCommon.UI.isValidObject(tag) == true) {
                objParam.tag = tag;
            }

            if (FCommon.UI.isValidObject(bAsync) == true) {
                objParam.bAsync = bAsync;
            }

            if (FCommon.UI.isValidObject(bDoNotShowPopup) == true) {
                objParam.bDoNotShowPopup = bDoNotShowPopup;
            }

            OPTIONCONTROL_INTERNAL.resetDataElement(id, true);
            OPTIONCONTROL_INTERNAL.getDataFromServer(objParam);
        }
        catch (err) {
            WriteConsoleLog("Exception: {OPTIONCONTROL::setControlValue} " + err.message);

            err.message = "Exception: {OPTIONCONTROL::setControlValue} " + err.message;
            throw err;
        }

        return (false);
    },

    // {Public} Returns selected value
    this.getControlValueLong = function (id, sField) {
        var element = null;
        var value = null;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return ("");
            }

            element = OPTIONCONTROL_INTERNAL.getDataElement(id);
            if (FCommon.UI.isValidObject(element) == false) {
                return ("");
            }

            if (FCommon.String.isNullOrEmpty(sField, true) == true) {
                value = element.getAttribute("value");
            }
            else {
                value = element.getAttribute("data-" + sField.toLowerCase());
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getControlValueLong} " + err.message);
        }

        value = FConvert.toString(value);

        return (value);
    },

    // {Public} Returns inputted text in control
    this.getControlText = function (id) {
        var vValue = "";

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == true) {
                vValue = id.value;
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL::getControlText} " + err.message;
            throw err;
        }

        return (vValue);
    },

    // {Public} Sets control text
    this.setControlText = function (id, sValue, bRefresh) {
        var objData = null;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == true) {
                id.value = sValue;

                if (OPTIONCONTROL_COMBO.isWorkAsComboBox(id) == true) {
                    OPTIONCONTROL_COMBO.setControlText(id, sValue);
                    return;
                }
                else {
                    bRefresh = FConvert.toBoolean(bRefresh);
                    if (bRefresh == true) {
                        objData = OPTIONCONTROL_INTERNAL.getElementData(OPTIONCONTROL_INTERNAL.getSelectedRow(id), id);
                        OPTIONCONTROL_INTERNAL.processInputs(id,
                                                    sValue,
                                                    FCommon.UI.getAttributeData(id, "url"),
                                                    objData,
                                                    false);
                    }
                }
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL.setControlText} " + err.message;
            throw err;
        }
    },

    this.updateControlValue = function (id, sText, iValue, obj) {
        var eleData = null;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return;
            }

            id.value = sText;

            eleData = OPTIONCONTROL_INTERNAL.getDataElement(id);
            if (FCommon.UI.isValidObject(eleData) == false) {
                return;
            }

            FCommon.UI.removeDataAttribute(eleData);
            eleData.value = FConvert.toInt(iValue);

            if (FCommon.UI.isValidObject(obj) == true) {
                FCommon.UI.setAttributeData(eleData, obj);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.updateControlValue} " + err.message);
        }
    },

    this.setLoadedData = function (id, objRawData, iSelectedData, objMetaData) {
        var objResponse = null;

        try {
            objResponse = {};
            objResponse.id = id;
            objResponse.data = objRawData;
            objResponse.sKey = "";
            objResponse.bAsync = null;
            objResponse.objSelectedData = iSelectedData;
            objResponse.bIgnoreChangeCallback = false;
            objResponse.bFromKeyboard = false;
            objResponse.sURL = "";
            objResponse.iSearchBy = -1;
            objResponse.bDoNotShowPopup = null;

            if (FCommon.UI.isValidObject(objMetaData) == true) {
                objResponse.tag = objMetaData;
            }

            OPTIONCONTROL_INTERNAL.serverResponse(objResponse, true);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.setLoadedData} " + err.message);
        }
    },

    this.resetControl = function (id, value, iSearchBy, iFirstField, bFromF2) {
        var bWorkAsComboBox = false;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return;
            }

            if (OPTIONCONTROL_COMBO.isWorkAsComboBox(id) == true) {
                OPTIONCONTROL_COMBO.resetControl(id, value);

                return;
            }

            if (FCommon.UI.isValidObject(iSearchBy) == true) {
                OPTIONCONTROL_INTERNAL.setSearchBy(id, iSearchBy);
            }
            else {
                OPTIONCONTROL_INTERNAL.setSearchBy(id, -1);
            }

            if (FCommon.UI.isValidObject(iFirstField) == true) {
                OPTIONCONTROL_INTERNAL.setFirstField(id, iFirstField);
            }
            else {
                OPTIONCONTROL_INTERNAL.setFirstField(id, -1);
            }

            OPTIONCONTROL_INTERNAL.resetHeadingElement(id);
            OPTIONCONTROL.clear(id, false);

            OPTIONCONTROL_INTERNAL.setDataLoadingFlag(id, false);
            OPTIONCONTROL_INTERNAL.setBufferedInputText(id, "");

            if (FCommon.UI.isValidObject(value) == true) {
                OPTIONCONTROL.setControlValue(id, value, null, false, true, bFromF2);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.resetControl} " + err.message);
        }
    },

    // {Public} Cleares memory and control data
    this.clear = function (id, bDoNotClearInput) {
        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return;
            }

            if (OPTIONCONTROL_COMBO.isWorkAsComboBox(id) == true) {
                OPTIONCONTROL_COMBO.clear(id, FConvert.toBoolean(bDoNotClearInput));

                return;
            }

            OPTIONCONTROL_INTERNAL.resetDataElement(id, true);

            if (FCommon.UI.isValidObject(bDoNotClearInput) == false || bDoNotClearInput == false) {
                id.value = "";
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.clear} " + err.message);
        }
    },

    // {Public} Returns mastertype id
    this.getMasterTypeId = function (id) {
        var value = 0;

        try {
            id = FCommon.UI.getValidElement(id);
            value = FConvert.toInt(FCommon.UI.getAttributeData(id, "mastertypeid"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getMasterTypeId} " + err.message);
        }

        return (value);
    },

    // {Public} Sets mastertype id
    this.setMasterTypeId = function (id, iMasterTypeId) {
        id = FCommon.UI.getValidElement(id);
        if (FCommon.UI.isValidObject(id) == true) {
            FCommon.UI.setAttributeData(id, "mastertypeid", iMasterTypeId);

            OPTIONCONTROL.clear(id);
        }
    },

    this.getGroupType = function (id) {
        var value = 0;

        try {
            id = FCommon.UI.getValidElement(id);
            value = FConvert.toInt(FCommon.UI.getAttributeData(id, "grouptype"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getGroupType} " + err.message);
        }

        return (value);
    },

    this.getUserRestriction = function (id) {
        var value = 0;

        try {
            id = FCommon.UI.getValidElement(id);
            value = FCommon.UI.getAttributeData(id, "userrestriction");
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getUserRestriction} " + err.message);
        }

        return (value);
    },

    this.getScanFlag = function (id) {
        var value = 0;

        try {
            id = FCommon.UI.getValidElement(id);
            value = FConvert.toBoolean(FCommon.UI.getAttributeData(id, "bscanned"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getScanFlag} " + err.message);
        }

        return (value);
    },

    this.setScanFlag = function (id, value) {
        try {
            id = FCommon.UI.getValidElement(id);
            FCommon.UI.setAttributeData(id, "bscanned", value);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.setScanFlag} " + err.message);
        }
    },

    this.isMandatory = function (id) {
        var value = 0;

        try {
            id = FCommon.UI.getValidElement(id);
            value = FConvert.toBoolean(FCommon.UI.getAttributeData(id, "bmandatory"));
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL.isMandatory} " + err.message;
            throw err;
        }

        return (value);
    },

    this.isMultipleSelectSearch = function (id) {
        var bValue = false;

        try {
            id = FCommon.UI.getValidElement(id);

            bValue = FConvert.toBoolean(id.getAttribute("data-multipleselectsearch"));
        }
        catch (err) {
            console.log("Exception: {OPTIONCONTROL.isMultipleSelectSearch} " + err.message);
        }

        return (bValue);
    },

    this.setFilter = function (id, filter, bDoNotClear) {
        id = FCommon.UI.getValidElement(id);

        FCommon.UI.setAttributeData(id, "filter", filter);

        if (FConvert.toBoolean(bDoNotClear) == false) {
            OPTIONCONTROL.clear(id);
        }
    },

    this.getFilter = function (id) {
        var value = "";

        try {
            value = FCommon.UI.getAttributeData(id, "filter");
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getFilter} " + err.message);
        }

        return (value);
    },

    this.setExtraFilter = function (id, filter, bAppend) {
        var sFilter = "";

        id = FCommon.UI.getValidElement(id);
        filter = FConvert.toString(filter);

        sFilter = FConvert.toString(OPTIONCONTROL.getExtraFilter(id));
        if (FCommon.String.isNullOrEmpty(sFilter, true) == true || FConvert.toBoolean(bAppend) == false) {
            sFilter = filter;
        }
        else {
            sFilter += " AND " + filter;
        }

        FCommon.UI.setAttributeData(id, "extrafilter", sFilter);
    },

    this.getExtraFilter = function (id) {
        var value = "";

        try {
            value = FCommon.UI.getAttributeData(id, "extrafilter");
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getExtraFilter} " + err.message);
        }

        return (value);
    },

    this.removeExtraFilter = function (id, sFilterField) {
        var sFilter = "";

        try {
            id = FCommon.UI.getValidElement(id);
            sFilterField = FConvert.toString(sFilterField);
            if (FCommon.String.isNullOrEmpty(sFilterField, true) == true) {
                return;
            }

            sFilter = FConvert.toString(OPTIONCONTROL.getExtraFilter(id));
            sFilter = OPTIONCONTROL_INTERNAL.removefilterCondition(sFilter, sFilterField);

            OPTIONCONTROL.setExtraFilter(id, sFilter);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.removeExtraFilter} " + err.message);
        }
    },

    this.setTableName = function (id, table) {
        id = FCommon.UI.getValidElement(id);

        FCommon.UI.setAttributeData(id, "tablename", table);

        OPTIONCONTROL.clear(id);
    },

    this.getTableName = function (id) {
        var value = null;

        try {
            value = FCommon.UI.getAttributeData(id, "tablename");
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getTableName} " + err.message);
        }

        return (value);
    },

    this.setPrimaryField = function (id, field) {
        id = FCommon.UI.getValidElement(id);

        FCommon.UI.setAttributeData(id, "primaryfield", field);

        OPTIONCONTROL.clear(id);
    },

    this.getPrimaryField = function (id) {
        var vValue = null;

        try {
            vValue = FCommon.UI.getAttributeData(id, "primaryfield");
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL::getPrimaryField} " + err.message;
            throw err;
        }

        return (vValue);
    },

    this.setDisplayField = function (id, field) {
        id = FCommon.UI.getValidElement(id);

        FCommon.UI.setAttributeData(id, "displayfield", field);

        OPTIONCONTROL.clear(id);
    },

    this.getDisplayField = function (id) {
        var vValue = null;

        try {
            vValue = FCommon.UI.getAttributeData(id, "displayfield");
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL::getDisplayField} " + err.message;
            throw err;
        }

        return (vValue);
    },

    this.getMandatoryFields = function (id) {
        var vValue = null;

        try {
            vValue = FCommon.UI.getAttributeData(id, "mandatoryfield");
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL.getMandatoryFields} " + err.message;
            throw err;
        }

        return (vValue);
    },

    this.setMandatoryFields = function (id, sFields) {
        try {
            sFields = FConvert.toString(sFields);
            FCommon.UI.setAttributeData(id, "mandatoryfield", sFields);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.setMandatoryFields} " + err.message);
        }
    },

    // Returns true if option control has specific mandatory Field
    this.hasMandatoryField = function (id, sFieldName) {
        var sMandatoryFields = "";
        var iCounter = 0;
        var arrFields = null;

        try {
            sMandatoryFields = OPTIONCONTROL.getMandatoryFields(id);
            if (FCommon.String.isNullOrEmpty(sMandatoryFields, true) == true) {
                return (false);
            }

            if (FCommon.String.isNullOrEmpty(sFieldName, true) == true) {
                return (true);
            }

            arrFields = sMandatoryFields.split(",");
            for (iCounter = 0; iCounter < arrFields.length; iCounter++) {
                if (arrFields[iCounter].trim() == sFieldName.trim()) {
                    return (true);
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.hasMandatoryField} " + err.message);
        }

        return (false);
    },

    this.setUserData = function (id, value) {
        try {
            FCommon.UI.setAttributeData(id, "userdata", value);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.setUserData} " + err.message);
        }
    },

    this.getUserData = function (id) {
        var value = null;

        try {
            value = FCommon.UI.getAttributeData(id, "userdata");
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL.getUserData} " + err.message;
            throw err;
        }

        return (value);
    },

    this.getAfterPopupDisplayedCallback = function (id) {
        var sValue = "";

        try {
            sValue = FCommon.UI.getAttributeData(id, "afterpopupdisplayed");
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL.getAfterPopupDisplayedCallback} " + err.message;
        }

        return (sValue);
    },

    // {Public} Returns onfocus callback method name
    this.getOnFocusCallback = function (id) {
        var sValue = "";

        try {
            sValue = FCommon.UI.getAttributeData(id, "onfocus");
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL.getOnFocusCallback} " + err.message;
        }

        return (sValue);
    },

    // {Public} Returns onblur callback method name
    this.getOnLeaveCallback = function (id) {
        var sValue = "";

        try {
            sValue = FCommon.UI.getAttributeData(id, "onleave");
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL::getOnLeaveCallback} " + err.message;
        }

        return (sValue);
    },

    // {Public}
    this.getOnMultipleSelectedSearchCallback = function (id) {
        var sValue = "";

        try {
            sValue = FCommon.UI.getAttributeData(id, "onmultipleselectedsearch");
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL::getOnMultipleSelectedSearchCallback} " + err.message;
        }

        return (sValue);
    },

    // {Public} Returns onKeyDown callback method name
    this.getOnKeyDownCallback = function (id) {
        var sValue = "";

        try {
            sValue = FCommon.UI.getAttributeData(id, "onkeydown");
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL::getOnKeyDownCallback} " + err.message;
        }

        return (sValue);
    },

    // {Public} Returns on data loaded callback method name
    this.getOnDataLoadedCallback = function (id) {
        var sValue = "";

        try {
            id = FCommon.UI.getValidElement(id);
            sValue = FCommon.UI.getAttributeData(id, "ondataloaded");
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL::getOnDataLoadedCallback} " + err.message;
        }

        return (sValue);
    },

    // {Public} Returns on data change callback method name
    this.getOnDataChangeCallback = function (id) {
        var sValue = "";

        try {
            id = FCommon.UI.getValidElement(id);
            sValue = FCommon.UI.getAttributeData(id, "ondatachange");
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getOnDataChangeCallback} " + err.message);
        }

        return (sValue);
    },

    this.setOnDataChangeCallback = function (id, sValue) {
        try {
            id = FCommon.UI.getValidElement(id);
            sValue = FCommon.UI.setAttributeData(id, "ondatachange", sValue);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.setOnDataChangeCallback} " + err.message);
        }
    },

    this.getBarcodeDataLoadedCallback = function (id) {
        var sValue = "";

        try {
            id = FCommon.UI.getValidElement(id);
            sValue = FCommon.UI.getAttributeData(id, "barcodedataloaded");
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getBarcodeDataLoadedCallback} " + err.message);
        }

        return (sValue);
    },

    // {Public} Returns callback method name
    this.getDataNotFoundCallback = function (id) {
        var sValue = "";

        try {
            sValue = FCommon.UI.getAttributeData(id, "ondatanotfound");
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getDataNotFoundCallback} " + err.message);
        }

        return (sValue);
    },

    this.collapseAllPopups = function () {
        var iCounter = 0;
        var arrElements = null;

        try {
            arrElements = document.getElementsByClassName("option_container");
            if (FCommon.UI.isValidObject(arrElements) == true) {
                for (iCounter = 0; iCounter < arrElements.length; iCounter++) {
                    arrElements[iCounter].style.display = "none";
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.collapseAllPopups} " + err.message);
        }
    },

    this.updatePopupPosition = function () {
        //var sId = "";
        var iCounter = 0;
        var arrElements = null;
        ////var eleId = null;
        var obj = null;

        try {
            arrElements = document.getElementsByClassName("option_container");
            if (FCommon.UI.isValidObject(arrElements) == true) {
                for (iCounter = 0; iCounter < arrElements.length; iCounter++) {
                    //if (arrElements[iCounter].style.display === "none") {
                    //    continue;
                    //}

                    OPTIONCONTROL_INTERNAL.updatePopupPosition(arrElements[iCounter]);
                    //sId = arrElements[iCounter].id;
                    //if (FCommon.String.isNullOrEmpty(sId) == true) {
                    //    continue;
                    //}

                    //sId = FCommon.String.left(sId, sId.length - "_container".length);
                    //eleId = FCommon.UI.getValidElement(sId);

                    //obj = FCommon.UI.getVisibleWidthHeight(eleId);
                    //if (obj.iVisibleWidth < 1 || obj.iVisibleHeight < 1) {
                    //    arrElements[iCounter].style.display = "none";
                    //}
                    //else {
                    //    FCommon.UI.setFocusDropdownPopupPosition(eleId, arrElements[iCounter]);
                    //}
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.updatePopupPosition} " + err.message);
        }
    },

    this.setUnit = function (id, iUnitId, iItemId) {
        try {
            id = FCommon.UI.getValidElement(id);

            id.setAttribute("data-i_UnitId", iUnitId);
            id.setAttribute("data-i_ItemId", iItemId);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.setUnit} " + err.message);
        }
    },

    this.setParam = function (id, iParam) {
        try {
            id = FCommon.UI.getValidElement(id);
            FCommon.UI.setAttributeData(id, "iparam", iParam);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.setParam} " + err.message);
        }
    },

    this.getParam = function (id) {
        var value = 0;

        try {
            id = FCommon.UI.getValidElement(id);

            value = FConvert.toInt(id.getAttribute("data-iparam"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getParam} " + err.message);
        }

        return (value);
    },

    this.setGroupId = function (id, iGroupId) {
        try {
            id = FCommon.UI.getValidElement(id);

            id.setAttribute("data-i_GroupId", iGroupId);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.setGroupId} " + err.message);
        }
    },

    this.getGroupId = function (id) {
        var iValue = 0;

        try {
            id = FCommon.UI.getValidElement(id);

            iValue = FConvert.toInt(id.getAttribute("data-i_GroupId"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getGroupId} " + err.message);
        }

        return (iValue);
    },

    this.getAccTypes = function (id) {
        var iValue = 0;

        try {
            id = FCommon.UI.getValidElement(id);

            iValue = FConvert.toString(id.getAttribute("data-acctypes"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getAccTypes} " + err.message);
        }

        return (iValue);
    },

    this.setCompanyId = function (id, iCompanyId) {
        try {
            id = FCommon.UI.getValidElement(id);

            id.setAttribute("data-i_companyid", iCompanyId);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.setCompanyId} " + err.message);
        }
    },

    this.getCompanyId = function (id) {
        var iValue = 0;

        try {
            id = FCommon.UI.getValidElement(id);

            iValue = FConvert.toInt(id.getAttribute("data-i_companyid"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getCompanyId} " + err.message);
        }

        return (iValue);
    },

    this.getControlType = function (id) {
        var iValue = 0;

        try {
            id = FCommon.UI.getValidElement(id);

            iValue = FConvert.toInt(id.getAttribute("data-controltype"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.getControlType} " + err.message);
        }

        return (iValue);
    },

    // {Public} Create and returns proper object based on passed data and meta data.
    this.convertRawDataIntoObject = function (id, objData) {
        var sProperty = "";
        var iCounter = 0;
        var iIndex = 0;
        var arrMetaData = null;
        var obj = null;
        var data = null;

        try {
            obj = {};

            arrMetaData = OPTIONCONTROL_INTERNAL.getMetaData(id);
            for (iCounter = 0; iCounter < arrMetaData.length && iCounter < objData.length; iCounter++) {
                sProperty = arrMetaData[iCounter].Name;
                if (FCommon.String.includes(sProperty, " ") == true) {
                    WriteConsoleLog("Error: {OPTIONCONTROL.convertRawDataIntoObject} [id=" + id.id + "][Property=" + sProperty + "] Property cannot have space.");
                }

                if (FCommon.UI.isValidObject(objData) == true) {
                    if (FCommon.UI.isValidObject(objData[iCounter].sValue) == true) {
                        obj[sProperty] = objData[iCounter].sValue;
                    }
                    else {
                        data = FCommon.Object.getValueInObjectArray(sProperty, objData);
                        obj[sProperty] = data.Value;
                    }
                }
                else {
                    obj[sProperty] = "";
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.convertRawDataIntoObject} " + err.message);
        }

        return (obj);
    },

    this.hideControl = function (id, bHide) {
        var ctrl = null;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return;
            }

            ctrl = document.getElementById(id.id + "_input_container");
            if (FCommon.UI.isValidObject(ctrl) == true) {
                ctrl.style.display = FConvert.toBoolean(bHide) == true ? "none" : "";
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.hideControl} " + err.message);
        }

        return (ctrl);
    },

    // {Public} Enable Disable Control
    this.disableControl = function (id, bDisable) {
        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return;
            }

            if (bDisable == true) {
                id.readOnly = true;
                id.parentElement.parentElement.style.backgroundColor = "#EBEBE4";
                id.style.backgroundColor = "#EBEBE4";
                id.parentNode.style.backgroundColor = "#EBEBE4";
            }
            else {
                id.readOnly = false;
                id.parentElement.parentElement.style.backgroundColor = "";
                id.style.backgroundColor = "";
                id.parentNode.style.backgroundColor = "";
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.disableControl} " + err.message);
        }
    },

    this.isNoDropdown = function (id) {
        var value = false;

        try {
            id = FCommon.UI.getValidElement(id);
            value = FConvert.toBoolean(FCommon.UI.getAttributeData(id, "nodropdown"));
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL.isNoDropdown} " + err.message;
            throw err;
        }

        return (value);
    },

    this.isDisabled = function (id) {
        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return (null);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.isDisabled} " + err.message);
        }

        return (id.readOnly);
    },

    this.isCustomizedPopupVisible = function (id) {
        return (OPTIONCONTROL_CUSTOMIZE.isPopupVisible(id));
    },

    this.focusText = function (id, value) {
        var sText = "";

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return;
            }

            sText = FCommon.UI.getAttributeData(id, "focustext");

            if (value == undefined) {
                sText = FCommon.UI.getAttributeData(id, "focustext");
            }
            else {
                FCommon.UI.setAttributeData(id, "focustext", value);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL.focusText} " + err.message);
        }

        return (sText);
    },

    this.getParent = function (ctrl) {
        var result = null;
        var element = null;

        try {
            result = COMMON.prototype.getEmptyResultObject();
            result.lValue = 0;
            result.sValue = "";

            if (FCommon.UI.isValidObject(ctrl) == false) {
                result.lValue = 0;
                result.sValue = "{OPTIONCONTROL::getParent} Option control id required.";

                return (result);
            }

            ctrl = FCommon.UI.getValidElement(ctrl);
            if (FCommon.UI.isValidObject(ctrl) == false) {
                result.lValue = 0;
                result.sValue = "{OPTIONCONTROL::getParent} Option control id cannot be blank.";

                return (result);
            }

            element = document.getElementById(ctrl.id + "_input_container");
            if (FCommon.UI.isValidObject(element) == false) {
                result.lValue = 0;
                result.sValue = "{OPTIONCONTROL::getParent} Invalid control(corrupted).";

                return (result);
            }

            result.data = element.parentElement;
            if (FCommon.UI.isValidObject(result.data) == false) {
                result.lValue = 0;
                result.sValue = "{OPTIONCONTROL::getParent} Parent not found.";

                return (result);
            }

            result.lValue = 1;
        }
        catch (err) {
            result.lValue = -1;
            result.sValue = "{OPTIONCONTROL::getParent} " + err.message;
            bResult = false;
        }

        return (result);
    },

    this.setParent = function (ctrl, newParent, bFocus) {
        var bResult = false;
        var child = null;

        try {
            ctrl = FCommon.UI.getValidElement(ctrl);
            if (FCommon.UI.isValidObject(ctrl) == false) {
                alert("Error: {OPTIONCONTROL::setParent} Option control id cannot be blank");
                return (false);
            }

            if (FCommon.UI.isValidObject(newParent) == false) {
                alert("Error: {OPTIONCONTROL::setParent} New parent object required");
                return (false);
            }

            newParent = FCommon.UI.getValidElement(newParent)
            if (FCommon.UI.isValidObject(newParent) == false) {
                alert("Error: {OPTIONCONTROL::setParent} New parent id cannot be blank");
                return (false);
            }

            child = document.getElementById(ctrl.id + "_input_container");
            if (FCommon.UI.isValidObject(child) == true) {
                newParent.appendChild(child);
            }

            bFocus = FConvert.toBoolean(bFocus);
            if (ctrl.getBoundingClientRect().left != 0 && bFocus == true) {
                ctrl.focus();
            }

            bResult = true;
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL::setParent} " + newParent.id + ", " + err.message);
            bResult = false;
        }

        return (bResult);
    };

}();

var OPTIONCONTROL_COMBO = {
    setControlValue: function (id, value, bIgnoreChangeCallback) {
        var row = null;

        try {
            id = FCommon.UI.getValidElement(id);
            OPTIONCONTROL_COMBO.loadAndSelectDropdownText(id, value);
            row = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
            if (FCommon.UI.isValidObject(row) == true) {
                OPTIONCONTROL_INTERNAL.setSelectedValue(id);
            }
        }
        catch (err) {
            console.log("Exception: {OPTIONCONTROL_COMBO.setControlValue} " + err.message);
        }
    },

    setControlText: function (id, value, bIgnoreChangeCallback) {
        var row = null;

        try {
            id = FCommon.UI.getValidElement(id);
            OPTIONCONTROL_COMBO.loadAndSelectDropdownText(id, value);
            row = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
            if (FCommon.UI.isValidObject(row) == true) {
                OPTIONCONTROL_INTERNAL.setSelectedValue(id);
            }
        }
        catch (err) {
            console.log("Exception: {OPTIONCONTROL_COMBO.setControlText} " + err.message);
        }
    },

    resetControl: function (id, value) {
        try {

        }
        catch (err) {
            console.log("Exception: {OPTIONCONTROL_COMBO.resetControl} " + err.message);
        }
    },

    clear: function (id, bDoNotClearInput) {
        try {
            id = FCommon.UI.getValidElement(id);

            OPTIONCONTROL_INTERNAL.resetDataElement(id, true);

            if (FCommon.UI.isValidObject(bDoNotClearInput) == false || bDoNotClearInput == false) {
                id.value = "";
            }

        }
        catch (err) {
            console.log("Exception: {OPTIONCONTROL_COMBO.clear} " + err.message);
        }
    },

    storeDataArrayInMemory: function (id, arrIdNamePair, bUpdate) {
        var iCounter = 0;
        var iIndex = 0;
        var bHasId = false;
        var arrData = null;
        var obj = null;

        try {
            id = FCommon.UI.getValidElement(id);
            bUpdate = FConvert.toBoolean(bUpdate);

            if (bUpdate == false) {
                OPTIONCONTROL_INTERNAL.setMemoryData(id, []);

                OPTIONCONTROL_INTERNAL.setCompareValueIndex(id, 1);
                OPTIONCONTROL_INTERNAL.setStoreValueIndex(id, 1);
            }


            if (FCommon.Array.getLength(arrIdNamePair) == 0) {
                if (bUpdate == false) {
                    OPTIONCONTROL_COMBO.clear(id);
                }

                return;
            }

            for (iCounter = 0; iCounter < arrIdNamePair.length; iCounter++) {
                if (arrIdNamePair[iCounter].ID > 0) {
                    bHasId = true;
                    break;
                }
            }

            arrData = [];
            for (iCounter = 0; iCounter < arrIdNamePair.length; iCounter++) {
                arrData.push([]);
                iIndex = arrData.length - 1;

                if (bHasId == true) {
                    obj = {};
                    obj.sValue = arrIdNamePair[iCounter].ID;
                    obj.bHasData = true;
                    arrData[iIndex].push(obj);

                    obj = {};
                    obj.sValue = arrIdNamePair[iCounter].Name;
                    obj.bHasData = true;
                    arrData[iIndex].push(obj);

                }
                else {
                    obj = {};
                    obj.sValue = arrIdNamePair[iCounter].Name;
                    obj.bHasData = true;
                    arrData[iIndex].push(obj);

                    obj = {};
                    obj.sValue = arrIdNamePair[iCounter].Name;
                    obj.bHasData = true;
                    arrData[iIndex].push(obj);
                }
            }

            if (bHasId == true) {
                OPTIONCONTROL_INTERNAL.setStoreValueIndex(id, 0);
            }

            OPTIONCONTROL_INTERNAL.setMemoryData(id, arrData);

            OPTIONCONTROL_INTERNAL.createHeading(id, OPTIONCONTROL_COMBO.PRIVATE.getMetaData(id));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_COMBO.storeDataArrayInMemory} " + err.message);
        }
    },

    onFocus: function (id, evt) {
        var sCallback = "";

        try {
            sCallback = OPTIONCONTROL.getOnFocusCallback(id);
            if (FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                eval(sCallback)(id, evt);
            }
        }
        catch (err) {
            console.log("Exception: {OPTIONCONTROL_COMBO.onFocus} " + err.message);
        }
    },

    onLeave: function (id, evt) {
        var sCallback = "";

        try {
            OPTIONCONTROL_COMBO.processTabKey(id, evt);
            OPTIONCONTROL_INTERNAL.hidePopup(id);

            sCallback = OPTIONCONTROL.getOnLeaveCallback(id);
            if (FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                eval(sCallback)(id, evt);
            }
        }
        catch (err) {
            console.log("Exception: {OPTIONCONTROL_COMBO.onLeave} " + err.message);
        }
    },

    processInput: function (id, sText) {
        var arrIndex = null;

        try {
            if (OPTIONCONTROL.isNoDropdown(id) == true) {
                return;
            }

            id = FCommon.UI.getValidElement(id);
            OPTIONCONTROL_INTERNAL.createHeading(id, OPTIONCONTROL_COMBO.PRIVATE.getMetaData(id));

            if (sText == " ") {
                id.value = "";
                //OPTIONCONTROL_INTERNAL.createHeading(id, OPTIONCONTROL_COMBO.PRIVATE.getMetaData(id));
                //OPTIONCONTROL_COMBO.showPopup(id);
                //return;
            }

            OPTIONCONTROL_COMBO.loadAndSelectDropdownText(id, sText);

            if (OPTIONCONTROL_INTERNAL.isPopupVisible(id) == false) {
                if (OPTIONCONTROL_INTERNAL.getMetaData(id).length > 0) {
                    OPTIONCONTROL_INTERNAL.showPopup(id);
                }
            }

        }
        catch (err) {
            console.log("Exception: {OPTIONCONTROL_COMBO.processInput} " + err.message);
        }
    },

    loadAndSelectDropdownText: function (id, sText) {
        var arrIndex = null;
        var arrMetaData = null;

        try {
            arrIndex = OPTIONCONTROL_INTERNAL.getKeyDataIndexArray(id, sText, 0);
            if ((arrIndex == null || arrIndex.length <= 0)) {
                OPTIONCONTROL_INTERNAL.resetDataElement(id, false);
            }
            else {
                OPTIONCONTROL_INTERNAL.setDataLoadingFlag(id, false);
                OPTIONCONTROL_INTERNAL.setBufferedInputText(id, "");

                arrMetaData = OPTIONCONTROL_INTERNAL.getMetaData(id);
                OPTIONCONTROL_INTERNAL.fillDataFromIndex(id, arrMetaData, arrIndex);
                OPTIONCONTROL_INTERNAL.selectFirstRow(id);
            }
        }
        catch (err) {
            console.log("Exception: {OPTIONCONTROL_COMBO.loadAndSelectDropdownText} " + err.message);
        }

        return (arrIndex);
    },

    keydown: function (id, evt) {
        var sInputText = "";
        var sCallback = "";
        var bResult = false;
        var objCtrl = null;

        try {
            sCallback = OPTIONCONTROL.getOnKeyDownCallback(id);
            if (FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                bResult = FConvert.toBoolean(eval(sCallback)(id, evt));
                if (bResult == true) {
                    return;
                }
            }

            switch (evt.keyCode) {
                case eKeyCode.Tab:
                    OPTIONCONTROL_COMBO.processTabKey(id, evt);
                    break;
                case eKeyCode.CR:
                    break;
                case eKeyCode.Esc: // Esc key
                    FCommon.UI.stopKeyProcess(evt);
                    OPTIONCONTROL_INTERNAL.unselectRow(OPTIONCONTROL_INTERNAL.getSelectedRow(id));
                    return;
                case eKeyCode.End: // End key
                    if (evt.shiftKey == true) {
                    }
                    else if (evt.ctrlKey == true) {
                    }
                    else {
                        FCommon.UI.stopKeyProcess(evt);
                        OPTIONCONTROL_INTERNAL.selectLastRow(id);
                    }
                    break;
                case eKeyCode.Home: // Home key
                    if (evt.shiftKey == true) {
                    }
                    else if (evt.ctrlKey == true) {
                    }
                    else {
                        FCommon.UI.stopKeyProcess(evt);
                        OPTIONCONTROL_INTERNAL.selectFirstRow(id);
                    }
                    break;
                case eKeyCode.Up: // up arrow
                    OPTIONCONTROL_INTERNAL.processUpKey(id, evt);
                    break;
                case eKeyCode.Down: // down arrow
                    OPTIONCONTROL_INTERNAL.processDownKey(id, evt, "");
                    break;
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_COMBO.keydown} " + err.message);
        }
    },

    processTabKey: function (id, evt) {
        var sInputText = "";
        var sCallback = "";
        var bNoDropDown = false;
        var objCtrl = null;
        var arrData = null;

        try {
            sInputText = id.value;

            bNoDropDown = OPTIONCONTROL.isNoDropdown(id);

            if (bNoDropDown == true) {
                arrData = OPTIONCONTROL_COMBO.getCustomData(id, sInputText);
                OPTIONCONTROL_INTERNAL.setControlData(id, arrData);
            }
            else {
                objCtrl = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
                OPTIONCONTROL_INTERNAL.setSelectedValue(id);
            }

            //objCtrl = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
            //OPTIONCONTROL_INTERNAL.setSelectedValue(id);

            if (FCommon.String.isNullOrEmpty(id.value) == true && FCommon.String.isNullOrEmpty(sInputText) == false) {
                if (OPTIONCONTROL_INTERNAL.isPopupVisible(id) == true) {
                    OPTIONCONTROL_INTERNAL.hidePopup(id);
                }

                sCallback = OPTIONCONTROL.getDataNotFoundCallback(id);
                if (FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                    bResult = eval(sCallback)(id, { InputText: sInputText, Event: evt });
                    if (bResult == true) {
                        return;
                    }
                }
            }

            if (navigator.userAgent.indexOf("Firefox") != -1) {
                if (OPTIONCONTROL_INTERNAL.isPopupVisible(id) == true) {
                    FCommon.UI.stopKeyProcess(evt);
                    OPTIONCONTROL_INTERNAL.hidePopup(id);
                }
            }

        }
        catch (err) {
            console.log("Exception: {OPTIONCONTROL_COMBO.processTabKey} " + err.message);
        }
    },

    getCustomData: function (id, sText) {
        var iCounter = 0;
        var arrMetaData = null;
        var arrData = null;

        try {
            arrData = [];

            arrMetaData = OPTIONCONTROL_INTERNAL.getMetaData(id);
            for (iCounter = 0; iCounter < arrMetaData.length; iCounter++) {
                arrData.push({ sValue: sText });
            }
        }
        catch (err) {
            console.log("Exception: {OPTIONCONTROL_COMBO.getCustomData} " + err.message);
        }

        return (arrData);
    },

    showPopup: function (id) {
        var sCallback = "";
        var ctrlPopup = null;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                alert("Error: {OPTIONCONTROL_COMBO.showPopup} Invalid control id.");

                return (false);
            }

            if (FCommon.String.isNullOrEmpty(id.id) == true) {
                alert("Error: {OPTIONCONTROL_COMBO.showPopup} Control id cannot be blank.");

                return (false);
            }

            ctrlPopup = OPTIONCONTROL_INTERNAL.getDataContainerElement(id);
            if (ctrlPopup == null) {
                alert("Error: {OPTIONCONTROL_COMBO.showPopup} Data container not found.");

                return (false);
            }

            OPTIONCONTROL_COMBO.processInput(id, id.value);

            //OPTIONCONTROL_INTERNAL.createHeading(id, OPTIONCONTROL_COMBO.PRIVATE.getMetaData(id));
            //var arrIndex = OPTIONCONTROL_INTERNAL.getKeyDataIndexArray(id, id.value, 0);
            //if ((arrIndex == null || arrIndex.length <= 0)) {
            //    OPTIONCONTROL_INTERNAL.resetDataElement(id, false);
            //}
            //else {
            //    OPTIONCONTROL_INTERNAL.setDataLoadingFlag(id, false);
            //    OPTIONCONTROL_INTERNAL.setBufferedInputText(id, "");

            //    OPTIONCONTROL_INTERNAL.fillDataFromIndex(id, OPTIONCONTROL_INTERNAL.getMetaData(id), arrIndex);
            //    OPTIONCONTROL_INTERNAL.selectFirstRow(id);
            //}

            ctrlPopup.style.display = '';

            FCommon.UI.setFocusDropdownPopupPosition(id, ctrlPopup);
            FCommon.UI.selectTextInInput(id, id.value.length, id.value.length);

            return (true);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_COMBO.showPopup} " + err.message);
        }

        return (false);
    },

    getHeadingText: function (id) {
        var value = "";

        try {
            id = FCommon.UI.getValidElement(id);

            value = FConvert.toString(id.getAttribute("data-comboheading"));
        }
        catch (err) {
            console.log("Exception: {OPTIONCONTROL_COMBO.getHeadingText} " + err.message);
        }

        return (value);

    },

    isWorkAsComboBox: function (id) {
        var bValue = false;

        try {
            id = FCommon.UI.getValidElement(id);

            bValue = FConvert.toBoolean(id.getAttribute("data-workascombobox"));
        }
        catch (err) {
            console.log("Exception: {OPTIONCONTROL_COMBO.isWorkAsComboBox} " + err.message);
        }

        return (bValue);
    },

    PRIVATE: {
        getMetaData: function (id) {
            var sAlign = "";
            var sHeading = "";
            var arrMetaData = null;
            var iLanguageId = 0;

            try {
                sHeading = OPTIONCONTROL_COMBO.getHeadingText(id);

                if (FCommon.UI.isValidObject(window.GLOBAL) == true) {
                    iLanguageId = window.GLOBAL.getLanguageId();
                }

                if (iLanguageId != 0) {
                    sAlign = "right";
                }
                else {
                    sAlign = "left";
                }

                arrMetaData = [];
                arrMetaData.push({ Index: 0, Width: 0, Name: "Id", Hidden: true, Align: sAlign });
                arrMetaData.push({ Index: 0, Width: 250, Name: sHeading, Hidden: false, Align: sAlign });
            }
            catch (err) {
                console.log("Exception: {OPTIONCONTROL_COMBO.PRIVATE.getMetaData} " + err.message);
            }

            return (arrMetaData);
        }
    }
};

var OPTIONCONTROL_INTERNAL = {
    // Prepare structure for getting data row data from server
    getDataFromServer: function (obj) {
        WriteConsoleLog("Enter: {OPTIONCONTROL_INTERNAL::getDataFromServer} [ControlId='" + obj.id.id + "'][Text='" + FConvert.toString(obj.id.value) + "']");

        var element = null;
        var value = null;
        var parameter = "";
        var sExistingFilter = "";

        try {
            element = document.getElementById(obj.id.id);

            value = OPTIONCONTROL.getMasterTypeId(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("iMasterTypeId", value, parameter);

            value = OPTIONCONTROL.getGroupType(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("iGroupType", value, parameter);

            sExistingFilter = OPTIONCONTROL.getFilter(obj.id);
            if (FCommon.String.isNullOrEmpty(obj.sFilter, true) == false) {
                if (FCommon.String.isNullOrEmpty(sExistingFilter) == false) {
                    if (OPTIONCONTROL.getControlType(element) == eWebOptionControlType.Masters) {
                        obj.sFilter = "(" + sExistingFilter + ") AND " + obj.sFilter;
                    }
                    else {
                        obj.sFilter = sExistingFilter + " AND " + obj.sFilter;
                    }
                }

                parameter = NETWORK.createParameterForHTTPPostRequest("sFilter", obj.sFilter, parameter);
            }
            else {
                value = sExistingFilter;
                parameter = NETWORK.createParameterForHTTPPostRequest("sFilter", value, parameter);
            }

            value = OPTIONCONTROL.getExtraFilter(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("sExtraFilter", value, parameter);

            parameter = NETWORK.createParameterForHTTPPostRequest("sSearchKey", obj.sSearch, parameter);
            parameter = NETWORK.createParameterForHTTPPostRequest("iExistingDataCount", obj.iExistingDataCount, parameter);

            value = OPTIONCONTROL.getTableName(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("sTableName", value, parameter);

            value = OPTIONCONTROL.getPrimaryField(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("sPrimaryField", value, parameter);

            value = OPTIONCONTROL.getDisplayField(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("sDisplayField", value, parameter);

            value = OPTIONCONTROL.getMandatoryFields(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("sMandatoryFields", value, parameter);

            value = FConvert.toInt(FCommon.UI.getAttributeData(element, "i_UnitId"));
            if (value > 0) {
                parameter = NETWORK.createParameterForHTTPPostRequest("iUnitId", value, parameter);
            }

            value = FConvert.toInt(FCommon.UI.getAttributeData(element, "i_ItemId"));
            if (value > 0) {
                parameter = NETWORK.createParameterForHTTPPostRequest("iItemId", value, parameter);
            }

            value = OPTIONCONTROL.getGroupId(element);
            if (value > 0) {
                parameter = NETWORK.createParameterForHTTPPostRequest("iGroupId", value, parameter);
            }

            parameter = NETWORK.createParameterForHTTPPostRequest("lAccTypes", OPTIONCONTROL.getAccTypes(element), parameter);
            parameter = NETWORK.createParameterForHTTPPostRequest("bLoadAll", FConvert.toBoolean(obj.bLoadAll), parameter);

            value = OPTIONCONTROL.getUserRestriction(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("bUseRestriction", FConvert.toBoolean(value), parameter);

            value = OPTIONCONTROL_INTERNAL.getSearchBy(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("iSearchBy", value, parameter);
            obj.iSearchBy = value;

            parameter = NETWORK.createParameterForHTTPPostRequest("iParam", OPTIONCONTROL.getParam(element), parameter);

            value = OPTIONCONTROL.getControlType(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("ControlType", value, parameter);

            parameter = NETWORK.createParameterForHTTPPostRequest("bShowAllCols", obj.bShowAllCols, parameter);

            parameter = NETWORK.createParameterForHTTPPostRequest("iSelectedId", obj.iSelectedId, parameter);

            value = OPTIONCONTROL.getCompanyId(element);
            if (value > 0) {
                parameter = NETWORK.createParameterForHTTPPostRequest("iCompanyId", value, parameter);
            }

            //if (FCommon.UI.isValidObject(document.activeElement) == true
            //    && FCommon.UI.isSameElement(document.activeElement, obj.id) == true
            //    && FCommon.String.isNullOrEmpty(obj.sSearch, true) == false
            //    //&& obj.sSearch.length > 1
            //    ) {
            //    obj.bAsync = true;
            //}

            if (FCommon.UI.isValidObject(obj.bAsync) == true) {
                obj.bAsync = obj.bAsync;
            }
            else {
                if (FCommon.UI.isValidObject(document.activeElement) == true
                    && FCommon.UI.isSameElement(document.activeElement, obj.id) == true
                    && FCommon.String.isNullOrEmpty(obj.sSearch, true) == false
                    //&& obj.sSearch.length > 1
                    ) {
                    obj.bAsync = true;
                }
            }

            //if (obj.bFromKeyboard == true) {
            //    obj.id.readOnly = true;
            //}

            OPTIONCONTROL_INTERNAL.setDataLoadingFlag(obj.id, true);
            OPTIONCONTROL_INTERNAL.setBufferedInputText(obj.id, "");
            OPTIONCONTROL_INTERNAL.fetchDataFromServer(obj, parameter);
        }
        catch (err) {
            WriteConsoleLog("Exception: {OPTIONCONTROL_INTERNAL::getDataFromServer} " + err.message);

            err.message = "Exception: {OPTIONCONTROL_INTERNAL::getDataFromServer} " + err.message;
            throw err;
        }
    },

    serverResponse: function (objResponse, bHideLog) {
        if (FConvert.toBoolean(bHideLog) == false) {
            WriteConsoleLog("Enter: {OPTIONCONTROL_INTERNAL::serverResponse} [ControlId='" + objResponse.id.id + "'][Text='" + FConvert.toString(objResponse.sKey) + "']");
        }

        var sNewInput = "";
        var sCallback = "";
        var sFieldName = "";
        var sError = "";

        var arrIndex = null;
        var row = null;
        var bRowSelected = false;
        var obj = {};

        try {
            OPTIONCONTROL_INTERNAL.displayLoading(objResponse.id, false);
            OPTIONCONTROL_INTERNAL.setDataLoadingFlag(objResponse.id, false);

            sCallback = OPTIONCONTROL.getOnDataLoadedCallback(objResponse.id);

            obj = OPTIONCONTROL_INTERNAL.getCallbackDataObject(objResponse.id, objResponse.tag, false);
            obj.OldData = OPTIONCONTROL_INTERNAL.getSelectedRowValue(objResponse.id);

            if (FCommon.String.isNullOrEmpty(objResponse.data.Error) == false) {
                sFieldName = OPTIONCONTROL_INTERNAL.getFieldName(objResponse.id);
                sError = "{OPTIONCONTROL_INTERNAL.serverResponse} [id=" + objResponse.id.id + "]";
                if (FCommon.String.isNullOrEmpty(sFieldName, true) == false) {
                    sError += "[Name='" + sFieldName + "']";
                }

                COMMON.prototype.showMessage(sError + " " + objResponse.data.Error, document.getElementById("id_resource_message_error").value);
                return;
            }

            if (OPTIONCONTROL_INTERNAL.getFirstField(objResponse.id) == -1) {
                OPTIONCONTROL_INTERNAL.setSearchBy(objResponse.id, objResponse.data.FirstField);
                OPTIONCONTROL_INTERNAL.setFirstField(objResponse.id, objResponse.data.FirstField);
            }
            // debugger
            if (objResponse.data.FirstField >= 0) {
                if (objResponse.iSearchBy == -1) {
                    OPTIONCONTROL_INTERNAL.setSearchBy(objResponse.id, objResponse.data.FirstField);
                }
                else {
                    OPTIONCONTROL_INTERNAL.setSearchBy(objResponse.id, objResponse.iSearchBy);
                }

                OPTIONCONTROL_INTERNAL.setFirstField(objResponse.id, objResponse.data.FirstField);
            }

            if (objResponse.data.OriginalFirstField >= 0) {
                OPTIONCONTROL_INTERNAL.setOriginalFirstField(objResponse.id, objResponse.data.OriginalFirstField);
            }

            OPTIONCONTROL_INTERNAL.setCompareValueIndex(objResponse.id, objResponse.data.CompareValueIndex);
            OPTIONCONTROL_INTERNAL.setStoreValueIndex(objResponse.id, objResponse.data.StoreValueIndex);

            if (OPTIONCONTROL_INTERNAL.getMetaData(objResponse.id).length == 0) {
                OPTIONCONTROL_INTERNAL.createHeading(objResponse.id, objResponse.data.ColumnMetaData);
            }

            if (objResponse.bAsync == true && OPTIONCONTROL_INTERNAL.isPopupVisible(objResponse.id) == false && FConvert.toBoolean(objResponse.bDoNotShowPopup) == false) {
                if (OPTIONCONTROL_INTERNAL.getMetaData(objResponse.id).length > 0) {
                    OPTIONCONTROL_INTERNAL.showPopup(objResponse.id);
                }
            }


            OPTIONCONTROL_INTERNAL.storeDataArrayInMemory(objResponse.id, objResponse.data.ColumnValue);

            sNewInput = OPTIONCONTROL_INTERNAL.getBufferedInputText(objResponse.id);
            if (FCommon.String.isNullOrEmpty(sNewInput) == false && objResponse.sKey != sNewInput) {
                OPTIONCONTROL_INTERNAL.processInputs(objResponse.id,
                                            sNewInput,
                                            objResponse.sURL,
                                            null,
                                            true);
                return;

            }

            if (FCommon.String.isNullOrEmpty(objResponse.sKey) == false) // If any key typed or spacebar is pressed
            {
                arrIndex = OPTIONCONTROL_INTERNAL.getKeyDataIndexArray(objResponse.id, objResponse.sKey, 0);
                if (FCommon.String.isNullOrEmpty(objResponse.sKey.trim()) == true) {
                    FCommon.UI.getValidElement(objResponse.id).value = "";
                }

                OPTIONCONTROL_INTERNAL.fillDataFromIndex(objResponse.id, OPTIONCONTROL_INTERNAL.getMetaData(objResponse.id), arrIndex);
                if (FCommon.String.startsWith(objResponse.sKey, "#") == true) {
                    return;
                }

                bRowSelected = false;
                if (FCommon.UI.isValidObject(objResponse.objSelectedData) == true) {
                    row = OPTIONCONTROL_INTERNAL.getRowFromObject(objResponse.id, objResponse.objSelectedData);
                    if (FCommon.UI.isValidObject(row) == true) {
                        OPTIONCONTROL_INTERNAL.selectRow(row, objResponse.id);
                        bRowSelected = true;
                    }
                }
                else {
                    OPTIONCONTROL_INTERNAL.selectFirstRow(objResponse.id);
                    bRowSelected = true;
                }

                if (bRowSelected == true && FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                    obj.Data = OPTIONCONTROL_INTERNAL.getSelectedRowValue(objResponse.id);
                    obj.Flag.bLeave = false;
                    obj.Flag.bDataLoad = true;
                    obj.Flag.bDataChange = false;
                    eval(sCallback)(objResponse.id, obj.Data, obj);
                }
            }
            else if (FCommon.UI.isValidObject(objResponse.objSelectedData) == true) {
                if (OPTIONCONTROL_INTERNAL.selectValueInControl(objResponse.id, objResponse.objSelectedData, objResponse.tag, objResponse.bIgnoreChangeCallback) == true) { // Called indirectly from setControlValue
                    //if (FCommon.String.isNullOrEmpty(sCallback) == false)
                    //{
                    //    obj.Data = OPTIONCONTROL.getControlData(objResponse.id);
                    //    obj.Flag.bLeave = false;
                    //    obj.Flag.bDataLoad = true;
                    //    obj.Flag.bDataChange = false;
                    //    eval(sCallback)(objResponse.id, obj.Data, obj);
                    //}
                }
                else {
                    if (FCommon.String.isNullOrEmpty(sCallback) == false) {
                        obj.Data = null;
                        obj.Flag.bLeave = false;
                        obj.Flag.bDataLoad = true;
                        obj.Flag.bDataChange = false;
                        eval(sCallback)(objResponse.id, null, obj);
                    }
                }
            }
            else {
                arrIndex = OPTIONCONTROL_INTERNAL.getKeyDataIndexArray(objResponse.id, " ", 0);
                OPTIONCONTROL_INTERNAL.fillDataFromIndex(objResponse.id, OPTIONCONTROL_INTERNAL.getMetaData(objResponse.id), arrIndex);
                OPTIONCONTROL_INTERNAL.selectFirstRow(objResponse.id);

                if (FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                    obj.bDataArray = true;
                    obj.Data = objResponse.data.ColumnValue;
                    obj.Flag.bLeave = false;
                    obj.Flag.bDataLoad = true;
                    obj.Flag.bDataChange = false;
                    eval(sCallback)(objResponse.id, obj.Data, obj);
                }
            }

            if (objResponse.bFromKeyboard == true && OPTIONCONTROL_INTERNAL.isPopupVisible(objResponse.id) == false) {
                if (OPTIONCONTROL_INTERNAL.getMetaData(objResponse.id).length > 0) {
                    OPTIONCONTROL_INTERNAL.showPopup(objResponse.id);
                }
            }
        }
        catch (err) {
            if (FConvert.toBoolean(bHideLog) == false) {
                WriteConsoleLog("Exception: {OPTIONCONTROL_INTERNAL::serverResponse} " + err.message);
            }

            if (FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                obj.Data = null;
                obj.Flag.bLeave = false;
                obj.Flag.bDataLoad = false;
                obj.Flag.bDataChange = false;
                eval(sCallback)(objResponse.id, null, obj);
            }

            COMMON.prototype.showMessage("{OPTIONCONTROL_INTERNAL.serverResponse} " + err.message, document.getElementById("id_resource_message_error").value);

            //err.message = "Exception: {serverResponse} " + err.message;
            //throw err;
        }
    },

    // Prepare structure for getting remaining data of particular row from server
    loadPartialData: function (obj) {
        WriteConsoleLog("Enter: {OPTIONCONTROL_INTERNAL::loadPartialData} [ControlId='" + obj.id.id + "']");

        var element = null;
        var value = null;
        var parameter = "";
        var sExistingFilter = "";

        try {
            element = document.getElementById(obj.id.id);

            value = OPTIONCONTROL.getMasterTypeId(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("iMasterTypeId", value, parameter);

            value = OPTIONCONTROL.getGroupType(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("iGroupType", value, parameter);

            sExistingFilter = OPTIONCONTROL.getFilter(obj.id);
            if (FCommon.String.isNullOrEmpty(obj.sFilter, true) == false) {
                if (FCommon.String.isNullOrEmpty(sExistingFilter) == false) {
                    if (OPTIONCONTROL.getControlType(element) == eWebOptionControlType.Masters) {
                        obj.sFilter = "(" + sExistingFilter + ") AND " + obj.sFilter;
                    }
                    else {
                        obj.sFilter = sExistingFilter + " AND " + obj.sFilter;
                    }
                }

                parameter = NETWORK.createParameterForHTTPPostRequest("sFilter", obj.sFilter, parameter);
            }
            else {
                value = sExistingFilter;
                parameter = NETWORK.createParameterForHTTPPostRequest("sFilter", value, parameter);
            }

            parameter = NETWORK.createParameterForHTTPPostRequest("sSearchKey", obj.sSearch, parameter);
            parameter = NETWORK.createParameterForHTTPPostRequest("iExistingDataCount", obj.iExistingDataCount, parameter);

            value = OPTIONCONTROL.getTableName(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("sTableName", value, parameter);

            value = OPTIONCONTROL.getPrimaryField(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("sPrimaryField", value, parameter);

            value = OPTIONCONTROL.getDisplayField(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("sDisplayField", value, parameter);

            value = OPTIONCONTROL.getMandatoryFields(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("sMandatoryFields", value, parameter);

            value = FConvert.toInt(FCommon.UI.getAttributeData(element, "i_UnitId"));
            if (value > 0) {
                parameter = NETWORK.createParameterForHTTPPostRequest("iUnitId", value, parameter);
            }

            value = FConvert.toInt(FCommon.UI.getAttributeData(element, "i_ItemId"));
            if (value > 0) {
                parameter = NETWORK.createParameterForHTTPPostRequest("iItemId", value, parameter);
            }

            value = OPTIONCONTROL.getGroupId(element);
            if (value > 0) {
                parameter = NETWORK.createParameterForHTTPPostRequest("iGroupId", value, parameter);
            }

            parameter = NETWORK.createParameterForHTTPPostRequest("bLoadAll", false, parameter);

            value = OPTIONCONTROL.getUserRestriction(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("bUseRestriction", FConvert.toBoolean(value), parameter);

            value = OPTIONCONTROL_INTERNAL.getSearchBy(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("iSearchBy", value, parameter);

            parameter = NETWORK.createParameterForHTTPPostRequest("iParam", OPTIONCONTROL.getParam(element), parameter);

            value = OPTIONCONTROL.getControlType(element);
            parameter = NETWORK.createParameterForHTTPPostRequest("ControlType", value, parameter);

            parameter = NETWORK.createParameterForHTTPPostRequest("bShowAllCols", true, parameter);

            OPTIONCONTROL_INTERNAL.fetchDataFromServer(obj, parameter);
        }
        catch (err) {
            WriteConsoleLog("Exception: {OPTIONCONTROL_INTERNAL::loadPartialData} " + err.message);

            err.message = "Exception: {OPTIONCONTROL_INTERNAL::loadPartialData} " + err.message;
            throw err;
        }
    },

    fetchDataFromServer: function (obj, parameter) {
        WriteConsoleLog("Enter: {OPTIONCONTROL_INTERNAL::fetchDataFromServer} [URL='" + obj.sURL + "'][ControlId='" + obj.id.id + "'][Async='" + obj.bAsync + "'][Text='" + FConvert.toString(obj.sSearch) + "'][Filter='" + FConvert.toString(obj.sFilter) + "']");

        try {
            OPTIONCONTROL_INTERNAL.displayLoading(obj.id, true);

            $.ajax({
                url: obj.sURL,
                data: parameter,
                type: 'GET',
                traditional: true,
                async: obj.bAsync,
                success: function (data, textStatus, jqXHR) {
                    var objResponse = {};

                    try {
                        WriteConsoleLog("Success: {OPTIONCONTROL_INTERNAL::fetchDataFromServer} [ControlId='" + obj.id.id + "'][textStatus='" + textStatus + "']");

                        var value = jqXHR.getResponseHeader("SESSION_EXPIRE");
                        if (FCommon.UI.isValidObject(value) == true && value == 1) {
                            if (FCommon.UI.isValidObject(window.GLOBAL) == true) {
                                window.GLOBAL.pageRefresh();
                            }

                            return;
                        }

                        value = jqXHR.getResponseHeader("FOCUS_MESSAGE");
                        if (FConvert.toInt(value) > 0) {
                            if ((typeof data).toLowerCase() == "object") {
                                COMMON.prototype.showMessage(data.sValue, data.lValue < 0 ? document.getElementById("id_resource_message_exception").value : document.getElementById("id_resource_message_error").value);
                            }
                            else {
                                data = FConvert.stringToObject(data);
                                if (data.lValue > 0) {
                                    data = data.data;
                                    COMMON.prototype.showMessage(data.sValue, data.lValue < 0 ? document.getElementById("id_resource_message_exception").value : document.getElementById("id_resource_message_error").value);
                                }
                            }

                            return;
                        }

                        objResponse.id = obj.id;
                        objResponse.data = data;
                        objResponse.sKey = obj.sSearch;
                        objResponse.bAsync = obj.bAsync;
                        objResponse.objSelectedData = obj.SelectedData;
                        objResponse.bIgnoreChangeCallback = obj.bIgnoreChangeCallback;
                        objResponse.bFromKeyboard = obj.bFromKeyboard;
                        objResponse.sURL = obj.sURL;
                        objResponse.iSearchBy = obj.iSearchBy;
                        objResponse.bDoNotShowPopup = obj.bDoNotShowPopup;

                        if (FCommon.UI.isValidObject(obj.tag) == true) {
                            objResponse.tag = obj.tag;
                        }

                        if (FCommon.String.isNullOrEmpty(obj.sfnResponse) == true) {
                            OPTIONCONTROL_INTERNAL.serverResponse(objResponse, false);
                        }
                        else {
                            eval(obj.sfnResponse)(objResponse);
                        }
                    }
                    catch (err) {
                        WriteConsoleLog("Exception: {OPTIONCONTROL_INTERNAL::fetchDataFromServer:success} [ControlId='" + obj.id.id + "'][Message='" + err.message + "']");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    try {
                        WriteConsoleLog("Error: {OPTIONCONTROL_INTERNAL::fetchDataFromServer} [ControlId='" + obj.id.id + "'][textStatus='" + textStatus + "'][errorThrown='" + errorThrown + "']");
                        OPTIONCONTROL_INTERNAL.displayLoading(obj.id, false);
                        OPTIONCONTROL_INTERNAL.setDataLoadingFlag(obj.id, false);
                    }
                    catch (err) {
                        WriteConsoleLog("Exception: {OPTIONCONTROL_INTERNAL::fetchDataFromServer:error} [ControlId='" + obj.id.id + "'][Message='" + err.message + "']");
                    }
                }
            });
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.fetchDataFromServer} " + err.message);
        }
    },

    loadPartialDataResponse: function (objResponse) {
        WriteConsoleLog("Enter: {OPTIONCONTROL_INTERNAL::loadPartialDataResponse} [ControlId='" + objResponse.id.id + "']");

        var iCounter = 0;
        var data = null;
        var eleRow = null;
        var arrData = null;
        var arrMetaData = [];

        try {
            OPTIONCONTROL_INTERNAL.displayLoading(objResponse.id, false);

            if (FCommon.String.isNullOrEmpty(objResponse.data.Error) == false) {
                COMMON.prototype.showMessage("{OPTIONCONTROL_INTERNAL.loadPartialDataResponse} [id=" + objResponse.id.id + "] " + objResponse.data.Error, document.getElementById("id_resource_message_error").value);
                return;
            }

            if (FCommon.UI.isValidObject(objResponse.data) == true && FCommon.Array.getLength(objResponse.data.ColumnValue) == 1) {
                data = objResponse.data.ColumnValue[0];

                arrData = OPTIONCONTROL_INTERNAL.getMemoryData(objResponse.id);
                if (arrData.length <= objResponse.tag.obj.iMemoryIndex) {
                    return;
                }

                if (arrData[objResponse.tag.obj.iMemoryIndex][0].sValue != data[0].sValue) {
                    return;
                }

                arrData[objResponse.tag.obj.iMemoryIndex] = data;
                OPTIONCONTROL_INTERNAL.setMemoryData(objResponse.id, arrData);

                eleRow = objResponse.tag.row;
                for (iCounter = 0; iCounter < eleRow.children.length && iCounter < data.length; iCounter++) {
                    FCommon.UI.setText(eleRow.children[iCounter], data[iCounter + 1].sValue);
                }

                arrMetaData = OPTIONCONTROL_INTERNAL.getMetaData(objResponse.id);
                for (iCounter = 0; iCounter < data.length; iCounter++) {
                    if (iCounter >= arrMetaData.length) {
                        continue;
                    }

                    FCommon.UI.setAttributeData(eleRow, arrMetaData[iCounter].Name, data[iCounter].sValue);
                }
            }
        }
        catch (err) {
            WriteConsoleLog("Exception: {OPTIONCONTROL_INTERNAL::loadPartialDataResponse} " + err.message);
            COMMON.prototype.showMessage("{OPTIONCONTROL_INTERNAL.loadPartialDataResponse} " + err.message, document.getElementById("id_resource_message_error").value);
        }
    },

    keydown: function (id, evt, sURL) {
        var sInputText = "";
        var sCallback = "";
        var bResult = false;
        var objCtrl = null;

        try {
            if (OPTIONCONTROL_COMBO.isWorkAsComboBox(id) == true) {
                OPTIONCONTROL_COMBO.keydown(id, evt);
                return;
            }

            if (OPTIONCONTROL_INTERNAL.getDataLoadingFlag(id) == true) {
                FCommon.UI.stopKeyProcess(evt);
                return;
            }

            sCallback = OPTIONCONTROL.getOnKeyDownCallback(id);
            if (FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                bResult = FConvert.toBoolean(eval(sCallback)(id, evt));
                if (bResult == true) {
                    return;
                }
            }

            switch (evt.keyCode) {
                case eKeyCode.Tab:
                    sInputText = id.value;
                    objCtrl = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
                    OPTIONCONTROL_INTERNAL.setSelectedValue(id);

                    if (FCommon.String.isNullOrEmpty(id.value) == true && FCommon.String.isNullOrEmpty(sInputText) == false) {
                        if (OPTIONCONTROL_INTERNAL.isPopupVisible(id) == true) {
                            OPTIONCONTROL_INTERNAL.hidePopup(id);
                        }

                        sCallback = OPTIONCONTROL.getDataNotFoundCallback(id);
                        if (FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                            bResult = eval(sCallback)(id, { InputText: sInputText, Event: evt });
                            if (bResult == true) {
                                return;
                            }
                        }
                    }

                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        if (OPTIONCONTROL_INTERNAL.isPopupVisible(id) == true) {
                            FCommon.UI.stopKeyProcess(evt);
                            OPTIONCONTROL_INTERNAL.hidePopup(id);
                        }
                    }
                    break;
                case eKeyCode.CR:
                    OPTIONCONTROL_INTERNAL.processForBarcode(id, evt);
                    break;
                case eKeyCode.Esc: // Esc key
                    FCommon.UI.stopKeyProcess(evt);
                    OPTIONCONTROL_INTERNAL.unselectRow(OPTIONCONTROL_INTERNAL.getSelectedRow(id));
                    return;
                case eKeyCode.End: // End key
                    //if (evt.shiftKey == true) {
                    //}
                    //else if (evt.ctrlKey == true) {
                    //}
                    //else {
                    //    FCommon.UI.stopKeyProcess(evt);
                    //    OPTIONCONTROL_INTERNAL.selectLastRow(id);
                    //}
                    break;
                case eKeyCode.Home: // Home key
                    //if (evt.shiftKey == true) {
                    //}
                    //else if (evt.ctrlKey == true) {
                    //}
                    //else {
                    //    FCommon.UI.stopKeyProcess(evt);
                    //    OPTIONCONTROL_INTERNAL.selectFirstRow(id);
                    //}
                    break;
                case eKeyCode.Up: // up arrow
                    OPTIONCONTROL_INTERNAL.processUpKey(id, evt);
                    break;
                case eKeyCode.Down: // down arrow
                    OPTIONCONTROL_INTERNAL.processDownKey(id, evt, sURL);
                    break;
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.keydown} " + err.message);
        }
    },

    keyup: function (id, evt, sURL) {
        var sValue = "";
        var row = null;

        try {
            if (OPTIONCONTROL_COMBO.isWorkAsComboBox(id) == true) {
                return;
            }

            switch (evt.keyCode) {
                case eKeyCode.Backspace: // backspace key
                    OPTIONCONTROL_INTERNAL.clearTimerForInput(id);
                    sValue = id.value;
                    row = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
                    OPTIONCONTROL_INTERNAL.processInputs(id,
                                                        sValue,
                                                        sURL,
                                                        OPTIONCONTROL_INTERNAL.getElementData(row),
                                                        true);
                    if (FCommon.String.isNullOrEmpty(sValue) == false && OPTIONCONTROL_INTERNAL.isPopupVisible(id) == false) {
                        OPTIONCONTROL_INTERNAL.showPopup(id);
                    }
                    return;
                case eKeyCode.CR: // Enter key
                    break;
                case 16: // Shift key
                    return;
                case 19: // Pause key
                    return;
                case eKeyCode.Space: // Space bar
                    break;
                case eKeyCode.PageUp: // Page up
                    break;
                case eKeyCode.PageDown: // Page down
                    break;
                case eKeyCode.Left: // left arrow
                    break;
                case eKeyCode.Up: // up arrow
                    return;
                case eKeyCode.Right: // right arrow
                    break;
                case eKeyCode.Down: // down arrow
                    return;
                case eKeyCode.PrintScreen: // Print screen key
                    return;
                case eKeyCode.Insert: // Insert key
                    return;
                case eKeyCode.Del: // Delete key
                    OPTIONCONTROL_INTERNAL.clearTimerForInput(id);
                    sValue = id.value;
                    OPTIONCONTROL_INTERNAL.processInputs(id,
                                                            sValue,
                                                            sURL,
                                                            null,
                                                            true);
                    if (FCommon.String.isNullOrEmpty(sValue) == false && OPTIONCONTROL_INTERNAL.isPopupVisible(id) == false) {
                        OPTIONCONTROL_INTERNAL.showPopup(id);
                    }
                    break;
                case 106: // Numeric pad * key
                    break;
                case 107: // Numeric pad + key
                    break;
                case 109: // Numeric pad - key
                    break;
                case 110: // Numeric pad . key
                    break;
                case 111: // Numeric pad / key
                    break;
                case eKeyCode.F2: // F2
                    OPTIONCONTROL_INTERNAL.processF2(id, evt);
                    break;
                case eKeyCode.F5: // F5 Search
                    OPTIONCONTROL_SEARCH.processSearch(id, "", evt);
                    break;
                case 144: // Num Lock key
                    return;
                case 145: // Scroll Lock key
                    return;
                case 186: // ; : key
                    break;
                case 187: // = + key
                    break;
                case 188: // , < key
                    break;
                case 189: // - _ key
                    break;
                case 190: //. > key
                    break;
                case 191: // / ? key
                    break;
                case 192: // ` ~ key
                    return;
                case 219: //[ { key
                    break;
                case 220: // \ | key
                    break;
                case 221: // ] } key
                    break;
                case 222: // ' " key
                    break;
                default:
                    if (evt.keyCode >= eKeyCode.NumPad0 && evt.keyCode <= eKeyCode.NumPad9) { // Numeric pad number 0 to 9
                    }
                    else if (evt.keyCode >= eKeyCode.D0 && evt.keyCode <= eKeyCode.D9) { // Number key 0 to 9
                    }
                    else if (evt.keyCode >= eKeyCode.A && evt.keyCode <= eKeyCode.Z) { // key a to z in both case

                    }

                    break;
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.keyup} " + err.message);
        }
    },

    input: function (id, evt, sURL) {
        var sValue = "";

        try {
            sValue = FConvert.toString(id.value);

            if (OPTIONCONTROL_COMBO.isWorkAsComboBox(id) == true) {
                OPTIONCONTROL_COMBO.processInput(id, sValue);
            }
            else {
                OPTIONCONTROL_INTERNAL.processInputs(id,
                                            sValue,
                                            sURL,
                                            OPTIONCONTROL_INTERNAL.getElementData(OPTIONCONTROL_INTERNAL.getSelectedRow(id), id), true);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.input} " + err.message);
        }
    },

    onFocus: function (id, evt) {
        var sCallback = "";
        var iSearchBy = 0;
        var iFirstField = 0;
        var iOriginalFirstField = 0;
        var value = null;
        var obj = null;

        try {
            if (id == null) {
                alert("Error: {OPTIONCONTROL_INTERNAL.onFocus} Invalid control id.");

                return (false);
            }

            id = FCommon.UI.getValidElement(id);

            if (OPTIONCONTROL_COMBO.isWorkAsComboBox(id) == true) {
                OPTIONCONTROL_COMBO.onFocus(id, evt);

                return (true);
            }

            value = OPTIONCONTROL_INTERNAL.getDataElement(id).value;

            OPTIONCONTROL.setScanFlag(id, false);
            OPTIONCONTROL_INTERNAL.setDataLoadingFlag(id, false);
            OPTIONCONTROL_INTERNAL.setBufferedInputText(id, "");

            if (OPTIONCONTROL.getControlType(id) == eWebOptionControlType.Masters) {
                iSearchBy = OPTIONCONTROL_INTERNAL.getSearchBy(id);
                iFirstField = OPTIONCONTROL_INTERNAL.getFirstField(id);
                iOriginalFirstField = OPTIONCONTROL_INTERNAL.getOriginalFirstField(id);

                // if (iSearchBy != -1) {
                if (iSearchBy != -1 && iSearchBy != iOriginalFirstField) {
                    //debugger
                    //OPTIONCONTROL.resetControl(id, value);
                    OPTIONCONTROL.resetControl(id, value, iSearchBy);
                    FCommon.UI.selectTextInInput(id, 0, FConvert.toString(id.value).length);
                }
                else {
                    OPTIONCONTROL_INTERNAL.setSearchBy(id, iFirstField);
                }
            }

            FCommon.UI.setAttributeData(id, "focusvalue", value);
            OPTIONCONTROL.focusText(id, id.value);
            //FCommon.UI.setAttributeData(id, "focustext", id.value);
            FCommon.UI.setAttributeData(id, "lastValue", value);
            obj = OPTIONCONTROL_INTERNAL.getCallbackDataObject(id, null, false);
            obj.Event = evt;

            sCallback = OPTIONCONTROL.getOnFocusCallback(id);
            if (FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                obj.Flag.bLeave = false;
                obj.Flag.bDataLoad = false;
                obj.Flag.bDataChange = false;
                eval(sCallback)(obj);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.onFocus} " + err.message);
        }

        return (true);
    },

    leaveFocus: function (id, evt) {
        var sCallback = "";
        var iSearchBy = 0;
        var iFirstField = 0;
        var iOriginalFirstField = 0;
        var data = null;
        var obj = null;
        var value = null;
        var row = null;
        var objPartialFlag = null;

        try {
            id = FCommon.UI.getValidElement(id);

            if (OPTIONCONTROL_COMBO.isWorkAsComboBox(id) == true) {
                OPTIONCONTROL_COMBO.onLeave(id, evt);

                return;
            }

            OPTIONCONTROL_INTERNAL.clearTimerForInput(id);

            OPTIONCONTROL_INTERNAL.setDataLoadingFlag(id, false);
            OPTIONCONTROL_INTERNAL.setBufferedInputText(id, "");

            obj = OPTIONCONTROL_INTERNAL.getCallbackDataObject(id, null, true);
            obj.Event = evt;

            OPTIONCONTROL_INTERNAL.setSelectedValue(id);



            value = FConvert.toInt(OPTIONCONTROL.getControlValue(id));
            //if (OPTIONCONTROL_INTERNAL.getSearchBy(id) != -1 && OPTIONCONTROL.getControlType(id) == eWebOptionControlType.Masters) {
            //    OPTIONCONTROL.resetControl(id, value);
            //}

            if (OPTIONCONTROL.getControlType(id) == eWebOptionControlType.Masters) {
                iSearchBy = OPTIONCONTROL_INTERNAL.getSearchBy(id);
                iFirstField = OPTIONCONTROL_INTERNAL.getFirstField(id);
                iOriginalFirstField = OPTIONCONTROL_INTERNAL.getOriginalFirstField(id);

                if (iSearchBy != -1 && iSearchBy != iOriginalFirstField) {
                    OPTIONCONTROL.resetControl(id, value);
                }
            }


            // Load partial data before leave
            if (FConvert.toInt(OPTIONCONTROL.getControlValue(id)) != 0) {
                row = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
                objPartialFlag = OPTIONCONTROL_INTERNAL.hasPartialData(row, id);
                if (objPartialFlag.iMasterId > 0) {
                    OPTIONCONTROL_INTERNAL.startLoadingPartialData(id, row, objPartialFlag);
                    OPTIONCONTROL_INTERNAL.setSelectedValue(id);
                }
            }

            obj.Data = OPTIONCONTROL.getControlData(id);
            if (FCommon.UI.isValidObject(obj.Data) == true) {
                obj.Value = FConvert.toInt(FCommon.Object.getFirstPropertyValue(obj.Data[0]));
            }


            OPTIONCONTROL_INTERNAL.hidePopup(id);

            sCallback = OPTIONCONTROL.getOnDataChangeCallback(id);
            if (FCommon.String.isNullOrEmpty(sCallback, true) == false && obj.OldValue != obj.Value) {
                obj.Flag.bLeave = false;
                obj.Flag.bDataLoad = false;
                obj.Flag.bDataChange = true;
                eval(sCallback)(obj.Control, obj.Data, obj);
                obj.OldValue = obj.Value // 14/Nov/2017
            }

            sCallback = OPTIONCONTROL.getOnLeaveCallback(id);
            if (FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                obj.Flag.bLeave = true;
                obj.Flag.bDataLoad = false;
                obj.Flag.bDataChange = false;

                eval(sCallback)(id, obj.Data, obj);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.leaveFocus} " + err.message);
        }
    },

    dropdownClick: function (id, evt) {
        var arrMetaData = null;
        var sValue = "";
        var iStoreValueIndex = 0;
        var objCurrentData = null;
        var result = null;

        try {
            FCommon.UI.stopKeyProcess(evt);
            id = FCommon.UI.getValidElement(id);

            if (id.readOnly == true || id.disabled == true) {
                return;
            }

            if (OPTIONCONTROL_COMBO.isWorkAsComboBox(id) == true) {
                OPTIONCONTROL_COMBO.showPopup(id);

                return;
            }

            sValue = id.value;

            arrMetaData = OPTIONCONTROL_INTERNAL.getMetaData(id);
            if (arrMetaData.length == 0) {
                if (FCommon.String.isNullOrEmpty(sValue, true) == true) {
                    OPTIONCONTROL_INTERNAL.loadAndDisplayDropdownWithData(id);
                }

                return;
            }

            if (OPTIONCONTROL.getMasterTypeId(id) < 1 && FCommon.String.isNullOrEmpty(OPTIONCONTROL.getTableName(id), true) == false) {
                objCurrentData = {};
                objCurrentData.Id = FConvert.toInt(OPTIONCONTROL.getControlValue(id));
                objCurrentData.Value = id.value;

                OPTIONCONTROL.resetControl(id);


                OPTIONCONTROL_INTERNAL.processInputs(id, " ", FCommon.UI.getAttributeData(id, "url"), null, false);

                if (objCurrentData.Id > 0) {
                    iStoreValueIndex = OPTIONCONTROL_INTERNAL.getStoreValueIndex(id);
                    result = OPTIONCONTROL_INTERNAL.getValueFromMemory(id, objCurrentData.Id, iStoreValueIndex);

                    if (FCommon.Array.getLength(result) == 0) {
                        result = [];
                        result.push({ sValue: FConvert.toString(objCurrentData.Id) });
                        result.push({ sValue: objCurrentData.Value });
                        OPTIONCONTROL_INTERNAL.storeDataInMemory(id, result, 0)

                        OPTIONCONTROL_INTERNAL.createDataRow(id, result, OPTIONCONTROL_INTERNAL.getMetaData(id), 0);
                    }

                    OPTIONCONTROL.setControlValue(id, objCurrentData.Id, null, false, true);
                    if (FCommon.String.isNullOrEmpty(sValue, true) == false) {
                        OPTIONCONTROL_INTERNAL.showPopup(id);
                    }
                    return;
                }

                id.value = sValue;
                OPTIONCONTROL_INTERNAL.unselectAllRows(id);
                if (FCommon.String.isNullOrEmpty(sValue, true) == true) {
                    OPTIONCONTROL_INTERNAL.selectFirstRow(id);
                }
                OPTIONCONTROL_INTERNAL.showPopup(id);
                return;
            }

            //arrMetaData = OPTIONCONTROL_INTERNAL.getMetaData(id);
            //if (arrMetaData.length == 0) {
            //    if (FCommon.String.isNullOrEmpty(sValue, true) == true) {
            //        OPTIONCONTROL_INTERNAL.loadAndDisplayDropdownWithData(id);
            //    }

            //    return;
            //}

            if (FCommon.String.isNullOrEmpty(sValue, true) == true && OPTIONCONTROL_INTERNAL.getMemoryData().length == 0) {
                OPTIONCONTROL_INTERNAL.processInputs(id, " ", FCommon.UI.getAttributeData(id, "url"), null, false);
            }

            OPTIONCONTROL_INTERNAL.showPopup(id);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.dropdownClick} " + err.message);
        }
    },

    settingsClick: function (id, evt) {
        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return;
            }

            if (id.readOnly == true || id.disabled == true) {
                return;
            }

            OPTIONCONTROL_CUSTOMIZE.open(id, evt);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.settingsClick} " + err.message);
        }
    },

    showPopup: function (id) {
        var sCallback = "";
        var ctrlPopup = null;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                alert("Error: {OPTIONCONTROL_INTERNAL.showPopup} Invalid control id.");

                return (false);
            }

            if (FCommon.String.isNullOrEmpty(id.id) == true) {
                alert("Error: {OPTIONCONTROL_INTERNAL.showPopup} Control id cannot be blank.");

                return (false);
            }

            if (OPTIONCONTROL.isInputBarcodeEnabled(id) == true) {
                return (false);
            }

            ctrlPopup = OPTIONCONTROL_INTERNAL.getDataContainerElement(id);
            if (ctrlPopup == null) {
                alert("Error: {OPTIONCONTROL_INTERNAL.showPopup} Data container not found.");

                return (false);
            }

            ctrlPopup.style.display = '';

            FCommon.UI.setFocusDropdownPopupPosition(id, ctrlPopup);
            FCommon.UI.selectTextInInput(id, id.value.length, id.value.length);

            sCallback = OPTIONCONTROL.getAfterPopupDisplayedCallback(id);
            if (FCommon.String.isNullOrEmpty(sCallback) == false) {
                if (FCommon.String.includes(sCallback, "(") == true) {
                    eval(sCallback);
                }
                else {
                    eval(sCallback)(id);
                }
            }

            return (true);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.showPopup} " + err.message);
        }

        return (false);
    },

    hidePopup: function (id) {
        var ctrlPopuup = null;

        try {
            if (id == null) {
                alert("Error: {OPTIONCONTROL_INTERNAL.hidePopup} Invalid control id.");

                return (false);
            }

            ctrlPopuup = OPTIONCONTROL_INTERNAL.getDataContainerElement(id);
            if (ctrlPopuup == null) {
                alert("Error: {OPTIONCONTROL_INTERNAL.hidePopup} Data container not found.");

                return (false);
            }

            ctrlPopuup.style.display = 'none';

            return (true);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.hidePopup} " + err.message);
        }

        return (false);
    },

    processInputs: function (id, sKey, sURL, objData, bFromKeyboard) {
        var arrIndex = null;
        var vValue = null;
        var row = null;
        var objParam = null;
        var objData = null;

        try {
            if (FCommon.String.startsWith(sKey, "#") == true) {
                OPTIONCONTROL_INTERNAL.resetDataElement(id, true);

                if (sKey == "#") {
                    return;
                }
            }

            if (OPTIONCONTROL_INTERNAL.isKeepUnmatchedData(id) == true) {
                if (FCommon.String.isNullOrEmpty(sKey) == true) {
                    OPTIONCONTROL_INTERNAL.resetDataElement(id, false);
                }
            }
            else {
                if (sKey == " " && OPTIONCONTROL.isValidStoredData(id, sKey) == false) {
                    OPTIONCONTROL.clear(id, true);

                    if (FCommon.UI.isValidObject(objData) == true) {
                        objData = null;
                    }
                }
            }

            if (OPTIONCONTROL.isInputBarcodeEnabled(id) == true) {
                return;
            }

            arrIndex = OPTIONCONTROL_INTERNAL.getKeyDataIndexArray(id, sKey, 0);
            if (FCommon.String.isNullOrEmpty(sURL) == false && (arrIndex == null || arrIndex.length <= 0)) {
                bFromKeyboard = FConvert.toBoolean(bFromKeyboard);
                if (bFromKeyboard == true) {
                    //if (OPTIONCONTROL_INTERNAL.getDataLoadingFlag(id) == true) {
                    OPTIONCONTROL_INTERNAL.startTimerForInput(id, sKey, sURL);
                    OPTIONCONTROL_INTERNAL.setBufferedInputText(id, sKey);
                }
                else {
                    objParam = OPTIONCONTROL_INTERNAL.getServerCommunicationParameterObject(id, sURL);
                    objParam.sSearch = sKey;

                    OPTIONCONTROL_INTERNAL.resetDataElement(id, true);
                    OPTIONCONTROL_INTERNAL.getDataFromServer(objParam);
                }
            }
            else {
                OPTIONCONTROL_INTERNAL.setDataLoadingFlag(id, false);
                OPTIONCONTROL_INTERNAL.setBufferedInputText(id, "");

                OPTIONCONTROL_INTERNAL.fillDataFromIndex(id, OPTIONCONTROL_INTERNAL.getMetaData(id), arrIndex);
                if (FCommon.UI.isValidObject(objData) == true) {
                    row = OPTIONCONTROL_INTERNAL.getRowFromObject(id, objData);
                    if (row != null) {
                        OPTIONCONTROL_INTERNAL.selectRow(row, id);
                    }
                    else {
                        OPTIONCONTROL_INTERNAL.selectFirstRow(id);
                    }
                }
                else {
                    OPTIONCONTROL_INTERNAL.selectFirstRow(id);
                }
            }

            if (OPTIONCONTROL_INTERNAL.isPopupVisible(id) == false) {
                if (OPTIONCONTROL_INTERNAL.getMetaData(id).length > 0) {
                    //debugger
                    // OPTIONCONTROL_INTERNAL.showPopup(id);
                    objData = OPTIONCONTROL_INTERNAL.getElementData(OPTIONCONTROL_INTERNAL.getSelectedRow(id), id);

                    if (FConvert.toBoolean(bFromKeyboard) == true) {
                        OPTIONCONTROL_INTERNAL.showPopup(id);
                    }
                    else {
                        OPTIONCONTROL_INTERNAL.setControlData(id, objData);
                    }
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.processInputs} " + err.message);
        }
    },

    processForBarcode: function (id, evt) {
        var sHandler = "";
        var sBarcodeProductURL = "";
        var iMasterTypeId = 0;
        var data = null;
        var obj = null;

        try {
            if (FCommon.String.isNullOrEmpty(id.value, true) == true) {
                return (false);
            }

            iMasterTypeId = OPTIONCONTROL.getMasterTypeId(id);
            if (iMasterTypeId != 2) {
                return (false);
            }

            data = OPTIONCONTROL_INTERNAL.getSelectedRowValue(id);
            if (FCommon.UI.isValidObject(data) == true) {
                return (false);
            }

            sBarcodeProductURL = OPTIONCONTROL.getBarcodeProductURL(id);
            if (FCommon.String.isNullOrEmpty(sBarcodeProductURL) == true) {
                return (false);
            }

            data = NETWORK.executeServerMethod(sBarcodeProductURL, false, { sBarcode: id.value }, "json", false);
            if (data.lValue > 0) {
                data = data.data;
                if (data.lValue > 0) {
                    obj = data.data;
                    if (obj.ItemId > 0) {
                        OPTIONCONTROL.setControlValue(id, obj.ItemId);
                        OPTIONCONTROL.setScanFlag(id, true);
                    }

                    sHandler = OPTIONCONTROL.getBarcodeDataLoadedCallback(id);
                    if (FCommon.String.isNullOrEmpty(sHandler, true) == false) {
                        eval(sHandler)(id, obj);
                    }
                }
                else if (FCommon.String.isNullOrEmpty(data.sValue, true) == false) {
                    alert("Error: {OPTIONCONTROL_INTERNAL.processForBarcode)} " + data.sValue);
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.processForBarcode)} " + err.message);
        }

        return (true);
    },

    processF2: function (id, evt) {
        var iSearchBy = 0;
        var iFirstField = 0;
        var eleRow = null;
        var iId = 0;

        try {
            eleRow = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
            if (FCommon.UI.isValidObject(eleRow) == true) {
                iId = FConvert.toInt(FCommon.UI.getAttributeData(eleRow, "imasterid"));
            }
            //iId = FConvert.toInt(OPTIONCONTROL.getControlValue(id));

            iFirstField = OPTIONCONTROL_INTERNAL.getFirstField(id);
            iSearchBy = OPTIONCONTROL_INTERNAL.getSearchBy(id);
            iSearchBy++;
            if (iSearchBy < 0 || iSearchBy > 2) {
                iSearchBy = 0;
            }

            OPTIONCONTROL.resetControl(id, iId, iSearchBy, iFirstField, true);
            OPTIONCONTROL_INTERNAL.updatePopupPosition(id);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.processF2)} " + err.message);
        }
    },

    processUpKey: function (id, evt) {
        var row = null;

        try {
            FCommon.UI.stopKeyProcess(evt);

            if (OPTIONCONTROL_INTERNAL.isPopupVisible(id) == false && OPTIONCONTROL_INTERNAL.getMetaData(id).length > 0) {
                OPTIONCONTROL_INTERNAL.showPopup(id);
                return;
            }

            row = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
            if (row != null) {
                OPTIONCONTROL_INTERNAL.unselectRow(row);
                row = OPTIONCONTROL_INTERNAL.getPreviousDataRow(row);
            }

            if (row == null) {
                row = OPTIONCONTROL_INTERNAL.getFirstDataRow(id);
            }

            if (row != null) {
                OPTIONCONTROL_INTERNAL.selectRow(row, id);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.processUpKey} " + err.message);
        }
    },

    processDownKey: function (id, evt, sURL) {
        var row = null;
        var selectedrow = null;
        var bFlag = false;
        var value = 0;
        var objData = null;
        var obj = null;

        try {
            FCommon.UI.stopKeyProcess(evt);

            if (OPTIONCONTROL_INTERNAL.isPopupVisible(id) == false && OPTIONCONTROL_INTERNAL.getMetaData(id).length > 0) {
                value = FConvert.toInt(OPTIONCONTROL.getControlValue(id));
                if (value != 0) {
                    OPTIONCONTROL_INTERNAL.showPopup(id);
                    OPTIONCONTROL.setControlValue(id, value);
                }
                else {
                    OPTIONCONTROL_INTERNAL.dropdownClick(id, evt);
                }
                return;
            }
            else if (OPTIONCONTROL_INTERNAL.isPopupVisible(id) == false && OPTIONCONTROL_INTERNAL.getMetaData(id).length == 0) {
                OPTIONCONTROL_INTERNAL.loadAndDisplayDropdownWithData(id);
                return;
            }

            selectedrow = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
            if (FCommon.UI.isValidObject(selectedrow) == false) {
                //OPTIONCONTROL_INTERNAL.selectFirstRow(selectedrow);
                OPTIONCONTROL_INTERNAL.selectFirstRow(id);
                return;
            }

            bFlag = true;
            objData = OPTIONCONTROL_INTERNAL.getElementData(selectedrow);
            OPTIONCONTROL_INTERNAL.unselectRow(selectedrow);
            row = OPTIONCONTROL_INTERNAL.getNextDataRow(selectedrow);

            if (row != null) {
                OPTIONCONTROL_INTERNAL.selectRow(row, id);
            }
            else if (bFlag == true) {
                if (FCommon.String.isNullOrEmpty(sURL, true) == true) {
                    OPTIONCONTROL_INTERNAL.selectRow(selectedrow, id);
                }
                else {
                    obj = OPTIONCONTROL_INTERNAL.getServerCommunicationParameterObject(id, sURL);
                    obj.sSearch = id.value;
                    obj.iExistingDataCount = OPTIONCONTROL_INTERNAL.getControlDataRowCount(id);
                    obj.SelectedData = objData;
                    OPTIONCONTROL_INTERNAL.getDataFromServer(obj);
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.processDownKey} " + err.message);
        }
    },

    removefilterCondition: function (sFilter, sFilterField) {
        var iStartIndex = 0;
        var iCurrentIndex = 0;
        var iCounter = 0;
        var value = 0;

        try {
            sFilter = sFilter.replace(/\s{2,}/g, ' ');
            if (FCommon.String.isNullOrEmpty(sFilter, true) == true) {
                return (sFilter);
            }

            if (sFilter.charAt(0) == ' ') {
                sFilter = sFilter.substr(1);
            }


            iStartIndex = sFilter.indexOf(sFilterField + "=");
            if (iStartIndex != -1) {
                iCurrentIndex = iStartIndex + sFilterField.length;
            }
            else {
                iStartIndex = sFilter.indexOf(sFilterField + " =");
                if (iStartIndex != -1) {
                    iCurrentIndex = iStartIndex + sFilterField.length;
                    iCurrentIndex++; // Skip space before =
                }
                else {
                    return;
                }
            }

            iCurrentIndex++; // Skip =

            if (iStartIndex >= 5 && sFilter.substr(iStartIndex - 1, 1) == " " && sFilter.substr(iStartIndex - 5, 5).toLowerCase() == " and ") {
                iStartIndex -= 4; // "and "
            }

            if (sFilter.substr(iCurrentIndex, 1) == ' ') {
                iCurrentIndex++;
            }

            if (sFilter.substr(iCurrentIndex, 1) == "'") { // string
                iCurrentIndex++;
                while (iCurrentIndex < sFilter.length) {
                    value = sFilter.charAt(iCurrentIndex);
                    if (value != "'") {
                        iCurrentIndex++;
                    }
                    else {
                        iCurrentIndex++; // Skip ' char
                        break;
                    }
                }
            }
            else { // Number
                while (iCurrentIndex < sFilter.length) {
                    value = sFilter.charCodeAt(iCurrentIndex); // Get ASCII value
                    if (value >= 48 && value <= 57) {
                        iCurrentIndex++;
                    }
                    else {
                        break;
                    }
                }
            }

            if (iCurrentIndex == sFilter.length) {
                // Remove start to last
                sFilter = sFilter.substr(0, iStartIndex);
            }
            else {
                sFilter = sFilter.substr(0, iStartIndex) + sFilter.substr(iCurrentIndex);
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.removefilterCondition} " + err.message;
            throw err;
        }

        return (sFilter);
    },

    getRowFromObject: function (id, objData, bValueIndexOnly) {
        var iCompareValueIndex = 0;
        var row = null;
        var obj = null;

        try {
            bValueIndexOnly = FConvert.toBoolean(bValueIndexOnly);

            iCompareValueIndex = OPTIONCONTROL_INTERNAL.getCompareValueIndex(id);
            for (row = OPTIONCONTROL_INTERNAL.getFirstDataRow(id) ; row != null; row = OPTIONCONTROL_INTERNAL.getNextDataRow(row)) {
                //obj = OPTIONCONTROL_INTERNAL.getElementData(row); // Data not loaded because mandatory and displayfield or common reported by safdar
                obj = OPTIONCONTROL_INTERNAL.getElementData(row, id);
                if (OPTIONCONTROL_INTERNAL.compareObject(obj, objData, iCompareValueIndex, bValueIndexOnly) == true) {
                    return (row);
                }
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getRowFromObject} " + err.message;
            throw err;
        }

        return (null);
    },

    // Sets control selected data into hidden element
    setControlData: function (id, objData) {
        var sProperty = "";
        var iStoreValueIndex = 0;
        var iCompareValueIndex = 0;
        var iExactMatchValue = 0;
        var arrMetaData = null;
        var element = null;

        var iIndex = 0;

        try {
            iStoreValueIndex = OPTIONCONTROL_INTERNAL.getStoreValueIndex(id);
            iCompareValueIndex = OPTIONCONTROL_INTERNAL.getCompareValueIndex(id);

            element = OPTIONCONTROL_INTERNAL.getDataElement(id);
            if (FCommon.UI.isValidObject(element) == false) {
                return;
            }

            arrMetaData = OPTIONCONTROL_INTERNAL.getMetaData(id);
            for (iIndex = 0; iIndex < arrMetaData.length; iIndex++) {
                sProperty = arrMetaData[iIndex].Name;
                if (FCommon.String.includes(sProperty, " ") == true) {
                    WriteConsoleLog("Error: {OPTIONCONTROL_INTERNAL.setControlData} [id=" + id.id + "][Property=" + sProperty + "] Property cannot have space.");
                }

                if (FCommon.UI.isValidObject(objData) == true) {
                    if (iIndex < objData.length) {
                        FCommon.UI.setAttributeData(element, sProperty, objData[iIndex].sValue);
                    }
                }
                else {
                    FCommon.UI.setAttributeData(element, sProperty, "");
                }
            }

            if (FCommon.UI.isValidObject(objData) == true) {
                element.setAttribute("value", objData[iStoreValueIndex].sValue);
                id.value = objData[iCompareValueIndex].sValue;
            }
            else {
                element.setAttribute("value", "0");

                iExactMatchValue = OPTIONCONTROL_INTERNAL.getExactMatchValue(id);
                if (iExactMatchValue != 0) {
                    id.value = "";
                }
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.setControlData} " + err.message;
            throw err;
        }
    },

    // Match store key index value in stored data with passed value and select it in control
    selectValueInControl: function (id, value, tag, bIgnoreChangeCallback) {
        var sCallback = "";
        var iStoreValueIndex = 0;
        var row = null;
        var result = null;
        var arrIndex = [];
        var obj = null;

        try {
            id = FCommon.UI.getValidElement(id);

            iStoreValueIndex = OPTIONCONTROL_INTERNAL.getStoreValueIndex(id);

            obj = OPTIONCONTROL_INTERNAL.getCallbackDataObject(id, tag, false);
            obj.OldData = OPTIONCONTROL_INTERNAL.getSelectedRowValue(id);

            row = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
            OPTIONCONTROL_INTERNAL.unselectRow(row);

            result = OPTIONCONTROL_INTERNAL.getValueFromMemory(id, value, iStoreValueIndex);
            if (FCommon.UI.isValidObject(result) == true && result.length > 0) {
                row = OPTIONCONTROL_INTERNAL.getRowFromObject(id, result[1]);
                if (row == null) {
                    arrIndex.push(result[0]);
                    OPTIONCONTROL_INTERNAL.fillDataFromIndex(id, OPTIONCONTROL_INTERNAL.getMetaData(id), arrIndex);
                }

                if (row == null) {
                    row = OPTIONCONTROL_INTERNAL.getRowFromObject(id, result[1]);
                }

                if (row != null) {
                    OPTIONCONTROL_INTERNAL.selectRow(row, id);
                    OPTIONCONTROL_INTERNAL.setControlData(id, result[1]);
                }

                obj.Data = OPTIONCONTROL_INTERNAL.getSelectedRowValue(id);
                if (FCommon.UI.isValidObject(obj.Data) == true) {
                    obj.Value = FConvert.toInt(FCommon.Object.getFirstPropertyValue(obj.Data[0]));
                }

                sCallback = OPTIONCONTROL.getOnDataLoadedCallback(id);
                if (FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                    obj.Flag.bLeave = false;
                    obj.Flag.bDataLoad = true;
                    obj.Flag.bDataChange = false;
                    eval(sCallback)(obj.Control, obj.Data, obj);
                }

                sCallback = OPTIONCONTROL.getOnDataChangeCallback(id);
                if (FCommon.String.isNullOrEmpty(sCallback, true) == false && obj.OldValue != obj.Value) {
                    FCommon.UI.setAttributeData(id, "focusvalue", obj.Value);
                    OPTIONCONTROL.focusText(id, id.value);
                    //FCommon.UI.setAttributeData(id, "focustext", id.value);
                    FCommon.UI.setAttributeData(id, "lastvalue", obj.Value);

                    obj.Flag.bLeave = false;
                    obj.Flag.bDataLoad = false;
                    obj.Flag.bDataChange = true;

                    bIgnoreChangeCallback = FConvert.toBoolean(bIgnoreChangeCallback);
                    if (bIgnoreChangeCallback == false) {
                        eval(sCallback)(obj.Control, obj.Data, obj);
                    }
                }

                return (true);
            }
            else {
                OPTIONCONTROL_INTERNAL.setControlData(id, null);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.selectValueInControl} " + err.message);
        }

        return (false);
    },

    // Returns object from memory data where given value match with store value
    getValueFromMemory: function (id, value, iStoreValueIndex) {
        var iCounter = 0;
        var objExisting = null;
        var arrData = null;
        var result = [];

        try {
            if (FCommon.UI.isValidObject(iStoreValueIndex) == false) {
                iStoreValueIndex = OPTIONCONTROL_INTERNAL.getStoreValueIndex(id);
            }

            arrData = OPTIONCONTROL_INTERNAL.getMemoryData(id);
            for (iCounter = 0; iCounter < arrData.length; iCounter++) {
                objExisting = arrData[iCounter];
                if (FCommon.UI.isValidObject(objExisting) == true
                    && FCommon.String.compare(objExisting[iStoreValueIndex].sValue, value, false) == 0) {
                    result.push(iCounter);
                    result.push(objExisting);

                    return (result);
                }
            }
        }
        catch (err) {
            WriteConsoleLog("Exception: {OPTIONCONTROL_INTERNAL.getValueFromMemory} [id=" + id.id + "][Exception=" + err.message + "]");
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getValueFromMemory} " + err.message;
            throw err;
        }

        return (result);
    },

    // Returns existing data row count
    getControlDataRowCount: function (id) {
        var objBody = null;
        var element = null;
        var iCount = 0;

        try {
            objBody = OPTIONCONTROL_INTERNAL.getDataTableBodyElement(id);
            if (FCommon.UI.isValidObject(objBody) == false) {
                return (0);
            }

            for (element = objBody.firstChild; element != null; element = element.nextSibling) {
                iCount++;
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getControlDataRowCount} " + err.message;
            throw err;
        }

        return (iCount);
    },

    // Returns selected row value
    getSelectedRowValue: function (id) {
        var iCompareValueIndex = 0;
        var data = null;

        try {
            id = FCommon.UI.getValidElement(id);
            iCompareValueIndex = OPTIONCONTROL_INTERNAL.getCompareValueIndex(id);

            data = OPTIONCONTROL_INTERNAL.getElementData(OPTIONCONTROL_INTERNAL.getSelectedRow(id), id);
            if (FCommon.UI.isValidObject(data) == true && data.length > iCompareValueIndex) {
                return (data);
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getSelectedRowValue} " + err.message;
            throw err;
        }

        return (null);
    },

    // Sets selected value into control
    setSelectedValue: function (id) {
        var iCompareValueIndex = 0;
        var data = null;

        try {
            id = FCommon.UI.getValidElement(id);
            iCompareValueIndex = OPTIONCONTROL_INTERNAL.getCompareValueIndex(id);

            data = OPTIONCONTROL_INTERNAL.getElementData(OPTIONCONTROL_INTERNAL.getSelectedRow(id), id);
            if (FCommon.UI.isValidObject(data) == true && data.length > iCompareValueIndex) {
                OPTIONCONTROL_INTERNAL.setControlData(id, data);
            }
            else {
                OPTIONCONTROL_INTERNAL.setControlData(id, null);
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.setSelectedValue} " + err.message;
            throw err;
        }
    },

    // Returns store value index received from server while fetching data
    getStoreValueIndex: function (id) {
        var value = 0;

        try {
            value = FCommon.UI.getAttributeData(id, OPTIONCONTROL_INTERNAL.getStoreValueIndexKey());
            if (FCommon.UI.isValidObject(value) == false) {
                value = 0;
            }

            value = Number(value);
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getStoreValueIndex} " + err.message;
            throw err;
        }

        return (value);
    },

    // Sets store value index
    setStoreValueIndex: function (id, iStoreValueIndex) {
        FCommon.UI.setAttributeData(id, OPTIONCONTROL_INTERNAL.getStoreValueIndexKey(), iStoreValueIndex);
    },

    // Returns compare value index received from server while fetching data
    getCompareValueIndex: function (id) {
        var vValue = 0;

        try {
            vValue = FCommon.UI.getAttributeData(id, OPTIONCONTROL_INTERNAL.getCompareValueIndexKey());
            if (FCommon.UI.isValidObject(vValue) == false) {
                vValue = 0;
            }

            vValue = Number(vValue);
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getCompareValueIndex} " + err.message;
            throw err;
        }

        return (vValue);
    },

    // Sets compare value index
    setCompareValueIndex: function (id, iCompareValueIndex) {
        FCommon.UI.setAttributeData(id, OPTIONCONTROL_INTERNAL.getCompareValueIndexKey(), iCompareValueIndex);
    },

    // Returns exact match flag value
    getExactMatchValue: function (id) {
        var value = 0;

        try {
            value = FCommon.UI.getAttributeData(id, OPTIONCONTROL_INTERNAL.getExactMatchKey());
            if (FCommon.UI.isValidObject(value) == false) {
                value = 1;
            }

            value = parseInt(value);
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getExactMatchValue} " + err.message;
            throw err;
        }

        return (value);
    },

    isTextSelectionType: function (id) {
        var iExactMatch = 0;
        var value = false;

        try {
            iExactMatch = OPTIONCONTROL_INTERNAL.getExactMatchValue(id);
            if (iExactMatch != 0) {
                return (false);
            }

            value = FConvert.toBoolean(FCommon.UI.getAttributeData(id, "textselectiontype"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.isTextSelectionType} " + err.message);
        }

        return (value);
    },

    // Returns data attribute value array of given element
    getElementData: function (element, id) {
        var sProperty = "";
        var data = [];
        var iCounter = 0;
        var arrMetaData = null;

        try {
            if (FCommon.UI.isValidObject(element) == false) {
                return (null);
            }

            if (FCommon.UI.isValidObject(id) == false) {
                for (iCounter = 0; iCounter < element.attributes.length; iCounter++) {
                    if (FCommon.String.compare(element.attributes[iCounter].name, "data-", true, "data-".length) == 0) {
                        data.push({ "sValue": element.attributes[iCounter].value });
                    }
                }
            }
            else {
                arrMetaData = OPTIONCONTROL_INTERNAL.getMetaData(id);
                for (iCounter = 0; iCounter < arrMetaData.length; iCounter++) {
                    sProperty = arrMetaData[iCounter].Name;
                    if (FCommon.String.includes(sProperty, " ") == true) {
                        WriteConsoleLog("Error: {OPTIONCONTROL_INTERNAL.getElementData} [id=" + id.id + "][Property=" + sProperty + "] Property cannot have space.");
                    }

                    data.push({ "sValue": element.getAttribute("data-" + sProperty.toLowerCase()) });
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getElementData} " + err.message);
        }

        return (data);
    },

    isPopupVisible: function (id) {
        var ctrlPopuup = null;

        try {
            if (id == null) {
                alert("Error: {OPTIONCONTROL_INTERNAL.isPopupVisible} Invalid control id.");

                return (false);
            }

            ctrlPopuup = OPTIONCONTROL_INTERNAL.getDataContainerElement(id);
            if (ctrlPopuup == null) {
                alert("Error: {OPTIONCONTROL_INTERNAL.isPopupVisible} Data container not found.");

                return (false);
            }

            return (ctrlPopuup.style.display != 'none');
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.isPopupVisible} " + err.message);
        }

        return (false);
    },

    // Compare objects
    compareObject: function (objData, objData1, iCompareValueIndex, bValueIndexOnly) {
        var iIndex = 0;
        var iTotal = 0;

        try {
            if (FCommon.UI.isValidObject(objData) == false
                || FCommon.UI.isValidObject(objData1) == false
                || objData.length <= iCompareValueIndex
                || objData1.length <= iCompareValueIndex) {
                return (false);
            }

            bValueIndexOnly = FConvert.toBoolean(bValueIndexOnly);
            if (FCommon.String.compare(objData[iCompareValueIndex].sValue, objData1[iCompareValueIndex].sValue, false) == 0) {
                if (bValueIndexOnly == true) {
                    return (true);
                }

                iTotal = objData.length;
                iTotal = Math.min(objData.length, objData1.length); // Added for length mismatch 30/May/2017
                for (iIndex = 0; iIndex < iTotal; iIndex++) {
                    if (objData[iIndex].sValue != objData1[iIndex].sValue) {
                        break;
                    }
                }

                if (iIndex >= iTotal) {
                    return (true);
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.compareObject} " + err.message);
        }

        return (false);
    },

    // Stores data object in memory
    storeDataInMemory: function (id, objData, iInsertAfter) {
        var iIndex = 0;
        var iCompareValueIndex = 0;
        var iResult = 0;
        var iPosition = 0;
        var arrData = null;
        var objExistingData = null;

        try {
            iCompareValueIndex = OPTIONCONTROL_INTERNAL.getCompareValueIndex(id);

            if (FCommon.String.isNullOrEmpty(objData[iCompareValueIndex].sValue) == true || iCompareValueIndex < 0) {
                return (0);
            }

            if (OPTIONCONTROL_INTERNAL.isDataExist(id, objData) >= 0) {
                return (0);
            }

            iPosition = OPTIONCONTROL_INTERNAL.getDataPositionInMemory(id, objData, iCompareValueIndex);
            if (iPosition >= 0) { // Data already stored in memory
                return (iPosition);
            }

            arrData = OPTIONCONTROL_INTERNAL.getMemoryData(id);
            for (iIndex = iInsertAfter; iIndex < arrData.length; iIndex++) {
                objExistingData = arrData[iIndex];
                iResult = FCommon.String.compare(objExistingData[iCompareValueIndex].sValue, objData[iCompareValueIndex].sValue, false);
                if (iResult < 0) {
                    continue;
                }

                arrData.splice(iIndex, 0, objData);
                OPTIONCONTROL_INTERNAL.setMemoryData(id, arrData);

                return (iIndex);
            }

            arrData.splice(iIndex, 0, objData);
            OPTIONCONTROL_INTERNAL.setMemoryData(id, arrData);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.storeDataInMemory} " + err.message);
        }

        return (iIndex);
    },

    // Stores array of data objects in memory
    storeDataArrayInMemory: function (id, arrData) {
        var iCounter = 0;
        var objArr = null;

        try {
            if (OPTIONCONTROL_COMBO.isWorkAsComboBox(id) == true) {
                OPTIONCONTROL_COMBO.storeDataArrayInMemory(id, arrData);

                return;
            }

            if (FCommon.UI.isValidObject(arrData) == false) {
                return;
            }

            for (iCounter = 0; iCounter < arrData.length; iCounter++) {
                objArr = arrData[iCounter];
                OPTIONCONTROL_INTERNAL.storeDataInMemory(id, objArr, 0);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.storeDataArrayInMemory} " + err.message);
        }
    },

    // Returns object position in memory data
    getDataPositionInMemory: function (id, objData, iCompareValueIndex) {
        var iCounter = 0;
        var objExisting = null;
        var arrData = null;

        try {
            arrData = OPTIONCONTROL_INTERNAL.getMemoryData(id);
            for (iCounter = 0; iCounter < arrData.length; iCounter++) {
                objExisting = arrData[iCounter];
                if (OPTIONCONTROL_INTERNAL.compareObject(objExisting, objData, iCompareValueIndex) == true) {
                    return (iCounter);
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getDataPositionInMemory} " + err.message);
        }

        return (-1);
    },

    isDataExist: function (id, objData) {
        var iCounter = 0;
        var objExisting = null;
        var arrData = null;

        try {
            arrData = OPTIONCONTROL_INTERNAL.getMemoryData(id);
            for (iCounter = 0; iCounter < arrData.length; iCounter++) {
                objExisting = arrData[iCounter];
                if (objExisting[0].sValue === objData[0].sValue) {
                    return (iCounter);
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.isDataExist} " + err.message);
        }

        return (-1);
    },

    // Returns array of data index of memory data that matched from given key value
    getKeyDataIndexArray: function (id, sSearchKey, iStartArrayIndex) {
        var iCompreValueIndex = 0;
        var sValue = "";
        var arrIndex = [];
        var iCounter = 0;
        var arrData = null;
        var objData = null;
        var bShowAll = false;

        try {
            if (FCommon.String.isNullOrEmpty(sSearchKey) == false) {
                if (FCommon.String.isNullOrEmpty(sSearchKey.trim()) == true) {
                    bShowAll = true;
                }
                else if (FCommon.String.startsWith(sSearchKey, "#") == true) {
                    bShowAll = true;
                }

                iCompreValueIndex = OPTIONCONTROL_INTERNAL.getCompareValueIndex(id);

                arrData = OPTIONCONTROL_INTERNAL.getMemoryData(id);
                for (iCounter = iStartArrayIndex; iCounter < arrData.length; iCounter++) {
                    objData = arrData[iCounter];
                    if (objData == null || iCompreValueIndex >= objData.length) {
                        continue;
                    }

                    sValue = objData[iCompreValueIndex].sValue;
                    if (sValue.length <= 0 || sSearchKey.length <= 0) {
                        continue;
                    }

                    if (bShowAll == true) {
                        arrIndex.push(iCounter);
                        continue;
                    }
                    else if (sSearchKey.length > sValue.length) {
                        if (FCommon.String.compare(sValue, sSearchKey, true, 0) == 0) {
                            arrIndex.push(iCounter);
                        }
                    }
                    else {
                        if (FCommon.String.compare(sValue, sSearchKey, true, Math.min(sValue.length, sSearchKey.length)) == 0) {
                            arrIndex.push(iCounter);
                        }
                    }
                }
            }
        }
        catch (err) {
            alert(err.message = "Exception: {OPTIONCONTROL_INTERNAL.getKeyDataIndexArray} " + err.message);
        }

        return (arrIndex);
    },

    removePartialData: function (id) {
        var iCounter = 0;
        var iIndex = 0;
        var arrData = null;
        var objData = null;
        var row = null;

        try {
            id = FCommon.UI.getValidElement(id);
            row = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
            OPTIONCONTROL_INTERNAL.unselectRow(row);

            iStoreValueIndex = OPTIONCONTROL_INTERNAL.getStoreValueIndex(id);

            arrData = OPTIONCONTROL_INTERNAL.getMemoryData(id);

            for (iCounter = 0; iCounter < arrData.length; iCounter++) {
                objData = arrData[iCounter];
                if (FCommon.UI.isValidObject(objData) == false) {
                    continue;
                }

                for (iIndex = 0; iIndex < objData.length; iIndex++) {
                    if (objData[iIndex].bHasData == false) {
                        break;
                    }
                }

                if (iIndex >= objData.length) {
                    continue;
                }

                row = OPTIONCONTROL_INTERNAL.getRowFromObject(id, objData, true);
                if (row == null) {
                    FCommon.UI.removeElement(row);
                }
                arrData.splice(iCounter, 1);
                iCounter--;
            }

            OPTIONCONTROL_INTERNAL.setMemoryData(id, arrData);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.removePartialData} " + err.message);
        }
    },

    hasPartialData: function (row, id) {
        var iMasterId = 0;
        var iCounter = 0;
        var iMasterTypeId = 0;
        var iCompareValueIndex = 0;
        var iStoreValueIndex = 0;
        var data = null;
        var result = null;
        var obj = null;

        try {
            obj = {};
            obj.iMasterId = 0;
            obj.iMemoryIndex = -1;

            iMasterTypeId = OPTIONCONTROL.getMasterTypeId(id);
            if (iMasterTypeId < 1 || iMasterTypeId > 2) {
                return (obj);
            }

            iCompareValueIndex = OPTIONCONTROL_INTERNAL.getCompareValueIndex(id);

            data = OPTIONCONTROL_INTERNAL.getElementData(row, id);
            if (FCommon.UI.isValidObject(data) == true && data.length > iCompareValueIndex) {

                iStoreValueIndex = OPTIONCONTROL_INTERNAL.getStoreValueIndex(id);

                iMasterId = FConvert.toInt(data[0].sValue);
                result = OPTIONCONTROL_INTERNAL.getValueFromMemory(id, iMasterId, iStoreValueIndex);
                if (FCommon.UI.isValidObject(result) == false || result.length == 0) {
                    return (obj);
                }
                else if (result.length == 2) {
                    data = result[1];

                    for (iCounter = 0; iCounter < data.length; iCounter++) {
                        if (data[iCounter].bHasData == false) {
                            obj.iMasterId = iMasterId;
                            obj.iMemoryIndex = result[0];

                            return (obj);
                        }
                    }
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.hasPartialData} " + err.message);
        }

        return (obj);
    },

    // Fetches multiple value from server at one go
    fillValueInMemory: function (id, arrValue, tag, bLoadAll, bIgnoreChangeCallback) {
        var sURL = "";
        var sValueFilter = "";
        var iStoreValueIndex = 0;
        var iCounter = 0;
        var result = null;
        var arr = [];
        var arrLoadedData = [];
        var objParam = null;

        try {
            iStoreValueIndex = OPTIONCONTROL_INTERNAL.getStoreValueIndex(id);

            for (iCounter = 0; iCounter < arrValue.length; iCounter++) {
                result = OPTIONCONTROL_INTERNAL.getValueFromMemory(id, arrValue[iCounter], iStoreValueIndex);
                if (FCommon.UI.isValidObject(result) == false || result.length == 0) {
                    arr.push(arrValue[iCounter]);
                }
                else if (result.length >= 2) {
                    arrLoadedData.push(result[1]);
                }
            }

            if (arr.length > 0) {
                sURL = FCommon.UI.getAttributeData(id, "url");
                sValueFilter = FCommon.UI.getAttributeData(id, "valuefilterfield");
                if (FCommon.String.isNullOrEmpty(sValueFilter) == true) {
                    if (FCommon.String.isNullOrEmpty(OPTIONCONTROL.getTableName(id)) == true) {
                        sValueFilter = "a.iMasterId IN(";
                    }
                    else {
                        sValueFilter = OPTIONCONTROL.getPrimaryField(id) + " IN(";
                    }
                }
                else {
                    sValueFilter += " IN(";
                }

                for (iCounter = 0; iCounter < arr.length; iCounter++) {
                    if (iCounter > 0) {
                        sValueFilter += ",";
                    }

                    sValueFilter += '\'' + arr[iCounter] + '\'';
                }

                sValueFilter += ")";

                objParam = OPTIONCONTROL_INTERNAL.getServerCommunicationParameterObject(id, sURL);
                objParam.sFilter = sValueFilter;
                objParam.bLoadAll = FConvert.toBoolean(bLoadAll);
                objParam.bIgnoreChangeCallback = FConvert.toBoolean(bIgnoreChangeCallback);
                if (FCommon.UI.isValidObject(tag) == true) {
                    objParam.tag = tag;
                }

                OPTIONCONTROL_INTERNAL.resetDataElement(id, true);
                OPTIONCONTROL_INTERNAL.getDataFromServer(objParam);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.fillValueInMemory} " + err.message);
        }

        return (arrLoadedData);
    },

    fillDataFromIndex: function (id, arrMetaData, arrIndex) {
        var iCounter = 0;
        var iIndex = 0;
        var arrData = null;
        var objArr = null;
        var element = null;
        var objBody = null;

        try {
            id = FCommon.UI.getValidElement(id);
            element = OPTIONCONTROL_INTERNAL.getDataTableColGroupElement(id); // id_header_3_table_data_colgroup
            if (FCommon.UI.isValidObject(element) == false) {
                if (OPTIONCONTROL_INTERNAL.createTableDataColGroup(id, arrMetaData) == false) {
                    return (false);
                }
            }

            objBody = OPTIONCONTROL_INTERNAL.getDataTableBodyElement(id);
            if (objBody == null) {
                objBody = document.createElement("tbody");
                objBody.id = OPTIONCONTROL_INTERNAL.getDataBodyId(id);

                element = OPTIONCONTROL_INTERNAL.getDataTableElement(id); // id_header_3_table_data
                if (element == null) {
                    return (false);
                }

                element.appendChild(objBody);
            }
            else {
                while (objBody.firstChild) {
                    objBody.removeChild(objBody.firstChild);
                }
            }

            arrData = OPTIONCONTROL_INTERNAL.getMemoryData(id);
            if (arrData.length == 0 || FCommon.Array.getLength(arrIndex) == 0) {
                return;
            }

            for (iCounter = 0; iCounter < arrIndex.length; iCounter++) {
                iIndex = arrIndex[iCounter];
                if (iIndex >= arrData.length) {
                    continue;
                }

                objArr = arrData[iIndex];
                OPTIONCONTROL_INTERNAL.createDataRow(id, objArr, arrMetaData, iIndex);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.fillDataFromIndex} " + err.message);
        }
    },

    // Select given row
    selectRow: function (row, id) {
        var obj = null;

        try {
            if (FCommon.UI.isValidObject(row) == false) {
                return (false);
            }

            row.className = OPTIONCONTROL_INTERNAL.getSelectedDataRowClassName();
            if (OPTIONCONTROL_INTERNAL.isRowVisible(row, id) == false) {
                OPTIONCONTROL_INTERNAL.makeTableRowVisibile(row, id);

                //row.scrollIntoView(false);
            }

            obj = OPTIONCONTROL_INTERNAL.hasPartialData(row, id);
            if (obj.iMasterId > 0) {
                OPTIONCONTROL_INTERNAL.startTimerForPartialData(id, row, obj);
            }
        }
        catch (err) {
            err.message = "Exception: {selectRow} " + err.message;
            throw err;
        }

        return (true);
    },

    // Unselect given row
    unselectRow: function (row) {
        try {
            if (FCommon.UI.isValidObject(row) == false) {
                return (false);
            }

            row.className = OPTIONCONTROL_INTERNAL.getDataRowClassName();
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.unselectRow} " + err.message;
            throw err;
        }

        return (true);
    },

    unselectAllRows: function (id) {
        var parent = null;
        var ctrl = null;

        try {
            id = FCommon.UI.getValidElement(id);
            parent = OPTIONCONTROL_INTERNAL.getDataTableBodyElement(id);
            if (parent == null) {
                return (null);
            }

            for (ctrl = parent.firstChild; ctrl != null; ctrl = ctrl.nextSibling) {
                ctrl.className = OPTIONCONTROL_INTERNAL.getDataRowClassName();
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.unselectAllRows} " + err.message);
        }
    },

    // Selects first row
    selectFirstRow: function (id) {
        var objRow = null;

        try {
            objRow = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
            if (objRow != null) {
                OPTIONCONTROL_INTERNAL.unselectRow(objRow);
            }

            objRow = OPTIONCONTROL_INTERNAL.getFirstDataRow(id);
            if (objRow != null) {
                objRow.parentElement.parentElement.parentElement.scrollTop = 0;
                OPTIONCONTROL_INTERNAL.selectRow(objRow, id);
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.selectFirstRow} " + err.message;
            throw err;
        }

        return (objRow);
    },

    // Selects last row
    selectLastRow: function (id) {
        var objRow = null;

        try {
            objRow = OPTIONCONTROL_INTERNAL.getSelectedRow(id);
            if (objRow != null) {
                OPTIONCONTROL_INTERNAL.unselectRow(objRow);
            }

            objRow = OPTIONCONTROL_INTERNAL.getLastDataRow(id);
            if (objRow != null) {
                OPTIONCONTROL_INTERNAL.selectRow(objRow, id);
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.selectLastRow} " + err.message;
            throw err;
        }

        return (objRow);
    },

    // Checks table row is visible in parent div
    isRowVisible: function (row, id) {
        var div = null;
        var rowRect = null;
        var divRect = null;
        var bResult = false;

        try {
            div = document.getElementById(id.id + '_div_data');
            if (FCommon.UI.isValidObject(div) == false) {
                return (false);
            }

            rowRect = row.getBoundingClientRect();
            divRect = div.getBoundingClientRect();

            bResult = rowRect.top >= divRect.top && rowRect.top < (divRect.bottom - 10);

        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.isRowVisible} " + err.message;
            throw err;
        }

        return (bResult);
    },

    makeTableRowVisibileOld: function (row, id) {
        var iLastScrollTop = 0;
        var iHeight = 0;

        try {
            iLastScrollTop = row.parentElement.parentElement.parentElement.scrollTop;
            iHeight = row.getBoundingClientRect().height;

            row.parentElement.parentElement.parentElement.scrollTop += iHeight;

            if (OPTIONCONTROL_INTERNAL.isRowVisible(row, id) == false) {
                row.parentElement.parentElement.parentElement.scrollTop = iLastScrollTop;
                row.parentElement.parentElement.parentElement.scrollTop -= iHeight;
            }

            if (OPTIONCONTROL_INTERNAL.isRowVisible(row, id) == false) {
                row.parentElement.parentElement.parentElement.scrollTop = iLastScrollTop;
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.makeTableRowVisibileOld} " + err.message;
            throw err;
        }
    },

    makeTableRowVisibile: function (row, id) {
        var iMaxHeight = 0;
        var iHeight = 0;
        var eleDataTableContainer = null;

        try {
            iHeight = row.getBoundingClientRect().height;

            eleDataTableContainer = row.parentElement.parentElement.parentElement;
            eleDataTableContainer.scrollTop = 0;
            iMaxHeight = eleDataTableContainer.scrollHeight;
            if (iMaxHeight > 0 && iHeight > 0) {
                while (eleDataTableContainer.scrollTop <= iMaxHeight) {
                    if (OPTIONCONTROL_INTERNAL.isRowVisible(row, id) == false) {
                        eleDataTableContainer.scrollTop += iHeight;
                    }
                    else {
                        break;
                    }
                }
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.makeTableRowVisibile} " + err.message;
            throw err;
        }
    },

    // Returns first data row
    getFirstDataRow: function (id) {
        var parent = null;

        try {
            parent = OPTIONCONTROL_INTERNAL.getDataTableBodyElement(id);
            if (parent == null) {
                return (null);
            }

            return (parent.firstChild);
        }
        catch (err) {
            alert("Exception: {getFirstDataRow} " + err.message);
        }

        return (null);
    },

    // Returns next data row of given
    getNextDataRow: function (objRow) {

        try {
            if (FCommon.UI.isValidObject(objRow) == false) {
                return (null);
            }

            objRow = objRow.nextSibling;
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getNextDataRow} " + err.message;
            throw err;
        }

        return (objRow);
    },

    // Returns previous data row of given
    getPreviousDataRow: function (objRow) {

        try {
            if (FCommon.UI.isValidObject(objRow) == false) {
                return (null);
            }

            objRow = objRow.previousSibling;
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getPreviousDataRow} " + err.message);
        }

        return (objRow);
    },

    // Returns last data row
    getLastDataRow: function (id) {
        var parent = null;

        try {
            parent = OPTIONCONTROL_INTERNAL.getDataTableBodyElement(id);
            if (parent == null) {
                return (null);
            }

            return (parent.lastChild);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getLastDataRow} " + err.message);
        }

        return (null);
    },

    getDataBodyId: function (id) {
        var sName = "";

        try {
            sName = id.id + "_table_data_body";
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getDataBodyId} " + err.message;
            throw err;
        }

        return (sName);
    },

    // Returns first selected row
    getSelectedRow: function (id) {
        var parent = null;
        var ctrl = null;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return (null);
            }
            parent = OPTIONCONTROL_INTERNAL.getDataTableBodyElement(id);
            if (parent == null) {
                return (null);
            }

            for (ctrl = parent.firstChild; ctrl != null; ctrl = ctrl.nextSibling) {
                if (ctrl.className == OPTIONCONTROL_INTERNAL.getSelectedDataRowClassName()) {
                    return (ctrl);
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getSelectedRow} " + err.message);
        }

        return (null);
    },

    getSearchBy: function (id) {
        var value = 0;

        try {
            id = FCommon.UI.getValidElement(id);
            value = FConvert.toInt(FCommon.UI.getAttributeData(id, "i_searchby"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getSearchBy} " + err.message);
        }

        return (value);
    },

    setSearchBy: function (id, value) {
        try {
            id = FCommon.UI.getValidElement(id);
            FCommon.UI.setAttributeData(id, "i_searchby", value);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.setSearchBy} " + err.message);
        }
    },

    getShowAllColumns: function (id) {
        var value = false;

        try {
            id = FCommon.UI.getValidElement(id);
            value = FConvert.toBoolean(FCommon.UI.getAttributeData(id, "showallcolumns"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getShowAllColumns} " + err.message);
        }

        return (value);
    },

    getFirstField: function (id) {
        var value = 0;

        try {
            id = FCommon.UI.getValidElement(id);
            value = FConvert.toInt(FCommon.UI.getAttributeData(id, "i_firstfield"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getFirstField} " + err.message);
        }

        return (value);
    },

    setFirstField: function (id, value) {
        try {
            id = FCommon.UI.getValidElement(id);
            FCommon.UI.setAttributeData(id, "i_firstfield", value);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.setFirstField} " + err.message);
        }
    },

    getOriginalFirstField: function (id) {
        var value = 0;

        try {
            id = FCommon.UI.getValidElement(id);
            value = FConvert.toInt(FCommon.UI.getAttributeData(id, "i_originalfirstfield"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getOriginalFirstField} " + err.message);
        }

        return (value);
    },

    setOriginalFirstField: function (id, value) {
        try {
            id = FCommon.UI.getValidElement(id);
            FCommon.UI.setAttributeData(id, "i_originalfirstfield", value);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.setOriginalFirstField} " + err.message);
        }
    },

    getFieldName: function (id) {
        var value = "";

        try {
            id = FCommon.UI.getValidElement(id);
            value = FConvert.toString(FCommon.UI.getAttributeData(id, "fieldname"));
        }
        catch (err) {
            WriteConsoleLog("Exception: {OPTIONCONTROL_INTERNAL.getFieldName} " + err.message, "red");
        }

        return (value);
    },

    // Returns is unmatched data needed to be stored
    isKeepUnmatchedData: function (id) {
        var value = false;

        try {
            value = FConvert.toBoolean(FCommon.UI.getAttributeData(id, "keepunmatcheddata"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.isKeepUnmatchedData} " + err.message);
        }

        return (value);
    },

    getCustomizeUIURL: function (id) {
        var value = "";

        try {
            id = FCommon.UI.getValidElement(id);
            value = FConvert.toString(FCommon.UI.getAttributeData(id, "customizeuiurl"));
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getCustomizeUIURL} " + err.message);
        }

        return (value);
    },

    // Deletes heading element
    resetHeadingElement: function (id) {
        var parent = null;

        try {
            parent = OPTIONCONTROL_INTERNAL.getDataHeadingTableElement(id);
            if (parent == null) {
                return (false);
            }

            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }

            OPTIONCONTROL_INTERNAL.setMetaData(id, []);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.resetHeadingElement} " + err.message);
        }

        return (true);
    },

    // Deletes all data element
    resetDataElement: function (id, bClearMemoryData) {
        var ele = null;
        var bValue = false;

        try {
            ele = OPTIONCONTROL_INTERNAL.getDataElement(id);
            if (FCommon.UI.isValidObject(ele) == true) {
                FCommon.UI.removeDataAttribute(ele);
                ele.value = 0;
            }

            ele = OPTIONCONTROL_INTERNAL.getDataTableElement(id);
            if (FCommon.UI.isValidObject(ele) == true) {
                while (ele.firstChild) {
                    ele.removeChild(ele.firstChild);
                }

                bValue = true;
            }

            if (FConvert.toBoolean(bClearMemoryData) == true) {
                OPTIONCONTROL_INTERNAL.setMemoryData(id, []);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.resetDataElement} " + err.message);
        }

        return (bValue);
    },

    createHeading: function (id, arrMetaData) {
        var eleTable = null;
        var iCounter = 0;
        var objData = null;
        var colGroup = null;
        var row = null;
        var element = null;
        var iWidth = 0;

        try {
            eleTable = OPTIONCONTROL_INTERNAL.getDataHeadingTableElement(id);
            if (eleTable == null) {
                return (false);
            }

            while (eleTable.firstChild) {
                eleTable.removeChild(eleTable.firstChild);
            }

            if (FCommon.UI.isValidObject(arrMetaData) == false) {
                return;
            }

            OPTIONCONTROL_INTERNAL.setMetaData(id, arrMetaData);

            colGroup = document.createElement("colgroup");
            row = document.createElement("tr");

            for (iCounter = 0; iCounter < arrMetaData.length; iCounter++) {
                objData = arrMetaData[iCounter];
                if (objData.Hidden == true) {
                    continue;
                }

                iWidth += objData.Width;

                element = document.createElement("col");
                element.setAttribute("width", objData.Width);
                colGroup.appendChild(element);

                element = document.createElement("th");
                element.className = "option_heading theme_background-color theme_color";
                element.style.minWidth = objData.Width + "px";
                element.style.maxWidth = objData.Width + "px";
                element.style.position = "relative";
                element.style.borderRight = "solid 1px rgb(154, 198, 255)";
                // element.style.fontWeight = "bold";
                element.style.fontweight = "normal";
                element.style.paddingLeft = "3px";
                element.style.paddingRight = "3px";
                element.style.paddingTop = "1px";
                element.style.paddingBottom = "3px";
                element.style.overflow = "hidden";
                element.style.textOverflow = "ellipsis";
                element.style.whiteSpace = "nowrap";

                if (FCommon.UI.isValidObject(window.GLOBAL) == true && FCommon.UI.isValidObject(window.GLOBAL.getThemeColor) == true) {
                    element.style.backgroundColor = window.GLOBAL.getThemeColor();
                }

                //element.style.backgroundColor = GLOBAL.getThemeColor();
                element.setAttribute("align", OPTIONCONTROL_INTERNAL.getTableColumnAlignText(objData.Align));
                OPTIONCONTROL_INTERNAL.setElementText(element, objData.Name);
                row.appendChild(element)
            }
            eleTable.appendChild(colGroup);

            element = document.createElement("thead");
            element.appendChild(row);
            eleTable.appendChild(element);

            OPTIONCONTROL.setDataContainerPosition(id);
        }
        catch (err) {
            WriteConsoleLog("Exception: {OPTIONCONTROL_INTERNAL.createHeading} " + err.message, "red");
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.createHeading} " + err.message;
            throw err;
        }
    },

    createTableDataColGroup: function (id, arrMetaData) {
        var iCounter = 0;
        var eleDataTable = null;
        var eleCol = null;
        var eleColGroup = null;
        var objColumnMetaData = null;

        try {
            if (FCommon.UI.isValidObject(arrMetaData) == false) {
                return (false);
            }

            eleDataTable = OPTIONCONTROL_INTERNAL.getDataTableElement(id); // id_header_3_table_data
            if (eleDataTable == null) {
                return (false);
            }

            eleColGroup = OPTIONCONTROL_INTERNAL.getDataTableColGroupElement(id); // id_header_3_table_data_colgroup
            if (FCommon.UI.isValidObject(eleColGroup) == true) {
                while (eleColGroup.firstChild) {
                    eleColGroup.removeChild(eleColGroup.firstChild);
                }
            }
            else {
                eleColGroup = document.createElement("colgroup");
                eleColGroup.id = OPTIONCONTROL_INTERNAL.getDataColGroupId(id);
            }

            for (iCounter = 0; iCounter < arrMetaData.length; iCounter++) {
                objColumnMetaData = arrMetaData[iCounter];
                if (objColumnMetaData.Hidden == true) {
                    continue;
                }

                eleCol = document.createElement("col");
                eleCol.setAttribute("width", objColumnMetaData.Width);
                eleColGroup.appendChild(eleCol);
            }

            eleDataTable.appendChild(eleColGroup);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.createTableDataColGroup} " + err.message);
        }

        return (true);
    },

    createDataRow: function (id, objArr, arrMetaData, iIndex) {
        var sText = "";
        var iCounter = 0;
        var iCount = 0;
        var objColumnMetaData = null;
        var objData = null;
        var objBody = null;
        var eleRow = null;
        var eleTd = null;

        try {
            eleRow = document.createElement("tr");
            eleRow.id = "row_" + iIndex;
            eleRow.className = OPTIONCONTROL_INTERNAL.getDataRowClassName();
            eleRow.onmousedown = function (event) {
                OPTIONCONTROL.rowClick(this, id, event);
                FCommon.UI.stopKeyProcess(event);
                OPTIONCONTROL_INTERNAL.hidePopup(id);
            };

            iCount = 0;
            for (iCounter = 0; iCounter < objArr.length; iCounter++) {
                if (iCounter >= arrMetaData.length) {
                    continue;
                }

                iCount++;
                objData = objArr[iCounter];
                objColumnMetaData = arrMetaData[iCounter];

                FCommon.UI.setAttributeData(eleRow, objColumnMetaData.Name, objData.sValue);
                if (objColumnMetaData.Hidden == false) {
                    eleTd = document.createElement("td");
                    eleTd.className = "option_column";
                    eleTd.style.paddingLeft = "3px";
                    eleTd.style.paddingRight = "3px";
                    eleTd.style.overflow = "hidden";
                    eleTd.style.textOverflow = "ellipsis";
                    eleTd.style.whiteSpace = "pre"; //"nowrap";
                    eleTd.style.display = "table-cell";
                    eleTd.style.verticalAlign = "inherit";

                    if (FCommon.UI.isValidObject(objColumnMetaData.Align) == false) {
                        sText = "left";
                    }
                    else {
                        sText = objColumnMetaData.Align.toLowerCase();
                        if (sText != "center" && sText != "right") {
                            sText = "left";
                        }
                    }

                    eleTd.style.textAlign = sText;

                    OPTIONCONTROL_INTERNAL.setElementText(eleTd, objData.sValue);
                    eleRow.appendChild(eleTd);
                }
            }

            if (iCount > 0) {
                // Forcefully set masterid, and name because if it is used in mandatory fields and partial data loading is eneabled it will be set as blank
                FCommon.UI.setAttributeData(eleRow, arrMetaData[0].Name, objArr[0].sValue);

                if (iCount > 1) {
                    FCommon.UI.setAttributeData(eleRow, arrMetaData[1].Name, objArr[1].sValue);
                }
            }

            objBody = OPTIONCONTROL_INTERNAL.getDataTableBodyElement(id);
            if (FCommon.UI.isValidObject(objBody) == true) {
                objBody.appendChild(eleRow);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.createDataRow} " + err.message);
        }

        return (eleRow);
    },

    // Returns data container element which contains data heading and data rows (id_header_3_container)
    getDataContainerElement: function (id) {
        var element = null;

        try {
            element = document.getElementById(id.id + "_container");
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getDataContainerElement} " + err.message;
            throw err;
        }

        return (element);
    },

    // Returns data table heading element (id_header_3_table_head)
    getDataHeadingTableElement: function (id) {
        var element = null;

        try {
            id = FCommon.UI.getValidElement(id);
            element = document.getElementById(id.id + "_table_head");
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getDataHeadingTableElement} " + err.message;
            throw err;
        }

        return (element);
    },

    // Returns data table element (id_header_3_table_data)
    getDataTableElement: function (id) {
        var element = null;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == true) {
                element = document.getElementById(id.id + "_table_data");
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getDataTableElement} " + err.message;
            throw err;
        }

        return (element);
    },

    // Returns data table colgroup element (id_header_3_table_data_colgroup)
    getDataTableColGroupElement: function (id) {
        var element = null;

        try {
            element = document.getElementById(OPTIONCONTROL_INTERNAL.getDataColGroupId(id));
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getDataTableColGroupElement} " + err.message;
            throw err;
        }

        return (element);
    },

    // Returns body of data table (id_header_3_table_data_body)
    getDataTableBodyElement: function (id) {
        var element = null;

        try {
            element = document.getElementById(OPTIONCONTROL_INTERNAL.getDataBodyId(id));
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getDataTableBodyElement} " + err.message;
            throw err;
        }

        return (element);
    },

    getSearchContainerElement: function (id) {
        var element = null;

        try {
            element = document.getElementById(id.id + "_search_container");
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getSearchContainerElement} " + err.message);
        }

        return (element);
    },

    getDataElement: function (id) {
        var eleData = null;

        try {
            if (FCommon.UI.isValidObject(id) == true) {
                eleData = document.getElementById(id.id + "_data");
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getDataElement} " + err.message);
        }

        return (eleData);
    },

    getServerCommunicationParameterObject: function (id, sURL) {
        var iMasterTypeId = 0;
        var obj = {};

        obj.id = id;
        obj.sURL = sURL;
        obj.sSearch = "";
        obj.iExistingDataCount = 0;
        obj.SelectedData = null;
        obj.sFilter = "";
        obj.tag = null;
        obj.bAsync = false;
        obj.bLoadAll = false;
        obj.bIgnoreChangeCallback = false;
        obj.bFromKeyboard = false;
        obj.bShowAllCols = false;
        obj.iSelectedId = 0;
        obj.bAsync = null;
        obj.bDoNotShowPopup = null;

        iMasterTypeId = OPTIONCONTROL.getMasterTypeId(id);
        if (iMasterTypeId == 1 || iMasterTypeId == 2) {
            obj.bShowAllCols = OPTIONCONTROL_INTERNAL.getShowAllColumns(id);
        }
        else {
            obj.bShowAllCols = true;
        }

        obj.sfnResponse = "";

        return (obj);
    },

    getCallbackDataObject: function (id, tag, bLeave) {
        var obj = {};

        try {
            bLeave = FConvert.toBoolean(bLeave);

            obj.Control = FCommon.UI.getValidElement(id);
            obj.OldData = null;
            obj.Data = null;
            obj.CustomData = FCommon.UI.isValidObject(tag) == true ? tag : null;
            obj.bDataArray = false;
            obj.UserData = OPTIONCONTROL.getUserData(obj.Control);

            // obj.OldValue = FConvert.toInt(FCommon.UI.getAttributeData(obj.Control, "focusvalue"));
            if (FCommon.UI.isSameElement(id, document.activeElement) == true || bLeave == true) {
                obj.OldValue = FConvert.toInt(FCommon.UI.getAttributeData(obj.Control, "focusvalue"));
            }
            else {
                obj.OldValue = FConvert.toInt(OPTIONCONTROL.getControlValue(obj.Control));
            }

            obj.Value = 0;
            obj.Flag = {
                bLeave: false,
                bDataLoad: false,
                bDataChange: false
            };
        }
        catch (err) { }

        return (obj);
    },

    getInputContainerId: function (id) {
        var sName = "";

        try {
            sName = id.id + "_input_container";
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getInputContainerId} " + err.message;
            throw err;
        }

        return (sName);
    },

    getInputImageId: function (id) {
        var sName = "";

        try {
            sName = id.id + "_input_image";
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getInputImageId} " + err.message;
            throw err;
        }

        return (sName);
    },

    getDataColGroupId: function (id) {
        var sName = "";

        try {
            sName = id.id + "_table_data_colgroup";
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getDataColGroupId} " + err.message;
            throw err;
        }

        return (sName);
    },

    isInvalidkeyCode: function (keyCode) {
        try {
            switch (keyCode) {
                case eKeyCode.Tab: // Tab key
                case eKeyCode.LF: // Enter key
                case eKeyCode.CR: // Enter key
                    //case 27: // Escape key
                case eKeyCode.PageUp: // Page up
                case eKeyCode.PageDown: // Page down
                    //case 35: // End key
                    //case 36: // Home key
                case eKeyCode.Left: // left arrow
                    //case 38: // up arrow
                case eKeyCode.Right: // right arrow
                    //case 40: // down arrow
                case eKeyCode.PrintScreen: // Print screen key
                case eKeyCode.Insert: // Insert key
                    return (true);
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.isInvalidkeyCode} " + err.message;
            throw err;
        }

        return (false);
    },

    setMetaData: function (id, arrMetaData) {
        var sVariableName = "";

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return;
            }

            sVariableName = "g_" + id.id + "_metadata";
            window[sVariableName] = arrMetaData;
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.setMetaData} " + err.message);
        }
    },

    getMetaData: function (id) {
        var sVariableName = "";
        var arrMetaData = [];

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return ([]);
            }

            sVariableName = "g_" + id.id + "_metadata";
            arrMetaData = window[sVariableName];
            if (FCommon.UI.isValidObject(arrMetaData) == false || FCommon.Array.getLength(arrMetaData) == 0) {
                arrMetaData = [];
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getMetaData} " + err.message);
        }

        return (arrMetaData);
    },

    setMemoryData: function (id, arrData) {
        var sVariableName = "";

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return;
            }

            sVariableName = "g_" + id.id + "_data";
            window[sVariableName] = arrData;
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.setMemoryData} " + err.message);
        }

        return (arrData);
    },

    getMemoryData: function (id) {
        var sVariableName = "";
        var arrData = [];

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return ([]);
            }

            sVariableName = "g_" + id.id + "_data";
            arrData = window[sVariableName];
            if (FCommon.UI.isValidObject(arrData) == false || FCommon.Array.getLength(arrData) == 0) {
                arrData = [];
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.getMemoryData} " + err.message);
        }

        return (arrData);
    },

    getStoreValueIndexKey: function () {
        return ("storevalueindex");
    },

    getCompareValueIndexKey: function () {
        return ("comparevalueindex");
    },

    getExactMatchKey: function () {
        return ("exactmatch");
    },

    getSelectedDataRowClassName: function () {
        return ("option_row_selected");
    },

    getDataRowClassName: function () {
        return ("option_row");
    },

    displayLoading: function (id, bLoading) {
        var ele = null;

        try {
            ele = document.getElementById(id.id + "_input_image");
            if (FCommon.UI.isValidObject(ele) == false || ele.children.length != 1) {
                return;
            }

            ele = ele.children[0];

            if (bLoading == true) {
                FCommon.UI.removeClass(ele, "icon-down-arrow");
                FCommon.UI.addClass(ele, "fa fa-spinner fa-pulse");
            }
            else {
                FCommon.UI.removeClass(ele, "fa fa-spinner fa-pulse");
                FCommon.UI.addClass(ele, "icon-down-arrow");
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.displayLoading} " + err.message);
        }
    },

    setDataLoadingFlag: function (id, bValue) {
        FCommon.UI.setAttributeData(id, "dataloadingflag", bValue);
    },

    getDataLoadingFlag: function (id) {
        var value = null;

        value = FConvert.toBoolean(FCommon.UI.getAttributeData(id, "dataloadingflag"));

        return (value);
    },

    setBufferedInputText: function (id, sValue) {
        FCommon.UI.setAttributeData(id, "bufferedinputtext", sValue);
    },

    getBufferedInputText: function (id) {
        var value = null;

        value = FConvert.toString(FCommon.UI.getAttributeData(id, "bufferedinputtext"));

        return (value);
    },

    clearTimerForInput: function (id) {
        var timer = null;

        try {
            timer = FCommon.UI.getAttributeData(id, "input_timerid");
            if (FCommon.String.isNullOrEmpty(timer) == false) {
                window.clearInterval(timer);
                FCommon.UI.setAttributeData(id, "input_timerid", "");
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.clearTimerForInput} " + err.message);
        }
    },

    startTimerForInput: function (id, sKey, sURL) {
        var timer = null;

        try {
            OPTIONCONTROL_INTERNAL.clearTimerForInput(id);

            timer = window.setInterval(function (id, sKey, sURL) {
                var objParam = null;

                OPTIONCONTROL_INTERNAL.clearTimerForInput(id);

                objParam = OPTIONCONTROL_INTERNAL.getServerCommunicationParameterObject(id, sURL);
                objParam.sSearch = sKey;
                objParam.bFromKeyboard = true;

                OPTIONCONTROL_INTERNAL.resetDataElement(id, true);
                OPTIONCONTROL_INTERNAL.getDataFromServer(objParam);
            }, 350, id, sKey, sURL);

            FCommon.UI.setAttributeData(id, "input_timerid", timer);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.startTimerForInput} " + err.message);
        }
    },

    clearTimerForPartialData: function (id) {
        var timer = null;

        try {
            timer = FCommon.UI.getAttributeData(id, "partialdata_timerid");
            if (FCommon.String.isNullOrEmpty(timer) == false) {
                window.clearInterval(timer);
                FCommon.UI.setAttributeData(id, "partialdata_timerid", "");
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.clearTimerForPartialData} " + err.message);
        }
    },

    startTimerForPartialData: function (id, row, obj, sURL) {
        var timer = null;

        try {
            OPTIONCONTROL_INTERNAL.clearTimerForPartialData(id);

            timer = window.setInterval(function (id, row, obj) {
                OPTIONCONTROL_INTERNAL.clearTimerForPartialData(id);

                OPTIONCONTROL_INTERNAL.startLoadingPartialData(id, row, obj);
            }, 300, id, row, obj);

            FCommon.UI.setAttributeData(id, "partialdata_timerid", timer);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.startTimerForPartialData} " + err.message);
        }
    },

    startLoadingPartialData: function (id, row, obj) {
        var sURL = "";
        var objParam = null;

        try {
            //OPTIONCONTROL_INTERNAL.clearTimerForPartialData(id);

            if (FCommon.String.isNullOrEmpty(OPTIONCONTROL.getTableName(id)) == false) {
                return;
            }

            sURL = FCommon.UI.getAttributeData(id, "url");
            objParam = OPTIONCONTROL_INTERNAL.getServerCommunicationParameterObject(id, sURL);
            objParam.bShowAllCols = true;

            if (FCommon.String.isNullOrEmpty(OPTIONCONTROL.getTableName(id)) == true) {
                objParam.sFilter = "a.iMasterId=" + obj.iMasterId;
            }
            else {
                objParam.sFilter = OPTIONCONTROL.getPrimaryField(id) + "=" + obj.iMasterId;
            }

            objParam.bLoadAll = false;
            objParam.bIgnoreChangeCallback = true;
            objParam.sfnResponse = "OPTIONCONTROL_INTERNAL.loadPartialDataResponse";
            objParam.tag = {};
            objParam.tag.row = row;
            objParam.tag.obj = obj;

            OPTIONCONTROL_INTERNAL.loadPartialData(objParam);

        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.startLoadingPartialData} " + err.message);
        }
    },

    loadAndDisplayDropdownWithData: function (id) {
        OPTIONCONTROL_INTERNAL.showPopup(id);
        OPTIONCONTROL_INTERNAL.processInputs(id, " ", FCommon.UI.getAttributeData(id, "url"), null, false);
    },

    updatePopupPosition: function (id) {
        var sId = "";
        var eleId = null;
        var eleContainer = null;
        var obj = null;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return;
            }

            if (FCommon.String.endsWith(id.id, "_container") == true) {
                eleContainer = id;
            }
            else {
                eleContainer = document.getElementById(id.id + "_container");
                if (FCommon.UI.isValidObject(eleContainer) == false) {
                    return;
                }
            }

            if (eleContainer.style.display === "none") {
                return;
            }

            sId = eleContainer.id;
            sId = FCommon.String.left(sId, sId.length - "_container".length);
            eleId = FCommon.UI.getValidElement(sId);

            obj = FCommon.UI.getVisibleWidthHeight(eleId);
            if (obj.iVisibleWidth < 1 || obj.iVisibleHeight < 1) {
                eleContainer.style.display = "none";
            }
            else {
                FCommon.UI.setFocusDropdownPopupPosition(eleId, eleContainer);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_INTERNAL.updatePopupPosition} " + err.message);
        }
    },

    getTableColumnAlignText: function (value) {
        var sText = "";

        try {
            if (FCommon.UI.isValidObject(value) == false) {
                return ("left");
            }

            sText = value.toLowerCase();
            if (sText != "center" && sText != "right") {
                sText = "left";
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.getTableColumnAlignText} " + err.message;
            throw err;
        }

        return (sText);
    },

    setElementText: function (element, sText) {
        var sOldText = "";

        try {
            if (FCommon.UI.isValidObject(element.innerText) == true) {
                sOldText = element.innerText;
                element.innerText = sText;
            }
            else if (FCommon.UI.isValidObject(element.textContent) == true) { // Mozila
                sOldText = element.textContent;
                element.textContent = sText;
            }
        }
        catch (err) {
            err.message = "Exception: {OPTIONCONTROL_INTERNAL.setElementText} " + err.message;
            throw err;
        }

        return (sOldText);
    },

    getContextPath: function (actionName, controllerName, areaName) {
        var sURL = "";

        try {
            if (FCommon.UI.isValidObject(window.GLOBAL) == true) {
                sURL = window.GLOBAL.getContextPath(actionName, controllerName, areaName);
            }
        }
        catch (err) {
        }

        return (sURL);
    }
};

var OPTIONCONTROL_CUSTOMIZE = {
    open: function (id, evt) {
        var sURL = "";
        var iMasterTypeId = 0;
        var sTableName = "";
        var sDisplayField = "";
        var ControlType = 0;
        var obj = null;

        try {
            sURL = OPTIONCONTROL_INTERNAL.getCustomizeUIURL(id);
            if (FCommon.String.isNullOrEmpty(sURL, true) == true) {
                sURL = OPTIONCONTROL_INTERNAL.getContextPath("GetOptionControlCustomize", "TransHome", "Transactions");
            }

            iMasterTypeId = OPTIONCONTROL.getMasterTypeId(id);
            sTableName = OPTIONCONTROL.getTableName(id);
            sDisplayField = OPTIONCONTROL.getDisplayField(id);
            ControlType = OPTIONCONTROL.getControlType(id);

            if (ControlType == eWebOptionControlType.Masters && iMasterTypeId < 1) {
                return;
            }
            else if (ControlType == eWebOptionControlType.Table_View && FCommon.String.isNullOrEmpty(sTableName, true) == true) {
                return;
            }

            obj = {};
            obj.sId = id.id;
            obj.iMasterTypeId = iMasterTypeId;
            obj.sTableName = sTableName;
            obj.sDisplayField = sDisplayField;
            obj.ControlType = ControlType;

            NETWORK.executeServerMethod(sURL,
                                        false,
                                        obj,
                                        "html",
                                        true,
                                        "OPTIONCONTROL_CUSTOMIZE.PRIVATE.callbackShowPopup",
                                        "GLOBAL.LoadingStart",
                                        "GLOBAL.LoadingEnd",
                                        id);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_CUSTOMIZE.open} " + err.message);
        }
    },

    onStandardFields_Click: function (id, evt) {
        OPTIONCONTROL_CUSTOMIZE.PRIVATE.showScreen(id.id, 1); // Show Standard Fields Screen
    },

    onDelete_Click: function (id, evt) {
        var eleSelected = null;

        try {
            eleSelected = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getSelectedElement(id.id);
            if (FCommon.UI.isValidObject(eleSelected) == true) {
                eleSelected.parentElement.removeChild(eleSelected);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_CUSTOMIZE.onDelete_Click} " + err.message);
        }
    },

    onOK_Click: function (id, evt) {
        switch (OPTIONCONTROL_CUSTOMIZE.PRIVATE.getSelectedScreen(id.id)) {
            case 0: // Customize OK
                OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.onSave(id, evt);
                break;
            case 1: // Standard Fields OK
                OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.onSave(id, evt);
                break;
        }
    },

    onClose_Click: function (id, evt) {
        switch (OPTIONCONTROL_CUSTOMIZE.PRIVATE.getSelectedScreen(id.id)) {
            case 0: // Customize Close
                OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.onClose(id, evt);
                break;
            case 1: // Standard Fields Close
                OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.onClose(id.id);
                break;
        }
    },

    onClose_Keydown: function (id, evt) {
        try {
            if (evt.keyCode == eKeyCode.Tab && evt.shiftKey == false) {
                FCommon.UI.stopKeyProcess(evt);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_CUSTOMIZE.onClose_Keydown} " + err.message);
        }
    },

    onColumn_Click: function (id, evt) {
        try {
            if (FCommon.UI.hasClass(id, "theme_background-color") == true) {
                OPTIONCONTROL_CUSTOMIZE.PRIVATE.unselectAll(id.parentElement);
                id.className = "theme_background-color-inverse theme_color-inverse"; // Select column
            }
            else {
                id.className = "theme_background-color theme_color"; // Unselect column
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_CUSTOMIZE.onColumn_Click} " + err.message);
        }
    },

    onColumn_DblClick: function (eleColumn, id, evt) {
        try {
            objColumn = OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.getColumnValue(eleColumn);
            if (FCommon.UI.isValidObject(objColumn) == true) {
                OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.show(id.id,
                                                                    objColumn.Name,
                                                                    objColumn.Display,
                                                                    objColumn.Width,
                                                                    objColumn.Alignment,
                                                                    eleColumn.id);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_CUSTOMIZE.onColumn_DblClick} " + err.message);
        }
    },

    isPopupVisible: function (id) {
        var elePopup = null;
        var rect = null;

        try {
            id = FCommon.UI.getValidElement(id);
            if (FCommon.UI.isValidObject(id) == false) {
                return (false);
            }

            elePopup = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(id.id);
            if (FCommon.UI.isValidObject(elePopup) == false) {
                return (false);
            }

            rect = elePopup.getBoundingClientRect();
            if (rect.height > 0) {
                return (true);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_CUSTOMIZE.isPopupVisible} " + err.message);
        }

        return (false);
    },

    onDragStart: function (evt) {
        try {
            evt.dataTransfer.setData("text", evt.target.id);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_CUSTOMIZE.onDragStart} " + err.message);
        }
    },

    onAllowDrop: function (evt) {
        try {
            if (evt.preventDefault) {
                evt.preventDefault();
            }
            else {
                evt.returnValue = false;
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_CUSTOMIZE.onAllowDrop} " + err.message);
        }
    },

    onDrop: function (evt) {
        var sSourceId = "";
        var iSourceIndex = -1;
        var iTargetIndex = -1;
        var iCounter = 0;
        var eleTarget = null;
        var eleParent = null;

        try {
            if (evt.preventDefault) {
                evt.preventDefault();
            }
            else {
                evt.returnValue = false;
            }

            evt.stopImmediatePropagation();

            sSourceId = evt.dataTransfer.getData("text");

            eleTarget = evt.target;
            if (FCommon.String.isNullOrEmpty(eleTarget.id) == true) {
                eleTarget = eleTarget.parentElement;
            }

            if (sSourceId == eleTarget.id) {
                return;
            }

            eleParent = eleTarget.parentElement;
            for (iCounter = 0; iCounter < eleParent.children.length; iCounter++) {
                if (eleParent.children[iCounter].id == sSourceId) {
                    iSourceIndex = iCounter;
                }
                else if (eleParent.children[iCounter].id == eleTarget.id) {
                    iTargetIndex = iCounter;
                }
            }

            if (iSourceIndex == -1 || iTargetIndex == -1) {
                return;
            }

            if (iTargetIndex < iSourceIndex) {
                eleParent.insertBefore(eleParent.children[iSourceIndex], eleParent.children[iTargetIndex]);
            }
            else if (iTargetIndex > iSourceIndex) {
                if (iTargetIndex == (eleParent.children.length - 1)) {
                    eleParent.appendChild(eleParent.children[iSourceIndex]);
                }
                else if (iTargetIndex < (eleParent.children.length - 1)) {
                    eleParent.insertBefore(eleParent.children[iSourceIndex], eleParent.children[iTargetIndex + 1]);
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_CUSTOMIZE.onDrop} " + err.message);
        }
    },

    CUSTOMIZE_SCREEN: {
        onSave: function (id, evt) {
            var arrData = null;
            var obj = null;
            var objParam = null;

            try {
                obj = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getData(id.id);

                objParam = {};
                objParam.id = id;
                objParam.data = obj;
                objParam.event = evt;
                objParam.iId = FConvert.toInt(OPTIONCONTROL.getControlValue(id));
                objParam.sText = FConvert.toString(OPTIONCONTROL.getControlText(id));


                NETWORK.executeServerMethod(OPTIONCONTROL_INTERNAL.getContextPath("SaveOptionControlFields", "TransHome", "Transactions"),
                                            true,
                                            obj,
                                            "json",
                                            true,
                                            "OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.callbackSave",
                                            "GLOBAL.LoadingStart",
                                            "GLOBAL.LoadingEnd",
                                            objParam);
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.onSave} " + err.message)
            }
        },

        onClose: function (id, evt) {
            var eleContainer = null;
            var elePopup = null;

            try {
                elePopup = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(id.id);
                if (FCommon.UI.isValidObject(elePopup) == true) {
                    $(elePopup).modal("hide");
                }

                eleContainer = OPTIONCONTROL_INTERNAL.getSearchContainerElement(id);
                FCommon.UI.removeChildren(eleContainer);

                OPTIONCONTROL_SEARCH.PRIVATE.enableControl(id, true);
                FCommon.UI.setFocus(id);
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.onClose} " + err.message);
            }
        },

        show: function (sId) {
            var eleHeading = null;
            var eleBody = null;
            var eleFooter = null;
            var eleButtonContainer = null;
            var ele = null;

            try {
                eleHeading = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getHeadingElement(sId);
                eleBody = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getBodyElement(sId);
                eleFooter = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getFooterElement(sId);

                eleButtonContainer = eleFooter.children[0].children[0];

                eleBody.children[0].style.display = ""; // Show Customize
                eleBody.children[1].style.display = "none"; // Hide Standard Fields
                eleButtonContainer.children[0].style.display = ""; // Show Standard Fields Button
                eleButtonContainer.children[1].style.display = ""; // Show Delete Column Button

                FCommon.UI.setText(eleHeading, "Customize Display Columns");
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.show} " + err.message);
            }
        },

        callbackSave: function (bSuccess, data, obj) {
            var value = 0;

            try {
                if (bSuccess == false) {
                    return;
                }

                if (FCommon.String.isNullOrEmpty(data.sValue) == false) {
                    alert("Error: {OptionControl.Customization.Save} " + data.sValue);
                }
                else {
                    value = FConvert.toInt(OPTIONCONTROL.getControlValue(obj.id));

                    OPTIONCONTROL_INTERNAL.setSearchBy(obj.id, -1);
                    OPTIONCONTROL_INTERNAL.setFirstField(obj.id, -1);
                    OPTIONCONTROL_INTERNAL.setOriginalFirstField(obj.id, -1);

                    OPTIONCONTROL.resetControl(obj.id, value);
                    OPTIONCONTROL_CUSTOMIZE.onClose_Click(obj.id, obj.event);

                    if (value == 0 && FCommon.String.isNullOrEmpty(obj.sText, true) == false) {
                        OPTIONCONTROL.setControlText(obj.id, obj.sText);
                    }
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.callbackSave} " + err.message);
            }
        },

        createColumn: function (sId, sFieldName, sDisplayName, iWidth, nAlignment, sColumnId) {
            var sStyle = "";
            var sDblClickHandler = "";
            var eleContainer = null;
            var eleDiv = null;
            var eleSpan = null;
            var date = null;

            try {
                eleDiv = document.getElementById(FConvert.toString(sColumnId));
                if (FCommon.UI.isValidObject(eleDiv) == true) { // Update

                    eleDiv.style.width = iWidth + "px";
                    eleDiv.setAttribute("data-alignment", FConvert.toString(nAlignment));
                    eleDiv.setAttribute("data-display", sDisplayName);
                    eleDiv.setAttribute("data-name", sFieldName);

                    switch (nAlignment) {
                        case 0:
                            eleDiv.style.textAlign = "left";
                            break;
                        case 1:
                            eleDiv.style.textAlign = "center";
                            break;
                        case 2:
                            eleDiv.style.textAlign = "right";
                            break;
                    }

                    FCommon.UI.setText(eleDiv.children[0], sDisplayName);

                    return (true);
                }
                else if (OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.isDuplicateField(sId, sFieldName) == true) {
                    alert("Duplicate Field cannot be added.");

                    return (false);
                }

                date = new Date();
                eleDiv = document.createElement("div");
                eleDiv.id = sId + "_column_" + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds() + "_" + date.getMilliseconds();
                eleDiv.className = "theme_background-color theme_color";
                eleDiv.draggable = true;
                eleDiv.setAttribute("ondragstart", "OPTIONCONTROL_CUSTOMIZE.onDragStart(event);");
                eleDiv.setAttribute("ondragover", "OPTIONCONTROL_CUSTOMIZE.onAllowDrop(event);");
                eleDiv.setAttribute("ondrop", "OPTIONCONTROL_CUSTOMIZE.onDrop(event);");
                eleDiv.setAttribute("data-alignment", FConvert.toString(nAlignment));
                eleDiv.setAttribute("data-display", sDisplayName);
                eleDiv.setAttribute("data-name", sFieldName);
                eleDiv.setAttribute("data-tabletype", "0");
                eleDiv.setAttribute("onclick", "OPTIONCONTROL_CUSTOMIZE.onColumn_Click(this, event);");

                sDblClickHandler = "OPTIONCONTROL_CUSTOMIZE.onColumn_DblClick(this, " + sId + ", event);";
                eleDiv.setAttribute("ondblclick", sDblClickHandler);

                sStyle = "width:" + iWidth + "px; height: 100%; display:inline-block; cursor: pointer; border-right: 1px solid #ccc; resize: horizontal; overflow: auto;  padding-left: 10px; padding-right: 10px;";
                switch (nAlignment) {
                    case 0:
                        sStyle += "text-align:left;";
                        break;
                    case 1:
                        sStyle += "text-align:center;";
                        break;
                    case 2:
                        sStyle += "text-align:right;";
                        break;
                }
                eleDiv.setAttribute("style", sStyle);

                eleSpan = document.createElement("span");
                eleSpan.className = "vcenter";
                eleSpan.setAttribute("style", "display:block;");
                FCommon.UI.setText(eleSpan, sDisplayName);
                eleDiv.appendChild(eleSpan);

                eleContainer = OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.getDisplayFieldContainerElement(sId);
                eleContainer.appendChild(eleDiv);
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.createColumn} " + err.message);
            }

            return (true);
        },

        isDuplicateField: function (sId, sFieldName) {
            var sName = "";
            var iCounter = 0;
            var eleContainer = null;

            try {
                eleContainer = OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.getDisplayFieldContainerElement(sId);
                for (iCounter = 0; iCounter < eleContainer.children.length; iCounter++) {
                    sName = FConvert.toString(FCommon.UI.getAttributeData(eleContainer.children[iCounter], "data-name"));
                    if (sName === sFieldName) {
                        return (true);
                    }
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.isDuplicateField} " + err.message);
            }

            return (false);
        },

        getColumnValue: function (eleColumn) {
            var objColumn = null;
            var rect = null;

            try {
                rect = eleColumn.getBoundingClientRect();

                objColumn = {};
                objColumn.Name = eleColumn.getAttribute("data-name"); // string
                objColumn.Display = ""; // string
                objColumn.TableType = FConvert.toInt(eleColumn.getAttribute("data-tabletype")); // byte
                objColumn.Width = rect.right - rect.left; // int
                objColumn.Alignment = 0; // byte

                if (eleColumn.children[0].children.length > 0) {
                    objColumn.Display = FCommon.UI.getText(eleColumn.children[0].children[0]);
                }
                else {
                    objColumn.Display = FCommon.UI.getText(eleColumn.children[0]);
                }

                if (eleColumn.style.textAlign == "left") {
                    objColumn.Alignment = 0;
                }
                else if (eleColumn.style.textAlign == "center") {
                    objColumn.Alignment = 1;
                }
                else if (eleColumn.style.textAlign == "right") {
                    objColumn.Alignment = 2;
                }

            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.getColumnValue} " + err.message);
            }

            return (objColumn);
        },

        getDisplayFieldContainerElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(sId);
            ele = document.getElementById(ele.id + "_container");

            return (ele);
        }
    },

    STANDARDFIELDS_SCREEN: {
        onSave: function (id, evt) {
            var eleFields = null;
            var eleHeader = null;
            var bResult = false;

            try {
                eleFields = OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getFieldsListElement(id.id);
                eleHeader = OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getHeaderElement(id.id);

                if (eleFields.options.selectedIndex < 0) {
                    return;
                }

                if (FCommon.String.isNullOrEmpty(eleHeader.value, true) == true) {
                    return;
                }

                bResult = OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.createColumn(id.id,
                                                                                    eleFields.options[eleFields.selectedIndex].value,
                                                                                    eleHeader.value,
                                                                                    OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getWidthValue(id.id),
                                                                                    OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getAlignmentValue(id.id),
                                                                                    OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getColumnIdElement(id.id).value);

                if (bResult == false) {
                    return;
                }

                OPTIONCONTROL_CUSTOMIZE.PRIVATE.showScreen(id.id, 0); // Show Customize Screen
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.onSave} " + err.message);
            }
        },

        onClose: function (sId) {
            OPTIONCONTROL_CUSTOMIZE.PRIVATE.showScreen(sId, 0); // Show Customize Screen
        },

        onFieldSelChange: function (id, evt) {
            var sFieldName = "";
            var sId = "";
            var ele = null;

            try {
                if (id.selectedIndex < 0) {
                    return;
                }

                sFieldName = id.options[id.selectedIndex].value;
                sId = OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getIdFromFieldListId(id.id);
                ele = OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getHeaderElement(sId);
                if (FCommon.UI.isValidObject(ele) == true) {
                    ele.value = OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.headerDisplay(sFieldName);
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.onFieldSelChange} " + err.message);
            }
        },

        getIdFromFieldListId: function (sId) {
            var sPopupId = "";

            sPopupId = FCommon.String.left(sId, sId.length - "_customize_popup_standardfields_list".length);

            return (sPopupId);
        },

        getColumnIdElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(sId);
            if (FCommon.UI.isValidObject(ele) == true) {
                ele = document.getElementById(ele.id + "_standardfields_columnid");
            }

            return (ele);
        },

        getFieldsListElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(sId);
            if (FCommon.UI.isValidObject(ele) == true) {
                ele = document.getElementById(ele.id + "_standardfields_list");
            }

            return (ele);
        },

        getHeaderElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(sId);
            if (FCommon.UI.isValidObject(ele) == true) {
                ele = document.getElementById(ele.id + "_standardfields_header");
            }

            return (ele);
        },

        getWidthElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(sId);
            if (FCommon.UI.isValidObject(ele) == true) {
                ele = document.getElementById(ele.id + "_standardfields_width");
            }

            return (ele);
        },

        getAlignmentElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(sId);
            if (FCommon.UI.isValidObject(ele) == true) {
                ele = document.getElementById(ele.id + "_standardfields_alignment");
            }

            return (ele);
        },

        getAlignmentValue: function (sId) {
            var iValue = 0;
            var ele = null;

            try {
                ele = OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getAlignmentElement(sId);
                if (ele.selectedIndex >= 0) {
                    iValue = FConvert.toInt(ele.options[ele.selectedIndex].value);
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getAlignmentValue} " + err.message);
            }

            return (iValue);
        },

        getWidthValue: function (sId) {
            var iValue = 100;
            var ele = null;

            try {
                ele = OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getWidthElement(sId);
                iValue = FConvert.toInt(ele.value);
                if (iValue < 10 || iValue > 500) {
                    iValue = 100;
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getWidthValue} " + err.message);
            }

            return (iValue);
        },

        show: function (sId, sFieldName, sHeader, iWidth, nAlignment, sColumnId) {
            var eleHeading = null;
            var eleBody = null;
            var eleFooter = null;
            var eleButtonContainer = null;
            var ele = null;

            try {
                eleHeading = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getHeadingElement(sId);
                eleBody = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getBodyElement(sId);
                eleFooter = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getFooterElement(sId);

                eleButtonContainer = eleFooter.children[0].children[0];

                eleBody.children[0].style.display = "none"; // Hide Customize
                eleBody.children[1].style.display = ""; // Show Standard Fields
                eleButtonContainer.children[0].style.display = "none"; // Hide Standard Fields Button
                eleButtonContainer.children[1].style.display = "none"; // Hide Delete Column Button

                ele = OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getColumnIdElement(sId);
                ele.value = FConvert.toString(sColumnId);

                ele = OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getFieldsListElement(sId);
                if (FCommon.String.isNullOrEmpty(sFieldName, true) == true) {
                    ele.options.selectedIndex = -1;
                }
                else {
                    ele.value = sFieldName;
                }

                ele = OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getHeaderElement(sId);
                ele.value = FConvert.toString(sHeader);

                ele = OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getWidthElement(sId);
                ele.value = FConvert.toInt(iWidth);
                if (ele.value == 0) {
                    ele.value = 100;
                }

                ele = OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getAlignmentElement(sId);
                ele.value = FConvert.toInt(nAlignment);


                ele = OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.getFieldsListElement(sId);
                if (FCommon.String.isNullOrEmpty(sColumnId, true) == true) { // New
                    ele.disabled = false;
                }
                else { // Edit
                    ele.disabled = true;
                }

                FCommon.UI.setText(eleHeading, "Column Attributes");
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.show} " + err.message);
            }
        },

        headerDisplay: function (sFieldName) {
            var sHeader = "";

            try {
                sHeader = sFieldName;

                if (FCommon.String.startsWith(sFieldName, "sz") == true
                    || FCommon.String.startsWith(sFieldName, "dt") == true
                    || FCommon.String.startsWith(sFieldName, "by") == true) {
                    sHeader = sFieldName.substr(2);
                }
                else if (FCommon.String.startsWith(sFieldName, "bit") == true
                    || FCommon.String.startsWith(sFieldName, "str") == true) {
                    sHeader = sFieldName.substr(3);
                }
                else if (FCommon.String.startsWith(sFieldName, "s") == true
                    || FCommon.String.startsWith(sFieldName, "i") == true
                    || FCommon.String.startsWith(sFieldName, "d") == true
                    || FCommon.String.startsWith(sFieldName, "b") == true
                    || FCommon.String.startsWith(sFieldName, "f") == true) {
                    sHeader = sFieldName.substr(1);
                }
                else if (FCommon.String.startsWith(sFieldName, "pkn_i") == true) {
                    sHeader = sFieldName.substr(5);
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.headerDisplay} " + err.message);
            }

            return (sHeader);
        }
    },

    PRIVATE: {
        bindPopupEvents: function (sId) {
            var elePopup = null;
            elePopup = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(sId);

            $(elePopup).draggable({
                cancel: "#" + OPTIONCONTROL_CUSTOMIZE.PRIVATE.getBodyElement(sId).id + ", #" + OPTIONCONTROL_CUSTOMIZE.PRIVATE.getCloseElement(sId).id // "#id_transactionentry_workflow_popup_body, #id_transactionentry_workflow_popup_close"
            });

            // Occurs when the modal is about to be shown
            $(elePopup).on('show.bs.modal', function () {
            });

            // Occurs when the modal is fully shown (after CSS transitions have completed)
            $(elePopup).on('shown.bs.modal', function () {
                //FCommon.UI.setFocus(OPTIONCONTROL_SEARCH.PRIVATE.getInputElement(sId));
            });

            // Occurs when the modal is about to be hidden
            $(elePopup).on('hide.bs.modal', function () {
            });

            // Occurs when the modal is fully hidden (after CSS transitions have completed)
            $(elePopup).on('hidden.bs.modal', function (event) {
            });
        },

        getPopupElement: function (sId) {
            var ele = null;

            ele = document.getElementById(sId + "_customize_popup");

            return (ele);
        },

        getBodyElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(sId);
            ele = document.getElementById(ele.id + "_body");

            return (ele);
        },

        getFooterElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(sId);
            ele = document.getElementById(ele.id + "_footer");

            return (ele);
        },

        getCloseElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(sId);
            ele = document.getElementById(ele.id + "_close");

            return (ele);
        },

        getHeadingElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(sId);
            ele = document.getElementById(ele.id + "_heading");

            return (ele);
        },

        getSelectedElement: function (sId) {
            var iCounter = 0;
            var eleContainer = null;

            try {
                eleContainer = OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.getDisplayFieldContainerElement(sId);
                if (FCommon.UI.isValidObject(eleContainer) == false) {
                    return (null);
                }

                for (iCounter = 0; iCounter < eleContainer.children.length; iCounter++) {
                    if (FCommon.UI.hasClass(eleContainer.children[iCounter], "theme_background-color-inverse") == true) {
                        return (eleContainer.children[iCounter]);
                    }
                }

            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.PRIVATE.getSelectedElement} " + err.message);
            }

            return (null);
        },

        enableControl: function (id, bEnable) {
            try {
                if (bEnable == true) {
                    id.style.backgroundColor = "";
                }
                else {
                    id.style.backgroundColor = "lightgray";
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.PRIVATE.enableControl} " + err.message);
            }
        },

        callbackShowPopup: function (bSuccess, data, id) {
            var eleContainer = null;
            var elePopup = null;

            try {
                if (bSuccess == false) {
                    return;
                }

                eleContainer = OPTIONCONTROL_INTERNAL.getSearchContainerElement(id);
                if (FCommon.UI.isValidObject(eleContainer) == true) {
                    FCommon.UI.removeChildren(eleContainer);
                    eleContainer.style.display = "";
                    $(eleContainer).html(data);

                    elePopup = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(id.id);
                    $(elePopup).modal("show");

                    OPTIONCONTROL_CUSTOMIZE.PRIVATE.bindPopupEvents(id.id);
                    OPTIONCONTROL_CUSTOMIZE.PRIVATE.enableControl(id, false);
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.PRIVATE.callbackShowPopup} " + err.message);
            }
        },

        unselectAll: function (ele) {
            var iCounter = 0;

            try {
                for (iCounter = 0; iCounter < ele.children.length; iCounter++) {
                    ele.children[iCounter].className = "theme_background-color theme_color";
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.PRIVATE.unselectAll} " + err.message);
            }
        },

        getData: function (sId) {
            var iCounter = 0;
            var arrData = null;
            var elePopup = null;
            var eleContainer = null;
            var eleColumn = null;
            var objColumn = null;

            try {
                obj = {};
                obj.arrOptionControlColumns = [];
                obj.iId = 0;
                obj.iMasterTypeId = 0;
                obj.sTableName = "";
                obj.sDisplayName = "";
                obj.ControlType = 0;

                elePopup = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getPopupElement(sId);
                if (FCommon.UI.isValidObject(elePopup) == true) {
                    obj.iId = FConvert.toInt(elePopup.getAttribute("data-id"));
                    obj.iMasterTypeId = FConvert.toInt(elePopup.getAttribute("data-mastertypeid"));
                    obj.sTableName = FConvert.toString(elePopup.getAttribute("data-tablename"));
                    obj.sDisplayField = FConvert.toString(elePopup.getAttribute("data-displayfield"));
                    obj.ControlType = FConvert.toInt(elePopup.getAttribute("data-controltype"));
                }

                eleContainer = OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.getDisplayFieldContainerElement(sId);
                if (FCommon.UI.isValidObject(eleContainer) == false) {
                    return (obj);
                }

                for (iCounter = 0; iCounter < eleContainer.children.length; iCounter++) {
                    eleColumn = eleContainer.children[iCounter];

                    objColumn = OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.getColumnValue(eleColumn);

                    obj.arrOptionControlColumns.push(objColumn);
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.PRIVATE.getData} " + err.message);
            }

            return (obj);
        },

        getSelectedScreen: function (sId) {
            var eleBody = null;
            var iScreen = 0;

            try {
                eleBody = OPTIONCONTROL_CUSTOMIZE.PRIVATE.getBodyElement(sId);
                if (FCommon.UI.isValidObject(eleBody) == false) {
                    return (0);
                }

                if (eleBody.children[1].style.display == "none") {
                    return (0); // Customize Screen
                }
                else {
                    return (1); // Standard Fields Screen
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_CUSTOMIZE.PRIVATE.getSelectedScreen} " + err.message);
            }

            return (0);
        },

        showScreen: function (sId, iScreen) {
            switch (iScreen) {
                case 0: // Customize Screen
                    OPTIONCONTROL_CUSTOMIZE.CUSTOMIZE_SCREEN.show(sId);
                    break;
                case 1: // Standard Fields Screen
                    OPTIONCONTROL_CUSTOMIZE.STANDARDFIELDS_SCREEN.show(sId, "", "");
                    break;
            }
        }
    }
};

var OPTIONCONTROL_SEARCH = {
    processSearch: function (id, sInputText, evt) {
        var sURL = "";
        var eleContainer = null;
        var objInput = null;
        var result = null;

        try {
            if (OPTIONCONTROL.getControlType(id) != eWebOptionControlType.Masters) {
                return;
            }

            sURL = OPTIONCONTROL.getSearchUIURL(id);
            if (FCommon.String.isNullOrEmpty(sURL, true) == true) {
                //sURL = OPTIONCONTROL_INTERNAL.getContextPath("GetOptionControlSearch", "TransHome", "Transactions");
                return;
            }

            objInput = {};
            objInput.sId = id.id;
            objInput.sInputText = sInputText;
            objInput.bMultipleSelectSearch = OPTIONCONTROL.isMultipleSelectSearch(id);

            NETWORK.executeServerMethod(sURL,
                                        false,
                                        objInput,
                                        "html",
                                        true,
                                        "OPTIONCONTROL_SEARCH.PRIVATE.callbackShowPopup",
                                        "GLOBAL.LoadingStart",
                                        "GLOBAL.LoadingEnd",
                                        id);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_SEARCH.processSearch} " + err.message);
        }
    },

    onSearch_Click: function (id, evt) {
        var sURL = "";
        var value = null;
        var parameter = "";
        var eleInput = null;
        var result = null;
        var obj = null;

        try {
            eleInput = OPTIONCONTROL_SEARCH.PRIVATE.getInputElement(id.id);
            if (FCommon.UI.isValidObject(eleInput) == false) {
                return;
            }

            if (FCommon.String.isNullOrEmpty(eleInput.value) == true) {
                return;
            }


            sURL = OPTIONCONTROL.getSearchUIURL(id);
            if (FCommon.String.isNullOrEmpty(sURL, true) == true) {
                return;
            }

            obj = {};
            obj.optParam = {};
            obj.bSearchAllFields = false;


            obj.optParam.iMasterTypeId = FCommon.UI.getAttributeData(id, "mastertypeid");

            obj.optParam.iGroupType = FCommon.UI.getAttributeData(id, "grouptype");

            obj.optParam.sFilter = FCommon.UI.getAttributeData(id, "filter");;

            obj.optParam.sSearchKey = eleInput.value;
            obj.optParam.iExistingDataCount = 0;

            obj.optParam.sMandatoryFields = OPTIONCONTROL.getMandatoryFields(id);

            value = FConvert.toInt(FCommon.UI.getAttributeData(id, "i_UnitId"));
            if (value > 0) {
                obj.optParam.iUnitId = value;
            }

            value = FConvert.toInt(FCommon.UI.getAttributeData(id, "i_ItemId"));
            if (value > 0) {
                obj.optParam.iItemId = value;
            }

            value = OPTIONCONTROL.getGroupId(id);
            if (value > 0) {
                obj.optParam.iGroupId = value;
            }

            obj.optParam.bLoadAll = false;

            obj.optParam.bUseRestriction = FCommon.UI.getAttributeData(id, "userrestriction");

            obj.optParam.iSearchBy = -1;

            obj.bSearchAllFields = OPTIONCONTROL_SEARCH.PRIVATE.getAllFieldElement(id.id).checked;
            obj.sId = id.id + "_search_popup";
            obj.bMultipleSelectSearch = OPTIONCONTROL.isMultipleSelectSearch(id);

            result = NETWORK.executeServerMethod(sURL + "Data",
                                                true,
                                                obj,
                                                "html",
                                                true,
                                                "OPTIONCONTROL_SEARCH.PRIVATE.callbackOptionControlSearchData",
                                                "GLOBAL.LoadingStart",
                                                "GLOBAL.LoadingEnd",
                                                id);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_SEARCH.onSearch_Click} " + err.message)
        }
    },

    onOK_Click: function (id, evt) {
        var sCallback = "";
        var iTotalRows = 0;
        var iRow = 0;
        var iMasterId = 0;
        var bMultipleSelectSearch = false;
        var arrSelectedMasterId = null;
        var eleGrid = null;
        var cell = null;

        try {
            eleGrid = OPTIONCONTROL_SEARCH.PRIVATE.getDataGrid(id.id);
            if (FCommon.UI.isValidObject(eleGrid) == false) {
                return;
            }

            bMultipleSelectSearch = OPTIONCONTROL.isMultipleSelectSearch(id);

            arrSelectedMasterId = [];
            iTotalRows = FGRIDCONTROL.getTotalRows(eleGrid);
            for (iRow = 1; iRow <= iTotalRows; iRow++) {
                cell = FGRIDCONTROL.getCellObject(eleGrid, iRow, 1);
                if (cell.cell.children[0].checked == true) {
                    cell = FGRIDCONTROL.getCellObject(eleGrid, iRow, 2);
                    iMasterId = FConvert.toInt(cell.getCellData());
                    arrSelectedMasterId.push(iMasterId);

                    if (bMultipleSelectSearch == false) {
                        break;
                    }
                }
            }

            if (arrSelectedMasterId.length > 0) {
                OPTIONCONTROL.setControlValue(id, arrSelectedMasterId[0]);
                OPTIONCONTROL_SEARCH.onClose_Click(id, evt);

                arrSelectedMasterId.splice(0, 1); // Remove first id it is already processed above
                if (arrSelectedMasterId.length > 0) {
                    sCallback = OPTIONCONTROL.getOnMultipleSelectedSearchCallback(id);
                    if (FCommon.String.isNullOrEmpty(sCallback, true) == false) {
                        eval(sCallback)(id, arrSelectedMasterId, evt);
                    }
                }
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_SEARCH.onOK_Click} " + err.message)
        }
    },

    onClose_Click: function (id, evt) {
        var eleContainer = null;
        var elePopup = null;

        try {
            elePopup = OPTIONCONTROL_SEARCH.PRIVATE.getPopupElement(id.id);
            if (FCommon.UI.isValidObject(elePopup) == true) {
                $(elePopup).modal("hide");
            }

            elePopup = OPTIONCONTROL_SEARCH.PRIVATE.getPopupElement(id.id);
            if (FCommon.UI.isValidObject(elePopup) == true) {
                elePopup.parentElement.removeChild(elePopup);
            }

            eleContainer = OPTIONCONTROL_INTERNAL.getSearchContainerElement(id);
            if (FCommon.UI.isValidObject(eleContainer) == true) {
                FCommon.UI.removeChildren(eleContainer);
            }

            OPTIONCONTROL_SEARCH.PRIVATE.enableControl(id, true);
            FCommon.UI.setFocus(id);
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_SEARCH.onClose_Click} " + err.message);
        }
    },

    onSearch_Keydown: function (id, evt) {
        try {
            if (evt.keyCode == eKeyCode.Tab && evt.shiftKey == true) {
                FCommon.UI.stopKeyProcess(evt);
            }

            if (evt.keyCode == eKeyCode.CR) {
                FCommon.UI.stopKeyProcess(evt);
                OPTIONCONTROL_SEARCH.onSearch_Click(id, evt);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_SEARCH.onSearch_Keydown} " + err.message);
        }
    },

    onClose_Keydown: function (id, evt) {
        try {
            if (evt.keyCode == eKeyCode.Tab && evt.shiftKey == false) {
                FCommon.UI.stopKeyProcess(evt);
            }
        }
        catch (err) {
            alert("Exception: {OPTIONCONTROL_SEARCH.onClose_Keydown} " + err.message);
        }
    },

    PRIVATE: {
        bindPopupEvents: function (sId) {
            var elePopup = null;
            elePopup = OPTIONCONTROL_SEARCH.PRIVATE.getPopupElement(sId);

            $(elePopup).draggable({
                cancel: "#" + OPTIONCONTROL_SEARCH.PRIVATE.getBodyElement(sId).id + ", #" + OPTIONCONTROL_SEARCH.PRIVATE.getCloseElement(sId).id // "#id_transactionentry_workflow_popup_body, #id_transactionentry_workflow_popup_close"
            });

            // Occurs when the modal is about to be shown
            $(elePopup).on('show.bs.modal', function () {
            });

            // Occurs when the modal is fully shown (after CSS transitions have completed)
            $(elePopup).on('shown.bs.modal', function () {
                FCommon.UI.setFocus(OPTIONCONTROL_SEARCH.PRIVATE.getInputElement(sId));
            });

            // Occurs when the modal is about to be hidden
            $(elePopup).on('hide.bs.modal', function () {
            });

            // Occurs when the modal is fully hidden (after CSS transitions have completed)
            $(elePopup).on('hidden.bs.modal', function (event) {
            });
        },

        getPopupElement: function (sId) {
            var ele = null;

            ele = document.getElementById(sId + "_search_popup");

            return (ele);
        },

        getInputElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_SEARCH.PRIVATE.getPopupElement(sId);
            ele = document.getElementById(ele.id + "_input");

            return (ele);
        },

        getAllFieldElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_SEARCH.PRIVATE.getPopupElement(sId);
            ele = document.getElementById(ele.id + "_checkbox");

            return (ele);
        },

        getDataContainerElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_SEARCH.PRIVATE.getPopupElement(sId);
            ele = document.getElementById(ele.id + "_datacontainer");

            return (ele);
        },

        getDataGrid: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_SEARCH.PRIVATE.getPopupElement(sId);
            ele = document.getElementById(ele.id + "_grid");

            return (ele);
        },

        getBodyElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_SEARCH.PRIVATE.getPopupElement(sId);
            ele = document.getElementById(ele.id + "_body");

            return (ele);
        },

        getCloseElement: function (sId) {
            var ele = null;

            ele = OPTIONCONTROL_SEARCH.PRIVATE.getPopupElement(sId);
            ele = document.getElementById(ele.id + "_close");

            return (ele);
        },

        enableControl: function (id, bEnable) {
            try {
                if (bEnable == true) {
                    id.style.backgroundColor = "";
                }
                else {
                    id.style.backgroundColor = "lightgray";
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_SEARCH.PRIVATE.enableControl} " + err.message);
            }
        },

        callbackShowPopup: function (bSuccess, data, id) {
            var eleContainer = null;
            var elePopup = null;

            try {
                if (bSuccess == false) {
                    return;
                }

                eleContainer = OPTIONCONTROL_INTERNAL.getSearchContainerElement(id);
                if (FCommon.UI.isValidObject(eleContainer) == true) {
                    FCommon.UI.removeChildren(eleContainer);
                    eleContainer.style.display = "";
                    $(eleContainer).html(data);

                    elePopup = OPTIONCONTROL_SEARCH.PRIVATE.getPopupElement(id.id);
                    $(elePopup).modal("show");

                    OPTIONCONTROL_SEARCH.PRIVATE.bindPopupEvents(id.id);
                    OPTIONCONTROL_SEARCH.PRIVATE.enableControl(id, false);
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_SEARCH.PRIVATE.callbackShowPopup} " + err.message);
            }
        },

        callbackOptionControlSearchData: function (bSuccess, data, id) {
            var eleContainer = null;

            try {
                if (bSuccess == false) {
                    return;
                }

                eleContainer = OPTIONCONTROL_SEARCH.PRIVATE.getDataContainerElement(id.id);
                if (FCommon.UI.isValidObject(eleContainer) == true) {
                    FCommon.UI.removeChildren(eleContainer);
                    $(eleContainer).html(data);
                }
            }
            catch (err) {
                alert("Exception: {OPTIONCONTROL_SEARCH.PRIVATE.callbackOptionControlSearchData} " + err.message);
            }
        }
    }
};
