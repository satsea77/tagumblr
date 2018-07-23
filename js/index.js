//http://www.creativyst.com/Prod/3/で圧縮している
$( init );
//**********************
//	初期起動
//**********************
function init ()
{
	//SELECTの中身作成
	for( var iCnt=50; iCnt<=1000; iCnt += 50)
	{
		$("#selMax").append($("<option>").attr({ value : iCnt }).text("直近 " + iCnt + "Post"));
	}
	$("#selMax").val("200");
}
//**********************
//	タグを作成する押下時
//***********************
function btnCreateTag_OnClick()
{
	var opt = "";
	if ($("#txtWide").val() != "")
	{
		opt = " width=\"" + $("#txtWide").val() + "\""
	}
	if ($("#txtHigh").val() != "")
	{
		opt += " height=\"" + $("#txtHigh").val() + "\""
	}
	
	var str = "<div>\r\n" +
			  "    <IFRAME src=\"https://satsea77.github.io/tagumblr/Tagumblr.html?url=" + $("#txtUrl").val() + "&max=" + $("#selMax").val() + "\" frameborder=\"0\"" + opt + "></IFRAME>\r\n" +
			  "</div>"
	$("#divResult").hide().show("normal");
	$("#txaTag").val(str);
	$("#divTestShow").empty().append(str);
}
