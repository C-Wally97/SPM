let allData;
window.onload = function() {
fetch('./getParts')
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
  document.getElementById("filterButton").addEventListener('click', filterParts);
  let elems = document.querySelectorAll('.datepicker');
  let options = {}
  options.format = 'yyyy-mm-dd'
  let instances = M.Datepicker.init(elems,options);
  let modal = document.querySelectorAll('.modal');
  let modalInit = M.Modal.init(modal);
  let select = document.querySelectorAll('.select');
  let selectInit = M.FormSelect.init(select);
  document.getElementById('addPart').addEventListener('click', function() {
    let form = document.getElementById("partForm")
    let dateBox = document.getElementById("date_raised")
    let partButton = document.getElementById("partButton")  
    form.setAttribute("action", "/addPart")
    partButton.textContent = "Add Part"
    clearModal()         
    dateBox.value = getToday()
  });
});

function clearModal() {
  let data = document.getElementById('partForm')
  let innerData = data.querySelectorAll('input, textarea')
  innerData.forEach(el => {
    el.value = ""
  })
}

function populateTable(data) {
  allData = data;
  let tableID = document.querySelector("#content_table > tbody");
  tableID.innerHTML = ""
  let tableStr = "<tr><th>id</th><th>xQM_No</th><th>Warranty_No</th><th>Serial_No</th><th>Date of Sale</th><th>Date of Failure</th><th>Part No</th><th>Comments</th><th>Sent_to_manufacture</th><th>Date Added</th><th></th></tr>"
  tableID.innerHTML = tableStr
  for (let i = 0; i < data.length; i++) {
      const tr = document.createElement("tr")
      tr.id = i
      let tableStr = ""
      tableStr = tableStr + "<td>" + data[i].id + "</td>"
      tableStr = tableStr + "<td>" + data[i].xQM_No + "</td>"
      tableStr = tableStr + "<td>" + data[i].Warranty_No + "</td>"
      tableStr = tableStr + "<td>" + data[i].Serial_No + "</td>"
      tableStr = tableStr + "<td>" + data[i].Date_of_sale + "</td>"
      tableStr = tableStr + "<td>" + data[i].Date_of_failure + "</td>"
      tableStr = tableStr + "<td>" + data[i].Part_number + "</td>"
      tableStr = tableStr + "<td>" + data[i].Comments + "</td>"
      tableStr = tableStr + "<td>" + data[i].Sent_to_manufacture + "</td>"
      tableStr = tableStr + "<td>" + data[i].Date_added + "</td>"
      tableStr = tableStr + '<td><a class="waves-effect waves-light btn modal-trigger" href="#myModal" id="editPart">Edit</a></td>'
      tr.innerHTML = tableStr
      tableID.append(tr)
      }
      document.querySelectorAll('#editPart')
      .forEach(i => i.addEventListener("click", function() {
        editPart(this.parentElement.parentElement)
      }));
}


function getToday() {
  let today = new Date()
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  return yyyy + "-" + mm + "-" + dd; 
}

function editPart(partData) {
  let form = document.getElementById("partForm")
  let editButton = document.getElementById("partButton")  
  form.setAttribute("action", `/editPart/${allData[partData.id].id}`)
  editButton.textContent = "Edit Part"
  document.getElementById("xQM_No").value = allData[partData.id].xQM_No
  document.getElementById("Warranty_No").value = allData[partData.id].Warranty_No
  document.getElementById("Serial_No").value = allData[partData.id].Serial_No
  document.getElementById("date_of_sale").value = allData[partData.id].Date_of_sale
  document.getElementById("date_of_failure").value = allData[partData.id].Date_of_failure
  document.getElementById("Part_No").value = allData[partData.id].Part_number
  document.getElementById("Comments").value = allData[partData.id].Comments
  document.getElementById("Sent_to_Manufacture").value = allData[partData.id].Sent_to_manufacture
  document.getElementById("date_raised").value = allData[partData.id].Date_added
}

function filterParts() {
  let data = document.getElementById('filter-content')
  let innerData = data.querySelectorAll('input, textarea, select')
  let querystr = "/filterParts?"
  let queryBool = false
  innerData.forEach(el => {
    if (el.value != "" & el.name != "") {
      if (queryBool) {
        querystr = querystr + "&"
      }
      querystr = querystr + el.name + "=" + el.value
      queryBool = true 
    }
  })
  if (querystr == "/filterParts?") {
    querystr = "./getParts"
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
        populateTable(data)
        });
    })
}