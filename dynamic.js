const fetch = require("node-fetch")
const fs = require('fs').promises

fs.readdir('../markdown')
	.then( (files) => {
		files = files.filter( (filename) => filename.endsWith('.md') )
		files = files.filter( (filename) => filename !== ('index.md') )
		readPromises = files.map( (filename) => {
			return fs.readFile('../markdown/' + filename, "utf-8")
				.then( (content) => Promise.resolve([content, filename]) )
		})
		Promise.all(readPromises).then( (contents) => {
			const summaries = contents.map( (contentAndFilename) => {
				content = contentAndFilename[0]
				filename = contentAndFilename[1]
				content = content.replace(/^.+\n=+/,'') // remove (title \n ===)
					.replace(/^# .+\n/,'')          // remove (# title)
					.replace(/\n#+ /g,'\n')         // remove markdown sharp
					.replace(/`/g,'')               // remove markdown back quote
					.replace(/^ +- /g,'')           // remove markdown hyphen
					.replace(/\n/g,'')              // remove newline
				return {  filename: filename, summary: content.slice(0,50)}
			})
			json = JSON.stringify(summaries)
			fs.writeFile('list', json)
		})
	} )