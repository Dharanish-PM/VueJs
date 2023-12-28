const baseUrl="http://10.30.1.96:8098/employee"
// const baseUrl="http://10.30.1.137:8098/loginController"

const get = (arg) => {
    const url=baseUrl+arg
    return fetch(url);
}
const post=(requestBody,arg)=>{
    const url=baseUrl+arg
    return fetch(url, {
        method:'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

const put=(arg) => {
    const url = baseUrl+arg
    return fetch(url, {
        method:'PUT',
        body: "",
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
const puTT=(requestBody,arg) => {
    const url = baseUrl+arg
    return fetch(url, {
        method:'PUT',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export default {
    get,
    post,
    put,
    puTT

}