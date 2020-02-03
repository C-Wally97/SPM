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
            let tableID = document.querySelector("#desc_table > tbody");
            for (let i = 0; i < data.length; i++) {
                const tr = document.createElement("tr")
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
                tableStr = tableStr + '<button type="button">edit</button>'
                tr.innerHTML = tableStr
                tableID.append(tr)
            }
            document.querySelectorAll('#test > tr > td')
            .forEach(i => i.addEventListener("click", function() {
            console.log(this.textContent);
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
      });

      document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);
      });


      document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems, options);
      });


