## Live - Reload

a small node server for refreshing files in a browser while working

it will definitely runs on node v7.3.0
```console
npm start
```

if there are any changes to the client file then you will need to run gulp on the files
```console
npm run build-client
```

### config

there is a JSON file in root that the server will currently use as a way to watch the files or directories you are working on

```json
{
	"root": "/main/root/directory/for/server/in/linux",
	"watch": [
		"sub/directories",
		"or/files.txt",
		"to/watch"
	]
}
```

you can call the script in the webpage manually by setting the src to the address of the node server

for local server
```html
<script type="text/javascript" src='/assets/scripts/main.js'></script>
```

for external website
https://you.example.com
```html
<script type="text/javascript" src='https://localhost:3001/assets/scripts/main.js'></script>
```

there are ssl files but they were quick and might work for other purposes, but probably not
