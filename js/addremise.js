async function fetchData() {
    try {
        // Replace 'your-api-url' with the actual URL of your API endpoint
        const response = await fetch('./php/ajouterremise.php');
        const data = await response.json();
        
        // Update the table with the fetched data
        updateTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to update the table with new data
function updateTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear existing table rows

    data.forEach(compteur => {
        const row = document.createElement('tr');

        const compteurCell = document.createElement('td');
        compteurCell.textContent = compteur.nom + " " + compteur.prenom;
        row.appendChild(compteurCell);

        const valueCell1 = document.createElement('td');
        valueCell1.textContent = compteur.n_serie;
        row.appendChild(valueCell1);

        const valueCell2 = document.createElement('td');
        valueCell2.textContent = compteur.type;
        row.appendChild(valueCell2);

        // Add click event listener to the row
        row.addEventListener('click', () => updateForm(compteur));

        tableBody.appendChild(row);
    });
}

// Function to update the form with the selected row's data
function updateForm(compteur) {
    document.getElementById('idClient').value=compteur.id_client || '';
    document.getElementById('nom').value = compteur.nom || '';
    document.getElementById('prenom').value = compteur.prenom || '';
  
    document.getElementById('address').value = compteur.adresse || ''; // Adjust if 'address' field is available in compteur
    
    
}

// Fetch data and update the table when the page loads
document.addEventListener('DOMContentLoaded', fetchData);
