// ** this is just a copy of the JS used in the diabetes.html page
// global vars
var myA
var curI = 0
var studyText
var obj
var jdata
var temp

// load json from ct.gov
var titles = "diabetes";
//var fields = "NCTId,BriefTitle,Condition,InterventionName,Phase,EligibilityCriteria,PrimaryOutcomeMeasure,LeadSponsorName,CentralContactName";
var fields = "ProtocolSection";
var status = "ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION,NOT_YET_RECRUITING,RECRUITING,AVAILABLE,UNKNOWN";
var dates = "&query.term=AREA[LastUpdatePostDate]RANGE[2018-01-15,MAX]"
url = 'https://clinicaltrials.gov/api/v2/studies?query.titles=' + titles + '&fields=' + fields + dates + '&postFilter.overallStatus=' + status + '&pageSize=100&format=json';
//url = 'diabetes2.json';
fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Process the response data
        //console.log(data);
        jdata = data
        scourData();
        // clear memory
        data = null
    })
    .catch(error => {
        // Handle errors
        console.error('There was a problem with the request:', error);
    });

// HELPER FUNCTIONS
function updateGui() {

    // nav btns
    nxtBtn.disabled = (curI == (myA.length - 1)) ? true : false;
    bckBtn.disabled = (curI > 0) ? false : true;

    ctr.textContent = (curI + 1) + " of " + myA.length;

    studyText = ""
    obj = myA[curI]

    Object.keys(obj).forEach(key => {
        // don't need url text
        if (key != "url") {
            // filter missing info
            if (obj[key] != undefined) {
                studyText += key + ": " + obj[key] + "<br><br>";
            }
        }
    });

    box5.innerHTML = studyText;
}
// nav
function btnMgr(id) {
    if (id == "nxt") {
        curI++;
    } else {
        curI--;
    }
    updateGui()
}
function scourData() {

    myA = [];

    for (const i in jdata.studies) {
        // first 0 = protocol section
        //const nctId = data.studies[0].protocolSection.identificationModule.nctId;
        //console.log(nctId)

        temp = jdata.studies[i].protocolSection;

        obj = {
            url: temp.identificationModule.nctId,
            Title: temp.identificationModule.briefTitle,
            Start: temp.statusModule.startDateStruct.date,
            Status: temp.statusModule.overallStatus,
            Sponsor: temp.sponsorCollaboratorsModule.leadSponsor.name,
            Summary: temp.descriptionModule.briefSummary,
            Type: temp.designModule.studyType,
            Phase: temp.designModule.phases,
            Enroll: temp.designModule.enrollmentInfo.count,
            Outcome: temp.outcomesModule.primaryOutcomes[0].measure,
            TxDuration: temp.outcomesModule.primaryOutcomes[0].timeFrame
        };
        // irregular structures in json
        var t = lookup(temp.contactsLocationsModule, "name")
        if (t != null) obj.Name = t[1];

        t = lookup(temp.contactsLocationsModule, "phone")
        if (t != null) obj.Phone = t[1]

        t = lookup(temp.contactsLocationsModule, "email")
        if (t != null) obj.Email = t[1]
        // save
        myA.push(obj);
    }

    // ready for gui
    jdata = null;
    updateGui();
}
// thanks to https://stackoverflow.com/questions/38805134/search-key-in-nested-complex-json
function lookup(obj, k) {
    // search whole obj for key - 1. the 'in' operator
    for (var key in obj) {
        // assign value
        var value = obj[key];
        // if found with 'in' statement
        if (k == key) {
            return [k, value];
        }
        // typeof return obj, str, num, etc, and if it's not an array
        if (typeof (value) === "object" && !Array.isArray(value)) {
            var y = lookup(value, k);
            // this if statement is almost never true
            if (y && y[0] == k) return y;
        }
        // if the object is an array, iterate through it
        if (Array.isArray(value)) {
            // for..in doesn't work the way you want on arrays in some browsers
            //
            for (var i = 0; i < value.length; ++i) {
                var x = lookup(value[i], k);
                // returns e.g. ["name","Dr Name"] so desired value is [1]
                if (x && x[0] == k) return x;

            }
        }
    }

    return null;
}
// ctgov url button
function linkBtn() {
    // else launch linkedin
    window.open("https://clinicaltrials.gov/study/" + myA[curI].url, "_blank");
}
function makeFile(csv) {
    const blob = new Blob([csv], { type: 'text/csv' });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');

    // Set the link's href attribute to the temporary URL
    link.href = url;

    // Set the link's download attribute to the desired file name
    link.download = "ctgov " + titles;

    // Append the link to the document body
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up by removing the link and revoking the temporary URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
// export to csv
function exportCsv() {
    // pretty column heads (as opposed to using key names)
    let csv = ["ID", "Title", "Start", "Status", "Sponsor", "Summary", "Type", "Phase", "TargetEnroll", "Outcomes", "TreatmentDuration"]
    csv += '\n';
    // load rows
    for (const obj of myA) {
        let row = '';

        // Iterate over each key in the object
        for (const key in obj) {
            // Check if the value is null or undefined
            let value = (obj[key] !== null && obj[key] !== undefined) ? obj[key] : '';

            // make ids into links
            if (key == "url") {
                let t = value;
                value = "https://clinicaltrials.gov/study/" + t;
            }

            // Add the value to the row
            row += `"${value}",`;
        }

        // Trim the trailing comma and add a newline character
        csv += row.slice(0, -1) + '\n';
    }
    //console.log(csv);
    makeFile(csv);
}
// results section load here
var box5 = document.getElementById('box5');
// nav
var nxtBtn = document.getElementById('nxt');
var bckBtn = document.getElementById('bck');
var cnt = document.getElementById('ctr');