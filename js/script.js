// Sample data to compare fetched values with
const datas = [
    {
        "name": "salt",
        "amount": 40
    },
    {
        "name": "rice",
        "amount": 30
    },
    {
        "name": "sugar",
        "amount": 15
    },
    {
        "name": "turmeric powder",
        "amount": 10
    },
    {
        "name": "urad dal",
        "amount": 27
    },
    {
        "name": "moong dal",
        "amount": 16
    },
    {
        "name": "oreo",
        "amount": 10
    },
];

let fetchedQuantity, fetchedUnits, fetchedItemName, fetchedNoOfItems; // Variables to store retrieved values

// Display loading spinner while waiting for voice input
const loadingSpinner = document.getElementById("center");

document.getElementById("speakButton").addEventListener("click", function() {
    loadingSpinner.style.display = "flex"; // Show loading spinner
    fetch("/get_values")
    .then(response => response.json()) // Parse response as JSON
    .then(data => {
        loadingSpinner.style.display = "none"; // Hide loading spinner after response received
        // Store retrieved values in separate variables
        fetchedQuantity = data.quantity;
        fetchedUnits = data.units;
        fetchedItemName = data.item_name;
        fetchedNoOfItems = data.no_of_items;

        // Display values in the console
        console.log("Quantity:", fetchedQuantity);
        console.log("Units:", fetchedUnits);
        console.log("Item Name:", fetchedItemName);
        console.log("Number of Items:", fetchedNoOfItems);

        // Compare fetched values with each object in JSON data array
        compareWithJSON(datas);
    })
    .catch(error => {
        loadingSpinner.style.display = "none"; // Hide loading spinner on error
        console.error('Error:', error);
    });
});

function compareWithJSON(jsonArray) {
    // Find the matching object in the JSON array
    const matchedObject = jsonArray.find(obj => obj.name === fetchedItemName);

    if (matchedObject) {
        // If a match is found, populate the table with the matched data
        populateTable(matchedObject, fetchedNoOfItems);
    } else {
        console.log("No match found in JSON data.");
    }
}

function populateTable(matchedObject, no_of_items) {
    const tableBody = document.getElementById("tableBody");

    // Create a new row for the matched data
    const newRow = document.createElement("tr");

    // Create cells for each value
    const itemNameCell = document.createElement("td");
    itemNameCell.textContent = matchedObject.name;

    const quantityCell = document.createElement("td");
    quantityCell.textContent = fetchedQuantity;

    const unitsCell = document.createElement("td");
    unitsCell.textContent = fetchedUnits;

    const noOfItemsCell = document.createElement("td");
    const noOfItemsInput = document.createElement("input");
    noOfItemsInput.type = "number";
    noOfItemsInput.value = no_of_items;
    noOfItemsInput.id = "noOfItemsInput"; // Add id to input field
    noOfItemsCell.appendChild(noOfItemsInput);
    fetchedNoOfItems = noOfItemsInput
    const amountCell = document.createElement("td");
    let amount = matchedObject.amount;
    if (fetchedUnits === "g") {
        amount *= fetchedQuantity / 1000; // Convert grams to kilograms
    }
    amountCell.textContent = amount;

    // Append cells to the row
    newRow.appendChild(itemNameCell);
    newRow.appendChild(quantityCell);
    newRow.appendChild(unitsCell);
    newRow.appendChild(noOfItemsCell);
    newRow.appendChild(amountCell);

    // Append the row to the table body
    tableBody.appendChild(newRow);
}

// // Event listener for the "Generate" button
// document.getElementById("generate").addEventListener("click", function() {
//     let totalPrice = 0; // Initialize total price
    
//     // Iterate over each row in the table
//     document.querySelectorAll("#tableBody tr").forEach(row => {
//         // Get the amount and number of items for the current row
//         const amountElement = row.querySelector("td:nth-child(5)"); // Assuming amount is the 5th column
//         const amount = parseFloat(amountElement.textContent);
//         const noOfItemsInput = row.querySelector("td:nth-child(4) input"); // Assuming input field is in the 4th column
//         const noOfItems = parseFloat(noOfItemsInput.value);
        
//         // Check if both amount and number of items are valid
//         if (!isNaN(amount) && !isNaN(noOfItems)) {
//             // Add the subtotal for the current row to the total price
//             totalPrice += amount * noOfItems;
//         } else {
//             console.error("Error: Invalid input values for row", row);
//         }
//     });

//     // Update the total price in the separate <div>
//     document.getElementById("totalPrice").textContent = "Total Price: " + totalPrice;
// });

document.getElementById("generate").addEventListener("click", function() {
    generateInvoice();
});
//
function generateInvoice() {
    // Get the table body
    var tableBody = document.getElementById("tableBody");
    
    // Get all rows in the table body
    var rows = tableBody.getElementsByTagName("tr");
    
    // Initialize variables for invoice content and total amount
    var invoiceContent = "<div class='invoice'><div class='invoice-header'><h2>Invoice</h2></div>"; // Start of invoice content with heading
    var totalAmount = 0;

    // Iterate over each row in the table body
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");
        // Extract data from each cell
        var itemName = cells[0].innerText;
        var quantity = parseInt(cells[1].innerText);
        var unit = cells[2].innerText;
      // Assuming cells is an array of table cells
var numberOfItems = parseInt(cells[3].querySelector('input').value);

        var amount = parseFloat(cells[4].innerText);
        // Calculate total amount
        totalAmount += (quantity * amount);
        // Add item to invoice content
        invoiceContent += "<div class='item'><span>Name of the Item:</span>" + itemName + "</div>" +
                          "<div class='item'><span>Quantity:</span>" + quantity + "</div>" +
                          "<div class='item'><span>No Of Items:</span>" + numberOfItems + "</div>" +
                          "<div class='item'><span>Amount:</span>" + (quantity * amount * numberOfItems).toFixed(2) + "</div>";
    }

    // Add total amount to invoice content
    invoiceContent += "<div class='total-amount'><strong>Total Amount:</strong> " + totalAmount.toFixed(2) + "</div>";

    // Get current date and time
    var currentDate = new Date();
    var dateTime = "<div class='date-time'><strong>Date and Time:</strong> <span>" + currentDate.toLocaleString() + "</span></div>";

    // Close the invoice content
    invoiceContent += dateTime + "</div>";

    // Display the invoice content in the container
    var invoiceContainer = document.getElementById("invoiceContainer");
    invoiceContainer.innerHTML = invoiceContent;
}