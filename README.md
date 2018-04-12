<h2>arcgis-rest-table-plugin</h2>

<img src="https://github.com/nick-romano/arcgis-rest-table-plugin/blob/master/imgs_forpreview/lists.PNG" height="400px"/>

This plugin builds a stylized table from an ArcGIS REST Query, to be used in mapping widgets and applications.

To use the plugin you need the following dependencies in your website:<br>
-ArcGIS for JavaScript API 3.x<br>
-jQuery

Load the module in via a CDN or a dojo require, if you use a dojo require, be sure to use the esri jqueryloader (<a href="https://community.esri.com/thread/184576-how-to-load-jquery-plugins-on-web-appbuilder">more here</a>)


<h3>Parameters</h3>
To activate the plugin, select the DOM element where you want to insert it with jQuery and run the command
<code>.sortableTable({*params*});</code>

You'll also have a few parameters to select:

```JavaScript
  {
    url: /* your REST url */,
    nameField: /* field in resource you want for the name of each feature in the list */, 
    sortField: /* field in resource you want to be able to sort be */, 
    back:  /* this option is if you want a back button, the button will hide the list and empty its contents (true, false) */,
  }  
```



<h3>Give it a try!</h3>

Try your rest URL <a href="https://nick-romano.github.io/arcgis-rest-table-plugin/">here</a>

