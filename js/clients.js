document.addEventListener('DOMContentLoaded', function() {
    const data = [
        { date: '2018-09-29 05:57', serie: '100398', type: 'iPhone X 64Gb Grey', categorie: '$999.00', reonnage: 1 },
        { date: '2018-09-28 01:22', serie: '100397', type: 'Samsung S8 Black', categorie: '$756.00', reonnage: 1 },
        { date: '2018-09-27 02:12', serie: '100396', type: 'Game Console Controller', categorie: '$22.00', reonnage: 2 },
        { date: '2018-09-26 23:06', serie: '100395', type: 'iPhone X 256Gb Black', categorie: '$1199.00', reonnage: 1 },
        { date: '2018-09-25 19:03', serie: '100393', type: 'USB 3.0 Cable', categorie: '$10.00', reonnage: 3 },
        { date: '2018-09-29 05:57', serie: '100392', type: 'Smartwatch 4.0 LTE Wifi', categorie: '$199.00', reonnage: 6 },
        { date: '2018-09-24 19:10', serie: '100391', type: 'Camera C430W 4k', categorie: '$699.00', reonnage: 1 },
        { date: '2018-09-22 00:43', serie: '100393', type: 'USB 3.0 Cable', categorie: '$10.00', reonnage: 3 },
    ];
    
    const table = document.getElementById('dynamicTable');
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
    fetch('./php/mag.php')

   .then(response => response.json())
  
   .then(data => {
    // Create thead
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['date', 'n°serie', 'type', 'categorie', 'reonnage'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    console.log(data[3].type)

    // Create tbody
    const tbody = document.createElement('tbody');

    data.forEach(item => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.textContent = item.date_entree;
        row.appendChild(dateCell);

        const serieCell = document.createElement('td');
        serieCell.textContent = item.n_serie;
        row.appendChild(serieCell);
        row.setAttribute('data-id',item.categorie);

        const typeCell = document.createElement('td');
        typeCell.textContent = item.type;
        row.appendChild(typeCell);

        const categorieCell = document.createElement('td');
        categorieCell.textContent = item.categorie;
        categorieCell.classList.add('text-right');
        row.appendChild(categorieCell);

        const reonnageCell = document.createElement('td');
        reonnageCell.textContent = item.reonnage;
        reonnageCell.classList.add('text-right');
        row.appendChild(reonnageCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);})}
    xhttp.open("GET", "./php/mag.php" );
    xhttp.send();
});





let search = document.getElementById("b1");
let s1 = document.getElementById("s1");
let s2 = document.getElementById("s2");
s1.addEventListener('change', ()=>{

})

var ap= true;
search.addEventListener("click", () => {
    
  let tr = document.querySelectorAll("#dynamicTable >tbody tr");
  if(tr!=null)(console.log(tr[1].getAttribute("data-id")));
  ap=!ap;
  if(ap!=true){
  let value = s2.value;
  console.log(value);
  tr.forEach((e)=> {
    let nom = e.getAttribute("data-id");
    console.log(nom);
    if(nom==value){
      e.style.display = "table-row";
    }else {
        console.log('dsd');
    
        e.style.display = "none";
    }
})}
else{
    tr.forEach((e)=> {e.style.display = "table-row";})
}
});


document.addEventListener('DOMContentLoaded', function () {

    
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
    fetch('./php/dema.php')
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

const select = document.createElement('select');
select.classList.add('js-select2', 'n-serie');
select.name = 'property';


let options=data.data2; 
console.log(options);
options.forEach(option => {
  const opt = document.createElement('option');
  opt.value = option.n_serie;
  opt.textContent = option.n_serie;
  select.appendChild(opt);
});

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

submitButton.addEventListener('click', () => {
    const checkedBoxes = document.querySelectorAll('.au-checkbox > input[type="checkbox"]:checked');
    const tableData = [];

    checkedBoxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const rowData = {
            n_serie: row.querySelector('.n-serie').value,
            nom_entreprise: row.querySelector('input[type="text"]').value,
            id_client: row.getAttribute('data-id'),
            id_demande: row.getAttribute('data-idc')
        };
        tableData.push(rowData);
    });

    if (tableData.length > 0) {
        fetch('php/demande.php', {
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
xhttp.open("GET", "./php/dema.php");
xhttp.send();
});
// Get the button element by its ID

// function showResult(str) {
//     if (str.length==0) {
//       document.getElementById("live").innerHTML="";
//       document.getElementById("live").style.border="0px";
//       return;
//     }
//     var xmlhttp=new XMLHttpRequest();
//     xmlhttp.onreadystatechange=function() {
//       if (this.readyState==4 && this.status==200) {
//         document.getElementById("livesearch").innerHTML=this.responseText;
//         document.getElementById("livesearch").style.border="1px solid #A5ACB2";
//       }
//     }
//     xmlhttp.open("GET","livesearch.php?q="+str,true);
//     xmlhttp.send();
//   }