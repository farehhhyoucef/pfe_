document.addEventListener('DOMContentLoaded', () => {
    loadDynamicTable();
    initializeFilters();
    loadAdditionalData();
    startPolling();
});

let isPolling = false;

function startPolling() {
    if (!isPolling) {
        isPolling = true;
        pollData();
    }
}

function pollData() {
    setTimeout(async () => {
        await updateTableWithNewData();
        await updateAdditionalData();
        pollData(); // Continue polling
    }, 5000); // Poll every 5 seconds
}

async function updateTableWithNewData() {
    try {
        const response = await fetch('./php/check_update.php');
        const { hasUpdate } = await response.json();

        if (hasUpdate) {
            await loadDynamicTable(); // Reload table if there are updates
        }
    } catch (error) {
        console.error('Error fetching update status:', error);
    }
}

async function updateAdditionalData() {
    try {
        const response = await fetch('./php/check_update_additional.php');
        const { hasUpdate } = await response.json();

        if (hasUpdate) {
            await loadAdditionalData(); // Reload additional data if there are updates
        }
    } catch (error) {
        console.error('Error fetching additional data status:', error);
    }
}

async function loadDynamicTable() {
    try {
        const response = await fetch('./php/table_mag.php');
        if (!response.ok) throw new Error('Network response was not ok.');

        const data = await response.json();
        const table = document.getElementById('dynamicTable');
        table.innerHTML = ''; // Clear the table before populating

        const headers = ['date', 'n°serie', 'type', 'categorie', 'reonnage'];
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        data.forEach(item => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${item.date_entree}</td>
                <td>${item.n_serie}</td>
                <td class='type_compteur'>${item.type}</td>
                <td class="text-right" data-id="${item.categorie}">${item.categorie}</td>
                <td class="text-right">${item.reonnage}</td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function initializeFilters() {
    const searchButton = document.getElementById("b1");
    const filterCategory = document.getElementById("s2");
    const filterType = document.getElementById("s1");

    searchButton.addEventListener("click", () => {
        const selectedCategory = filterCategory.value;
        const selectedType = filterType.value;
        const rows = document.querySelectorAll("#dynamicTable > tbody > tr");

        rows.forEach(row => {
            const rowCategory = row.querySelector('[data-id]').getAttribute('data-id');
            const rowType = row.querySelector('.type_compteur').textContent;

            // Apply both filters
            const matchesCategory = selectedCategory === 'categorie' || rowCategory === selectedCategory;
            const matchesType = selectedType === 'type compteur' || rowType === selectedType;

            // Show the row only if it matches both filters
            row.style.display = (matchesCategory && matchesType) ? '' : 'none';
        });
    });
}

async function loadAdditionalData() {
    try {
        const response = await fetch('./php/table_mag1.php');
        if (!response.ok) throw new Error('Network response was not ok.');

        const data = await response.json();
        const container = document.getElementById('you');
        container.innerHTML = ''; // Clear existing content

        const userDataDiv = document.createElement('div');
        userDataDiv.className = 'user-data m-b-30';

        const header = document.createElement('h3');
        header.className = 'title-3 m-b-30';
        header.innerHTML = '<i class="zmdi zmdi-account-calendar"></i> demandes compteurs <div id="alertContainer"></div>';
        userDataDiv.appendChild(header);

        const tableResponsiveDiv = document.createElement('div');
        tableResponsiveDiv.className = 'table-responsive table-data';
        userDataDiv.appendChild(tableResponsiveDiv);

        const table = document.createElement('table');
        table.id = 'Do';
        table.className = 'table';
        tableResponsiveDiv.appendChild(table);

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <td><label class="au-checkbox"><input type="checkbox"><span class="au-checkmark"></span></label></td>
                <td>name</td>
                <td>prenom</td>
                <td>n_serie</td>
                <td>type</td>
                <td>reference</td>
                <td>n_affire</td>
                <td>categorie</td>
                <td>adresse</td>
                <td>entreprise</td>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        const rows = data.data;

        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', row.id_client);
            tr.setAttribute('data-idc', row.id_demande_c);

            const tdCheckbox = document.createElement('td');
            tdCheckbox.innerHTML = '<label class="au-checkbox"><input type="checkbox"><span class="au-checkmark"></span></label>';
            tr.appendChild(tdCheckbox);

            tr.innerHTML += `
                <td><div class="table-data__info"><h6>${row.nom}</h6></div></td>
                <td>${row.prenom}</td>
                <td>
                    <div class="rs-select2--trans rs-select2--sm">
                        <select class="js-select2 n-serie" name="property">
                            ${row.option.map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>
                        <div class="dropDownSelect2"></div>
                    </div>
                </td>
                <td>${row.type_c}</td>
                <td>${row.reference}</td>
                <td>${row.n_affire}</td>
                <td>${row.categorie}</td>
                <td>${row.adresse}</td>
                <td>
                    <div class="form-group">
                        <input type="text" class=" dashed-input" placeholder="-------">
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });

        const footerDiv = document.createElement('div');
        footerDiv.className = 'user-data__footer';
        footerDiv.innerHTML = '<button id="gtr" class="au-btn au-btn-load">submit</button>';
        userDataDiv.appendChild(footerDiv);

        container.appendChild(userDataDiv);

        document.getElementById('gtr').addEventListener('click', async () => {
            const checkedBoxes = document.querySelectorAll('.au-checkbox > input[type="checkbox"]:checked');
            const tableData = Array.from(checkedBoxes).map(checkbox => {
                const row = checkbox.closest('tr');
                return {
                    n_serie: row.querySelector('.n-serie').value,
                    nom_entreprise: row.querySelector('.dashed-input').value,
                    id_client: row.getAttribute('data-id'),
                    id_demande: row.getAttribute('data-idc')
                };
            });

            if (tableData.length > 0) {
                try {
                    const response = await fetch('php/table_mag2.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(tableData)
                    });
                    const result = await response.json();
                    showAlert(result.update_status, result.etat_status === 'ok' ? 'success' : 'warning');
                    if (result.etat_status === 'ok') {
                        loadDynamicTable();
                        loadAdditionalData();
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });
    } catch (error) {
        console.error('Error fetching additional data:', error);
    }
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = ''; // Clear existing alerts

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    alertContainer.appendChild(alertDiv);
}
