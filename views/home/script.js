axios({
  method: "post",
  url: "/crawl",
})
  .then((response) => {
    console.log(response);
    const tableListBody = document.querySelector("#listCode");
    tableListBody.innerHTML = "";

    response.data.forEach((item, index) => {
      Object.keys(item.codes).forEach((groupName) => {
        tableListBody.innerHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${item.mail}</td>
            <td>${item.codes[groupName]}</td>
          </tr>
        `;
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
