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
                        <td><label class="au-checkbox"><input type="checkbox"><span class="au-checkmark"></span></label></td>
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
                //client.id_client,nom,prenom,type_c,reference,n_affire,categorie,adresse,id_demande_c
                table.appendChild(thead);

                const tbody = document.createElement('tbody');
                table.appendChild(tbody);

                const rows = data.data;
                const options = data.data2;

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

                  

                    // options.forEach(option => {
                    //     const opt = document.createElement('option');
                    //     opt.value = option.n_serie;
                    //     opt.textContent = option.n_serie;
                    //     select.appendChild(opt);
                    // });

                  

                    const tdType = document.createElement('td');
                    tdType.textContent = row.type_c;
                    tr.appendChild(tdType);


                    const tdfilename = document.createElement('td');
                    tdfilename.textContent = row.filename;
                    tdfilename.classList.add('filename');
                    tdfilename.setAttribute('data-filename',`"${row.id_client}.pdf"`)
                    tr.appendChild(tdfilename);

                    const tdReference = document.createElement('td');
                    tdReference.textContent = row.reference;
                    tr.appendChild(tdReference);

                    const tdNAffire = document.createElement('td');
                    tdNAffire.innerHTML = '<div class="form-group"><input type="text" class=" dashed-input" placeholder="-------"></div>';
                tr.appendChild(tdNAffire);

                   
                    


                 
                    const tdCategorie = document.createElement('td');
                    tdCategorie.textContent = row.categorie;
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

                const submitButton = document.getElementById('gtr');


                submitButton.addEventListener('click', () => {
                    const checkedBoxes = document.querySelectorAll('.au-checkbox > input[type="checkbox"]:checked');
                    const tableData = [];
                
                    checkedBoxes.forEach(checkbox => {
                        const row = checkbox.closest('tr');
                        const rowData = {
                          
                            n_affire: row.querySelector('input[type="text"]').value,
                            id_client: row.getAttribute('data-id'),
                            id_demande: row.getAttribute('data-idc')
                        };
                        tableData.push(rowData);
                    });
                
                    if (tableData.length > 0) {
                        fetch('php/rec_demande.php', {
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
    xhttp.open("GET", "./php/rec_demande.php");
    xhttp.send();
});
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

addFilenameClickListeners();
