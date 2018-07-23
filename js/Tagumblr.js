var gUrl; var gMax; var ie = (function(){ var undef, v = 3, div = document.createElement('div'); while ( div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->', div.getElementsByTagName('i')[0] ); return v> 4 ? v : undef;}()); function IsLocalStorage()
{ if(ie==undefined){return true;}
if(ie>=8){return true;}
return false;}
$( init ); function init ()
{ SetLoading(); var config = new Object(); var params = location.search.substr(1); var spparams = params.split("&"); if(spparams.length > 0 )
{ for(var i=0; i < spparams.length; i++)
{ var tmp = spparams[i].split("="); config[tmp[0]] = unescape(tmp[1]);}
gUrl = config.url.replace("http://",""); gMax = config.max; if( IsLocalStorage()){ var tagHtml = localStorage['tag4tumblr' + gUrl];}
if( tagHtml == undefined )
{ ShowTags_OnClick(); return;}
if( tagHtml.length > 0)
{ $("#tags").empty().append(tagHtml);}
}
else
{ $("#tags").empty().append("不正な引数です。");}
}
function SetLoading()
{ $("#tags").empty().append("<img src='./img/loading.gif'>");}
function ShowTags_OnClick()
{ SetLoading(); var all_tags = []; CreateTags( "http://" + gUrl, all_tags, 0, gMax );}
function ShowGetUrl(param)
{ var url = document.URL; if( url.indexOf("?") >= 0)
{ url = url.substring(0,url.indexOf("?")) + param;}
else
{ url = url + param;}
$("#spUrl").empty().append("<a href='" + url + "' target='_blank'>" + url + "</a>");}
function CreateTags(tgtUrl, all_tags, start, getMax)
{ $.ajax({ type: "GET", url: tgtUrl+'/api/read/json?callback=?&num=50&start='+start, dataType: "json", success: function(data)
{ $(data.posts).each(function(i, post)
{ $(post.tags).each(function(i, tag)
{ if(typeof(tag) == 'string'){all_tags.push(tag);}
});}); start = start + 50; if( getMax < start || data['posts-total'] < start)
{ CreateLink(tgtUrl, all_tags);}
else
{ $("#tags").append(start); CreateTags(tgtUrl, all_tags, start, getMax);}
}, error : function(){ $("#tags").empty().append("読み込めませんでした");}
});}
function CreateLink(tgtUrl, all_tags)
{ $("#tags").append("CreateLink"); var cloud = new Object(); $(all_tags).each(function(i, tag)
{ cloud[tag] = (cloud[tag] ? cloud[tag] + 1 : 1);}); var raw_cloud = new Object; for(tag in cloud)
{ raw_cloud[tag] = cloud[tag]; cloud[tag] = Math.log(cloud[tag]);}
var min_size = 100; var size_range = 200 - min_size; var tag_counts = []; for (j in cloud){tag_counts.push(cloud[j])}; tag_counts.sort(function(a, b){ return (a-b);}); var min_count = tag_counts[0]; var max_count = tag_counts[tag_counts.length - 1]; var slope = size_range / (max_count - min_count); $("#tags").empty(); for (tag in cloud)
{ var font_size = Math.round( slope * cloud[tag] - ( slope * min_count - min_size )); var postCnt = raw_cloud[tag] + " post"; var link = '<a href="' + tgtUrl + '/tagged/' + tag + '" target="_top" title="' + postCnt + '">' + tag + '</a>'; var output = '<li style="font-size:' + font_size + '%;">' + link + ' </li>'; $("#tags").append(output);}
if(IsLocalStorage())
{ localStorage['tag4tumblr' + tgtUrl.replace("http://","")] = $("#tags").html();}
}
