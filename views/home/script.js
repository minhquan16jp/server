axios({
    method: 'post',
    url: '/crawl'
}).then(res => {
    const tableListBody = document.querySelector("#listCode");
    tableListBody.innerHTML = '';
    res.data.forEach((item, index) => {
        tableListBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.code}</td>
            </tr>
        `
    })
}).catch(err => {
    console.log(err)
})