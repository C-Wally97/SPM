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
            let tableID = document.querySelector("#series_table > tbody");
            for (let i = 0; i < data.length; i++) {
                const tr = document.createElement("tr")
                let tableStr = ""
                tableStr = tableStr + "<td>" + data[i].Series + "</td>"
                tableStr = tableStr + "<td>" + data[i].Description + "</td>"
                tableStr = tableStr + "<td>" + data[i].Product_group + "</td>"
                tableStr = tableStr + "<td>" + data[i].Power_type + "</td>"
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