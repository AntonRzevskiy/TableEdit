# TableEdit

## Usage

#### From HTML Table
```html
<table id="from-table" class="table table-bordered table-hover">
    <thead>
        <tr>
            <th>head 1</th>
            <th>head 2</th>
            <th>head 3</th>
            <th>head 4</th>
            <th>head 5</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>value</td>
            <td colspan="2" class="warning colspan">value</td>
            <td>value</td>
            <td>value</td>
        </tr>
        <tr>
            <td>value</td>
            <td>value</td>
            <td>value</td>
            <td>value</td>
            <td>value</td>
        </tr>
    </tbody>
</table>
```
```javascript
jQuery(document).ready(function($){

    $('#from-table').tableEdid();

});
```

#### From HTML Textarea
```html
<textarea id="from-textarea" class="hidden">

    [
        [ {"value":"head 1"}, {"value":"head 2"}, {"value":"head 3"}, {"value":"head 4"}, {"value":"head 5","settings":{"class":"danger"}} ],
        [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value","settings":{"class":"warning"}} ],
        [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value","settings":{"class":"warning"}} ],
        [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value","settings":{"class":"warning"}} ],
        [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value","settings":{"class":"warning"}} ],
        [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value","settings":{"class":"warning"}} ]
    ]

</textarea>
```
```javascript
jQuery(document).ready(function($){

    $('#from-textarea').tableEdid();

});
```

#### From Array or Json
```javascript
var Table = [
    [ {"value":"head 1"}, {"value":"head 2"}, {"value":"head 3"}, {"value":"head 4"}, {"value":"head 5"} ],
    [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"} ],
    [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"} ],
    [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"} ],
    [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"} ],
    [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"} ]
];

Table.tableEdid();
```

#### From Object
```javascript
var Table = {
    "thead": [
        [ {"value":"head 1"}, {"value":"head 2"}, {"value":"head 3"}, {"value":"head 4"}, {"value":"head 5"} ]
    ],
    "tbody": [
        [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"} ],
        [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"} ],
        [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"} ],
        [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"} ],
        [ {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"}, {"value":"value"} ]
    ],
    "tfoot": [
        [ {"value":"foot 1"}, {"value":"foot 2"}, {"value":"foot 3"}, {"value":"foot 4"}, {"value":"foot 5"} ]
    ]
};

Table.tableEdid();
```
