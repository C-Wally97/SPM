let allData;

//on page load, fetch descriptions table from server and display on page
window.onload = function() {
    fetch('./getDesc')
    .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
          // Examine the text in the response
          response.json().then(function(data) {
            populateTable(data);
            });
          }
      )
      .catch(function(err) {
        console.log('Fetch Error :', err);
      });
    }

    document.addEventListener('DOMContentLoaded', function() {
        // MATERIALIZE INITIALISATIONS 
        let elems = document.querySelectorAll('.datepicker');
        document.getElementById("filterButton").addEventListener('click', filterDesc);
        let options = {}
        options.format = 'yyyy-mm-dd';
        let instances = M.Datepicker.init(elems,options);
        let modal = document.querySelectorAll('.modal');
        // eslint-disable-next-line no-unused-vars
        let modalInit = M.Modal.init(modal);
        let select = document.querySelectorAll('select');
        // eslint-disable-next-line no-unused-vars
        let selectInit = M.FormSelect.init(select);
        let sideNav = document.querySelectorAll('.sidenav');
        // eslint-disable-next-line no-unused-vars
        let sideNavInit = M.Sidenav.init(sideNav);
        // END OF MATERIALIZE INITIALISATIONS 

        document.getElementById('addButton').addEventListener('click', function() {
          document.getElementById("series_No").addEventListener('input', checkSeries);
          let form = document.getElementById("descForm");
          let dateBox = document.getElementById("date_Raised");
          let descButton = document.getElementById("descButton");  
          form.setAttribute("action", "/addDesc");
          descButton.textContent = "Add Description";          
          clearModal();
          dateBox.value = getToday();
        });
      });
      
      function getToday() {
        let today = new Date()
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        return yyyy + "-" + mm + "-" + dd; 
      } 

function clearModal() {
  let data = document.getElementById('descForm');
  let innerData = data.querySelectorAll('input, textarea');
  innerData.forEach(el => {
    el.value = "";
  })
}

// data variable is mySQL database json fetched from the database
function populateTable(data) {
  allData = data;
  let tableID = document.querySelector("#content_table > tbody");
  tableID.innerHTML = "";
  let tableStr = "<tr><th>id</th><th>xQM_No</th><th>Series_No</th><th>Models</th><th>Symptoms</th><th>Description of Failure</th><th>Technician</th><th>Closed</th><th>Date Raised</th><th>Img Location</th><th>Fault Type</th><th></th></tr>";
  tableID.innerHTML = tableStr;
  // creates table row with populated data for each element in data variable
  for (let i = 0; i < data.length; i++) {
      const tr = document.createElement("tr");
      tr.id = i;
      tr.setAttribute("class", "descEle"); 
      let tableStr = "";
      tableStr = tableStr + "<td>" + data[i].id + "</td>";
      tableStr = tableStr + "<td>" + data[i].xQM_No + "</td>";
      tableStr = tableStr + "<td>" + data[i].Series_No + "</td>";
      tableStr = tableStr + "<td>" + data[i].Models + "</td>";
      tableStr = tableStr + "<td>" + data[i].Symptoms + "</td>";
      tableStr = tableStr + "<td>" + data[i].Description_of_failure + "</td>";
      tableStr = tableStr + "<td>" + data[i].Technician + "</td>";
      if (data[i].Closed == 0) {
        tableStr = tableStr + "<td>True</td>";
      } else {
        tableStr = tableStr + "<td>False</td>";
      }
      tableStr = tableStr + "<td>" + data[i].Date_raised + "</td>";
      tableStr = tableStr + '<td><a href="' + data[i].image_location + '">' + data[i].image_location + '</td>';
      tableStr = tableStr + "<td>" + data[i].Fault_type + "</td>";
      tableStr = tableStr + '<td><a class="waves-effect waves-light btn modal-trigger" href="#myModal" id="editDesc">Edit</a></td>';
      tr.innerHTML = tableStr;
      tableID.append(tr);
  }
  // when descriptions table element clicked, gets the parts of the clicked description element
  document.querySelectorAll('.descEle')
  .forEach(i => i.addEventListener("click", function() {
    getParts(this);
  }));
  // when edit button of table element clicked, opens edit modal and populates with description data
  document.querySelectorAll('#editDesc')
  .forEach(i => i.addEventListener("click", function() {
    editDesc(this.parentElement.parentElement);
  }));
}

// ele variable is the clicked description
function getParts(ele) {
  // simple check to prevent multiple instances of the same data occuring
  if (ele.clicked) {
    ele.parentNode.removeChild(ele.nextSibling);
    ele.clicked = false;
  }
  else {
    let querystr = "/filterParts?xQM_No=";
    let temp = document.getElementsByTagName("template")[0];
    let clon = temp.content.cloneNode(true);
    const pTable = clon.childNodes[1];
    // insert row below clicked element
    ele.parentElement.insertRow(ele.rowIndex + 1);
    const eleTd = document.createElement("td");
    eleTd.innerHTML = "<h5>Parts:</h5>";
    eleTd.setAttribute("colspan", "10");
    querystr = querystr + allData[ele.id].xQM_No;
    fetch(querystr)
      .then(function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        // Examine the text in the response
        response.json().then(function(data) {
          if (data.length == 0) {
            const tr = document.createElement("tr");
            let tableStr = "<td><p class='red-text'>No parts found.</p></td>";
            tr.innerHTML = tableStr;
            pTable.append(tr);
          }
          else {
            for (let i = 0; i < data.length; i++) {
              const tr = document.createElement("tr");
              tr.id = i;
              let tableStr = "";
              tableStr = tableStr + "<td>" + data[i].id + "</td>";
              tableStr = tableStr + "<td>" + data[i].xQM_No + "</td>";
              tableStr = tableStr + "<td>" + data[i].Warranty_No + "</td>";
              tableStr = tableStr + "<td>" + data[i].Serial_No + "</td>";
              tableStr = tableStr + "<td>" + data[i].Date_of_sale + "</td>";
              tableStr = tableStr + "<td>" + data[i].Date_of_failure + "</td>";
              tableStr = tableStr + "<td>" + data[i].Part_number + "</td>";
              tableStr = tableStr + "<td>" + data[i].Comments + "</td>";
              tableStr = tableStr + "<td>" + data[i].Sent_to_manufacture + "</td>";
              tableStr = tableStr + "<td>" + data[i].Date_added + "</td>";
              tr.innerHTML = tableStr;
              pTable.append(tr);
              }
            }
              eleTd.append(pTable);
              //appends data to the created table row 
              ele.parentElement.children[ele.rowIndex + 1].append(eleTd);
              ele.clicked = true;
          });
      })
  }

}

// descData variable is data of the element that edit button was clicked for
function editDesc(descData) {
  let form = document.getElementById("descForm");
  let descButton = document.getElementById('descButton');
  form.setAttribute("action", `/editDesc/${allData[descData.id].id}`);
  descButton.textContent = "Edit Description";
  document.getElementById("xQM_No").value = allData[descData.id].xQM_No;
  document.getElementById("series_No").value = allData[descData.id].Series_No;
  checkSeries();
  document.getElementById("symptoms").value = allData[descData.id].Symptoms;
  document.getElementById("failure_Desc").value = allData[descData.id].Description_of_failure;
  document.getElementById("technician").value = allData[descData.id].Technician;
  if(descData.children[7].textContent == 0) {
    document.getElementById("closed").value = "Closed";
  }
  else  {
    document.getElementById("closed").value = "Open";
  }
  document.getElementById("date_Raised").value = allData[descData.id].Date_raised;
  document.getElementById("img_Loc").value = allData[descData.id].image_location;
  document.getElementById("fault_Type").value = allData[descData.id].Fault_type;
}

function checkSeries() {
  let seriesData = document.getElementById("series_No").value;
  let seriesEle = document.getElementById("models_wrapper");
  seriesEle.innerHTML = "";
  if (seriesData.length == 4) {
    let querystr = "/filterSeries?Series=" + seriesData;
    fetch(querystr)
    .then(function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      // Examine the text in the response
      response.json().then(function(data) {
        if (data.length == 0) {
          const option = document.createElement("option");
          let tableStr = "No Series";
          option.innerHTML = tableStr;
          seriesEle.append(option);
        }
        else {
          // create option element for each returned product
          data.forEach(el => {
            const option = document.createElement("option");
            let tableStr = el.Description;
            option.innerHTML = tableStr;
            seriesEle.append(option);
          })
        }
        // reinitialise select to display updated elements
        let select = document.querySelectorAll('select');
        let selectInit = M.FormSelect.init(select);
        });
    })
  }
}

function filterDesc() {
  let data = document.getElementById('filter-content');
  let innerData = data.querySelectorAll('input, textarea, select');
  let querystr = "/filterDesc?";
  let queryBool = false;
  // appends filter data to api call if the filter data on element is not empty
  innerData.forEach(el => {
    if (el.value != "" & el.name != "") {
      if (queryBool) {
        querystr = querystr + "&";
      }
      querystr = querystr + el.name + "=" + el.value;
      queryBool = true ;
    }
  })
  // if no filters, get full description list again
  if (querystr == "/filterDesc?") {
    querystr = "./getDesc";
  }
  
  fetch(querystr)
    .then(function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      // Examine the text in the response
      response.json().then(function(data) {
        populateTable(data);
        });
    })
}
