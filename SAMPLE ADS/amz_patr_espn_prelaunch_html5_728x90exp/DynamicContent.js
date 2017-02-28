/**
 * Created by nkatz on 7/31/15.
 */


function DynamicContent()
{
    this.contentPath = null;
}

DynamicContent.VIDEO_1 = 'video_1';
DynamicContent.VIDEO_2 = 'video_2';
DynamicContent.VIDEO_INTRO = 'video_intro';


DynamicContent.initData = function()
{
    Enabler.setProfileId(1107851);
    var devDynamicContent = {};

    devDynamicContent.Patriot_ESPN_8_250_Sheet1= [{}];
    devDynamicContent.Patriot_ESPN_8_250_Sheet1[0]._id = 0;
    devDynamicContent.Patriot_ESPN_8_250_Sheet1[0].Unique_ID = 1;
    devDynamicContent.Patriot_ESPN_8_250_Sheet1[0].Reporting_Label = "Patriot";
    devDynamicContent.Patriot_ESPN_8_250_Sheet1[0].video_1 = {};
    devDynamicContent.Patriot_ESPN_8_250_Sheet1[0].video_1.Type = "video";
    devDynamicContent.Patriot_ESPN_8_250_Sheet1[0].video_1.Progressive_Url = "https://gcdn.2mdn.net/videoplayback/id/7ed2bcbe915b5a85/itag/15/source/doubleclick/ratebypass/yes/mime/video%2Fmp4/acao/yes/ip/0.0.0.0/ipbits/0/expire/3631570740/sparams/id,itag,source,ratebypass,mime,acao,ip,ipbits,expire/signature/7D8F41272FA4D92E0CB4FBF8E544CFA25CAEB14C.AF1B80A455A7C94F74BEBE16F3632EB21E47EC32/key/ck2/file/file.mp4";
    devDynamicContent.Patriot_ESPN_8_250_Sheet1[0].video_1.Stream_Url = "";
    Enabler.setDevDynamicContent(devDynamicContent);

    this.contentPath = dynamicContent.Patriot_ESPN_8_250_Sheet1[0];
};


DynamicContent.getVideoByID = function( _id, _isHD )
{
    if( !this.contentPath ) this.initData();
    return this.contentPath[_id].Progressive_Url;
};


DynamicContent.getPropByID = function( _id )
{
    if( !this.contentPath ) this.initData();
    return this.contentPath[_id];
};