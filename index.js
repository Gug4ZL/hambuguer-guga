const express = require('express')
const uuid = require('uuid')


const port = 4000
const app = express()
app.use(express.json())


const order = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = order.findIndex(user => user.id === id)


    if (index < 0) {
        return response.status(404).json({ message: "User not found" })
    }

    request.orderIndex = index
    request.orderId = id


    next()
}

const checkUrl = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)

    next()

}




app.get('/order/', (request, response) => {

    return response.json(order)
})

app.post('/order/', checkUrl, (request, response) => {
    
    try{
        const { ClientName, price, orders, status } = request.body
        const user = { id: uuid.v4(), ClientName, orders, price, status }

        order.push(user)

        return response.status(201).json(order)
    }catch (err){
        return response.status(500).json({error:"internal server error"})
    }
})

app.put('/order/:id', checkOrderId, (request, response) => {

    const { ClientName, price, orders, status, obs } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = { id, ClientName, orders, price, status, obs }

    order[index] = updateOrder

    return response.json(updateOrder)
})


app.get('/order/:id', checkOrderId, (request, response) => {

    const id = request.orderId
    const index = request.orderIndex


    return response.status(201).json(order[index])

})

app.delete('/order/:id', checkOrderId, checkUrl, (request, response) => {

    const index = request.orderIndex

    order.splice(index, 1)

    return response.status(204).json()

})

app.patch('/order/:id', checkOrderId, checkUrl, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex


    const { status } = request.body


    return response.status(201).json(order[index])
})


















app.listen(4000, () => {
    console.log(`🐻 Server started on port ${port}`)
})