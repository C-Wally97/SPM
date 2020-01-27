window.onload = function() {
fetch('./parts')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
        let tableID = document.querySelector("#parts_table > tbody");
        for (let i = 0; i < data.length; i++) {
            const tr = document.createElement("tr")
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
            tr.innerHTML = tableStr
            tableID.append(tr)
        }});
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :', err);
  });

}