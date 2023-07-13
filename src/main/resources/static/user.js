const url = 'http://localhost:8080/api/current-user';
let tableBody = document.querySelector('#userTable tbody');
let headerData = document.getElementById('headerData');


document.addEventListener('DOMContentLoaded', function () {
    fillUserPage();
});

function stringRoles(element) {
    let roleArray = [];
    element.roles.forEach(role => {
        roleArray.push(role.name.replace("ROLE_", ""));
    })
    return roleArray.join(", ");
}

async function fillUserPage() {
    let tableRow = '';
    let header = '';
    await fetch(url)
        .then(response => response.json())
        .then(user => {

            header = `
            <a class="navbar-brand" href="#"><b class="font-weight-bold">${user.username}</b> with roles: <span class="font-weight-bold">${stringRoles(user)}
            </span></a>
            `;

            tableRow += `
                <tr data-id=${user.id}>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${stringRoles(user)}</td>
                </tr>
            `;
        })
    tableBody.innerHTML = tableRow;
    headerData.innerHTML = header;
}