document.addEventListener("DOMContentLoaded", () => {
    fetchDataAndPopulateTable();
});

async function fetchDataAndPopulateTable() {
    try {
        const response = await fetch('./php/remisereseption.php');
        const data = await response.json();

        const tableBody = document.querySelector('#userTable tbody');
        tableBody.innerHTML = ''; // Clear existing table rows

        data.forEach(user => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', user.id_client);

            row.innerHTML = `
                <td>${user.nom}</td>
                <td>${user.prenom}</td>
                <td>${user.n_telephone}</td>
                <td>${user.adresse}</td>
                <td class="filename" data-filename="${user.id_demande_r }.pdf">${user.filename}</td>
                <td>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-success accept-btn">accept</button>
                        <button type="button" class="btn btn-danger refuse-btn">refuse</button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        addFilenameClickListeners();
        addAcceptButtonListeners();
        addRefuseButtonListeners();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function addFilenameClickListeners() {
    const filenameCells = document.querySelectorAll('.filename');

    filenameCells.forEach(cell => {
        cell.addEventListener('click', (event) => {
            const filename = event.target.getAttribute('data-filename');
            const fileUrl = `./php/uploads/${filename}`; // Adjust this path to match your file storage location
            window.open(fileUrl, '_blank'); // Open the file in a new tab or window
        });
    });
}

function addAcceptButtonListeners() {
    const acceptButtons = document.querySelectorAll('.accept-btn');

    acceptButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const row = event.target.closest('tr');
            const idClient = row.getAttribute('data-id');

            try {
                const response = await fetch('./php/updateDemandeStatus.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id_client: idClient, action: 'accept' })
                });

                if (response.ok) {
                    // Optionally, you can remove the row from the table after a successful response
                    row.remove();
                } else {
                    console.error('Failed to update client status');
                }
            } catch (error) {
                console.error('Error updating client status:', error);
            }
        });
    });
}

function addRefuseButtonListeners() {
    const refuseButtons = document.querySelectorAll('.refuse-btn');

    refuseButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const row = event.target.closest('tr');
            const idClient = row.getAttribute('data-id');

            try {
                const response = await fetch('./php/updateDemandeStatus.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id_client: idClient, action: 'refuse' })
                });

                if (response.ok) {
                    // Optionally, you can remove the row from the table after a successful response
                    row.remove();
                } else {
                    console.error('Failed to update client status');
                }
            } catch (error) {
                console.error('Error updating client status:', error);
            }
        });
    });
}
