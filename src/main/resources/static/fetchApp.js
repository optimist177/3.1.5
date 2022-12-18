const url = 'http://localhost:8080/api/users'
const urlRoles = 'http://localhost:8080/api/roles'

let  usersList = document.querySelector('.usersList')
let  result = ''

getUsers()

function getUsers() {
    fetch(url).then(response => response.json())
        .then(data => {drawTable(data)})
        .catch(err => console.log(err))
}

const drawTable = (users) => {
    usersList.innerHTML = ''
    result = ''
    users.forEach(user => {
        let userRoles = ``
        for (let role of user.roles) {
            userRoles += role.name.replace("ROLE_", "") + ' '
        }
        result += `<tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${userRoles}</td>
                    <td><button type="button" class="btn btn-info text-white editButton" data-bs-toggle="modal">Edit</button></td>
                    <td><button type="button" class="btn btn-danger text-white deleteButton" data-bs-toggle="modal">Delete</button></td>
                </tr>`
    })
    usersList.innerHTML = result
}

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

const editModal = new bootstrap.Modal(document.getElementById('editModal'))
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'))

on(document, 'click', '.editButton', e => {
    const tableRow = e.target.parentNode.parentNode
    let editIdForm = tableRow.children[0].innerHTML

    fetch(url + '/' + editIdForm)
        .then(res => res.json())
        .then(data => showEditModal(data))
})

on(document, 'click', '.deleteButton', e => {
    const tableRow = e.target.parentNode.parentNode
    let deleteIdForm = tableRow.children[0].innerHTML

    fetch(url + '/' + deleteIdForm)
        .then(res => res.json())
        .then(data => showDeleteModal(data))
})

//+++++++++++++++++++++++++++++++EDIT+++++++++++++++++++++++++++++++//
const showEditModal = (user) => {
    const editId = document.getElementById('edit_id_input')
    const editUsername = document.getElementById('edit_username_input')
    const editEmail = document.getElementById('edit_email_input')
    const editRoles = document.getElementById('edit_roles_select')

    editId.value = user.id
    editUsername.value = user.username
    editEmail.value = user.email

    while (editRoles.options.length) {
        editRoles.options[0] = null;
    }
    fetch(urlRoles)
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                user.roles.forEach(userRole => {
                    if (userRole.id === role.id) {
                        editRoles.append(new Option(role.name.replace("ROLE_", ""), role.id, true, true));
                        role = true;
                    }
                });
                role !== true ? editRoles.append(new Option(role.name.replace("ROLE_", ""), role.id)) : null;
            });
        });

    editModal.show()

    const editUserButton = document.querySelector('.editUserButton')
    editUserButton.addEventListener('click', e => {
        e.preventDefault()

        let rolesFromForm = document.getElementById('edit_roles_select')
        let selectedOptions = rolesFromForm.selectedOptions
        let selected = []
        for (let i = 0; i < selectedOptions.length; i++) {
            selected.push({id: selectedOptions[i].value, name: 'ROLE_' + selectedOptions[i].text})
        }
        let prevPass = user.password
        let pass;
        if (document.getElementById('edit_password_input').value === '') {
            pass = prevPass
        } else {
            pass = document.getElementById('edit_password_input').value
        }
        let data = {
            id: editId.value,
            username: editUsername.value,
            email: editEmail.value,
            password: pass,
            roles: selected
        }
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(getUsers)
        editModal.hide()
        document.getElementById('edit_password_input').value = ''
    })
}
//+++++++++++++++++++++++++++++++EDIT+++++++++++++++++++++++++++++++//

//++++++++++++++++++++++++++++++DELETE++++++++++++++++++++++++++++++//
const showDeleteModal = (user) => {
    const deleteId = document.getElementById('delete_id_input')
    const deleteUsername = document.getElementById('delete_username_input')
    const deleteEmail = document.getElementById('delete_email_input')
    const deleteRoles = document.getElementById('delete_roles-select')

    deleteId.value = user.id
    deleteUsername.value = user.username
    deleteEmail.value = user.email

    while (deleteRoles.options.length) {
        deleteRoles.options[0] = null
    }
    fetch(urlRoles)
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                user.roles.forEach(userRole => {
                    if (userRole.id === role.id) {
                        deleteRoles.append(new Option(role.name.replace("ROLE_", ""), role.id, true, true))
                        role = true
                    }
                });
                role !== true ? deleteRoles.append(new Option(role.name.replace("ROLE_", ""), role.id)) : null
            })
        })

    deleteModal.show()

    const deleteUserButton = document.querySelector('.deleteUserButton')
    deleteUserButton.addEventListener('click', e => {
        e.preventDefault()
        fetch(url + '/' + user.id, {method: 'DELETE'})
           .then(getUsers)
        deleteModal.hide()
    })
}
//++++++++++++++++++++++++++++++DELETE++++++++++++++++++++++++++++++//

//+++++++++++++++++++++++++++++++ADD++++++++++++++++++++++++++++++++//
const username = document.getElementById('username_input')
const email = document.getElementById('email_input')
const password = document.getElementById('password_input')
const formRoles = document.getElementById('roles')

fetch(urlRoles)
    .then(res => res.json())
    .then(roles => {
        roles.forEach(role => {
            formRoles.append(new Option(role.name.replace("ROLE_", ""), role.id + ''))
        })
    })

const addUserButton = document.querySelector('#addUser')
addUserButton.addEventListener('click', e => {
    e.preventDefault()
    let rolesFromForm = document.getElementById('roles')
    let selectedOptions = rolesFromForm.selectedOptions
    let selected = []
    for (let i = 0; i < selectedOptions.length; i++) {
        selected.push({id: selectedOptions[i].value, name: 'ROLE_' + selectedOptions[i].text})
    }

    let data = JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
        roles: selected
    })

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
        .then(getUsers)

    username.value = ''
    email.value = ''
    password.value = ''
    formRoles.value = ''
})
//+++++++++++++++++++++++++++++++ADD++++++++++++++++++++++++++++++++//