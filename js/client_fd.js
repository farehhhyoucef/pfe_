

document.addEventListener('DOMContentLoaded', function () {

    
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
    fetch('./php/de.php')
    //    .then(response => response.text())  // Convert the response to text
    //    .then(text => {
    //        console.log(text);  // Log the response text
    //    })
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
    // thead.style.position='fixed';
    thead.innerHTML = `
        <tr style='position=sticky'>
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
       tr.setAttribute('data-id',row.id_client);
       tr.setAttribute('data-idc',row.id_demande_c);
        const tdCheckbox = document.createElement('td');
        tdCheckbox.innerHTML = '<label class="au-checkbox"><input type="checkbox"><span class="au-checkmark"></span></label>';
        tr.appendChild(tdCheckbox);

        const tdName = document.createElement('td');
        tdName.innerHTML = `<div class="table-data__info"><h6>${row.nom}</h6></div>`;
        tr.appendChild(tdName);

        const tdPrenom = document.createElement('td');
        tdPrenom.textContent = row.prenom;
        tr.appendChild(tdPrenom);
        const tdNSerie = document.createElement('td');

// const select = document.createElement('select');
// select.classList.add('js-select2', 'n-serie');
// select.name = 'property';


// let options=data.data2; 
// console.log(options);
// options.forEach(option => {
//   const opt = document.createElement('option');
//   opt.value = option.n_serie;
//   opt.textContent = option.n_serie;
//   select.appendChild(opt);
// });

const dropdownDiv = document.createElement('div');
dropdownDiv.classList.add('dropDownSelect2');

const selectContainer = document.createElement('div');
selectContainer.classList.add('rs-select2--trans', 'rs-select2--sm');
selectContainer.appendChild(select);
selectContainer.appendChild(dropdownDiv);

tdNSerie.innerHTML = ''; // Clear any existing content
tdNSerie.appendChild(selectContainer);

// You can now append tdNSerie to your desired table row (tr)
        tr.appendChild(tdNSerie);

        const tdType = document.createElement('td');
        tdType.textContent = row.type_c;
        tr.appendChild(tdType);

        const tdReference = document.createElement('td');
        tdReference.textContent = row.reference;
        tr.appendChild(tdReference);

        const tdNAffire = document.createElement('td');
        tdNAffire.textContent = row.n_affire;
        tr.appendChild(tdNAffire);

        const tdCategorie = document.createElement('td');
        tdCategorie.textContent = row.categorie;
        tr.appendChild(tdCategorie);

        const tdAdresse = document.createElement('td');
        tdAdresse.textContent = row.adresse;
        tr.appendChild(tdAdresse);

        const tdEntreprise = document.createElement('td');
        tdEntreprise.innerHTML = '<div class="form-group"><input type="text" class="form-control"></div>';
        tr.appendChild(tdEntreprise);

        tbody.appendChild(tr);
        
    });

    const footerDiv = document.createElement('div');
    footerDiv.className = 'user-data__footer';
    footerDiv.innerHTML = '<button id="gtr" class="au-btn au-btn-load">submit</button>';
    userDataDiv.appendChild(footerDiv);

    container.appendChild(userDataDiv);
   const submitButton = document.getElementById('gtr');

// Add an event listener to the button's click event
submitButton.addEventListener('click', ()=> {
 const chex =document.querySelectorAll('.au-checkbox > input[type="checkbox"]');
  const tr= document.querySelectorAll('#Do >tbody tr');
  const tableData = [];
  chex.forEach(e => {
    
    if (e.checked) { 
        console.log('ewq')
        tr.forEach(row => {
            const rowData = {};
            let cel = row.querySelector('.n-serie');
            rowData.n_serie = cel.value;
           let ce = row.querySelector('input[type="text"]');
           rowData.nom_entreprise=ce.value;
           rowData.id_client=row.getAttribute('data-id')     
           rowData.id_demande=row.getAttribute('data-idc') 
            
    
            tableData.push(rowData);
            console.log(row.getAttribute('data-idc'));

            fetch('php/demande.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tableData)
            })
               .then(response => response.text())  // Convert the response to text
       .then(text => {
           console.log(text);  // Log the response text
       })
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            console.log('well');
        });}
      else {
    console.log('fax')   
     }  
       console.log(tableData);
       
  });
    
 
}) 


})};xhttp.open("GET", "./php/de.php" );
xhttp.send();})

// Get the button element by its ID
