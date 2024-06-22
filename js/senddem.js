document.addEventListener('DOMContentLoaded', function() {
    fetchData();
  
    document.getElementById('submit').addEventListener('click', function() {
      const checkedRows = [];
      const rows = document.querySelectorAll('#data2-table-body tr');
      rows.forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
          const id = row.getAttribute('data-id');
          const nom = row.querySelector('td:nth-child(2) h6').innerText;
          const prenom = row.querySelector('td:nth-child(3)').innerText;
          checkedRows.push({ id, nom, prenom });
        }
      });
  
      console.log('Checked Rows:', checkedRows);
  
      const jsondata = JSON.stringify(checkedRows);
  
      // Send checkedRows data to PHP
      fetch('./php/updateremise.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsondata
      })
        .then(response => response.text())
        .then(data => {
          console.log('Response from PHP:', data);
          try {
            const jsonData = JSON.parse(data);
            if (jsonData.status === 'success') {
              // Fetch updated data to refresh the table
              fetchData();
            } else {
              console.error('Error processing data:', jsonData.message);
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        })
        .catch(error => console.error('Error sending data:', error));
    });
  });
  
  function fetchData() {
    fetch('./php/getdemeremise.php')
      .then(response => response.json())
      .then(data => {
        const tableBody = document.getElementById('data2-table-body');
        tableBody.innerHTML = ''; // Clear existing table content
        data.forEach(row => {
          const tr = document.createElement('tr');
          tr.setAttribute('data-id', row.id_client); // Set the id attribute for the row
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
  }
  