var focusedRow = -1;

window.onload = function init() {
    getMats();
};

function addMat() {
    //adds a new, blank material to the list
    var addData = "{\"name\":\"New Material\",\"color\":\"#ff0000\",\"volume\":\"0\",\"cost\":\"0\",\"date\":\"2020-12-01\"}";
    var URL = "http://localhost:8080/add";

    $.ajax ({
        type: "Post",
        url: URL,
        contentType: "application/json; charset=utf-8",
        data: addData,
        success: function(msg) {
            //refresh the table
            getMats();
        }, 
        error: function(jgXHR, textStatus, errorThrown){
            alert("Error: " + textStatus + " " + errorThrown); 
        }
    });	
}

function deleteMat() {
    //deletes the highlighted material
    var matNum = focusedRow;

    if (matNum != -1) {
        var URL = "http://localhost:8080/delete?m=" + matNum;

        $.ajax({
            url: URL,
            type: "Delete",
            dataType: "html",
            success: function(msg) {
                getMats();
                document.getElementById("matInfo").innerHTML = "";
            },
            error: function(jgXHR, textStatus, errorThrown){
                alert("Error: " + textStatus + " " + errorThrown); 
            }
        });
        focusedRow = -1;
    }
}

function getMats() {
    //gets the list of all materials to display
    var URL = "http://localhost:8080/materials";

    $.ajax ({
        type: "Get",
        url: URL,
        dataType: "html",
        success: function(msg){
            document.getElementById("matList").innerHTML = msg;
            var table = document.getElementById("materialTable");
            if (table) {
                addTableEvents();
            }
            getPrice();
        }, 
        error: function(jgXHR, textStatus, errorThrown){
            alert("Error: " + textStatus + " " + errorThrown); 
        }
    });
}

function getPrice() {
    var URL = "http://localhost:8080/price";

    $.ajax ({
        type: "Get",
        url: URL,
        dataType: "html",
        success: function(msg){
            document.getElementById("totalValue").innerHTML = msg;
        }, 
        error: function(jgXHR, textStatus, errorThrown){
            alert("Error: " + textStatus + " " + errorThrown); 
        }
    });
}

function getInfo() {
    //gets the information for the selected material and displays the information in a form
    var activeElement = document.activeElement;
    var check = ["tr", "table", "td", "tbody"];

    if (activeElement && check.indexOf(activeElement.tagName.toLowerCase()) != -1) {
        var matNum = activeElement.id;
        focusedRow = matNum;
        
        if (matNum != null && matNum != "") {
            var URL = "http://localhost:8080/info?m=" + matNum;

            $.ajax ({
                type: "Get",
                url: URL,
                dataType: "html",
                success: function(msg){
                    document.getElementById("matInfo").innerHTML = msg;
                    addFormEvents();
                    getPrice();
                }, 
                error: function(jgXHR, textStatus, errorThrown){
                    alert("Error: " + textStatus + " " + errorThrown); 
                }
            });
        }
    }
}

//code from https://stackoverflow.com/questions/1207939/adding-an-onclick-event-to-a-table-row
function addTableEvents() {
    var table = document.getElementById("materialTable");
    var rows = table.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        var currentRow = rows[i];
        currentRow.addEventListener("click", function() {
            getInfo();
        });
    }
}

function addFormEvents() {
    var name = document.getElementById("mName");
    if (name != null) {
        name.addEventListener("change", function() {
            updateInfo();
        });
    }
    var color = document.getElementById("mColor");
    if (color != null) {
        color.addEventListener("change", function() {
            updateInfo();
        });
    }
    var cost = document.getElementById("mCost");
    if (cost != null) {
        cost.addEventListener("change", function() {
            updateInfo();
        });
    }
    var volume = document.getElementById("mVolume");
    if (volume != null) {
        volume.addEventListener("change", function() {
            updateInfo();
        });
    }
    var date = document.getElementById("mDate");
    if (date != null) {
        date.addEventListener("change", function() {
            updateInfo();
        });
    }
}

function getSpecificInfo(n) {
    //gets the information for a specific material and displays the information in a form
    var URL = "http://localhost:8080/info?m=" + n;

    $.ajax ({
        type: "Get",
        url: URL,
        dataType: "html",
        success: function(msg){
            document.getElementById("matInfo").innerHTML = msg;
        }, 
        error: function(jgXHR, textStatus, errorThrown){
            alert("Error: " + textStatus + " " + errorThrown); 
        }
    });
}

function updateInfo() {
    //when a form is changed it sends that updated info to the server
    var matNum = document.getElementsByName("MaterialForm")[0].id;
    var matName = document.getElementById("mName").value;
    var matColor = document.getElementById("mColor").value;
    var matVolume = document.getElementById("mVolume").value;
    var matCost = document.getElementById("mCost").value;
    var matDate = document.getElementById("mDate").value;

    var addData = "{\"id\":" + matNum + 
        ",\"name\":\"" + matName + 
        "\",\"color\":\"" + matColor + 
        "\",\"volume\":\"" + matVolume + 
        "\",\"cost\":\"" + matCost + 
        "\",\"date\":\"" + matDate + "\"}";
    var URL = "http://localhost:8080/info";

    $.ajax ({
        type: "Post",
        url: URL,
        contentType: "application/json; charset=utf-8",
        data: addData,
        success: function(msg) {
            //refresh the table
            getMats();
            getSpecificInfo(matNum);
        }, 
        error: function(jgXHR, textStatus, errorThrown){
            alert("Error: " + textStatus + " " + errorThrown); 
        }
    });	
    focusedRow = matNum;
}