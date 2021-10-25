const client = require(process.cwd() + '/index.js')

module.exports.argCheck = (text, value = 1, value2) => { // this function does not follow the laws of an array but instead makes it simplier
    if (!value2) return text?.split(' ')[value - 1]
    if (value2 === true) return text?.split(' ').slice(value - 1).join(' ')
    else return text?.split(' ').slice(value - 1, value2).join(' ')
}
        
module.exports.get = async (name/*, id*/) => {
    let variable = name?.split('_')
    variable = variable?.slice(0, variable.length - 1).join('_')
    
    if (client.variables[variable] === undefined) return `VariableError: '${variable}' not found!`

    let item = await client.db.get('database', name)
    if (!item?.value) item = { value: client.variables[name] }
    
    return item?.value
}
