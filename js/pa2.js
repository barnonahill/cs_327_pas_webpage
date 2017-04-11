var tabs = $("div#pa2-tabs").find("li");
var tabPanels = $("div#pa2-tab-panels").find("div");

var $clearButtonPa2 = $("<button>", {
    html: "Clear Results",
    "id": "pa2-clear-results",
    "class": "btn btn-success btn-large"
});
var $outputDivPa2 = $("<div>", {
    "id": "pa2-output",
    "class": "output"
});
var $outputTable = $("<table>", {
    "id": "pa2-output-table",
    "class": "output-table"
});
var $shiftField = $('<span class="shift-field"><p>Shift Value: <input type="number" name="shift"></p></span>');

var pa2Ready = true;
var validShift = true;
var lines = null;
var textToFileInput = false;

const E_START_CODE = 97; // "a" char code
const E_END_CODE = 122; // "z" char code
const D_START_CODE = 65; // "A" char code
const D_END_CODE = 90; // "Z" char code

const E_INPUT_RANGE = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
    "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
];
const D_INPUT_RANGE = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
    "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

const INPUT_RANGE_SIZE = E_INPUT_RANGE.length;

// Checks when encrypt radio button is clicked
$(document).on("click", "input[value=encrypt]", function() {
    $("#input-msg-p").html("Message to Encrypt:");
    $("#file-tab-panel h3").html("File to Encrypt:");
    $("button#pa2-submit").html("Encrypt Message");
});

// Checks when decrypt radio button is clicked
$(document).on("click", "input[value=decrypt]", function() {
    $("#input-msg-p").html("Message to Decrypt:");
    $("#file-tab-panel h3").html("File to Decrypt:");
    $("button#pa2-submit").html("Decrypt Message");
});

// Shows the text tab and hides others
$(document).on("click", "li#text-tab", function() {
    if ($("div#text-tab").hasClass("active")) {
        return;
    }
    for (var i = 0; i < tabs.length; i++) {
        if ($(tabs[i]).is("#text-tab")) {
            $(tabs[i]).addClass("active");
            $(tabs[i]).removeClass("unactive");
            $(tabPanels[i]).addClass("active");
            $(tabPanels[i]).removeClass("hiddenPanel");
        } else {
            $(tabs[i]).addClass("unactive");
            $(tabs[i]).removeClass("active");
            $(tabPanels[i]).addClass("hiddenPanel");
            $(tabPanels[i]).removeClass("active");
        }
    }
});

// Shows the file tab and hides others
$(document).on("click", "li#file-tab", function() {
    if ($("div#file-tab").hasClass("active")) {
        return;
    }
    for (var i = 0; i < tabs.length; i++) {
        if ($(tabs[i]).is("#file-tab")) {
            $(tabs[i]).addClass("active");
            $(tabs[i]).removeClass("unactive");
            $(tabPanels[i]).addClass("active");
            $(tabPanels[i]).removeClass("hiddenPanel");
        } else {
            $(tabs[i]).addClass("unactive");
            $(tabs[i]).removeClass("active");
            $(tabPanels[i]).addClass("hiddenPanel");
            $(tabPanels[i]).removeClass("active");
        }
    }
});

// Clears the pa2 output when the clear results button is clicked
$(document).on("click", "button#pa2-clear-results", function() {
    $($outputTable).empty();
    $($outputDivPa2).empty();
    $($outputDivPa2).remove();
    $("#file-tab-panel span.shift-field").remove();
    console.log("Results cleared for pa2!");
    pa2Ready = true;
});

// Loads file input asynchronously when a file is selected to save time.
$("#file-input").on("change", function(event) {
    var file = document.getElementById("file-input").files[0];
    var textType = /text.*/; // regex for text file

    if (file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = function(event) {
            lines = reader.result.split(/\r?\n|\r/);
            console.log(lines);
        }
        reader.readAsText(file);
    } else {
        lines = null;
    }
});

// Resets validShift if file input is selected
$("#file-tab").on("click", function() {
    validShift = true;
    textToFileInput = true;
    console.log("file tab clicked, validShift reset to true.");
});

// Appends a clear results button for pa2
function appendClearButtonPa2() {
    $($outputDivPa2).append($clearButtonPa2);
}

// Gets input and shift from the input-msg field and shift field.
function getTextInput() {
    var input = $("#input-msg").val();
    var shift = $("#text-panel-shift").val();
    return [input, shift];
}

// Checks that shift if a integer within [-26,26] and returns T/F.
function validateShift(shift) {
    var validInput = true;
    // Check shift is not an integer
    parsedShift = parseInt(shift);
    if (Math.floor(shift) !== parsedShift) {
        console.log("Shift " + shift + " is not an integer!")
        validInput = false;
    }
    shift = parsedShift;

    // Check shift is outside interval [-26, 26]
    if (shift < INPUT_RANGE_SIZE * -1 || shift > INPUT_RANGE_SIZE) {
        console.log("Shift " + shift + " is outside the interval [-26,26]!");
        validInput = false;
    }
    return [validInput, shift];
}

// Validates the lowercase input to ensure all values are a-z or spaces.
function validateEncryptInput(input) {
    // Validate input text
    var badInputMsgs = [];
    var validInput = true;

    for (var i = 0; i < input.length; i++) {
        var char = input.charAt(i);
        var iRangeIndex = char.charCodeAt(0) - E_START_CODE;
        if (char === " " || char === "") {
            continue;
        } else if (char !== E_INPUT_RANGE[iRangeIndex]) {
            // invalid input character
            validInput = false;
            badInputMsgs.push(["Bad input at pos " + i + ": ", char]);
        }
    }
    if (validInput) {
        console.log("Valid Input!");
    } else {
        console.log("Invalid Input!")
        for (var i = 0; i < badInputMsgs.length; i++) {
            console.log(badInputMsgs[i]);
        }
        printBadPosTable(badInputMsgs);
    }
    return validInput;
}

// Creates a numerical cipher range for encyrption using the shift.
function encryptCipherRangeArray(shift) {
    var cipherRangeArr = [];
    for (var i = 0; i < INPUT_RANGE_SIZE; i++) {
        var cipherVal = (i + shift) % INPUT_RANGE_SIZE;
        // Makes the cipher work for negative shifts.
        if (cipherVal < 0) {
            cipherVal = INPUT_RANGE_SIZE + cipherVal;
        }
        cipherRangeArr.push(cipherVal);
    }
    console.log("cipherRangeArr: ");
    console.log(cipherRangeArr);
    return cipherRangeArr;
}

// Converts the input to numerical cipher using the cipherRange.
function encryptCipherTextArray(input, cipherRange) {
    var cipherTextArr = [];
    for (var i = 0; i < input.length; i++) {
        var char = input.charAt(i);
        var iRangeIndex = char.charCodeAt(0) - E_START_CODE;
        if (char === " ") {
            continue;
        }
        cipherTextArr.push(cipherRange[iRangeIndex]);
    }
    console.log("cipherTextArr: ");
    console.log(cipherTextArr);
    return cipherTextArr;
}

// Uses the input and the cipherRange to create an encrypted message.
function encryptInput(input, cipherRangerArr) {
    // get cipher text
    var cipherTextArr = encryptCipherTextArray(input, cipherRangerArr);
    // encrypt cipher text
    var encryptedMsg = '';
    for (var i = 0; i < cipherTextArr.length; i++) {
        encryptedMsg += E_INPUT_RANGE[cipherTextArr[i]];
    }
    var encryptedMsg = encryptedMsg.toUpperCase();
    console.log(encryptedMsg);
    // return encrypted message
    return encryptedMsg;
}

// The encrypt function of pa2 is performed within this method.
function encryptMode(input, shift, validInput) {
    /* Encrypt mode start */
    var validInput = validateEncryptInput(input);
    if (!validInput) {
        appendClearButtonPa2();
        return;
    }

    // Encrypt text
    var encryptedMsg = encryptInput(input, encryptCipherRangeArray(shift));

    printEncryptOutputTable(input, encryptedMsg);
    /* Encrypt mode end */
    appendClearButtonPa2();
}

function validateDecryptInput(input) {
    // Validate input text
    var badInputMsgs = [];
    var validInput = true;

    for (var i = 0; i < input.length; i++) {
        var char = input.charAt(i);
        var iRangeIndex = char.charCodeAt(0) - D_START_CODE;
        if (char === "") {
            continue;
        }
        if (char !== D_INPUT_RANGE[iRangeIndex]) {
            // invalid input character
            validInput = false;
            if (char !== " ") {
                badInputMsgs.push(["Bad input at pos " + i + ": ", char]);
            } else {
                badInputMsgs.push(["Bad input at pos " + i + ": ", "[space]"]);
            }
        }
    }
    if (validInput) {
        console.log("Valid Input!");
    } else {
        console.log("Invalid Input!")
        for (var i = 0; i < badInputMsgs.length; i++) {
            console.log(badInputMsgs[i]);
        }
        printBadPosTable(badInputMsgs);
    }
    return validInput;
}

// Creates a numerical cipher range for encyrption using the shift.
function decryptCipherRangeArray(shift) {
    var cipherRangeArrArr = [];
    for (var i = 0; i < INPUT_RANGE_SIZE; i++) {
        var cipherVal = (i - shift) % INPUT_RANGE_SIZE;
        // Makes the cipher work for negative shifts.
        if (cipherVal < 0) {
            cipherVal = INPUT_RANGE_SIZE + cipherVal;
        }
        cipherRangeArrArr.push(cipherVal);
    }
    console.log("cipherRangeArrArr: ");
    console.log(cipherRangeArrArr);
    return cipherRangeArrArr;
}

// Converts the input to numerical cipher using the cipherRange.
function decryptCipherTextArray(input, cipherRangeArr) {
    var cipherTextArr = [];
    for (var i = 0; i < input.length; i++) {
        var char = input.charAt(i);
        var iRangeIndex = char.charCodeAt(0) - D_START_CODE;
        cipherTextArr.push(cipherRangeArr[iRangeIndex]);
    }
    console.log("cipherTextArr: ");
    console.log(cipherTextArr);
    return cipherTextArr;
}

function decryptInput(input, cipherRange) {
    var cipherTextArr = decryptCipherTextArray(input, cipherRange);
    // encrypt cipher text
    var decryptedMsg = '';
    for (var i = 0; i < cipherTextArr.length; i++) {
        decryptedMsg += D_INPUT_RANGE[cipherTextArr[i]];
    }
    console.log(decryptedMsg);
    // return encrypted message
    return decryptedMsg;
}

// The decrypt function of pa2 is performed within this method
function decryptMode(input, shift, validInput) {
    // Validate input text
    var validInput = validateDecryptInput(input);
    if (!validInput) {
        appendClearButtonPa2();
        return;
    }

    // Decrypt text
    var decryptedMsg = decryptInput(input, decryptCipherRangeArray(shift));
    // Print plain text
    printDecryptOutputTable(input, decryptedMsg);
    appendClearButtonPa2();

    /* Decrypt mode end */
}

function printBadPosTable(badInputMsgs) {
    $($outputDivPa2).append($outputTable);
    for (var i = 0; i < badInputMsgs.length; i++) {
        $outputTable.append($("<tr>", {
            "class": "output-table-row"
        }));
        $outputTable.children("tr").eq(i).append($("<td>", {
            html: "<p>" + badInputMsgs[i][0] + "</p>",
            "class": "bg-danger"
        }));
        $outputTable.children("tr").eq(i).append($("<td>", {
            html: "<p>" + badInputMsgs[i][1] + "</p>",
            "class": "bg-danger"
        }));
    }
}

function printTwoRowTableShell() {
    $($outputDivPa2).append($outputTable);
    for (var i = 0; i < 2; i++) {
        $($outputTable).append($("<tr>", {
            class: "output-table-row"
        }));
    }
}

function printEncryptOutputTable(input, encryptedMsg) {
    printTwoRowTableShell();
    $outputTable.children("tr").eq(0).append($("<td>", {
        html: "<p>The plain text message is: </p>",
        "class": "bg-success"
    }));
    $outputTable.children("tr").eq(0).append($("<td>", {
        html: "<p>" + input.toUpperCase() + "</p>",
        "class": "bg-success"
    }));
    $outputTable.children("tr").eq(1).append($("<td>", {
        html: "<p>The encrypted message is: </p>",
        "class": "bg-success"
    }));
    $outputTable.children("tr").eq(1).append($("<td>", {
        html: "<p>" + encryptedMsg + "</p>",
        "class": "bg-success"
    }));
}

function printDecryptOutputTable(input, decryptedMsg) {
    printTwoRowTableShell();
    $outputTable.children("tr").eq(0).append($("<td>", {
        html: "<p>The encrypted message is: </p>",
        "class": "bg-success"
    }));
    $outputTable.children("tr").eq(0).append($("<td>", {
        html: "<p>" + input.toUpperCase() + "</p>",
        "class": "bg-success"
    }));
    $outputTable.children("tr").eq(1).append($("<td>", {
        html: "<p>The decrypted message is: </p>",
        "class": "bg-success"
    }));
    $outputTable.children("tr").eq(1).append($("<td>", {
        html: "<p>" + decryptedMsg + "</p>",
        "class": "bg-success"
    }));
}

function printBadFileInputTable() {
    $($outputDivPa2).append($("<p>", {
        html: "The file input provided isn't properly formatted! " +
            "It should be formatted with two lines as follows:",
        "class": "bg-danger"
    }));
    $($outputDivPa2).append($outputTable);
    printTwoRowTableShell();
    $outputTable.children("tr").eq(0).append($("<td>", {
        html: "message: ",
        "class": "bg-danger"
    }));
    $outputTable.children("tr").eq(0).append($("<td>", {
        html: "A string of English letters which may include a blank " +
            "if encrypting, and no blanks if decrypting.",
        "class": "bg-danger"
    }));
    $outputTable.children("tr").eq(1).append($("<td>", {
        html: "Shift value: ",
        "class": "bg-danger"
    }));
    $outputTable.children("tr").eq(1).append($("<td>", {
        html: "A positive or negative integer within the interval " +
            "[-26,26]. The sign in front is optional for positives.",
        "class": "bg-danger"
    }));
}

// Runs the cipher when submit is clicked
$(document).on("click", "#pa2-submit", function() {
    if (!validShift || textToFileInput) {
        $($outputTable).empty();
        $($outputDivPa2).empty();
        $($outputDivPa2).remove();
        console.log("Results cleared for pa2!");
        pa2Ready = true;
        textToFileInput = false;
    }
    if (pa2Ready) {
        pa2Ready = false;
        var input, shift;

        $("#pa2 div.container").append($outputDivPa2);
        $($outputDivPa2).append("<h3>Results:</h3>");

        // File input
        if ($("#file-tab").hasClass("active")) {
            if (lines === null) {
                // bad file input
                printBadFileInputTable();
                appendClearButtonPa2();
                return;
            }
            input = lines[0];
            if (validShift) {
                shift = lines[1];
            } else {
                shift = $("#file-tab-panel p input[name=shift]").val();
            }
        } else {
            // Else text input, get values from it
            [input, shift] = getTextInput();
        }
        var validInput = true;
        if (input === "") {
          $("#pa2-output").append($("<p>", {
            html: "No message was provided!",
            "class": "bg-danger"
          }));
          validInput = false;
        }
        if (shift === "") {
          $("#pa2-output").append($("<p>", {
            html: "No shift was provided!",
            "class": "bg-danger"
          }));
          validInput = false;
        }
        if (!validInput) {
          appendClearButtonPa2();
          return;
        }
        /* Validate shift value */

        [validInput, shift] = validateShift(shift);
        if (!validInput) {
            $($outputDivPa2).append($("<p>", {
                html: "Shift value " + shift + " is outside the interval [-26,26]!",
                class: "bg-danger"
            }));
            $($outputDivPa2).append($("<p>", {
                html: "Please provide a shift value within [26, 26] and re-submit.",
                "class": "bg-danger"
            }));
            validShift = false;
        } else {
            validShift = true;
        }

        if ($("#pa2-encrypt").is(":checked")) {
            if (!validShift) {
              if ($("#file-tab").hasClass("active")) {
                  $("#file-tab-panel").append($shiftField);
              }
            return;
            }
            encryptMode(input.toLowerCase(), shift, validInput);
        } else {
            if (!validShift && $("#file-tab").hasClass("active")) {
                $("#file-tab-panel").append($shiftField);
                return;
            }
            decryptMode(input.toUpperCase(), shift, validInput);
        }
    }
});
