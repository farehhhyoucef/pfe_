
document.addEventListener("DOMContentLoaded", function() {
    // Get the form element
    var form = document.getElementById("remiseForm");

    // Add submit event listener to the form
    form.addEventListener("submit", function(event) {
        // Prevent the default form submission
        event.preventDefault();

        // Serialize the form data into JSON format
        var formData = {};
        var inputs = form.querySelectorAll("input, select");
        inputs.forEach(function(input) {
            formData[input.name] = input.value;
        });
        
        // Convert JSON object to string
        var jsonData = JSON.stringify(formData);

        // Send the data to the PHP page using AJAX
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "./php/ajouterremise.php", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Request was successful
                    console.log("Data sent successfully");
                    // You can handle the response from the PHP page here if needed
                } else {
                    // Request failed
                    console.error("Failed to send data");
                }
            }
        };
        xhr.send(jsonData);
    });
});

