$(async function() {
    await thisUser();
});
async function thisUser() {
    fetch("http://localhost:8080/api/users/viewUser")
        .then(res => res.json())
        .then(data => {
            $('#headerUsername').append(data.email);
            let roles = data.roles.map(role => " " + role.name.replace("ROLE_", ""));
            $('#headerRoles').append(roles);


            let userRoles = ``
            for (let role of data.roles) {
                userRoles += role.name.replace("ROLE_", "") + ' '
            }
            let user = `$(
            <tr>
                <td>${data.id}</td>
                <td>${data.username}</td>
                <td>${data.email}</td>
                <td>${userRoles}</td>)
                 `;
            $('#userPanelBody').append(user);
        })
}



