//http://www.creativyst.com/Prod/3/で圧縮している
var gUrl;
var gMax;

//************************
//*	ブラウザ判定
//************************
var ie = (function(){
    var undef, v = 3, div = document.createElement('div');

    while (
        div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
        div.getElementsByTagName('i')[0]
    );

    return v> 4 ? v : undef;
}());
//************************
//	LocalStorage対応か？
//厳密にはもっと細かくする必要があるが、IE以外の古いバージョンは無視
//************************
function IsLocalStorage()
{
	if(ie==undefined){return true;}
	if(ie>=8){return true;}
	return false;
}

$( init );
//**********************
//	初期起動
//**********************
function init ()
{
	//Loading.....
	SetLoading();
	
	//当スクリプトを呼び出しているhtmlへのget引数を取得する
	var config = new Object();
	var params = location.search.substr(1);
	var spparams = params.split("&");
	//get引数があれば、セットする
	if(spparams.length > 0 )
	{
		for(var i=0; i < spparams.length; i++)
		{
			var tmp = spparams[i].split("=");
			config[tmp[0]] = unescape(tmp[1]);
		}
		gUrl = config.url.replace("http://","");
		gMax = config.max;
//		var iCss = config.css;

		//localStorageからデータ取得★ここを復活
		if( IsLocalStorage()){
			var tagHtml = localStorage['tag4tumblr' + gUrl];
		}

		if( tagHtml == undefined )
		{
			ShowTags_OnClick();											//Tagの作成
			return;
		}
		//データがあればそれを表示する。
		if( tagHtml.length > 0)
		{
			$("#tags").empty().append(tagHtml);
		}
	}
	else
	{
		$("#tags").empty().append("不正な引数です。");
	}
}
function SetLoading()
{
	$("#tags").empty().append("<img src='./img/loading.gif'>");
}
//***********************
//	「ShowTags」押下時
//***********************
function ShowTags_OnClick()
{
	//Loading.....
	SetLoading();
	var all_tags = [];	//全タグリスト
	CreateTags( "http://" + gUrl, all_tags, 0, gMax );					//Tagの作成
}
//**********************
//	Get用URLの表示
//**********************
function ShowGetUrl(param)
{
	var url = document.URL;
	if( url.indexOf("?") >= 0)
	{
		url = url.substring(0,url.indexOf("?")) + param;
	}
	else
	{
		url = url + param;
	}
	$("#spUrl").empty().append("<a href='" + url + "' target='_blank'>" + url + "</a>");
}
//**********************
//	TAGの作成
//tgtUrl	:対象のURL
//all_tags	:tag一覧
//start		:読み込み開始位置
//getMax	:読み込み上限
//**********************
function CreateTags(tgtUrl, all_tags, start, getMax)
{
	$.ajax({
		type: "GET",
		url: tgtUrl+'/api/read/json?callback=?&num=50&start='+start,
		dataType: "json",
		success: function(data)
		{
			$(data.posts).each(function(i, post) 
			{
				$(post.tags).each(function(i, tag) 
				{
					if(typeof(tag) == 'string'){all_tags.push(tag);}
				});
			});
			start = start + 50;
			if( getMax < start || data['posts-total'] < start)
			{
				//上限を突破したら、リンクを作成
				CreateLink(tgtUrl, all_tags);
			}
			else
			{
				//上限以下なので、次の50POSTに進む
				$("#tags").append(start);
				CreateTags(tgtUrl, all_tags, start, getMax);
			}
		},
		error : function(){
			$("#tags").empty().append("読み込めませんでした");
		}
	});
}
//**********************
//	LINKの作成
//tgtUrl	:対象のURL
//all_tags	:tag一覧
//
//最終的にできたTAGをlocalStorageに保存している。
//**********************
function CreateLink(tgtUrl, all_tags)
{
	$("#tags").append("CreateLink");
	var cloud = new Object();

	$(all_tags).each(function(i, tag)	//タグごとの数を取得
	{
		cloud[tag] = (cloud[tag] ? cloud[tag] + 1 : 1);
	});

	var raw_cloud = new Object;
	for(tag in cloud) 
	{
		raw_cloud[tag] = cloud[tag];
		cloud[tag] = Math.log(cloud[tag]);
	}
//			for(tag in cloud) {cloud[tag] = Math.log(cloud[tag]);}
	var min_size = 100;
	var size_range = 200 - min_size;	//文字の大きさ：最大-最小
	var tag_counts = [];
	for (j in cloud){tag_counts.push(cloud[j])};
	tag_counts.sort(function(a, b){ return (a-b);});
	var min_count = tag_counts[0];
	var max_count = tag_counts[tag_counts.length - 1];
	var slope = size_range / (max_count - min_count);
	$("#tags").empty();
	for (tag in cloud) 
	{
		var font_size = Math.round( slope * cloud[tag] - ( slope * min_count - min_size ));
		var postCnt = raw_cloud[tag] + " post";
		var link = '<a href="' + tgtUrl + '/tagged/' + tag + '" target="_parent" title="' + postCnt + '">' + tag + '</a>';
//		var link = '<a href="' + tgtUrl + '/tagged/' + tag + '" title="' + postCnt + '">' + tag + '</a>';
		var output = '<li style="font-size:' + font_size + '%;">' + link + ' </li>';
		$("#tags").append(output);
	}
	//localStorageに保存
	if(IsLocalStorage())
	{
		localStorage['tag4tumblr' + tgtUrl.replace("http://","")] = $("#tags").html();
	}
}
//**********************
//	sort
//**********************
//function sortNum(a, b) {return (a - b);}
