
function initialize(){


    $('#firstDate').on("input", function(){
        startDate = document.getElementById("firstDate").value;
        console.log(startDate);
        if(startDate > finishDate){
            $("#firstDate").removeClass("is-valid");
            $("#firstDate").addClass("is-invalid");
            $("#secondDate").removeClass("is-valid");
            $("#secondDate").addClass("is-invalid");
        }
        else{
            $("#firstDate").removeClass("is-invalid");
            $("#firstDate").addClass("is-valid");
            $("#secondDate").removeClass("is-invalid");
            $("#secondDate").addClass("is-valid");
        }
        $('#secondDate').attr('min', startDate);


    })
    $('#secondDate').on("input", function(){
        finishDate = document.getElementById("secondDate").value;
        console.log(finishDate);
        if(startDate > finishDate){
            $("#firstDate").removeClass("is-valid");
            $("#firstDate").addClass("is-invalid");
            $("#secondDate").removeClass("is-valid");
            $("#secondDate").addClass("is-invalid");
        }
        else{
            $("#firstDate").removeClass("is-invalid");
            $("#firstDate").addClass("is-valid");
            $("#secondDate").removeClass("is-invalid");
            $("#secondDate").addClass("is-valid");
        }
        $('#firstDate').attr('max', finishDate);
    })
    $('#arrival').on("input", function(){
        var city = $('#arrival').val();
        console.log(city);
        if(!checkName(city)){
            $("#arrival").removeClass("is-valid");
            $("#arrival").addClass("is-invalid");

        }
        else{
            $("#arrival").removeClass("is-invalid");
            $("#arrival").addClass("is-valid");
        }
    })

    $('#departure').on("input", function(){
        var city = $('#departure').val();
        console.log(city);
        if(!checkName(city)){
            $("#departure").removeClass("is-valid");
            $("#departure").addClass("is-invalid");

        }
        else{
            $("#departure").removeClass("is-invalid");
            $("#departure").addClass("is-valid");
        }
    })

}
function isCharName(c) {
    if(c == " " || c == "'" || c == "-" || (c.toUpperCase() != c.toLowerCase())){
        return true;
    }

}
function checkName(name) {
    if (name.length == 0) return false;
    for (var i = 0; i < name.length; i++) {
        if (!isCharName(name[i])) {
            return false;
        }
    }
    return true;
}

exports.initialize = initialize;