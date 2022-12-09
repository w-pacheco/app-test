SharePointApi v3.0
==================

SharePointApi v3.0 is collection of methods used to call list data on a Microsoft SharePoint site collection via the REST API. Regardless the complexity of your project, SharePointApi is a great tool to have in your corner. Whether using to create a webpart or custom single page application, SharePointApi provides developers a platform to quickly design & create within a site collection.

Author: Wilfredo Pacheco  
_(C) 2020-2022 SharePointApi_

---
## Getting Started

Get started by including SharePointApi's production-ready JavaScript without the need for any build steps. Some of our components require the use of JavaScript to function. They require jQuery and we use jQuery’s $.ajax method to make the REST API calls.

### HTML Script Imports
``` html
<script type="text/javascript" src="./SharePointApi_v3/dist/SharePointApi.jQuery.js"></script>
<script type="text/javascript" src="./SharePointApi_v3/dist/SharePointApi.fetch.js"></script>
<script type="text/javascript" src="./SharePointApi_v3/dist/SharePointApi.xhr.js"></script>

<script type="text/javascript">
    var Route = new SharePointApi();
</script>
```

### Module Imports
``` javascript
import './SharePointApi_v3/dist/SharePointApi.jQuery.js';

const Route = new SharePointApi();
```
OR
``` javascript
import SharePointApi from './SharePointApi_v3/src/SharePointApi.js';

const Route = new SharePointApi({
    method: 'jQuery',
    verbose: false,
    statusCode: {
        307: function() {
            alert( 'The application needs to refresh.');
            return location.reload();
        }
    }
});
```
OR
``` javascript
import SharePointApi from './SharePointApi_v3/src/SharePointApi.js';

const Route = new SharePointApi({
    method: 'fetch',
    verbose: false,
});
```