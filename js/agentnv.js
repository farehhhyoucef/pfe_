document.addEventListener('DOMContentLoaded', function () {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        fetch('./php/teet.php')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('you');

                const userDataDiv = document.createElement('div');
                userDataDiv.className = 'user-data m-b-30';

                const header = document.createElement('h3');
                header.className = 'title-3 m-b-30';
                header.innerHTML = '<i class="zmdi zmdi-account-calendar"></i> demandes compteurs';
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
                    <tr style='position: sticky'>
                        <td><label class="au-checkbox"><input type="checkbox" id="selectAll"><span class="au-checkmark"></span></label></td>
                        <td>name</td>
                        <td>prenom</td>
                        <td>type</td>
                        <td>filename</td>
                        <td>reference</td>
                        <td>n_affire</td>
                        <td>categorie</td>
                        <td>adresse</td>
                    </tr>
                `;
                table.appendChild(thead);

                const tbody = document.createElement('tbody');
                table.appendChild(tbody);

                const rows = data.data2;
                rows.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.setAttribute('data-id', row.id_client);
                    tr.setAttribute('data-idc', row.id_demande_c);

                    const tdCheckbox = document.createElement('td');
                    tdCheckbox.innerHTML = '<label class="au-checkbox"><input type="checkbox"><span class="au-checkmark"></span></label>';
                    tr.appendChild(tdCheckbox);

                    const tdName = document.createElement('td');
                    tdName.innerHTML = `<div class="table-data__info"><h6>${row.nom}</h6></div>`;
                    tr.appendChild(tdName);

                    const tdPrenom = document.createElement('td');
                    tdPrenom.textContent = row.prenom;
                    tr.appendChild(tdPrenom);

                    const tdType = document.createElement('td');
                    tdType.innerHTML = '<div class="form-group"><input type="text" name="type_c" class="dashed-input" placeholder="-------"></div>';
                    tr.appendChild(tdType);

                    const tdfilename = document.createElement('td');
                    tdfilename.textContent = row.filename;
                    tr.appendChild(tdfilename);

                    const tdReference = document.createElement('td');
                    tdReference.innerHTML = '<div class="form-group"><input type="text" name="reference" class=" dashed-input" placeholder="-------"></div>';
                    tr.appendChild(tdReference);

                    const tdNAffire = document.createElement('td');
                    tdNAffire.innerHTML = '<div class="form-group"><input type="text" name="n_affire" class=" dashed-input" placeholder="-------"></div>';
                    tr.appendChild(tdNAffire);

                    const tdCategorie = document.createElement('td');
                    tdCategorie.innerHTML = '<div class="form-group"><input type="text" name="categorie" class=" dashed-input" placeholder="-------"></div>';
                    tr.appendChild(tdCategorie);

                    const tdAdresse = document.createElement('td');
                    tdAdresse.textContent = row.adresse;
                    tr.appendChild(tdAdresse);

                    tbody.appendChild(tr);
                });

                const footerDiv = document.createElement('div');
                footerDiv.className = 'user-data__footer';
                footerDiv.innerHTML = '<button id="gtr" class="au-btn au-btn-load">submit</button>';
                userDataDiv.appendChild(footerDiv);

                container.appendChild(userDataDiv);

                document.getElementById('selectAll').addEventListener('change', function() {
                    const checkboxes = tbody.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(checkbox => checkbox.checked = this.checked);
                });

                const submitButton = document.getElementById('gtr');
                submitButton.addEventListener('click', () => {
                    const checkedBoxes = tbody.querySelectorAll('input[type="checkbox"]:checked');
                    const tableData = [];

                    checkedBoxes.forEach(checkbox => {
                        const row = checkbox.closest('tr');
                        const rowData = {
                            n_affire: row.querySelector('input[name="n_affire"]').value,
                            id_client: row.getAttribute('data-id'),
                            id_demande: row.getAttribute('data-idc'),
                            n_refernce: row.querySelector('input[name="reference"]').value,
                            categorie: row.querySelector('input[name="categorie"]').value,
                            type_c: row.querySelector('input[name="type_c"]').value
                        };
                        tableData.push(rowData);
                    });

                    if (tableData.length > 0) {
                        fetch('php/rec_nev.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(tableData)
                        })
                        .then(response => response.text())
                        .then(text => {
                            console.log(text);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                    }
                });
            });
    };
    xhttp.open("GET", "./php/rec_nev.php");
    xhttp.send();
});
