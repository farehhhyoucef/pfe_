
document.addEventListener("DOMContentLoaded", function() {

  
  const containerSelector = '.table-responsive.table--no-card.m-b-40';
  const tableClassNames = 'table table-borderless table-striped table-earning';
  const headerTexts = ['date', 'n°serie', 'name', 'reference', 'n°affaire', 'address', 'entreprise'];
  
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
      fetch('./php/ma.php')
    //   .then(response => response.text())  // Convert the response to text
    //   .then(text => {
    //       console.log(text);  // Log the response text
    //   })
      .then(response => response.json())
      .then(data => {
        const st1 = document.getElementById('cc');
        st1.innerText = data.counts.compteur_stocke;
        
        const st2 = document.getElementById('bb');
        st2.innerText = data.counts.compteur_vendue;
        
        const st3 = document.getElementById('aa');
        st3.innerText = data.counts.demande;
        

        const container = document.querySelector(containerSelector);
          const  tableData=data.data;
        const table = document.createElement('table');
        table.className = tableClassNames;
  
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
  
        headerTexts.forEach(headerText => {
          const th = document.createElement('th');
          th.textContent = headerText;
          if (['reference', 'n°affaire', 'entreprise'].includes(headerText)) {
            th.className = 'text-right';
          }
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
  
        const tbody = document.createElement('tbody');
        tableData.forEach(rowData => {
          const row = document.createElement('tr');
          Object.keys(rowData).forEach(key => {
            const td = document.createElement('td');
            td.textContent = rowData[key];
            if (['reference', 'affaire', 'address', 'entreprise'].includes(key)) {
              td.className = 'text-right';
            }
            row.appendChild(td);
          });
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
  
        container.appendChild(table);
      });
  };
  
  xhttp.open("GET", "./php/ma.php");
  xhttp.send();
})

function showResult(str) {
  if (str.length==0) {
    document.getElementById("live").innerHTML="";
    document.getElementById("live").style.border="0px";
    return;
  }
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function() {
    if (this.readyState==4 && this.status==200) {
      document.getElementById("livesearch").innerHTML=this.responseText;
      document.getElementById("livesearch").style.border="1px solid #A5ACB2";
    }
  }
  xmlhttp.open("GET","livesearch.php?q="+str,true);
  xmlhttp.send();
}
