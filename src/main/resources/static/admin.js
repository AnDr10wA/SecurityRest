const url ="http://localhost:8080/api/users";
const urlNewUser ="http://localhost:8080/api/";
const urlRoles ="http://localhost:8080/api/roles";
const authDataUrl ="http://localhost:8080/api/current-user";

const homeTab= document.getElementById("usersTable-tab");
const tableBody = document.querySelector("#adminTable tbody");
const tableUserBody = document.querySelector('#userTable tbody');
const usernameNew= document.getElementById('usernameNew');
const emailNew= document.getElementById('emailNew');
const passwordNew= document.getElementById('passwordNew');
let selectRows ="";
const selectBody= document.getElementById('rolesNew');


const headerDataInfo = document.getElementById('headerData');


const idToEdit= document.getElementById('idEdit');
const usernmaeToEdit= document.getElementById('usernameEdit');
const emailToEdit=document.getElementById('emailEdit');
const passwordToEdit=document.getElementById('passwordEdit');
const rolesToEdit=document.getElementById('rolesEdit');
const idToDelete=document.getElementById('idDelete');


document.addEventListener('DOMContentLoaded', function(){
    fillTable();
    fillHeaderData();
    fillUserArea();
    $('#modalDelete').on("hidden.bs.modal", function() {
        $(this).find('form').trigger('reset');
        document.getElementById('rolesDelete').innerHTML="";
    });
    $('#modalEdit').on("hidden.bs.modal", function() {
        $(this).find('form').trigger('reset');
        document.getElementById('rolesEdit').innerHTML="";
    });
});


fetch (urlRoles)
    .then(res =>res.json())
    .then(data => fillSelect(data));

const fillSelect = (elements) => {
    elements.forEach(element => {
        let shortName = element.name.replace("ROLE_","");
        selectRows += `
        <option value="${element.name}">${shortName}</option>
        `;
    })
    selectBody.innerHTML=selectRows;
}


function stringRoles (element) {
    let x = [];
    element.roles.forEach(role => {
        x.push(role.name.replace("ROLE_",""));
    })
    return x.join(", ");
}

async function fillTable () {
    let tableRows ="";
    await fetch (url)
        .then(response => response.json())
        .then(data => data.forEach(user => {
            tableRows += `
            <tr data-id=${user.id}>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${stringRoles(user)}</td>
                    <td><button type="button" id = "buttonEdit" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalEdit" onclick="fillEditModal()" style="color: #fff">Edit</button></td>
                    <td><button type="button" id = "buttonDelete" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalDelete" onclick="fillDeleteModal()">Delete</button></td>
            </tr>
            `;
        }))
    tableBody.innerHTML=tableRows;
}


async function fillHeaderData () {
    let header='';
    await fetch (authDataUrl)
        .then(res =>res.json())
        .then(user =>{
            header = `
            <a class="navbar-brand" href="#"><b class="font-weight-bold">${user.username}</b> with roles: <span class="font-weight-bold">${stringRoles(user)}
            </span></a>
            `;
        });
    headerDataInfo.innerHTML=header;
}


async function addNewUser(){
    let newUser = {
        username:usernameNew.value,
        email:emailNew.value,
        password:passwordNew.value,
        roles:[]
    }

    for (let option of selectBody.options) {
        if (option.selected) {
            await fetch (urlRoles+'/'+option.value)
                .then(res =>res.json())
                .then(role => newUser.roles.push(role));
        }
    }

    await fetch(urlNewUser,{
        method: 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    });
    fillTable();
    $('.add-user-form').trigger('reset');
    homeTab.click();
}


function fillDeleteRoles (string) {
    let deleteRows = '';
    let stringSplitted = string.split(" ");
    stringSplitted.forEach(el => {
        deleteRows += `
        <option>${el}</option>
        `;
    })
    return deleteRows;
}

function fillDeleteModal() {
    const row = event.target.parentNode.parentNode;
    idToDelete.value=row.children[0].innerHTML;
    document.getElementById('usernameDelete').value=row.children[1].innerHTML;
    document.getElementById('emailDelete').value=row.children[2].innerHTML;
    document.getElementById("delete-button").addEventListener('click',deleteUserFunc,{once: true})
}

let deleteUserFunc = async function deleteUser() {
    console.log(idToDelete.value);
    await fetch(url + '/' + idToDelete.value, {
        method: 'DELETE',
        cache: 'reload',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(idToDelete.value)
    })
    fillTable();
    $('#modalDelete').modal('toggle');
}

function fillEditModal() {
    const row = event.target.parentNode.parentNode;
    idToEdit.value=row.children[0].innerHTML;
    usernmaeToEdit.value=row.children[1].innerHTML;
    emailToEdit.value=row.children[2].innerHTML;
    rolesToEdit.innerHTML=selectRows;
    document.getElementById("edit-button").addEventListener('click',editUserFunc,{once:true})
}

let editUserFunc =async function editUser(){
    console.log(idToEdit.value);
    let editUser = {
        id:idToEdit.value,
        username:usernmaeToEdit.value,
        email:emailToEdit.value,
        password:passwordToEdit.value,
        roles:[]
    }

    for (let option of rolesToEdit.options) {
        if (option.selected) {
            await fetch (urlRoles+'/'+option.value)
                .then(res =>res.json())
                .then(role => editUser.roles.push(role));
        }
    }

    await fetch(url + '/' + idToEdit.value,{
        method: 'PUT',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editUser)
    });
    fillTable();
    fillHeaderData();
    $('#modalEdit').modal('toggle');
}



async function fillUserArea() {
    let tableRowUser = '';
    await fetch(authDataUrl)
        .then(response => response.json())
        .then(user => {

            tableRowUser += `
                <tr data-id=${user.id}>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${stringRoles(user)}</td>
                </tr>
            `;
        })
    tableUserBody.innerHTML = tableRowUser;
}