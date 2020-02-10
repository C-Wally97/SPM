let allData;
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
            allData = data;
            let tableID = document.querySelector("#desc_table > tbody");
            for (let i = 0; i < data.length; i++) {
                const tr = document.createElement("tr")
                tr.id = i;
                let tableStr = ""
                tableStr = tableStr + "<td>" + data[i].id + "</td>"
                tableStr = tableStr + "<td>" + data[i].xQM_No + "</td>"
                tableStr = tableStr + "<td>" + data[i].Series_No + "</td>"
                tableStr = tableStr + "<td>" + data[i].Models + "</td>"
                tableStr = tableStr + "<td>" + data[i].Symptoms + "</td>"
                tableStr = tableStr + "<td>" + data[i].Description_of_failure + "</td>"
                tableStr = tableStr + "<td>" + data[i].Technician + "</td>"
                tableStr = tableStr + "<td>" + data[i].Closed + "</td>"
                tableStr = tableStr + "<td>" + data[i].Date_raised + "</td>"
                tableStr = tableStr + '<td><a href="' + data[i].image_location + '">' + data[i].image_location + '</td>'
                tableStr = tableStr + "<td>" + data[i].Fault_type + "</td>"
                tableStr = tableStr + '<a class="waves-effect waves-light btn modal-trigger" href="#myModal" id="editDesc">Edit</a>'
                tr.innerHTML = tableStr
                tableID.append(tr)
            }
            document.querySelectorAll('#editDesc')
            .forEach(i => i.addEventListener("click", function() {
              editDesc(this.parentElement)
            }));
            });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :', err);
      });
    
    }

    document.addEventListener('DOMContentLoaded', function() {
        let elems = document.querySelectorAll('.datepicker');
        let options = {}
        options.format = 'yyyy-mm-dd'
        let instances = M.Datepicker.init(elems,options);
        let modal = document.querySelectorAll('.modal');
        let modalInit = M.Modal.init(modal);
        let select = document.querySelectorAll('select');
        let selectInit = M.FormSelect.init(select);
        document.getElementById('addButton').addEventListener('click', function() {
          let form = document.getElementById("descForm")
          let dateBox = document.getElementById("date_Raised")
          let descButton = document.getElementById("descButton")  
          form.setAttribute("action", "/addDesc")
          descButton.textContent = "Add Description"          
          clearModal()
          dateBox.value = getToday()
        });
      });
      
      function getToday() {
        let today = new Date()
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        return yyyy + "-" + mm + "-" + dd; 
      } 

function clearModal() {
  let data = document.getElementById('descForm')
  let innerData = data.querySelectorAll('input, textarea')
  innerData.forEach(el => {
    el.value = ""
  })
}



function editDesc(descData) {
  console.log(descData)
  let form = document.getElementById("descForm")
  let descButton = document.getElementById('descButton')  
  form.setAttribute("action", `/editDesc/${allData[descData.id].id}`)
  descButton.textContent = "Edit Description"
  document.getElementById("xQM_No").value = allData[descData.id].xQM_No
  document.getElementById("series_No").value = allData[descData.id].Series_No
  document.getElementById("models").value = allData[descData.id].Models
  document.getElementById("symptoms").value = allData[descData.id].Symptoms
  document.getElementById("failure_Desc").value = allData[descData.id].Description_of_failure
  document.getElementById("technician").value = allData[descData.id].Technician
  if(descData.children[7].textContent == 0) {
    document.getElementById("closed").value = "Closed"
  }
  else  {
    document.getElementById("closed").value = "Open"
  }
  document.getElementById("date_Raised").value = allData[descData.id].Date_raised
  document.getElementById("img_Loc").value = allData[descData.id].image_location
  document.getElementById("fault_Type").value = allData[descData.id].Fault_type
}


