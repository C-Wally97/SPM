let allData;
window.onload = function() {
    fetch('./getSeries')
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
            let tableID = document.querySelector("#series_table > tbody");
            for (let i = 0; i < data.length; i++) {
                const tr = document.createElement("tr")
                tr.id = i
                let tableStr = ""
                tableStr = tableStr + "<td>" + data[i].Series + "</td>"
                tableStr = tableStr + "<td>" + data[i].Description + "</td>"
                tableStr = tableStr + "<td>" + data[i].Product_group + "</td>"
                tableStr = tableStr + "<td>" + data[i].Power_type + "</td>"
                tableStr = tableStr + '<a class="waves-effect waves-light btn modal-trigger" href="#myModal" id="editSeries">Edit</a>'
                tr.innerHTML = tableStr
                tableID.append(tr)
            }
            document.querySelectorAll('#editSeries')
            .forEach(i => i.addEventListener("click", function() {
              editSeries(this.parentElement)
            }));
            });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :', err);
      });
    }

    document.addEventListener('DOMContentLoaded', function() {
      let modal = document.querySelectorAll('.modal');
      let modalInit = M.Modal.init(modal);
      document.getElementById('addSeries').addEventListener('click', function() {
        let form = document.getElementById("seriesForm")
        let partButton = document.getElementById("seriesButton")  
        form.setAttribute("action", "/addSeries")
        partButton.textContent = "Add Series"
        clearModal()         
      });
    });

    function clearModal() {
      let data = document.getElementById('seriesForm')
      let innerData = data.querySelectorAll('input, textarea')
      innerData.forEach(el => {
        el.value = ""
      })
    }

    function editSeries(seriesData) {
      console.log(allData[seriesData.id])
      let form = document.getElementById("seriesForm")
      let editButton = document.getElementById("seriesButton")  
      form.setAttribute("action", `/editSeries/${allData[seriesData.id].id}`)
      editButton.textContent = "Edit Series"
      document.getElementById("series_No").value = allData[seriesData.id].Series
      document.getElementById("description").value = allData[seriesData.id].Description
      document.getElementById("product_Group").value = allData[seriesData.id].Product_group
      document.getElementById("power_Type").value = allData[seriesData.id].Power_type
    }