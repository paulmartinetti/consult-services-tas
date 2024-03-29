// ** this is just a copy of the JS used in the index.html page
// global vars
var c = {}
var s = {}
var t = {}
c.id = "c"
s.id = "s"
t.id = "t"
c.curA = []
s.curA = []
t.curA = []
c.curI = -1;
s.curI = -1;
t.curI = -1;
var res = 0;
var temp
var yes
//

// init
function loadAll() {

    // load a button for each consultant
    for (let i = 0; i < c.len; i++) {
        makeBtn(i, c);
    }

    // load a button for each service
    for (let i = 0; i < s.len; i++) {
        makeBtn(i, s);
    }

    // load a button for each TA
    for (let i = 0; i < t.len; i++) {
        makeBtn(i, t);
    }
}

// respond to search typing
function getQ(tx) {

    // wait for 2 letters
    if (tx.length < 2) return;

    /**
     * Keep associated boxes, btns, data together
     * object names "c", "s", "t"
     * obj.id = "c" - used for buttons
     * obj.curA = [] - current subset of indices to display as buttons
     * obj.curI = -1 - selected button
     * obj.data = data array for object
     * obj.len = length of data array
     * obj.box = box in ui where buttons are loaded
    */

    // reset interface
    c.curA = [];
    s.curA = [];
    t.curA = [];
    res = 0;
    this.feedback(" ");
    resetBtns(c);
    resetBtns(s);
    resetBtns(t);

    tx = tx.toLowerCase();

    // search consultants for text tx
    for (const i in c.data) {
        // capture consultant name
        temp = c.data[i];
        // indexOf fn is case-sensitive
        temp = temp.toLowerCase();

        // grabs the index wn the string, -1 if no result
        yes = temp.indexOf(tx);

        // if there is a match, add the index to the results array
        if (yes !== -1) {
            c.curA.push(i);
        }
    }
    // results
    if (c.curA.length > 0) res = 1;

    // search services for text tx
    for (const i in s.data) {
        // capture service name
        temp = s.data[i];
        // indexOf fn is case-sensitive
        temp = temp.toLowerCase();

        // grabs the index wn the string, -1 if no result
        yes = temp.indexOf(tx);

        // if there is a match, add the index to the results array
        if (yes !== -1) {
            s.curA.push(i);
        }
    }
    // update results case
    if (s.curA.length > 0) res = (res == 1) ? 3 : 2;

    // search TAs for text tx
    for (const i in t.data) {
        // capture service name
        temp = t.data[i];
        // indexOf fn is case-sensitive
        temp = temp.toLowerCase();

        // grabs the index wn the string, -1 if no result
        yes = temp.indexOf(tx);

        // if there is a match, add the index to the results array
        if (yes !== -1) {
            t.curA.push(i);
        }
    }

    // update results case
    if (t.curA.length > 0) res += 4;

    /**
    * Result cases (both = c + s)
    * 0 - both no, TA no
    * 1 - consultant yes, service no, TA no
    * 2 - consultant no, service yes, TA no
    * 3 - both yes, TA no
    * 4 - both no, TA yes
    * 5 - consultant yes, service no, TA yes
    * 6 - consultant no, service yes, TA yes
    * 7 - both yes, TA yes
    * 
    * if TA, res += 4
    * **/
    switch (res) {
        //
        case 0:
            this.feedback("No results, please try again")
            break;

        case 1: // consultant match
            // update consultants
            upBtns(c);
            // get services for these consultants
            getServices(c.curA);
            // get TAs for these consultants
            getTAs(c.curA)
            break;

        case 2: // service match
            upBtns(s);
            getConsultants(s, "A")
            getTAs(c.curA)
            break;

        case 3: // both match, do not load TAs
            upBtns(c)
            upBtns(s)
            break;

        case 4: // TA match
            upBtns(t);
            getConsultants(t, "A")
            getServices(c.curA);
            break;

        case 5: // c and t match
            upBtns(c)
            upBtns(t)
            getServices(c.curA)
            break;

        case 6: // inconclusive
            upBtns(s)
            upBtns(t)
            break;

        case 7: // inconclusive
            upBtns(c)
            upBtns(s)
            upBtns(t)
            break;
    }
}
// click on a consultant button
function btnMgr(id) {
    // reset gui
    this.feedback(" ");
    w1.value = "";
    // which btn - c, s, or t
    let sw = id.charAt(0);
    switch (sw) {
        case "c":
            //
            resetBtns(c);
            // get consultant index
            c.curI = parseInt(id.substring(1));

            // update services for just this consultant
            getServices(c.curI)

            // update TAs for this consultant
            getTAs(c.curI)
            break;
        case "s":
            resetBtns(s);

            // get service index
            s.curI = parseInt(id.substring(1));
            getConsultants(s)

            // update TAs for these consultants
            getTAs(c.curA);
            break;
        case "t":
            // TA chosen
            resetBtns(t)
            // get TA index
            t.curI = parseInt(id.substring(1));

            getConsultants(t)

            // update services for these consultants (who matched TA)
            getServices(c.curA);
            break;
    }
    // show selected
    let btn = document.getElementById(id);
    btn.className = "button has-background-linkedin has-text-white";
}

/****** HELPER FUNCTIONS ******/
// accepts a services or TA object, and type="A" if we want it to use the curA instead of curI
function getConsultants(obj, type = "") {
    // clear consultants
    c.curA = [];
    c.curI = -1;
    // if services
    if (obj.id == "s") {
        // if it's an array
        if (type == "A") {
            for (const i in obj.curA) {
                // check whole csdata array
                for (const j in csdata) {
                    // if consultant index is found in a pair, grab the service index
                    if (obj.curA[i] == csdata[j].sind) c.curA.push(csdata[j].cind);
                }
            }
        } else {
            // it's one id
            for (const j in csdata) {
                // if consultant index is found in a pair, grab the service index
                if (obj.curI == csdata[j].sind) c.curA.push(csdata[j].cind);
            }
        }
        // it's one or more TAs
    } else {
        // if it's an array
        if (type == "A") {
            for (const i in obj.curA) {
                // check whole csdata array
                for (const j in ctdata) {
                    // if consultant index is found in a pair, grab the TA index
                    if (obj.curA[i] == ctdata[j].tind) c.curA.push(ctdata[j].cind);
                }
            }
        } else {
            // it's one id
            for (const j in ctdata) {
                // if consultant index is found in a pair, grab the TA index
                if (obj.curI == ctdata[j].tind) c.curA.push(ctdata[j].cind);
            }
        }
    }
    // remove dups
    c.curA = removeDups(c.curA)
    upBtns(c);
}
// accepts a consultant id, or an array of ids
function getServices(obj) {
    // clear services
    s.curA = [];
    s.curI = -1;
    // if it's an array
    if (Array.isArray(obj)) {
        for (const i in obj) {
            // check whole csdata array
            for (const j in csdata) {
                // if consultant index is found in a pair, grab the service index
                if (obj[i] == csdata[j].cind) s.curA.push(csdata[j].sind);
            }
        }
    } else {
        // it's one id
        for (const j in csdata) {
            // if consultant index is found in a pair, grab the service index
            if (obj == csdata[j].cind) s.curA.push(csdata[j].sind);
        }
    }
    // remove dups
    s.curA = removeDups(s.curA)
    upBtns(s);
}
// accepts a consultant id, or an array of ids
function getTAs(obj) {
    // clear services
    t.curA = [];
    t.curI = -1;
    // if it's an array
    if (Array.isArray(obj)) {
        for (const i in obj) {
            // check whole csdata array
            let ti = obj[i]
            for (const j in ctdata) {
                // if consultant index is found in a pair, grab the TA index
                if (ti == ctdata[j].cind) t.curA.push(ctdata[j].tind);
            }
        }
    } else {
        // it's one id
        for (const j in ctdata) {
            // if consultant index is found in a pair, grab the TA index
            if (obj == ctdata[j].cind) t.curA.push(ctdata[j].tind);
        }
    }
    t.curA = removeDups(t.curA)
    upBtns(t);
}
function removeDups(myA) {
    const uniqueVals = new Set(myA);
    const uniqueA = [...uniqueVals];
    return uniqueA;
}
// remove all consultant or service buttons when given the parent container (box5 = consultants)
function removeAllChildNodes(box) {
    // remove btn listeners
    for (var i = 0; i < box.children.length; i++) {
        box.children[i].removeEventListener('click', function (event) {
            btnMgr(event.target.id);
        });
    }
    // remove buttons
    while (box.firstChild) {
        box.removeChild(box.firstChild);
    }
}
// all text prompts are fed through this function
function feedback(t) {
    r1.innerHTML = t;
}
// reset all buttons c, s, or t
function resetBtns(obj) {
    // reset curC
    obj.curI = -1;
    // use box5, get children
    let boxLen = obj.box.children.length;
    for (var i = 0; i < boxLen; i++) {
        obj.box.children[i].className = "button";
    }
}
// update buttons given data obj including .box, .curA
function upBtns(obj) {
    // remove current buttons
    removeAllChildNodes(obj.box);
    // add buttons based on indices
    for (const i in obj.curA) {
        makeBtn(obj.curA[i], obj);
    }
}

// make a consultant button with index idx and add it to box5
function makeBtn(idx, obj) {
    //console.log(idx)
    if (obj.data[idx].length < 1) return;

    let btn = document.createElement('button');
    btn.textContent = obj.data[idx];
    btn.id = obj.id + idx;
    btn.className = "button"
    btn.addEventListener('click', function (event) {
        btnMgr(event.target.id);
    });
    obj.box.appendChild(btn);
}

function resetBtn() {
    // remove current buttons
    removeAllChildNodes(c.box);
    // remove current buttons
    removeAllChildNodes(s.box);
    // remove current buttons
    removeAllChildNodes(t.box);
    loadAll();
    feedback("Search a consultant, service, or therapeutic area");
    w1.value = "";
}

// linked in button
function linkBtn() {
    // if no consultant selected
    if (c.curI < 0) {
        feedback("Please choose a consultant");
        return;
    }
    // else launch linkedin
    window.open(rdata[c.curI].link, "_blank");
}

// email button - copy to clipboard
function emailBtn() {
    // if no consultant selected
    if (c.curI < 0) {
        feedback("Please choose a consultant");
        return;
    }
    // else copy email address to clipboard
    var emailAddress = rdata[c.curI].email;
    var tempInput = document.createElement("input");
    tempInput.value = emailAddress;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    feedback("Email address copied to clipboard");
}

// DATA
// cdata is our names
c.data = ["Colin Miller", "Gitte Andreasen", "Andrew Beck", "Deepak Behera", "Liz Bloss", "Martin Collyer", "Lisa Cooper", "Dawn Flitcraft", "Jim Gilligan", "Marilyn Julien", "Jonathan Larkin", "Graham G. Lumsden", "Paul Martinetti", "Sandy McEwan", "Chelsea Miller", "Ben Mitchell", "Victor Miranda", "Kurt Mueller", "William Reinus", "Ina Margaretha Rijnhout", "Marybeth Profrock", "Elyse Rogers", "Andrew L. Salzman", "Rosemary Shull", "Nick Spring", "Nurcan Tosun", "Brad Wyman", "Jen Yip"];
c.len = c.data.length;
// sdata is our services -- confirm Venture capital at end!!
s.data = ["Alliance management", "Analytics", "Analytics measurement frameworks", "Analytics plan development", "B2B marketing", "Biomarker innovation", "Biopharma leaderhip", "Biopharma leadership", "Biotech leadership", "Biotechnology company leadership", "Board of Directors", "BOD", "Building marketing teams", "Building operational teams", "Business development", "Business strategy", "Business transformation", "Buy & build strategies", "Capital markets strategy", "Cardiac electrophysiology", "Cell and gene therapies", "CEO", "CFO", "Chief Digital Officer", "Chief Innovation Officer", "Chief Marketing Officer", "Clinical affairs", "Clinical development", "Clinical imaging", "Clinical imaging endpoints", "Clinical imaging trials", "Clinical operations management", "Clinical research precision", "Clinical trial design", "Clinical trial management", "Clinical trials", "Clinician", "Commercial due diligence", "Commercial innovation", "Commercial operations", "Commercial Product Promotion", "Commercial strategy", "Commercialization", "Company start-up", "Comparability amendment preparation", "Comparability protocol preparation", "Competitive analysis", "Content strategy", "Corporate strategy", "CRM", "CRO management", "CX journey mapping", "Data analysis", "Delivery logistics", "Development strategy", "Digital advertising", "Digital Health Technologies", "Digital innovation", "Digital marketing", "Digital patient platforms", "Digital patient recruitment", "Digital patient services", "Digital patient strategy", "Digital product development", "Digital strategy", "Direct to Patient (DTP) Marketing and Education", "Drug development", "Due diligence", "DXA imaging", "Early IND submission strategy", "Efficacy scale development", "Entrepreneurship", "EPA", "Europe", "Executive leadership", "FDA", "FDA milestone meetings", "Finance direction", "Funding", "Fundraising", "Generative AI", "Global business development", "Global product launch", "Go-to-market strategy", "HCP Marketing & Medical Communications", "Health authority interactions", "Health authority meeting preparations", "Health authority response to questions", "Health economics", "Imaging biomarker development", "Imaging biomarker implementation", "Imaging biomarkers", "Imaging biomarkers in clinical studies", "Imaging Core lab", "Imaging modalities optimization", "IND lifecycle management", "IND preparation", "IND submission", "Information services", "Initial IND submission strategy", "Intellectual property strategy", "Interim CBO", "Interim CEO", "Investor relations", "In-vitro diagnostics", "IRB and ethics review", "Licensing", "Life sciences organization leadership", "M&A", "Magnetic resonance imaging", "Manufacturing engineering", "Market analysis", "Market validation", "Marketing growth", "Marketing operations", "Marketing specialization", "Marketing staff development", "Medical affairs", "Medical communications", "Medical device development", "Medical device marketing", "Medical imaging", "Medical imaging in clinical trials", "Merger and acquisition", "Merger implementation", "Metrics measurement frameworks", "Microbiome therapeutics", "Molecular imaging", "MRI technique development", "Musculoskeletal imaging", "NDA preparation", "NDA review", "Non-personal promotion (NPP)", "Novel imaging diagnostics", "Nuclear medicine imaging", "Omnichannel integration", "Omnichannel strategy", "Oncology imaging", "Oncology opinion leader", "Opinion leader", "Opinion leader champion", "Opinion leader management", "Orphan drug submissions", "Osteoarthritis DMOARD development", "Osteoarthritis therapeutic development", "Oursourcing strategies", "Outsourcing strategies", "Partner marketing", "Patient engagement strategy", "Patient informed consent", "PET imaging", "PET tracers", "Pharma and biotech R&D leadership", "Pharmaceutical R&D", "Postapproval drug lifecycle management", "Post-launch", "Post-marketing studies", "Pre-launch", "Presentation authoring", "Presenting / pitching", "Product development", "Product management", "Product marketing", "Professional training", "Professor", "Project management", "Protocol development", "Protocol training", "Quality assurance", "Quality development", "Radioisotope therapy", "Radiology opinion leader", "Radiopharmaceutical strategy", "Raw material sourcing", "Regulations and guidelines expert", "Regulatory affairs leadership", "Regulatory CMC development strategy", "Regulatory CMC due diligence", "Regulatory CMC postapproval changes strategy", "Regulatory development", "Regulatory document writing", "Regulatory pathway", "Reimbursement", "Sales growth", "Scale validation", "Software marketing", "Software sales", "SPECT imaging", "Stakeholder segmentation", "Start-up business planning", "Strategic development", "Strategic partnering", "Strategic planning", "Tactical execution", "Team building", "Theranostics", "Vendor management", "Venture capital", "Veterinary medicine"];
s.len = s.data.length;
// csdata relates consultant indices to services indices
const csdata = [{ "cind": 0, "sind": 134 }, { "cind": 0, "sind": 68 }, { "cind": 0, "sind": 137 }, { "cind": 0, "sind": 129 }, { "cind": 0, "sind": 143 }, { "cind": 0, "sind": 190 }, { "cind": 0, "sind": 181 }, { "cind": 0, "sind": 133 }, { "cind": 0, "sind": 75 }, { "cind": 0, "sind": 34 }, { "cind": 0, "sind": 172 }, { "cind": 0, "sind": 67 }, { "cind": 0, "sind": 122 }, { "cind": 0, "sind": 93 }, { "cind": 1, "sind": 83 }, { "cind": 1, "sind": 82 }, { "cind": 1, "sind": 114 }, { "cind": 1, "sind": 116 }, { "cind": 1, "sind": 141 }, { "cind": 2, "sind": 172 }, { "cind": 2, "sind": 37 }, { "cind": 2, "sind": 41 }, { "cind": 2, "sind": 127 }, { "cind": 2, "sind": 123 }, { "cind": 2, "sind": 187 }, { "cind": 2, "sind": 150 }, { "cind": 2, "sind": 195 }, { "cind": 2, "sind": 111 }, { "cind": 2, "sind": 112 }, { "cind": 2, "sind": 46 }, { "cind": 2, "sind": 53 }, { "cind": 2, "sind": 173 }, { "cind": 2, "sind": 108 }, { "cind": 3, "sind": 117 }, { "cind": 3, "sind": 27 }, { "cind": 3, "sind": 172 }, { "cind": 3, "sind": 42 }, { "cind": 3, "sind": 75 }, { "cind": 3, "sind": 82 }, { "cind": 4, "sind": 69 }, { "cind": 4, "sind": 75 }, { "cind": 4, "sind": 142 }, { "cind": 4, "sind": 130 }, { "cind": 4, "sind": 131 }, { "cind": 4, "sind": 76 }, { "cind": 4, "sind": 54 }, { "cind": 5, "sind": 148 }, { "cind": 5, "sind": 77 }, { "cind": 5, "sind": 39 }, { "cind": 5, "sind": 38 }, { "cind": 5, "sind": 41 }, { "cind": 5, "sind": 62 }, { "cind": 5, "sind": 61 }, { "cind": 5, "sind": 59 }, { "cind": 5, "sind": 63 }, { "cind": 5, "sind": 14 }, { "cind": 5, "sind": 60 }, { "cind": 5, "sind": 196 }, { "cind": 5, "sind": 124 }, { "cind": 5, "sind": 22 }, { "cind": 5, "sind": 108 }, { "cind": 6, "sind": 175 }, { "cind": 6, "sind": 180 }, { "cind": 6, "sind": 174 }, { "cind": 7, "sind": 107 }, { "cind": 7, "sind": 37 }, { "cind": 7, "sind": 123 }, { "cind": 7, "sind": 105 }, { "cind": 7, "sind": 16 }, { "cind": 7, "sind": 139 }, { "cind": 7, "sind": 108 }, { "cind": 8, "sind": 8 }, { "cind": 8, "sind": 6 }, { "cind": 8, "sind": 66 }, { "cind": 8, "sind": 192 }, { "cind": 8, "sind": 37 }, { "cind": 8, "sind": 123 }, { "cind": 8, "sind": 197 }, { "cind": 8, "sind": 108 }, { "cind": 9, "sind": 176 }, { "cind": 9, "sind": 178 }, { "cind": 9, "sind": 99 }, { "cind": 9, "sind": 95 }, { "cind": 9, "sind": 154 }, { "cind": 9, "sind": 45 }, { "cind": 9, "sind": 44 }, { "cind": 9, "sind": 85 }, { "cind": 9, "sind": 87 }, { "cind": 9, "sind": 86 }, { "cind": 9, "sind": 177 }, { "cind": 10, "sind": 152 }, { "cind": 10, "sind": 144 }, { "cind": 10, "sind": 48 }, { "cind": 10, "sind": 166 }, { "cind": 10, "sind": 149 }, { "cind": 11, "sind": 152 }, { "cind": 11, "sind": 9 }, { "cind": 11, "sind": 198 }, { "cind": 11, "sind": 81 }, { "cind": 11, "sind": 108 }, { "cind": 11, "sind": 194 }, { "cind": 11, "sind": 27 }, { "cind": 11, "sind": 42 }, { "cind": 11, "sind": 41 }, { "cind": 11, "sind": 153 }, { "cind": 11, "sind": 126 }, { "cind": 11, "sind": 78 }, { "cind": 11, "sind": 21 }, { "cind": 11, "sind": 10 }, { "cind": 11, "sind": 100 }, { "cind": 11, "sind": 18 }, { "cind": 11, "sind": 20 }, { "cind": 12, "sind": 141 }, { "cind": 12, "sind": 140 }, { "cind": 12, "sind": 32 }, { "cind": 12, "sind": 70 }, { "cind": 12, "sind": 184 }, { "cind": 12, "sind": 167 }, { "cind": 12, "sind": 163 }, { "cind": 12, "sind": 57 }, { "cind": 12, "sind": 168 }, { "cind": 12, "sind": 159 }, { "cind": 12, "sind": 56 }, { "cind": 12, "sind": 35 }, { "cind": 13, "sind": 170 }, { "cind": 13, "sind": 127 }, { "cind": 13, "sind": 91 }, { "cind": 13, "sind": 36 }, { "cind": 13, "sind": 139 }, { "cind": 13, "sind": 171 }, { "cind": 13, "sind": 138 }, { "cind": 13, "sind": 164 }, { "cind": 14, "sind": 130 }, { "cind": 14, "sind": 131 }, { "cind": 14, "sind": 96 }, { "cind": 14, "sind": 97 }, { "cind": 14, "sind": 75 }, { "cind": 14, "sind": 72 }, { "cind": 14, "sind": 69 }, { "cind": 15, "sind": 98 }, { "cind": 15, "sind": 115 }, { "cind": 15, "sind": 1 }, { "cind": 15, "sind": 55 }, { "cind": 15, "sind": 64 }, { "cind": 16, "sind": 119 }, { "cind": 16, "sind": 117 }, { "cind": 16, "sind": 26 }, { "cind": 16, "sind": 88 }, { "cind": 16, "sind": 182 }, { "cind": 16, "sind": 156 }, { "cind": 16, "sind": 104 }, { "cind": 16, "sind": 19 }, { "cind": 17, "sind": 23 }, { "cind": 17, "sind": 64 }, { "cind": 17, "sind": 80 }, { "cind": 17, "sind": 136 }, { "cind": 17, "sind": 65 }, { "cind": 17, "sind": 84 }, { "cind": 17, "sind": 40 }, { "cind": 17, "sind": 155 }, { "cind": 17, "sind": 157 }, { "cind": 17, "sind": 132 }, { "cind": 17, "sind": 49 }, { "cind": 17, "sind": 58 }, { "cind": 17, "sind": 118 }, { "cind": 17, "sind": 3 }, { "cind": 17, "sind": 57 }, { "cind": 17, "sind": 24 }, { "cind": 17, "sind": 135 }, { "cind": 17, "sind": 188 }, { "cind": 17, "sind": 51 }, { "cind": 17, "sind": 2 }, { "cind": 17, "sind": 125 }, { "cind": 17, "sind": 139 }, { "cind": 18, "sind": 30 }, { "cind": 18, "sind": 29 }, { "cind": 18, "sind": 128 }, { "cind": 18, "sind": 94 }, { "cind": 18, "sind": 164 }, { "cind": 18, "sind": 121 }, { "cind": 18, "sind": 109 }, { "cind": 18, "sind": 36 }, { "cind": 18, "sind": 35 }, { "cind": 19, "sind": 43 }, { "cind": 19, "sind": 14 }, { "cind": 19, "sind": 106 }, { "cind": 19, "sind": 146 }, { "cind": 19, "sind": 27 }, { "cind": 19, "sind": 191 }, { "cind": 19, "sind": 50 }, { "cind": 19, "sind": 108 }, { "cind": 19, "sind": 79 }, { "cind": 19, "sind": 17 }, { "cind": 19, "sind": 73 }, { "cind": 19, "sind": 196 }, { "cind": 19, "sind": 34 }, { "cind": 19, "sind": 31 }, { "cind": 19, "sind": 103 }, { "cind": 19, "sind": 0 }, { "cind": 19, "sind": 102 }, { "cind": 19, "sind": 101 }, { "cind": 19, "sind": 67 }, { "cind": 20, "sind": 74 }, { "cind": 20, "sind": 113 }, { "cind": 20, "sind": 183 }, { "cind": 20, "sind": 14 }, { "cind": 20, "sind": 12 }, { "cind": 20, "sind": 25 }, { "cind": 20, "sind": 57 }, { "cind": 20, "sind": 4 }, { "cind": 20, "sind": 162 }, { "cind": 20, "sind": 147 }, { "cind": 20, "sind": 47 }, { "cind": 20, "sind": 15 }, { "cind": 21, "sind": 165 }, { "cind": 21, "sind": 169 }, { "cind": 21, "sind": 179 }, { "cind": 21, "sind": 160 }, { "cind": 21, "sind": 110 }, { "cind": 22, "sind": 7 }, { "cind": 22, "sind": 66 }, { "cind": 22, "sind": 152 }, { "cind": 22, "sind": 153 }, { "cind": 22, "sind": 21 }, { "cind": 22, "sind": 11 }, { "cind": 22, "sind": 100 }, { "cind": 22, "sind": 43 }, { "cind": 22, "sind": 106 }, { "cind": 22, "sind": 145 }, { "cind": 22, "sind": 67 }, { "cind": 23, "sind": 74 }, { "cind": 23, "sind": 113 }, { "cind": 23, "sind": 183 }, { "cind": 23, "sind": 14 }, { "cind": 23, "sind": 121 }, { "cind": 23, "sind": 186 }, { "cind": 23, "sind": 185 }, { "cind": 23, "sind": 120 }, { "cind": 23, "sind": 158 }, { "cind": 23, "sind": 159 }, { "cind": 24, "sind": 13 }, { "cind": 24, "sind": 194 }, { "cind": 24, "sind": 192 }, { "cind": 24, "sind": 193 }, { "cind": 24, "sind": 42 }, { "cind": 24, "sind": 189 }, { "cind": 24, "sind": 164 }, { "cind": 24, "sind": 71 }, { "cind": 24, "sind": 12 }, { "cind": 24, "sind": 14 }, { "cind": 25, "sind": 14 }, { "cind": 25, "sind": 161 }, { "cind": 25, "sind": 183 }, { "cind": 25, "sind": 191 }, { "cind": 25, "sind": 52 }, { "cind": 25, "sind": 1 }, { "cind": 25, "sind": 162 }, { "cind": 25, "sind": 113 }, { "cind": 26, "sind": 28 }, { "cind": 26, "sind": 35 }, { "cind": 26, "sind": 33 }, { "cind": 26, "sind": 91 }, { "cind": 26, "sind": 89 }, { "cind": 26, "sind": 90 }, { "cind": 26, "sind": 92 }, { "cind": 26, "sind": 150 }, { "cind": 26, "sind": 151 }, { "cind": 26, "sind": 5 }, { "cind": 27, "sind": 25 }, { "cind": 27, "sind": 57 }, { "cind": 27, "sind": 4 }, { "cind": 27, "sind": 47 }, { "cind": 27, "sind": 113 }, { "cind": 27, "sind": 162 }, { "cind": 27, "sind": 147 }];
const csLen = csdata.length;
// rdata is our contact info
const rdata = [{ "email": "cmiller@thebrackengroup.com", "link": "https://www.linkedin.com/in/colingmiller/" }, { "email": "gandreasen@thebrackengroup.com", "link": "https://www.linkedin.com/in/gitte-andreasen-97b1794/" }, { "email": "abeck@thebrackengroup.com", "link": "https://www.linkedin.com/in/driventosucceed1/" }, { "email": "dbehera@thebrackengroup.com", "link": "https://www.linkedin.com/in/deebehera/" }, { "email": "lbloss@thebrackengroup.com", "link": "https://www.linkedin.com/in/lieselotte-liz-bloss-dvm-87a586b/" }, { "email": "mcollyer@thebrackengroup.com", "link": "https://www.linkedin.com/in/martincollyer/" }, { "email": "lcooper@thebrackengroup.com", "link": "https://www.linkedin.com/in/lisa-cooper-phd-rac-9167297/" }, { "email": "dflitcraft@thebrackengroup.com", "link": "https://www.linkedin.com/in/dawnflitcraft/" }, { "email": "jgilligan@thebrackengroup.com", "link": "https://www.linkedin.com/in/james-gilligan-94090211/" }, { "email": "mjulien@thebrackengroup.com", "link": "https://www.linkedin.com/in/marilyn-julien/" }, { "email": "jlarkin@thebrackengroup.com", "link": "https://www.linkedin.com/in/jonathan-larkin-5b20266/" }, { "email": "glumsden@thebrackengroup.com", "link": "https://www.linkedin.com/in/grahamlumsden/" }, { "email": "pmartinetti@thebrackengroup.com", "link": "https://www.linkedin.com/in/paul-martinetti-md/" }, { "email": "smcewan@thabrackengroup.com", "link": "https://ca.linkedin.com/in/alexander-sandy-j-b-mcewan-mb-msc-frcpc-093b6112?trk=public_profile_browsemap" }, { "email": "chelseamiller@thebrackengroup.com", "link": "https://www.linkedin.com/in/cmillerbracken/" }, { "email": "bmitchell@thebrackengroup.com", "link": "https://www.linkedin.com/in/benjamin-j-mitchell/" }, { "email": "vmiranda@thebrackengroup.com", "link": "https://www.linkedin.com/in/vmirandamd/" }, { "email": "kmueller@thebrackengroup.com", "link": "https://www.linkedin.com/in/kwmueller" }, { "email": "wreinus@thebrackengroup.com", "link": "https://www.linkedin.com/in/william-reinus-1318342/" }, { "email": "irijnhout@thebrackengroup.com", "link": "https://www.linkedin.com/in/ineke-rijnhout/" }, { "email": "mprofrock@thebrackengroup.com", "link": "https://www.linkedin.com/in/marybethprofrock/" }, { "email": "erogers@thebrackengroup.com", "link": "https://www.linkedin.com/in/elyse-r-2323-er/" }, { "email": "asalzman@thebrackengroup.com", "link": "https://www.linkedin.com/in/andrew-salzman-74608a8/" }, { "email": "rshull@thebrackengroup.com", "link": "https://www.linkedin.com/in/rosemary-j-shull-4704574/" }, { "email": "nspring@thebrackengroup.com", "link": "https://www.linkedin.com/in/nickspring/" }, { "email": "Ntosun@thebrackengroup.com", "link": "https://www.linkedin.com/in/nurcan-tosun-a780505/" }, { "email": "bwyman@thebrackengroup.com", "link": "https://www.linkedin.com/in/brad-wyman-8b68284/" }, { "email": "jyip@thebrackengroup.com", "link": "https://www.linkedin.com/in/jenyip/" }];
const rLen = rdata.length;
// sdata is our services -- CHANGE NA TO ""
t.data = ["Allergy", "Animal Health", "Auto-Immune Disease", "Breast Cancer", "Cancer Survivorship", "Cardiac Electrophysiology", "Cardiovascular Diseases", "Celiac Disease", "Cell Therapy", "Cerebral Palsy", "Children's Health", "Circulatory Shock", "CNS", "Congenital Muscular Diseases", "Covid", "Dermatology", "Diabetes", "Epilepsy", "Gene Therapy", "Head Injury", "Hematology", "Hepatitis", "Herbal Medicine", "Hypertension", "Immunology", "Immunopathologies", "Immunopathology", "Infectious Disease", "Inflammatory Disorders", "Leukemia", "Lupus", "Lysosomal Storage Diseases", "Medical Device", "Metabolic Disease", "Metabolic Diseases", "Microbiome Disorders", "Migraine Headache", "Mitochondrial Diseases", "Motion Sickness", "Musculoskeletal Disorders", "", "Neonatal Intensive Care", "Neuromuscular Disorders", "Oncology", "Ophthalmology", "Orphan Diseases", "Osteoarthritis", "Osteoporosis", "Pediatric Critical Care", "Pediatric Neurotransmitter Disorders", "Prostate Cancer", "Psychological Disorders", "Pulmonology", "Rare Diseases", "Renal Diseases", "Rheumatoid Arthritis", "Sepsis", "Stroke", "Trauma", "Traumatic Brain Injury", "Urgent Care", "Women's Health"];
t.len = t.data.length;
// csdata relates consultant indices to services indices
const ctdata = [{ "cind": 0, "tind": 46 }, { "cind": 0, "tind": 39 }, { "cind": 1, "tind": 46 }, { "cind": 1, "tind": 47 }, { "cind": 1, "tind": 3 }, { "cind": 2, "tind": 43 }, { "cind": 3, "tind": 43 }, { "cind": 4, "tind": 40 }, { "cind": 5, "tind": 23 }, { "cind": 5, "tind": 30 }, { "cind": 6, "tind": 43 }, { "cind": 6, "tind": 52 }, { "cind": 6, "tind": 2 }, { "cind": 6, "tind": 27 }, { "cind": 7, "tind": 27 }, { "cind": 8, "tind": 39 }, { "cind": 8, "tind": 6 }, { "cind": 8, "tind": 51 }, { "cind": 9, "tind": 43 }, { "cind": 9, "tind": 29 }, { "cind": 9, "tind": 28 }, { "cind": 9, "tind": 25 }, { "cind": 10, "tind": 46 }, { "cind": 10, "tind": 27 }, { "cind": 10, "tind": 26 }, { "cind": 10, "tind": 21 }, { "cind": 11, "tind": 27 }, { "cind": 11, "tind": 47 }, { "cind": 11, "tind": 61 }, { "cind": 11, "tind": 6 }, { "cind": 11, "tind": 54 }, { "cind": 11, "tind": 43 }, { "cind": 11, "tind": 28 }, { "cind": 11, "tind": 25 }, { "cind": 11, "tind": 35 }, { "cind": 12, "tind": 15 }, { "cind": 12, "tind": 4 }, { "cind": 13, "tind": 46 }, { "cind": 13, "tind": 43 }, { "cind": 13, "tind": 50 }, { "cind": 14, "tind": 40 }, { "cind": 15, "tind": 40 }, { "cind": 16, "tind": 47 }, { "cind": 16, "tind": 6 }, { "cind": 16, "tind": 5 }, { "cind": 16, "tind": 44 }, { "cind": 16, "tind": 16 }, { "cind": 16, "tind": 19 }, { "cind": 17, "tind": 53 }, { "cind": 17, "tind": 43 }, { "cind": 17, "tind": 20 }, { "cind": 17, "tind": 36 }, { "cind": 17, "tind": 17 }, { "cind": 17, "tind": 9 }, { "cind": 17, "tind": 49 }, { "cind": 18, "tind": 59 }, { "cind": 18, "tind": 57 }, { "cind": 18, "tind": 39 }, { "cind": 19, "tind": 8 }, { "cind": 19, "tind": 18 }, { "cind": 19, "tind": 24 }, { "cind": 19, "tind": 55 }, { "cind": 19, "tind": 0 }, { "cind": 19, "tind": 1 }, { "cind": 19, "tind": 32 }, { "cind": 19, "tind": 45 }, { "cind": 19, "tind": 31 }, { "cind": 19, "tind": 13 }, { "cind": 19, "tind": 61 }, { "cind": 19, "tind": 37 }, { "cind": 19, "tind": 14 }, { "cind": 19, "tind": 16 }, { "cind": 19, "tind": 7 }, { "cind": 19, "tind": 6 }, { "cind": 19, "tind": 12 }, { "cind": 19, "tind": 22 }, { "cind": 19, "tind": 15 }, { "cind": 20, "tind": 40 }, { "cind": 21, "tind": 58 }, { "cind": 21, "tind": 60 }, { "cind": 22, "tind": 6 }, { "cind": 22, "tind": 10 }, { "cind": 22, "tind": 11 }, { "cind": 22, "tind": 27 }, { "cind": 22, "tind": 33 }, { "cind": 22, "tind": 41 }, { "cind": 22, "tind": 44 }, { "cind": 22, "tind": 45 }, { "cind": 22, "tind": 48 }, { "cind": 22, "tind": 52 }, { "cind": 22, "tind": 53 }, { "cind": 22, "tind": 56 }, { "cind": 22, "tind": 57 }, { "cind": 22, "tind": 58 }, { "cind": 22, "tind": 59 }, { "cind": 23, "tind": 43 }, { "cind": 23, "tind": 42 }, { "cind": 23, "tind": 39 }, { "cind": 23, "tind": 34 }, { "cind": 24, "tind": 27 }, { "cind": 24, "tind": 38 }, { "cind": 24, "tind": 10 }, { "cind": 25, "tind": 47 }, { "cind": 25, "tind": 27 }, { "cind": 25, "tind": 44 }, { "cind": 26, "tind": 43 }, { "cind": 27, "tind": 40 }];
const ctLen = ctdata.length;

// GUI
// input box
const w1 = document.getElementById('w1');
// feedback label
const r1 = document.getElementById('r1');
// our name buttons load here
c.box = document.getElementById('box5');
// our service buttons load here
s.box = document.getElementById('box7');
// our service buttons load here
t.box = document.getElementById('box9');

// gui setup calls
loadAll();
feedback("Search a consultant, service, or therapeutic area");