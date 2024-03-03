# consult-services-tas
These two html pages are single-use-case applications in HTML5, CSS, and JavaScript. My argument for the design is that it is a slick, fast user experience to simply open the page, quickly get exactly the info that I want, and moving on to other tasks. It's quicker than Google or AI, because it's a single use-case.

All source and markup is in each html file, to make it easiest for me to share with a colleague who might take over maintenance of the app once the logic works. The JavaScript can easily be implemented with any UI.

My favorite part is figuring out the most efficient logic and implementing the object-oriencted programming.

Files:
index.html - search tool for my consulting group. One search field searches three data sets: consultant name, services, and therapeutic areas (TAs) of experience, updating as each letter is typed. The data is in arrays and JSON at the bottom of the script. There are eight possible search result scenarios, calculated from 2 to the power of 3, where match/no-match are the two possibilities and three is the number of data sets. As the user types, eventually there will only be a match in one of the three categories, and the services and TAs are subsequently loaded for all consultants who match the search criteria.

diabetes.html - searches the open clinicaltrials.gov v2 API for the first 100 studies whose titles include the word diabetes. Using the JSON object returned, it attempts to display the most pertinent info for a user who is considering contacting the study to offer their study-support services. Due to the inconsistencies in the JSON structure, the quality of results varies.

