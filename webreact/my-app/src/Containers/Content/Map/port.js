import ol from 'openlayers';
import axios from 'axios';
import httpServer from '../../../servers';
import $ from 'jquery';
import yzan from '../../../Assets/image/contient/yzan.png';
import '../../../Assets/style/bootstrap.min.css';
import  'bootstrap'; 



var portStylesan = {
    'portwu' : new ol.style.Style({
        image : new ol.style.Icon({
            anchor : [ 0.5, 0.5 ],
            src : yzan
        })
    }),	

}
function portControllerAN1() {
//增加港口的远距离图标港口———————————————————————————————————————————————————————————————————————
this.portAll = new ol.source.Vector();
this.portLayer = new ol.layer.Vector({
visible : true,
source : this.portAll,
style : function(feature) {
    return portStylesan[feature.get('type')];
}
});
}

portControllerAN1.prototype.initPortLayerAn = function(seamap){
    this.map = seamap;
    seamap.addLayer(this.portLayer);

}

portControllerAN1.prototype.getport = function() { //目前港口的关联网络图

httpServer.app1({},function(data){
  
    PortController.portdetailinfo(data);
})
}; 

portControllerAN1.prototype.portdetailinfo = function(data) { //目前港口的关联网络图
    var len=data.data.length;
    var dataan=data.data;
    
   
    for(var i=0 ; i<len; i++){ 
        
        var lonlat = dataan[i].mt_pos.split('/');
        var coord = ol.proj.transform([ parseFloat(lonlat[0]), parseFloat(lonlat[1]) ], 'EPSG:4326', 'EPSG:3857');
        var disInfoportname = dataan[i].name;
        
        var port_english_name_space = dataan[i].country_english_name;
        var port_english_name_space2 = port_english_name_space.replace(/(^\s*)|(\s*$)/g, ""); //remove all the space————————————————————————————————————————————
        
        /* disinfo is aim to add the port list upon the seamap */
			var disInfo = "<div id='linedetail' style='color:white;height:55px;width:200px;margin:0px;padding:0px;'>" +
				"<div style='height:25px;width:200px;background:#153895;position:absolute;left:0px;top:0px;text-align:center;color:white;line-height:25px;font-size:16px;'>"
				+ "<img style='height:25px;width:45px;position:absolute;left:0px;' src='"+ process.env.PUBLIC_URL + "countrypic/" + port_english_name_space2 + ".jpg'/>"
				+ "港口标牌" + "</div>" +
				//详情的内容——————————————{process.env.PUBLIC_URL + '/countrypic/'}
				"<div id='jbxx' style='height:230px;width:200px;background:#3362ce;position:absolute;left:0px;top:25px;display:block;font-size:15px;'>" +
				"<div style='height:180px;width:200px;background:#3362ce'>" +
				"<div style='height:22px;width:200px;float:left;overflow:hidden;text-align:left;margin-left:10px;'>" + "中文名:" + dataan[i].port_chaname + "</div>" +
				"<div style='height:22px;width:200px;float:left;overflow:hidden;text-align:left;margin-left:10px;'>" + "英文名:" + dataan[i].name + "</div>" +
				"<div style='height:22px;width:200px;float:left;text-align:left;margin-left:10px;'>" + "经度:" + lonlat[0] + "</div>" +
				"<div style='height:22px;width:200px;float:left;text-align:left;margin-left:10px;'>" + "纬度:" + lonlat[1] + "</div>" +
				"<div style='height:22px;width:200px;float:left;text-align:left;margin-left:10px;'>" + "国家代码:" + dataan[i].country + "</div>" +
				"<br>" +
				"<div id='portdetailan' style='height:80px;width:285px;float:left;text-align:left;margin-left:10px;line-height:22px;'>" + "</div>" +
				"<button style='margin-left:15px;'><a  href='" +  + "/weball/portPage.html?mmsi=" + dataan[i].name + "'>详情页面</a></button>" +
				"<button style='margin-left:15px;'><a  href='" +  + "/weball/netDetail.html?name=" + dataan[i].name + "'>港口网络</a></button>" + "<br>" + "<br>"
				+ "</div>"
				+ "</div>"
                + "</div>";
              
            var porticon = new ol.Feature({
                    type : 'portwu',
                    disInfo : disInfo,
                    geometry : new ol.geom.Point(coord)
                });
            this.portAll.addFeature(porticon);

     } 
};

//出现定位函数
portControllerAN1.prototype.ChooseAIS = function(pos) {
	//flyto的方法进行跳转

	var duration = 2500;
	var start = +new Date();


	var pan = ol.animation.pan({
		duration : duration,
		source : /** @type {ol.Coordinate} */ (this.map.getView().getCenter()),
		start : start
	});
	var bounce = ol.animation.bounce({
		duration : duration,
		resolution : 4 * this.map.getView().getResolution(), //???
        start : start,
        
	});

	this.map.beforeRender(pan, bounce);
	this.map.getView().setCenter(pos);
    this.map.getView().setZoom(9);
   

};


//出现弹窗
portControllerAN1.prototype.portClick = function(feature, layer, element, popLayer) {
	popLayer.setPosition(feature.getGeometry().getCoordinates());
	$(element).popover('dispose');
	$(element).popover({
		'placement' : 'right',
        'html' : true,
        'content' : feature.get('disInfo'),
        
    });
    $(element).popover('show');
    
	};


    


let PortController = new portControllerAN1();

export default PortController;












