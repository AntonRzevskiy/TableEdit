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
        [ {"val":"head 1"}, {"val":"head 2"}, {"val":"head 3"}, {"val":"head 4"}, {"val":"head 5","settings":{"class":"danger"}} ],
        [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value","settings":{"class":"warning"}} ],
        [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value","settings":{"class":"warning"}} ],
        [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value","settings":{"class":"warning"}} ],
        [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value","settings":{"class":"warning"}} ],
        [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value","settings":{"class":"warning"}} ]
    ]

</textarea>
```
```javascript
jQuery(document).ready(function($){

    $('#from-textarea').tableEdid();

});
```

#### From Array or Json (TBody section only)
```javascript
var Table = [
    [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"} ],
    [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"} ],
    [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"} ],
    [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"} ],
    [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"} ]
];

Table.tableEdid();
```

#### From Object (ALL Sections)
```javascript
var Table = {
    "theadArray": [
        [ {"val":"head 1"}, {"val":"head 2"}, {"val":"head 3"}, {"val":"head 4"}, {"val":"head 5"} ]
    ],
    "tbodyArray": [
        [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"} ],
        [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"} ],
        [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"} ],
        [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"} ],
        [ {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"}, {"val":"value"} ]
    ],
    "tfootArray": [
        [ {"val":"foot 1"}, {"val":"foot 2"}, {"val":"foot 3"}, {"val":"foot 4"}, {"val":"foot 5"} ]
    ]
};

Table.tableEdid();
```
