const http = require('https')

class ConvertDataToSql{
    convert(req, res){

        try{
            let data = req.headers['content-type'] == 'application/json' ?  req.body : eval(req.body);

            let tableName = '' 
            let keys = []
            let values = []
            let scripts = []

            if(Array.isArray(data)){
                tableName = data.pop()
                data.map(d => {
                    keys = Object.keys(d)
                    values = Object.values(d)

                    let valuesMapped = values.map(value => typeof value == 'string' ? value = `'${value}'` : value)
                    scripts.push(`insert into ${tableName['tableName']} (${keys}) values (${valuesMapped});`)
                })
            }
            else{
                tableName = data['tableName']
                delete data['tableName']

                keys = Object.keys(data)
                values = Object.values(data)

                let valuesMapped = values.map(value => typeof value == 'string' ? value = `'${value}'` : value)
                scripts.push(`insert into ${tableName} (${keys}) values (${valuesMapped});`)
            }

            res.status(200).send({ querys: scripts })
        }
        catch(error){
            res.status(400).send({ error: `Informe uma informação válida!, ${error.stack}` })
        }
    }
}

module.exports = ConvertDataToSql