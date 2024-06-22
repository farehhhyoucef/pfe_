document.addEventListener('DOMContentLoaded', function() {
    fetch('./php/getdemeremise.php')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('data2-table-body');
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.id = `client-${row.id_client}`; // Set the id attribute for the row
                tr.innerHTML = `
                    <td>
                        <label class="au-checkbox">
                            <input type="checkbox">
                            <span class="au-checkmark"></span>
                        </label>
                    </td>
                    <td>
                        <div class="table-data__info">
                            <h6>${row.nom}</h6>
                        </div>
                    </td>
                    <td>${row.prenom}</td>
                `;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});