document.addEventListener('DOMContentLoaded', function() {
    fatchdata();
    function fatchdata(){
        fetch('./php/getremise.php')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('data-table-body');
            data.data2.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.date_coupure}</td>
                    <td>${row.reference}</td>
                    <td>${row.nom}</td>
                    <td class="text-right">${row.prenom}</td>
                    <td class="text-right">${row.adresse}</td>
                    <td class="text-right">${row.type}</td>
                    <td class="text-right">${row.nom_entreprise}</td>
                    <td class="text-right">${row.remarque}</td>
                `;
                tableBody.appendChild(tr);
            });
            document.getElementById('non-paye').innerText =  data.counts.non_paye;
            document.getElementById('paye').innerText =  data.counts.paye;
            document.getElementById('demande').innerText =  data.counts.demande;
                    
        })
        .catch(error => console.error('Error fetching data:', error));
    }
    setInterval(fetchData, 1000); // 5000 milliseconds = 5 seconds
});

