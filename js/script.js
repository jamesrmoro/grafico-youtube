var vidsList = [];
var datas = [];
var n = 0
function getV1(nextPageToken, vidsDone, params) {
    $.getJSON('https://www.googleapis.com/youtube/v3/search',{
        part: 'snippet',
        channelId: 'UCFYRsDi3Wdeb9j7bkhXiHjw',
        maxResults: 20,
        order: 'date',
        pageToken: (nextPageToken || ''),
        safeSearch: 'none',
        videoDuration: 'any',
        key: '' //insira sua chave ao lado
    },function(data) {
        n++
        vidsList = [];
        $.each(data.items,function(k,v){
            vidsList += v.id.videoId+',';
            var qtd = Math.round(data.pageInfo.totalResults/20);
            if (n <= qtd && k === (data.items.length-1) && data.hasOwnProperty('nextPageToken') ) {
            getV2().done(function(){getV1( data.nextPageToken )})
                if (n === qtd){
                    $.when(getV2().done(function(){
                        drawChart();
                        $('.load').fadeOut();
                        $(".hide").removeClass();
                    })
                )}
            };
        })
    })
}

function getV2(){
    return $.getJSON('https://www.googleapis.com/youtube/v3/videos',{
        part: 'snippet,statistics',
        id: vidsList,
        key: '' //insira sua chave ao lado
    }, function(r){
        console.log(r);
        var output = "";
        $.each(r.items, function(i,item){
            videTitle = item.snippet.title;
            date = item.snippet.publishedAt;
            output = '<li><a href="https://www.youtube.com/watch?v='+item.id+'" target="_blank" title="'+videTitle+'"><strong>Vídeo:</strong> '+videTitle+ ' <span class="views"><strong>Visualizações:</strong> '+item.statistics.viewCount+'</span></a></li>';
            $('#results').append(output);
            var date = item.snippet.publishedAt.slice(0,-14).replace(/[-]/g, ', ')
            var m = Number(date.substr(6,2) -1);
            var y = date.substr(0,4);
            var d = date.substr(10,2);
            datas += ('[ new Date ('+y+', '+m+' ,'+d+'), '+item.statistics.viewCount+' ],')
        })
    })
}

getV1();

google.load("visualization", "1.1", {packages:["calendar"]});
function drawChart() {

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'date', id: 'Date' });
    dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
    nnn = eval('['+datas+']')
    dataTable.addRows(nnn);
    var  chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));
    var options = {
        colorAxis: {
            minValue: 0,
            colors: ['#C6E48B', '#239a3b']
        },
        title: "Contribuições",
        height: 350,
        noDataPattern: {
            backgroundColor: '#ebedf0',
            color: '#ebedf0'
        },
        calendar: {
            cellColor: {
                stroke: '#FFF',
                strokeOpacity: 0.5,
                strokeWidth: 1,
            },
            focusedCellColor: {
                stroke: '#239a3b',
                strokeOpacity: 1,
                strokeWidth: 1,
            },
            dayOfWeekLabel: {
                fontName: 'Roboto',
                fontSize: 12,
                color: '#1a8763',
                bold: true,
                italic: true,
            },
            dayOfWeekRightSpace: 10,
            daysOfWeek: 'DSTQQSS',
            monthLabel: {
                fontName: 'Roboto',
                fontSize: 12,
                color: '#000000',
                bold: true,
                italic: false
            },
            monthOutlineColor: {
                stroke: '#7bc96f',
                strokeOpacity: 0.6,
                strokeWidth: 2
            },
            unusedMonthOutlineColor: {
                stroke: '#FFF',
                strokeOpacity: 0.8,
                strokeWidth: 1
            },
            underMonthSpace: 16,
        }
    };
    chart.draw(dataTable, options);
}

$(document).ready(function(){
    $("body").on("click", ".more", function(){
        $(".group-list .list").css("height", "100%");
        $(this).fadeOut();
    });
});