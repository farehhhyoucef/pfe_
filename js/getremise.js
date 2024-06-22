
    // Initial fetch and start interval
    
  

    async function fetchData() {
        try {
            const response = await fetch('./php/getremise.php');
            const data = await response.json();
            
            // Update the table with the fetched data
            updateTable(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function updateTable(data) {
        const tableBody = document.getElementById('data-table-body');
        tableBody.innerHTML = ''; // Clear existing table content

        data.data.forEach(row => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', row.type);
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
    }
    document.addEventListener('DOMContentLoaded', fetchData()); 

let search = document.getElementById ("b1");




var ap= true;
search.addEventListener("click", () => {
    let s1 = document.getElementById("s1");
  let tr = document.querySelectorAll("#data-table-body > tr");
  if(tr!=null);
  ap=!ap;
  if(ap!=true){
  let value = s1.value;
  console.log(value);
  console.log("iyyiu".value);
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