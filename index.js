const express = require("express");
const uuid = require("uuid");
const port = 3004;
const app = express();


app.use(express.json());

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex( user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "User not found"})
    }

    request.userIndex = index 

    next()
}

app.get('/users', (request, response) => {

    let cleanData = []
    
    users.forEach( user => {
        let userWithoutPassword = {
            id: user.id,
            email: user.email,
            nameUser: user.nameUser,
            name: user.name
        }

        cleanData.push(userWithoutPassword)
    })

    return response.json(cleanData)
})

app.post('/users', (request, response) => {
    const { name, email, password, nameUser } = request.body

    let alreadyHasEmail = false
    let alreadyHasUser = false

    function checkEmail(email) {
        
        users.forEach( user => {
            if(email === user.email) {
                alreadyHasEmail = true
            } 
        }) 
    }

    checkEmail(email)

    function checkUser(nameUser) {
        
        users.forEach( user => {
            if(nameUser === user.nameUser) {
                alreadyHasUser = true
            } 
        }) 
    }

    checkUser(nameUser)

    if(alreadyHasEmail) {
        return response.status(400).json({message: "Email já cadastrado."})
    }

    if(alreadyHasUser) {
        return response.status(400).json({message: "Nome de usuário já cadastrado."})
    }

    if(password.length < 6) {
        return response.status(404).json({ message: "No mínimo 6 caracteres."})
    }

    if(email == users.email) {
        return response.status(404).json({ message: "Esse email já está cadastrado."})
    }

    const user = { id: uuid.v4(), name, email, password, nameUser }

    users.push(user)
    return response.status(201).json(user) 
})

app.put('/users/:id', checkUserId, (request, response) => {
    const { id } = request.params
    const { name, email, password, nameUser} = request.body
    const index = request.userIndex

    const updatedUser = { id, name, email, password, nameUser } 

    users[index] = updatedUser

    return response.json(updatedUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const { id } = request.params
    const index = request.userIndex

    const newUsers = users.filter( user => user.id !== id)

    users.splice(index,1)
    
    return response.status(204).json(newUsers)
})

app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`)
})