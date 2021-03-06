let allData;
window.onload = function() {
    fetch('./getSeries')
    .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
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
      document.getElementById("filterButton").addEventListener('click', filterSeries);
      // MATERIALIZE INITIALISATIONS 
      let modal = document.querySelectorAll('.modal');
      let modalInit = M.Modal.init(modal);
      let select = document.querySelectorAll('.select');
      let selectInit = M.FormSelect.init(select);
      // END OF MATERIALIZE INITIALISATIONS 
      document.getElementById('addSeries').addEventListener('click', function() {
        let form = document.getElementById("seriesForm");
        let partButton = document.getElementById("seriesButton");
        form.setAttribute("action", "/addSeries");
        partButton.textContent = "Add Series";
        clearModal();
      });
    });

    function clearModal() {
      let data = document.getElementById('seriesForm');
      let innerData = data.querySelectorAll('input, textarea');
      innerData.forEach(el => {
        el.value = "";
      })
    }
    // seriesData is data of the element that edit button was clicked for
    function editSeries(seriesData) {
      let form = document.getElementById("seriesForm");
      let editButton = document.getElementById("seriesButton");
      form.setAttribute("action", `/editSeries/${allData[seriesData.id].id}`);
      editButton.textContent = "Edit Series";
      document.getElementById("series_No").value = allData[seriesData.id].Series;
      document.getElementById("description").value = allData[seriesData.id].Description;
      document.getElementById("product_Group").value = allData[seriesData.id].Product_group;
      document.getElementById("power_Type").value = allData[seriesData.id].Power_type;
    }
    // data variable is database json data
    function populateTable(data) {
      allData = data;
      let tableID = document.querySelector("#content_table > tbody");
      let tableStr = "<tr><th>Series No</th><th>Description</th><th>Product Group</th><th>Power Type</th></tr>";
      tableID.innerHTML = tableStr;
      for (let i = 0; i < data.length; i++) {
          const tr = document.createElement("tr");
          tr.id = i;
          let tableStr = "";
          tableStr = tableStr + "<td>" + data[i].Series + "</td>";
          tableStr = tableStr + "<td>" + data[i].Description + "</td>";
          tableStr = tableStr + "<td>" + data[i].Product_group + "</td>";
          tableStr = tableStr + "<td>" + data[i].Power_type + "</td>";
          tableStr = tableStr + '<td><a class="waves-effect waves-light btn modal-trigger" href="#myModal" id="editSeries">Edit</a></td>';
          tr.innerHTML = tableStr;
          tableID.append(tr);
      }
      document.querySelectorAll('#editSeries')
      .forEach(i => i.addEventListener("click", function() {
        editSeries(this.parentElement.parentElement);
      }));
    }

    function filterSeries() {
      let data = document.getElementById('filter-content')
      let innerData = data.querySelectorAll('input, textarea, select');
      let querystr = "/filterSeries?";
      let queryBool = false;
      // appends filter data to api call if the filter data on element is not empty
      innerData.forEach(el => {
        if (el.value != "" & el.name != "") {
          if (queryBool) {
            querystr = querystr + "&";
          }
          querystr = querystr + el.name + "=" + el.value;
          queryBool = true;
        }
      })
      if (querystr == "/filterSeries?") {
        querystr = "./getSeries";
      }
      console.log(querystr)
      fetch(querystr)
      .then(function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' + response.status);
          return;
        }
        // Examine the text in the response
        response.json().then(function(data) {
          populateTable(data);
          });
      })
  }