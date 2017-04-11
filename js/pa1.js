var pa1Ready = true;
var digits = [];
var divHash = {};
var sumDigits;
var input;

var $clearButtonPa1 = $("<button>", {
    html: "Clear Results",
    "id": "pa1-clear-results",
    "class": "btn btn-large btn-success"
});
var $outputDivPa1 = $("<div>", {
    "id": "pa1-output",
    "class": "output"
});

// Submit the input
$(document).on("click", "button#pa1-submit", function() {
    if (pa1Ready) {
        pa1Ready = false;
        input = $("input.pa1-input").val();
        console.log("Check divisibility button clicked!");
        console.log("Input: " + input);

        $("#pa1 div.container").append($outputDivPa1);
        $("#pa1-output").append("<h3>Results:</h3>");

        var validInput = true;

        // Check if input was given
        if (input === "") {
            $("#pa1-output").append($("<p>", {
                html: "No number was provided!",
                "class": "bg-danger"
            }));
            validInput = false;
        }
        // Check if number is an integer
        if (!(input == Math.floor(input))) {
            console.log(input + " isn't an integer.")
            $("#pa1-output").append($("<p>", {
                html: "The number provided must be an integer!",
                "class": "bg-danger"
            }));
            validInput = false;
        }
        // Check if integer is positive
        if (input <= 0) {
            console.log(input + " isn't positive.")
            $("#pa1-output").append($("<p>", {
                html: "The number provided must be positive!",
                "class": "bg-danger"
            }));
            validInput = false;
        }

        // Truncate input if larger than 7 digits
        if (input.length > 7) {
          var oldInput = input;
          input = input.substring(0, 7);
          $("#pa1-output").append($("<p>", {
            html: "The number " + oldInput + " exceeds 7 digits and was truncated to 7 digits.",
            "class": "bg-warning"
          }));
        }

        if (!validInput) {
            appendClearButtonPa1();
            return;
        }

        digits = numToDigits(input);
        sumDigits = 0;
        for (var i = 0; i < digits.length; i++) {
            sumDigits += digits[i];
        }

        // Check divisibility
        divHash["two"] = divByTwo();
        divHash["three"] = divByThree();
        divHash["four"] = divByFour();
        divHash["five"] = divByFive();
        divHash["six"] = divBySix();
        divHash["eight"] = divByEight();
        divHash["nine"] = divByNine();

        appendClearButtonPa1();
    }
});

// Clear the output
$(document).on("click", "button#pa1-clear-results", function() {
    $("#pa1-output").empty();
    $("#pa1-output").remove();
    console.log("Results cleared!");
    pa1Ready = true;
});

// Appends the clear button to the bottom of the output div.
function appendClearButtonPa1() {
    $("#pa1-output").append($clearButtonPa1);
}

function numToDigits(input) {
    var inputStr = input.toString();
    var digits = [];
    for (var i = 0; i < inputStr.length; i++) {
        digits.push(parseInt(inputStr.charAt(i)));
    }
    return digits;
}

// A number IS divisible by 2 when it ends in 0 or an even number.
function divByTwo() {
    var lastDigit = digits[digits.length - 1];
    if (lastDigit === 0) {
        $("#pa1-output").append($("<p>", {
            html: "The last digit of " + input + " is 0, so " + input + " <strong><em>IS</em> <u>divisible by 2.</u></strong>",
            "class": "bg-success"
        }));
        return true;
    } else if (lastDigit % 2 === 0) {
        $("#pa1-output").append($("<p>", {
            html: "The last digit of " + input + " is " + lastDigit + ", which IS divisible by 2, therefore " + input + " <strong><em>IS</em> <u>divisible by 2.</u></strong>",
            "class": "bg-success"
        }));
        return true;
    } else {
        $("#pa1-output").append($("<p>", {
            html: "The last digit of " + input + " is " + lastDigit + ", which isn't divisible by 2, therefore " + input + " <strong>is <em>NOT</em> <u>divisible by 2.</u></strong>",
            "class": "bg-danger"
        }));
        return false;
    }
}

function divByThree() {
    if (sumDigits % 3 === 0) {
        $("#pa1-output").append($("<p>", {
            html: "The sum of the digits of " + input + " is " + sumDigits + ", which is divisble by 3, therefore, " + input + " <strong><em>IS</em> <u>divisible by 3.</u></strong>",
            "class": "bg-success"
        }));
        return true;
    } else {
        $("#pa1-output").append($("<p>", {
            html: "The sum of the digits of " + input + " is " + sumDigits + ", which is not divisble by 3, therefore, " + input + " <strong>is <em>NOT</em> <u>divisible by 3.</u></strong>",
            "class": "bg-danger"
        }));
        return false;
    }
}

function divByFour() {
    var lastTwoDigits = input.substring(input.length - 2);
    if (lastTwoDigits == 0) {
        $("#pa1-output").append($("<p>", {
            html: "The last two digits of " + input + " are 00, therefore " + input + " <strong><em>IS</em> <u>divisble by 4.</u></strong>",
            "class": "bg-success"
        }));
        return true;
    } else if (parseInt(lastTwoDigits) % 4 === 0) {
        if (lastTwoDigits.length < 2) {
            $("#pa1-output").append($("<p>", {
                html: "The number " + input + " is only one digit which <strong><em>IS</em> <u>divisible by 4.</u></strong>",
                "class": "bg-success"
            }));
        } else {
            $("#pa1-output").append($("<p>", {
                html: "The last two digits of " + input + " are " + lastTwoDigits + ", which are divisible by 4, therefore " + input + " <strong><em>IS</em> <u>divisible by 4.</u></strong>",
                "class": "bg-success"
            }));
        }
        return true;
    } else {
        if (lastTwoDigits.length < 2) {
          $("#pa1-output").append($("<p>", {
              html: "The number " + input + " is only one digit which <strong>is <em>NOT</em> <u>divisible by 4.</u></strong>",
              "class": "bg-danger"
          }));
        } else {
            $("#pa1-output").append($("<p>", {
                html: "The last two digits of " + input + " are " + lastTwoDigits + ", which are not divisible by 4, therefore " + input + " <strong>is <em>NOT</em> <u>divisible by 4.</u></strong>",
                "class": "bg-danger"
            }));
        }
        return false;
    }
}

function divByFive() {
    var lastDigit = digits[digits.length - 1];
    if (lastDigit === 0) {
        $("#pa1-output").append($("<p>", {
            html: "The last digit of " + input + " is 0, therefore " + input + " <strong><em>IS</em> <u>divisible by 5.</u></strong>",
            "class": "bg-success"
        }));
        return true;
    } else if (lastDigit === 5) {
        $("#pa1-output").append($("<p>", {
            html: "The last digit of " + input + " is " + lastDigit + ", therefore " + input + " <strong><em>IS</em> <u>divisible by 5.</u></strong>",
            "class": "bg-success"
        }));
        return true;
    } else {
        $("#pa1-output").append($("<p>", {
            html: "The last digit of " + input + " is " + lastDigit + ", therefore " + input + " <strong>is <em>NOT</em> <u>divisible by 5.</u></strong>",
            "class": "bg-danger"
        }));
        return false;
    }
}

function divBySix() {
    if (divHash.two && divHash.three) {
        $("#pa1-output").append($("<p>", {
            html: "The number " + input + " is divisible by both 2 and 3, therefore " + input + " <strong><em>IS</em> <u>divisible by 6.</u></strong>",
            "class": "bg-success"
        }));
        return true;
    } else {
        $("#pa1-output").append($("<p>", {
            html: "The number " + input + " is not divisible by both 2 and 3, therefore " + input + " <strong>is <em>NOT</em> <u>divisible by 6.</u></strong>",
            "class": "bg-success"
        }));
        return false;
    }
}

function divByEight() {
    var lastThreeDigits = input.substring(input.length - 3);
    if (lastThreeDigits == 0) {
        $("#pa1-output").append($("<p>", {
            html: "The last three digits of " + input + " are " + lastThreeDigits + ", therefore " + input + " <strong><em>IS</em> <u>divisible by 8.</u></strong>",
            "class": "bg-success"
        }));
        return true;
    } else if (parseInt(lastThreeDigits) % 8 === 0) {
        $("#pa1-output").append($("<p>", {
            html: "The last three digits of " + input + " are " + lastThreeDigits + ", which are divisible by 8, therefore " + input + " <strong><em>IS</em> <u>divisible by 8.</u></strong>",
            "class": "bg-success"
        }));
        return true;
    } else {
        $("#pa1-output").append($("<p>", {
            html: "The last three digits of " + input + " are " + lastThreeDigits + ", which are not divisible by 8, therefore " + input + " <strong>is <em>NOT</em> <u>divisible by 8.</u></strong>",
            "class": "bg-danger"
        }));
        return false;
    }
}

function divByNine() {
    if (sumDigits % 9 === 0) {
        $("#pa1-output").append($("<p>", {
            html: "The sum of the digits of " + input + " is " + sumDigits + ", which is divisble by 9, therefore, " + input + " <strong><em>IS</em> <u>divisible by 9.</u></strong>",
            "class": "bg-success"
        }));
        return true;
    } else {
        $("#pa1-output").append($("<p>", {
            html: "The sum of the digits of " + input + " is " + sumDigits + ", which is not divisble by 9, therefore, " + input + " <strong>is <em>NOT</em> <u>divisible by 9.</u></strong>",
            "class": "bg-danger"
        }));
        return false;
    }
}
