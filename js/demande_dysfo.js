
// document.addEventListener("DOMContentLoaded", function() {
//     // Get the form element
//     var form = document.getElementById("form");
//     var alert=document.getElementById('r');
    
//     // Add submit event listener to the form
//     form.addEventListener("submit", function(event) {
//         // Prevent the default form submission
//         event.preventDefault();

//         // Create a FormData object from the form
//         var formData = new FormData(form);
//         // Send the data to the PHP page using AJAX
//         var xhr = new XMLHttpRequest();
//         xhr.open("POST", "./php/ajouter_compteur.php", true);
//         xhr.onreadystatechange = function() {
//             if (xhr.readyState === XMLHttpRequest.DONE) {
//                 if (xhr.status === 200) {
//                     // Request was successful
//                     var response = JSON.parse(xhr.responseText);
//                     if (response.status === "success") {
//                         r.className='alert alert-success';
//                         r.setAttribute('role','alert');
//                         r.innerText = "Nevau ajoute!";
//                     } else {
//                         r.className='alert alert-danger';
//                         r.setAttribute('role','alert');
//                         r.innerText=`${response.message}`;
//                     }
//                 } else {
//                     // Request failed
//                     console.error("Failed to send data");
//                 }
//             }
//         };
//         xhr.send(formData);
//     });
// });
