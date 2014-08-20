#Search NPM 

##Introduction
The SearchNPM API is a service that allows a person to query packages on the npm registry through HTTP requests.  

##Requests and Response 
A SearchNPM API request will take the following form

 
```http://localhost:8080?searchQuery=searchquery&optionalParameters```

###Request Parameters

Certain parameters are required while others are optional. As is standard in URLs, all parameters are separated using the ampersand (&) character. The list of parameters and their possible values are enumerated below.

####Required parameters

```searchQuery``` - this parameter is a string of the package name or functionallity you are looking for. If the searchQuery parameter is the only parameter that is filled in, then the search will default to a general search that will consider the search query in the following fields: keywords, package description, readme, and package name. 

The ranking will default to giving packages with a higher download frequency, star count, test scripts, and more dependancies a higher weight  compared to packages that don't . 

####Optional parameters 

```searchBy```- This field specifies what specific category or fields you would like to focus the ```searchQuery``` string on. Currently it defaults to a general search, which is described in the section above. 

Current supported ```searchBy``` fields are

- **keyword** - searches through all the npm packages looking for ```searchQuery``` in the keywords field of each package
 
- **description** -  searches through all the npm packages looking for  ```searchQuery``` in the description and readem fields of each package

- **packagename** -  searches through all the npm packages looking for ```searchQuery``` in the name field of each package 

- **author** -  searches through all the npm packages looking for  ```searchQuery```  in author field of each package

- **maintainers** - searches through all the npm packages looking for  ```searchQuery```  in maintainers field of each package

- **dependencies**  - searches through all the npm packages looking for  ```searchQuery``` in dependencies field of each package

- **general** - a general search that will consider the search query in the following fields: keywords, package description, readme, and package name. 
	- NOTE: The ranking in the general search will default to giving packages with a higher download frequency, star count, test scripts, and more dependancies a higher weight  compared to packages that don't. 
	
NOTE: The ranking for any search other than general will default to elasticsearch's default ranking algorithims, unless specified by the ```sortBy``` field

```sortBy```- This field specifies how you want to order your search results. 

Current supported ```sortBy``` fields are 

- **relevance** - This is the default elasticsearch ranking ordering. You can read more about it at <a>http://www.elasticsearch.org/guide/en/elasticsearch/guide/current/relevance-intro.html</a>  

- **issues** - Order search results based on the number of open issues a package has
 
- **stars** - Order search results based on the number of npm stars a package has

- **githubstars** - Order search results based on the number of github stars a package has 

- **downloads** - Order search results based on the number of downloads each package has had over the past month  

- **date** - Order search results based on most recent commit to master from github (NOTE: this can be up to three days off, due to github rate limits)

```from```-  The from parameter defines the offset from the first result you want to fetch.

```size```- The size parameter allows you to configure the maximum amount of hits to be returned.

NOTE: from and size are the same as on <a>http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/search-request-from-size.html</a>.

NOTE: size cannot be a number too large, as this causes problems for elasticsearch. 

```sortOrd```- How search results based on the ```sortBy``` field are ordered. There are currently two supported options for this. 

- **asc** - list the search results in ascending order 

- **desc** - list the search results in descending order 

####Note: If you use any parameter that is not listed, an error will be returned for an invalid request. 

###Response type 
Currently the only supported response type for search results is JSON.


##TODO: 

All functionality left to do are currently documented on the issues tracker for this repository. 

The url is <a>https://github.com/faiqus/searchnpm</a> 
 




