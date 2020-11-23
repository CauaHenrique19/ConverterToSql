class ConvertCsvDataToSql{
    convert(req, res){

        const data = req.body
        const splitedData = data.split('\n')

        let rows = []
        let scripts = []
        
        splitedData.forEach(value => rows.push(value.split(';')))
        
        let headers = rows[0]
        rows.shift()
        let tableName = rows.pop()

        rows.map(row => {
            let rowsMapped = row.map(value => isNaN(Number(value)) ? value = `'${value}'` : value)
            scripts.push(`insert into ${tableName} (${headers}) values (${rowsMapped});`)
        })

        res.send({ querys: scripts })
    }
}

module.exports = ConvertCsvDataToSql