document.addEventListener('DOMContentLoaded', function() {
    function fetchData() {
        fetch('php/demande_remise.php')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById('table-body');
                tableBody.innerHTML = ''; // Clear existing table rows

                data.data.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${row.nom}</td>
                        <td class='text-right'>${row.prenom}</td>
                        <td class='text-right'>${row.adresse}</td>
                        <td class='text-right'>${row.n_telephone}</td>
                    `;
                    tableBody.appendChild(tr);
                }); 
                document.getElementById('retablissement').innerText = data.counts.remise ;
                document.getElementById('nouveau').innerText = data.counts.nouveau;
                document.getElementById('changement').innerText = data.counts.changement;
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Fetch data initially and set an interval to refresh it
    fetchData();
    setInterval(fetchData, 30000); // Refresh data every 30 seconds
});
