cc.TGA_OK=0,cc.TGA_ERROR_FILE_OPEN=1,cc.TGA_ERROR_READING_FILE=2,cc.TGA_ERROR_INDEXED_COLOR=3,cc.TGA_ERROR_MEMORY=4,cc.TGA_ERROR_COMPRESSED_FILE=5,cc.ImageTGA=function(a,b,c,d,e,f,g){this.status=a||0,this.type=b||0,this.pixelDepth=c||0,this.width=d||0,this.height=e||0,this.imageData=f||[],this.flipped=g||0},cc.tgaLoadHeader=function(a,b,c){var d=2;if(d+1>b)return!1;var e=new cc.BinaryStreamReader(a);if(e.setOffset(d),c.type=e.readByte(),d+=10,d+4+1>b)return!1;if(e.setOffset(d),c.width=e.readUnsignedShort(),c.height=e.readUnsignedInteger(),c.pixelDepth=e.readByte(),d+=5,d+1>b)return!1;var f=e.readByte();return c.flipped=0,32&f&&(c.flipped=1),!0},cc.tgaLoadImageData=function(a,b,c){var d,e,f,g,h=18;if(d=0|c.pixelDepth/2,e=c.height*c.width*d,h+e>b)return!1;if(c.imageData=cc.__getSubArray(a,h,h+e),d>=3)for(f=0;e>f;f+=d)g=c.imageData[f],c.imageData[f]=c.imageData[f+2],c.imageData[f+2]=g;return!0},cc.tgaRGBtogreyscale=function(a){var b,c;if(8!==a.pixelDepth){var d=a.pixelDepth/8,e=new Uint8Array(a.height*a.width);if(null!==e){for(b=0,c=0;c<a.width*a.height;b+=d,c++)e[c]=.3*a.imageData[b]+.59*a.imageData[b+1]+.11*a.imageData[b+2];a.pixelDepth=8,a.type=3,a.imageData=e}}},cc.tgaDestroy=function(a){a&&(a.imageData=null,a=null)},cc.tgaLoadRLEImageData=function(a,b,c){var d,e,f,g=0,h=0,i=0,j=[],k=0,l=18;for(d=c.pixelDepth/8,e=c.height*c.width,f=0;e>f;f++){if(0!==k)k--,h=0!==i;else{if(l+1>b)break;k=a[l],l+=1,i=128&k,i&&(k-=128),h=0}if(!h){if(l+d>b)break;if(j=cc.__getSubArray(a,l,l+d),l+=d,d>=3){var m=j[0];j[0]=j[2],j[2]=m}}for(var n=0;d>n;n++)c.imageData[g+n]=j[n];g+=d}return!0},cc.tgaFlipImage=function(a){for(var b=a.pixelDepth/8,c=a.width*b,d=0;d<a.height/2;d++){var e=cc.__getSubArray(a.imageData,d*c,d*c+c);cc.__setDataToArray(cc.__getSubArray(a.imageData,(a.height-(d+1))*c,c),a.imageData,d*c),cc.__setDataToArray(e,a.imageData,(a.height-(d+1))*c)}a.flipped=0},cc.__getSubArray=function(a,b,c){return a instanceof Array?a.slice(b,c):a.subarray(b,c)},cc.__setDataToArray=function(a,b,c){for(var d=0;d<a.length;d++)b[c+d]=a[d]},cc.BinaryStreamReader=cc.Class.extend({_binaryData:null,_offset:0,ctor:function(a){this._binaryData=a},setBinaryData:function(a){this._binaryData=a,this._offset=0},getBinaryData:function(){return this._binaryData},_checkSize:function(a){if(!(this._offset+Math.ceil(a/8)<this._data.length))throw new Error("Index out of bound")},_decodeFloat:function(a,b){var c=a+b+1,d=c>>3;this._checkSize(c);var e=Math.pow(2,b-1)-1,f=this._readBits(a+b,1,d),g=this._readBits(a,b,d),h=0,i=2,j=0;do for(var k=this._readByte(++j,d),l=a%8||8,m=1<<l;m>>=1;)k&m&&(h+=1/i),i*=2;while(a-=l);return this._offset+=d,g===(e<<1)+1?h?0/0:f?-(1/0):+(1/0):(1+-2*f)*(g||h?g?Math.pow(2,g-e)*(1+h):Math.pow(2,-e+1)*h:0)},_readByte:function(a,b){return this._data[this._offset+b-a-1]},_decodeInt:function(a,b){var c=this._readBits(0,a,a/8),d=Math.pow(2,a),e=b&&c>=d/2?c-d:c;return this._offset+=a/8,e},_shl:function(a,b){for(++b;--b;a=1073741824===(1073741824&(a%=2147483648))?2*a:2*(a-1073741824)+2147483647+1);return a},_readBits:function(a,b,c){var d=(a+b)%8,e=a%8,f=c-(a>>3)-1,g=c+(-(a+b)>>3),h=f-g,i=this._readByte(f,c)>>e&(1<<(h?8-e:b))-1;for(h&&d&&(i+=(this._readByte(g++,c)&(1<<d)-1)<<(h--<<3)-e);h;)i+=this._shl(this._readByte(g++,c),(h--<<3)-e);return i},readInteger:function(){return this._decodeInt(32,!0)},readUnsignedInteger:function(){return this._decodeInt(32,!1)},readSingle:function(){return this._decodeFloat(23,8)},readShort:function(){return this._decodeInt(16,!0)},readUnsignedShort:function(){return this._decodeInt(16,!1)},readByte:function(){var a=this._data[this._offset];return this._offset+=1,a},readData:function(a,b){return this._binaryData instanceof Array?this._binaryData.slice(a,b):this._binaryData.subarray(a,b)},setOffset:function(a){this._offset=a},getOffset:function(){return this._offset}}),cc.TMX_ORIENTATION_ORTHO=0,cc.TMX_ORIENTATION_HEX=1,cc.TMX_ORIENTATION_ISO=2,cc.TMXTiledMap=cc.Node.extend({properties:null,mapOrientation:null,objectGroups:null,_mapSize:null,_tileSize:null,_tileProperties:null,_className:"TMXTiledMap",ctor:function(a,b){cc.Node.prototype.ctor.call(this),this._mapSize=cc.size(0,0),this._tileSize=cc.size(0,0),void 0!==b?this.initWithXML(a,b):void 0!==a&&this.initWithTMXFile(a)},getMapSize:function(){return cc.size(this._mapSize.width,this._mapSize.height)},setMapSize:function(a){this._mapSize.width=a.width,this._mapSize.height=a.height},_getMapWidth:function(){return this._mapSize.width},_setMapWidth:function(a){this._mapSize.width=a},_getMapHeight:function(){return this._mapSize.height},_setMapHeight:function(a){this._mapSize.height=a},getTileSize:function(){return cc.size(this._tileSize.width,this._tileSize.height)},setTileSize:function(a){this._tileSize.width=a.width,this._tileSize.height=a.height},_getTileWidth:function(){return this._tileSize.width},_setTileWidth:function(a){this._tileSize.width=a},_getTileHeight:function(){return this._tileSize.height},_setTileHeight:function(a){this._tileSize.height=a},getMapOrientation:function(){return this.mapOrientation},setMapOrientation:function(a){this.mapOrientation=a},getObjectGroups:function(){return this.objectGroups},setObjectGroups:function(a){this.objectGroups=a},getProperties:function(){return this.properties},setProperties:function(a){this.properties=a},initWithTMXFile:function(a){if(!a||0===a.length)throw"cc.TMXTiledMap.initWithTMXFile(): tmxFile should be non-null or non-empty string.";this.width=0,this.height=0;var b=new cc.TMXMapInfo(a);if(!b)return!1;var c=b.getTilesets();return c&&0!==c.length||cc.log("cc.TMXTiledMap.initWithTMXFile(): Map not found. Please check the filename."),this._buildWithMapInfo(b),!0},initWithXML:function(a,b){this.width=0,this.height=0;var c=new cc.TMXMapInfo(a,b),d=c.getTilesets();return d&&0!==d.length||cc.log("cc.TMXTiledMap.initWithXML(): Map not found. Please check the filename."),this._buildWithMapInfo(c),!0},_buildWithMapInfo:function(a){this._mapSize=a.getMapSize(),this._tileSize=a.getTileSize(),this.mapOrientation=a.orientation,this.objectGroups=a.getObjectGroups(),this.properties=a.properties,this._tileProperties=a.getTileProperties();var b=0,c=a.getLayers();if(c)for(var d=null,e=0,f=c.length;f>e;e++)if(d=c[e],d&&d.visible){var g=this._parseLayer(d,a);this.addChild(g,b,b),this.width=Math.max(this.width,g.width),this.height=Math.max(this.height,g.height),b++}},allLayers:function(){for(var a=[],b=this._children,c=0,d=b.length;d>c;c++){var e=b[c];e&&e instanceof cc.TMXLayer&&a.push(e)}return a},getLayer:function(a){if(!a||0===a.length)throw"cc.TMXTiledMap.getLayer(): layerName should be non-null or non-empty string.";for(var b=this._children,c=0;c<b.length;c++){var d=b[c];if(d&&d.layerName===a)return d}return null},getObjectGroup:function(a){if(!a||0===a.length)throw"cc.TMXTiledMap.getObjectGroup(): groupName should be non-null or non-empty string.";if(this.objectGroups)for(var b=0;b<this.objectGroups.length;b++){var c=this.objectGroups[b];if(c&&c.groupName===a)return c}return null},getProperty:function(a){return this.properties[a.toString()]},propertiesForGID:function(a){return cc.log("propertiesForGID is deprecated. Please use getPropertiesForGID instead."),this.getPropertiesForGID[a]},getPropertiesForGID:function(a){return this._tileProperties[a]},_parseLayer:function(a,b){var c=this._tilesetForLayer(a,b),d=new cc.TMXLayer(c,a,b);return a.ownTiles=!1,d.setupTiles(),d},_tilesetForLayer:function(a,b){var c=a._layerSize,d=b.getTilesets();if(d)for(var e=d.length-1;e>=0;e--){var f=d[e];if(f)for(var g=0;g<c.height;g++)for(var h=0;h<c.width;h++){var i=h+c.width*g,j=a._tiles[i];if(0!==j&&(j&cc.TMX_TILE_FLIPPED_MASK)>>>0>=f.firstGid)return f}}return cc.log("cocos2d: Warning: TMX Layer "+a.name+" has no tiles"),null}});var _p=cc.TMXTiledMap.prototype;_p.mapWidth,cc.defineGetterSetter(_p,"mapWidth",_p._getMapWidth,_p._setMapWidth),_p.mapHeight,cc.defineGetterSetter(_p,"mapHeight",_p._getMapHeight,_p._setMapHeight),_p.tileWidth,cc.defineGetterSetter(_p,"tileWidth",_p._getTileWidth,_p._setTileWidth),_p.tileHeight,cc.defineGetterSetter(_p,"tileHeight",_p._getTileHeight,_p._setTileHeight),cc.TMXTiledMap.create=function(a,b){return new cc.TMXTiledMap(a,b)},cc.TMX_PROPERTY_NONE=0,cc.TMX_PROPERTY_MAP=1,cc.TMX_PROPERTY_LAYER=2,cc.TMX_PROPERTY_OBJECTGROUP=3,cc.TMX_PROPERTY_OBJECT=4,cc.TMX_PROPERTY_TILE=5,cc.TMX_TILE_HORIZONTAL_FLAG=2147483648,cc.TMX_TILE_VERTICAL_FLAG=1073741824,cc.TMX_TILE_DIAGONAL_FLAG=536870912,cc.TMX_TILE_FLIPPED_ALL=(cc.TMX_TILE_HORIZONTAL_FLAG|cc.TMX_TILE_VERTICAL_FLAG|cc.TMX_TILE_DIAGONAL_FLAG)>>>0,cc.TMX_TILE_FLIPPED_MASK=~cc.TMX_TILE_FLIPPED_ALL>>>0,cc.TMXLayerInfo=cc.Class.extend({properties:null,name:"",_layerSize:null,_tiles:null,visible:null,_opacity:null,ownTiles:!0,_minGID:1e5,_maxGID:0,offset:null,ctor:function(){this.properties=[],this.name="",this._layerSize=null,this._tiles=[],this.visible=!0,this._opacity=0,this.ownTiles=!0,this._minGID=1e5,this._maxGID=0,this.offset=cc.p(0,0)},getProperties:function(){return this.properties},setProperties:function(a){this.properties=a}}),cc.TMXTilesetInfo=cc.Class.extend({name:"",firstGid:0,_tileSize:null,spacing:0,margin:0,sourceImage:"",imageSize:null,ctor:function(){this._tileSize=cc.size(0,0),this.imageSize=cc.size(0,0)},rectForGID:function(a){var b=cc.rect(0,0,0,0);b.width=this._tileSize.width,b.height=this._tileSize.height,a&=cc.TMX_TILE_FLIPPED_MASK,a-=parseInt(this.firstGid,10);var c=parseInt((this.imageSize.width-2*this.margin+this.spacing)/(this._tileSize.width+this.spacing),10);return b.x=parseInt(a%c*(this._tileSize.width+this.spacing)+this.margin,10),b.y=parseInt(parseInt(a/c,10)*(this._tileSize.height+this.spacing)+this.margin,10),b}}),cc.TMXMapInfo=cc.SAXParser.extend({properties:null,orientation:null,parentElement:null,parentGID:null,layerAttrs:0,storingCharacters:!1,tmxFileName:null,currentString:null,_objectGroups:null,_mapSize:null,_tileSize:null,_layers:null,_tilesets:null,_tileProperties:null,_resources:"",_currentFirstGID:0,ctor:function(a,b){cc.SAXParser.prototype.ctor.apply(this),this._mapSize=cc.size(0,0),this._tileSize=cc.size(0,0),this._layers=[],this._tilesets=[],this._objectGroups=[],this.properties=[],this._tileProperties={},this._currentFirstGID=0,void 0!==b?this.initWithXML(a,b):void 0!==a&&this.initWithTMXFile(a)},getOrientation:function(){return this.orientation},setOrientation:function(a){this.orientation=a},getMapSize:function(){return cc.size(this._mapSize.width,this._mapSize.height)},setMapSize:function(a){this._mapSize.width=a.width,this._mapSize.height=a.height},_getMapWidth:function(){return this._mapSize.width},_setMapWidth:function(a){this._mapSize.width=a},_getMapHeight:function(){return this._mapSize.height},_setMapHeight:function(a){this._mapSize.height=a},getTileSize:function(){return cc.size(this._tileSize.width,this._tileSize.height)},setTileSize:function(a){this._tileSize.width=a.width,this._tileSize.height=a.height},_getTileWidth:function(){return this._tileSize.width},_setTileWidth:function(a){this._tileSize.width=a},_getTileHeight:function(){return this._tileSize.height},_setTileHeight:function(a){this._tileSize.height=a},getLayers:function(){return this._layers},setLayers:function(a){this._layers.push(a)},getTilesets:function(){return this._tilesets},setTilesets:function(a){this._tilesets.push(a)},getObjectGroups:function(){return this._objectGroups},setObjectGroups:function(a){this._objectGroups.push(a)},getParentElement:function(){return this.parentElement},setParentElement:function(a){this.parentElement=a},getParentGID:function(){return this.parentGID},setParentGID:function(a){this.parentGID=a},getLayerAttribs:function(){return this.layerAttrs},setLayerAttribs:function(a){this.layerAttrs=a},getStoringCharacters:function(){return this.storingCharacters},setStoringCharacters:function(a){this.storingCharacters=a},getProperties:function(){return this.properties},setProperties:function(a){this.properties=a},initWithTMXFile:function(a){return this._internalInit(a,null),this.parseXMLFile(a)},initWithXML:function(a,b){return this._internalInit(null,b),this.parseXMLString(a)},parseXMLFile:function(a,b){b=b||!1;var c=b?a:cc.loader.getRes(a);if(!c)throw"Please load the resource first : "+a;var d,e,f=this._parseXML(c),g=f.documentElement,h=g.getAttribute("version"),i=g.getAttribute("orientation");if("map"===g.nodeName){"1.0"!==h&&null!==h&&cc.log("cocos2d: TMXFormat: Unsupported TMX version:"+h),"orthogonal"===i?this.orientation=cc.TMX_ORIENTATION_ORTHO:"isometric"===i?this.orientation=cc.TMX_ORIENTATION_ISO:"hexagonal"===i?this.orientation=cc.TMX_ORIENTATION_HEX:null!==i&&cc.log("cocos2d: TMXFomat: Unsupported orientation:"+i);var j=cc.size(0,0);j.width=parseFloat(g.getAttribute("width")),j.height=parseFloat(g.getAttribute("height")),this.setMapSize(j),j=cc.size(0,0),j.width=parseFloat(g.getAttribute("tilewidth")),j.height=parseFloat(g.getAttribute("tileheight")),this.setTileSize(j);var k=g.querySelectorAll("map > properties >  property");if(k){var l={};for(d=0;d<k.length;d++)l[k[d].getAttribute("name")]=k[d].getAttribute("value");this.properties=l}}var m=g.getElementsByTagName("tileset");for("map"!==g.nodeName&&(m=[],m.push(g)),d=0;d<m.length;d++){var n=m[d],o=n.getAttribute("source");if(o){var p=b?cc.path.join(this._resources,o):cc.path.changeBasename(a,o);this.parseXMLFile(p)}else{var q=new cc.TMXTilesetInfo;q.name=n.getAttribute("name")||"",q.firstGid=parseInt(n.getAttribute("firstgid"))||0,q.spacing=parseInt(n.getAttribute("spacing"))||0,q.margin=parseInt(n.getAttribute("margin"))||0;var r=cc.size(0,0);r.width=parseFloat(n.getAttribute("tilewidth")),r.height=parseFloat(n.getAttribute("tileheight")),q._tileSize=r;var s=n.getElementsByTagName("image")[0],t=s.getAttribute("source"),u=-1;if(this.tmxFileName&&(u=this.tmxFileName.lastIndexOf("/")),-1!==u){var v=this.tmxFileName.substr(0,u+1);q.sourceImage=v+t}else q.sourceImage=this._resources+(this._resources?"/":"")+t;this.setTilesets(q);var w=n.getElementsByTagName("tile");if(w)for(var x=0;x<w.length;x++){var y=w[x];this.parentGID=parseInt(q.firstGid)+parseInt(y.getAttribute("id")||0);var z=y.querySelectorAll("properties > property");if(z){var A={};for(e=0;e<z.length;e++){var B=z[e].getAttribute("name");A[B]=z[e].getAttribute("value")}this._tileProperties[this.parentGID]=A}}}}var C=g.getElementsByTagName("layer");if(C)for(d=0;d<C.length;d++){var D=C[d],E=D.getElementsByTagName("data")[0],F=new cc.TMXLayerInfo;F.name=D.getAttribute("name");var G=cc.size(0,0);G.width=parseFloat(D.getAttribute("width")),G.height=parseFloat(D.getAttribute("height")),F._layerSize=G;var H=D.getAttribute("visible");F.visible=!("0"==H);var I=D.getAttribute("opacity")||1;F._opacity=I?parseInt(255*parseFloat(I)):255,F.offset=cc.p(parseFloat(D.getAttribute("x"))||0,parseFloat(D.getAttribute("y"))||0);var J="";for(e=0;e<E.childNodes.length;e++)J+=E.childNodes[e].nodeValue;J=J.trim();var K=E.getAttribute("compression"),L=E.getAttribute("encoding");if(K&&"gzip"!==K&&"zlib"!==K)return cc.log("cc.TMXMapInfo.parseXMLFile(): unsupported compression method"),null;switch(K){case"gzip":F._tiles=cc.unzipBase64AsArray(J,4);break;case"zlib":var M=new Zlib.Inflate(cc.Codec.Base64.decodeAsArray(J,1));F._tiles=cc.uint8ArrayToUint32Array(M.decompress());break;case null:case"":if("base64"===L)F._tiles=cc.Codec.Base64.decodeAsArray(J,4);else if("csv"===L){F._tiles=[];for(var N=J.split(","),O=0;O<N.length;O++)F._tiles.push(parseInt(N[O]))}else{var P=E.getElementsByTagName("tile");F._tiles=[];for(var Q=0;Q<P.length;Q++)F._tiles.push(parseInt(P[Q].getAttribute("gid")))}break;default:this.layerAttrs===cc.TMXLayerInfo.ATTRIB_NONE&&cc.log("cc.TMXMapInfo.parseXMLFile(): Only base64 and/or gzip/zlib maps are supported")}var R=D.querySelectorAll("properties > property");if(R){var S={};for(e=0;e<R.length;e++)S[R[e].getAttribute("name")]=R[e].getAttribute("value");F.properties=S}this.setLayers(F)}var T=g.getElementsByTagName("objectgroup");if(T)for(d=0;d<T.length;d++){var U=T[d],V=new cc.TMXObjectGroup;V.groupName=U.getAttribute("name"),V.setPositionOffset(cc.p(parseFloat(U.getAttribute("x"))*this.getTileSize().width||0,parseFloat(U.getAttribute("y"))*this.getTileSize().height||0));var W=U.querySelectorAll("objectgroup > properties > property");if(W)for(e=0;e<W.length;e++){var X={};X[W[e].getAttribute("name")]=W[e].getAttribute("value"),V.properties=X}var Y=U.querySelectorAll("object");if(Y)for(e=0;e<Y.length;e++){var Z=Y[e],$={};$.name=Z.getAttribute("name")||"",$.type=Z.getAttribute("type")||"",$.x=parseInt(Z.getAttribute("x")||0)+V.getPositionOffset().x;var _=parseInt(Z.getAttribute("y")||0)+V.getPositionOffset().y;$.width=parseInt(Z.getAttribute("width"))||0,$.height=parseInt(Z.getAttribute("height"))||0,$.y=parseInt(this.getMapSize().height*this.getTileSize().height)-_-$.height,$.rotation=parseInt(Z.getAttribute("rotation"))||0;var aa=Z.querySelectorAll("properties > property");if(aa)for(var ba=0;ba<aa.length;ba++)$[aa[ba].getAttribute("name")]=aa[ba].getAttribute("value");var ca=Z.querySelectorAll("polygon");if(ca&&ca.length>0){var da=ca[0].getAttribute("points");da&&($.polygonPoints=this._parsePointsString(da))}var ea=Z.querySelectorAll("polyline");if(ea&&ea.length>0){var fa=ea[0].getAttribute("points");fa&&($.polylinePoints=this._parsePointsString(fa))}V.setObjects($)}this.setObjectGroups(V)}return g},_parsePointsString:function(a){if(!a)return null;for(var b=[],c=a.split(" "),d=0;d<c.length;d++){var e=c[d].split(",");b.push({x:e[0],y:e[1]})}return b},parseXMLString:function(a){return this.parseXMLFile(a,!0)},getTileProperties:function(){return this._tileProperties},setTileProperties:function(a){this._tileProperties.push(a)},getCurrentString:function(){return this.currentString},setCurrentString:function(a){this.currentString=a},getTMXFileName:function(){return this.tmxFileName},setTMXFileName:function(a){this.tmxFileName=a},_internalInit:function(a,b){this._tilesets.length=0,this._layers.length=0,this.tmxFileName=a,b&&(this._resources=b),this._objectGroups.length=0,this.properties.length=0,this._tileProperties.length=0,this.currentString="",this.storingCharacters=!1,this.layerAttrs=cc.TMXLayerInfo.ATTRIB_NONE,this.parentElement=cc.TMX_PROPERTY_NONE,this._currentFirstGID=0}});var _p=cc.TMXMapInfo.prototype;_p.mapWidth,cc.defineGetterSetter(_p,"mapWidth",_p._getMapWidth,_p._setMapWidth),_p.mapHeight,cc.defineGetterSetter(_p,"mapHeight",_p._getMapHeight,_p._setMapHeight),_p.tileWidth,cc.defineGetterSetter(_p,"tileWidth",_p._getTileWidth,_p._setTileWidth),_p.tileHeight,cc.defineGetterSetter(_p,"tileHeight",_p._getTileHeight,_p._setTileHeight),cc.TMXMapInfo.create=function(a,b){return new cc.TMXMapInfo(a,b)},cc.loader.register(["tmx","tsx"],cc._txtLoader),cc.TMXLayerInfo.ATTRIB_NONE=1,cc.TMXLayerInfo.ATTRIB_BASE64=2,cc.TMXLayerInfo.ATTRIB_GZIP=4,cc.TMXLayerInfo.ATTRIB_ZLIB=8,cc.TMXObjectGroup=cc.Class.extend({properties:null,groupName:"",_positionOffset:null,_objects:null,ctor:function(){this.groupName="",this._positionOffset=cc.p(0,0),this.properties=[],this._objects=[]},getPositionOffset:function(){return cc.p(this._positionOffset)},setPositionOffset:function(a){this._positionOffset.x=a.x,this._positionOffset.y=a.y},getProperties:function(){return this.properties},setProperties:function(a){this.properties.push(a)},getGroupName:function(){return this.groupName.toString()},setGroupName:function(a){this.groupName=a},propertyNamed:function(a){return this.properties[a]},objectNamed:function(a){this.getObject(a)},getObject:function(a){if(this._objects&&this._objects.length>0)for(var b=this._objects,c=0,d=b.length;d>c;c++){var e=b[c].name;if(e&&e===a)return b[c]}return null},getObjects:function(){return this._objects},setObjects:function(a){this._objects.push(a)}}),cc.TMXLayer=cc.SpriteBatchNode.extend({tiles:null,tileset:null,layerOrientation:null,properties:null,layerName:"",_layerSize:null,_mapTileSize:null,_opacity:255,_minGID:null,_maxGID:null,_vertexZvalue:null,_useAutomaticVertexZ:null,_reusedTile:null,_atlasIndexArray:null,_contentScaleFactor:null,_className:"TMXLayer",ctor:function(a,b,c){cc.SpriteBatchNode.prototype.ctor.call(this),this._descendants=[],this._layerSize=cc.size(0,0),this._mapTileSize=cc.size(0,0),void 0!==c&&this.initWithTilesetInfo(a,b,c)},_createRenderCmd:function(){return cc._renderType===cc._RENDER_TYPE_CANVAS?new cc.TMXLayer.CanvasRenderCmd(this):new cc.TMXLayer.WebGLRenderCmd(this)},setContentSize:function(a,b){cc.Node.prototype.setContentSize.call(this,a,b),this._renderCmd._updateCacheContext(a,b)},getTexture:function(){return this._renderCmd.getTexture()},getLayerSize:function(){return cc.size(this._layerSize.width,this._layerSize.height)},setLayerSize:function(a){this._layerSize.width=a.width,this._layerSize.height=a.height},_getLayerWidth:function(){return this._layerSize.width},_setLayerWidth:function(a){this._layerSize.width=a},_getLayerHeight:function(){return this._layerSize.height},_setLayerHeight:function(a){this._layerSize.height=a},getMapTileSize:function(){return cc.size(this._mapTileSize.width,this._mapTileSize.height)},setMapTileSize:function(a){this._mapTileSize.width=a.width,this._mapTileSize.height=a.height},_getTileWidth:function(){return this._mapTileSize.width},_setTileWidth:function(a){this._mapTileSize.width=a},_getTileHeight:function(){return this._mapTileSize.height},_setTileHeight:function(a){this._mapTileSize.height=a},getTiles:function(){return this.tiles},setTiles:function(a){this.tiles=a},getTileset:function(){return this.tileset},setTileset:function(a){this.tileset=a},getLayerOrientation:function(){return this.layerOrientation},setLayerOrientation:function(a){this.layerOrientation=a},getProperties:function(){return this.properties},setProperties:function(a){this.properties=a},initWithTilesetInfo:function(a,b,c){var d,e=b._layerSize,f=parseInt(e.width*e.height),g=.35*f+1;if(a&&(d=cc.textureCache.addImage(a.sourceImage)),this.initWithTexture(d,g)){this.layerName=b.name,this._layerSize=e,this.tiles=b._tiles,this._minGID=b._minGID,this._maxGID=b._maxGID,this._opacity=b._opacity,this.properties=b.properties,this._contentScaleFactor=cc.director.getContentScaleFactor(),this.tileset=a,this._mapTileSize=c.getTileSize(),this.layerOrientation=c.orientation;var h=this._calculateLayerOffset(b.offset);return this.setPosition(cc.pointPixelsToPoints(h)),this._atlasIndexArray=[],this.setContentSize(cc.sizePixelsToPoints(cc.size(this._layerSize.width*this._mapTileSize.width,this._layerSize.height*this._mapTileSize.height))),this._useAutomaticVertexZ=!1,this._vertexZvalue=0,!0}return!1},releaseMap:function(){this.tiles&&(this.tiles=null),this._atlasIndexArray&&(this._atlasIndexArray=null)},getTileAt:function(a,b){if(!a)throw"cc.TMXLayer.getTileAt(): pos should be non-null";if(void 0!==b&&(a=cc.p(a,b)),a.x>=this._layerSize.width||a.y>=this._layerSize.height||a.x<0||a.y<0)throw"cc.TMXLayer.getTileAt(): invalid position";if(!this.tiles||!this._atlasIndexArray)return cc.log("cc.TMXLayer.getTileAt(): TMXLayer: the tiles map has been released"),null;var c=null,d=this.getTileGIDAt(a);if(0===d)return c;var e=0|a.x+a.y*this._layerSize.width;if(c=this.getChildByTag(e),!c){var f=this.tileset.rectForGID(d);f=cc.rectPixelsToPoints(f),c=new cc.Sprite,c.initWithTexture(this.texture,f),c.batchNode=this,c.setPosition(this.getPositionAt(a)),c.vertexZ=this._vertexZForPos(a),c.anchorX=0,c.anchorY=0,c.opacity=this._opacity;var g=this._atlasIndexForExistantZ(e);this.addSpriteWithoutQuad(c,g,e)}return c},getTileGIDAt:function(a,b){if(null==a)throw"cc.TMXLayer.getTileGIDAt(): pos should be non-null";if(void 0!==b&&(a=cc.p(a,b)),a.x>=this._layerSize.width||a.y>=this._layerSize.height||a.x<0||a.y<0)throw"cc.TMXLayer.getTileGIDAt(): invalid position";if(!this.tiles||!this._atlasIndexArray)return cc.log("cc.TMXLayer.getTileGIDAt(): TMXLayer: the tiles map has been released"),null;var c=0|a.x+a.y*this._layerSize.width,d=this.tiles[c];return(d&cc.TMX_TILE_FLIPPED_MASK)>>>0},getTileFlagsAt:function(a,b){if(!a)throw"cc.TMXLayer.getTileFlagsAt(): pos should be non-null";if(void 0!==b&&(a=cc.p(a,b)),a.x>=this._layerSize.width||a.y>=this._layerSize.height||a.x<0||a.y<0)throw"cc.TMXLayer.getTileFlagsAt(): invalid position";if(!this.tiles||!this._atlasIndexArray)return cc.log("cc.TMXLayer.getTileFlagsAt(): TMXLayer: the tiles map has been released"),null;var c=0|a.x+a.y*this._layerSize.width,d=this.tiles[c];return(d&cc.TMX_TILE_FLIPPED_ALL)>>>0},setTileGID:function(a,b,c,d){if(!b)throw"cc.TMXLayer.setTileGID(): pos should be non-null";var e;if(void 0!==d?e=cc.p(b,c):(e=b,d=c),e.x>=this._layerSize.width||e.y>=this._layerSize.height||e.x<0||e.y<0)throw"cc.TMXLayer.setTileGID(): invalid position";if(!this.tiles||!this._atlasIndexArray)return void cc.log("cc.TMXLayer.setTileGID(): TMXLayer: the tiles map has been released");if(0!==a&&a<this.tileset.firstGid)return void cc.log("cc.TMXLayer.setTileGID(): invalid gid:"+a);d=d||0,this._setNodeDirtyForCache();var f=this.getTileFlagsAt(e),g=this.getTileGIDAt(e);if(g!==a||f!==d){var h=(a|d)>>>0;if(0===a)this.removeTileAt(e);else if(0===g)this._insertTileForGID(h,e);else{var i=e.x+e.y*this._layerSize.width,j=this.getChildByTag(i);if(j){var k=this.tileset.rectForGID(a);k=cc.rectPixelsToPoints(k),j.setTextureRect(k,!1),null!=d&&this._setupTileSprite(j,e,h),this.tiles[i]=h}else this._updateTileForGID(h,e)}}},removeTileAt:function(a,b){if(!a)throw"cc.TMXLayer.removeTileAt(): pos should be non-null";if(void 0!==b&&(a=cc.p(a,b)),a.x>=this._layerSize.width||a.y>=this._layerSize.height||a.x<0||a.y<0)throw"cc.TMXLayer.removeTileAt(): invalid position";if(!this.tiles||!this._atlasIndexArray)return void cc.log("cc.TMXLayer.removeTileAt(): TMXLayer: the tiles map has been released");var c=this.getTileGIDAt(a);if(0!==c){cc._renderType===cc._RENDER_TYPE_CANVAS&&this._setNodeDirtyForCache();var d=0|a.x+a.y*this._layerSize.width,e=this._atlasIndexForExistantZ(d);this.tiles[d]=0,this._atlasIndexArray.splice(e,1);var f=this.getChildByTag(d);if(f)cc.SpriteBatchNode.prototype.removeChild.call(this,f,!0);else if(cc._renderType===cc._RENDER_TYPE_WEBGL&&this.textureAtlas.removeQuadAtIndex(e),this._children)for(var g=this._children,h=0,i=g.length;i>h;h++){var j=g[h];if(j){var k=j.atlasIndex;k>=e&&(j.atlasIndex=k-1)}}}},getPositionAt:function(a,b){void 0!==b&&(a=cc.p(a,b));var c=cc.p(0,0);switch(this.layerOrientation){case cc.TMX_ORIENTATION_ORTHO:c=this._positionForOrthoAt(a);break;case cc.TMX_ORIENTATION_ISO:c=this._positionForIsoAt(a);break;case cc.TMX_ORIENTATION_HEX:c=this._positionForHexAt(a)}return cc.pointPixelsToPoints(c)},getProperty:function(a){return this.properties[a]},setupTiles:function(){this._renderCmd.initImageSize(),this._parseInternalProperties(),cc._renderType===cc._RENDER_TYPE_CANVAS&&this._setNodeDirtyForCache();for(var a=this._layerSize.height,b=this._layerSize.width,c=0;a>c;c++)for(var d=0;b>d;d++){var e=d+b*c,f=this.tiles[e];0!==f&&(this._appendTileForGID(f,cc.p(d,c)),this._minGID=Math.min(f,this._minGID),this._maxGID=Math.max(f,this._maxGID))}this._maxGID>=this.tileset.firstGid&&this._minGID>=this.tileset.firstGid||cc.log("cocos2d:TMX: Only 1 tileset per layer is supported")},addChild:function(a,b,c){cc.log("addChild: is not supported on cc.TMXLayer. Instead use setTileGID or tileAt.")},removeChild:function(a,b){if(a){if(-1===this._children.indexOf(a))return void cc.log("cc.TMXLayer.removeChild(): Tile does not belong to TMXLayer");cc._renderType===cc._RENDER_TYPE_CANVAS&&this._setNodeDirtyForCache();var c=a.atlasIndex,d=this._atlasIndexArray[c];this.tiles[d]=0,this._atlasIndexArray.splice(c,1),cc.SpriteBatchNode.prototype.removeChild.call(this,a,b),cc.renderer.childrenOrderDirty=!0}},getLayerName:function(){return this.layerName},setLayerName:function(a){this.layerName=a},_positionForIsoAt:function(a){return cc.p(this._mapTileSize.width/2*(this._layerSize.width+a.x-a.y-1),this._mapTileSize.height/2*(2*this._layerSize.height-a.x-a.y-2))},_positionForOrthoAt:function(a){return cc.p(a.x*this._mapTileSize.width,(this._layerSize.height-a.y-1)*this._mapTileSize.height)},_positionForHexAt:function(a){var b=a.x%2===1?-this._mapTileSize.height/2:0;return cc.p(a.x*this._mapTileSize.width*3/4,(this._layerSize.height-a.y-1)*this._mapTileSize.height+b)},_calculateLayerOffset:function(a){var b=cc.p(0,0);switch(this.layerOrientation){case cc.TMX_ORIENTATION_ORTHO:b=cc.p(a.x*this._mapTileSize.width,-a.y*this._mapTileSize.height);break;case cc.TMX_ORIENTATION_ISO:b=cc.p(this._mapTileSize.width/2*(a.x-a.y),this._mapTileSize.height/2*(-a.x-a.y));break;case cc.TMX_ORIENTATION_HEX:(0!==a.x||0!==a.y)&&cc.log("offset for hexagonal map not implemented yet")}return b},_appendTileForGID:function(a,b){var c=this.tileset.rectForGID(a);c=cc.rectPixelsToPoints(c);var d=0|b.x+b.y*this._layerSize.width,e=this._renderCmd._reusedTileWithRect(c);this._setupTileSprite(e,b,a);var f=this._atlasIndexArray.length;return this.insertQuadFromSprite(e,f),this._atlasIndexArray.splice(f,0,d),e},_insertTileForGID:function(a,b){var c=this.tileset.rectForGID(a);c=cc.rectPixelsToPoints(c);var d=0|b.x+b.y*this._layerSize.width,e=this._renderCmd._reusedTileWithRect(c);this._setupTileSprite(e,b,a);var f=this._atlasIndexForNewZ(d);if(this.insertQuadFromSprite(e,f),this._atlasIndexArray.splice(f,0,d),this._children)for(var g=this._children,h=0,i=g.length;i>h;h++){var j=g[h];if(j){var k=j.atlasIndex;k>=f&&(j.atlasIndex=k+1)}}return this.tiles[d]=a,e},_updateTileForGID:function(a,b){var c=this.tileset.rectForGID(a),d=this._contentScaleFactor;c=cc.rect(c.x/d,c.y/d,c.width/d,c.height/d);var e=b.x+b.y*this._layerSize.width,f=this._renderCmd._reusedTileWithRect(c);return this._setupTileSprite(f,b,a),f.atlasIndex=this._atlasIndexForExistantZ(e),f.dirty=!0,f.updateTransform(),this.tiles[e]=a,f},_parseInternalProperties:function(){var a=this.getProperty("cc_vertexz");if(a)if("automatic"===a){this._useAutomaticVertexZ=!0;var b=this.getProperty("cc_alpha_func"),c=0;if(b&&(c=parseFloat(b)),cc._renderType===cc._RENDER_TYPE_WEBGL){this.shaderProgram=cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLORALPHATEST);var d=cc._renderContext.getUniformLocation(this.shaderProgram.getProgram(),cc.UNIFORM_ALPHA_TEST_VALUE_S);this.shaderProgram.use(),this.shaderProgram.setUniformLocationWith1f(d,c)}}else this._vertexZvalue=parseInt(a,10)},_setupTileSprite:function(a,b,c){var d=b.x+b.y*this._layerSize.width;if(a.setPosition(this.getPositionAt(b)),cc._renderType===cc._RENDER_TYPE_WEBGL?a.vertexZ=this._vertexZForPos(b):a.tag=d,a.anchorX=0,a.anchorY=0,a.opacity=this._opacity,cc._renderType===cc._RENDER_TYPE_WEBGL&&(a.rotation=0),a.setFlippedX(!1),a.setFlippedY(!1),(c&cc.TMX_TILE_DIAGONAL_FLAG)>>>0){a.anchorX=.5,a.anchorY=.5,a.x=this.getPositionAt(b).x+a.width/2,a.y=this.getPositionAt(b).y+a.height/2;var e=(c&(cc.TMX_TILE_HORIZONTAL_FLAG|cc.TMX_TILE_VERTICAL_FLAG)>>>0)>>>0;e===cc.TMX_TILE_HORIZONTAL_FLAG?a.rotation=90:e===cc.TMX_TILE_VERTICAL_FLAG?a.rotation=270:e===(cc.TMX_TILE_VERTICAL_FLAG|cc.TMX_TILE_HORIZONTAL_FLAG)>>>0?(a.rotation=90,a.setFlippedX(!0)):(a.rotation=270,a.setFlippedX(!0))}else(c&cc.TMX_TILE_HORIZONTAL_FLAG)>>>0&&a.setFlippedX(!0),(c&cc.TMX_TILE_VERTICAL_FLAG)>>>0&&a.setFlippedY(!0)},_vertexZForPos:function(a){var b=0,c=0;if(this._useAutomaticVertexZ)switch(this.layerOrientation){case cc.TMX_ORIENTATION_ISO:c=this._layerSize.width+this._layerSize.height,b=-(c-(a.x+a.y));break;case cc.TMX_ORIENTATION_ORTHO:b=-(this._layerSize.height-a.y);break;case cc.TMX_ORIENTATION_HEX:cc.log("TMX Hexa zOrder not supported");break;default:cc.log("TMX invalid value")}else b=this._vertexZvalue;return b},_atlasIndexForExistantZ:function(a){var b;if(this._atlasIndexArray)for(var c=this._atlasIndexArray,d=0,e=c.length;e>d&&(b=c[d],b!==a);d++);return cc.isNumber(b)||cc.log("cc.TMXLayer._atlasIndexForExistantZ(): TMX atlas index not found. Shall not happen"),d},_atlasIndexForNewZ:function(a){for(var b=this._atlasIndexArray,c=0,d=b.length;d>c;c++){var e=b[c];if(e>a)break}return c}});var _p=cc.TMXLayer.prototype;cc.defineGetterSetter(_p,"texture",_p.getTexture,_p.setTexture),
_p.layerWidth,cc.defineGetterSetter(_p,"layerWidth",_p._getLayerWidth,_p._setLayerWidth),_p.layerHeight,cc.defineGetterSetter(_p,"layerHeight",_p._getLayerHeight,_p._setLayerHeight),_p.tileWidth,cc.defineGetterSetter(_p,"tileWidth",_p._getTileWidth,_p._setTileWidth),_p.tileHeight,cc.defineGetterSetter(_p,"tileHeight",_p._getTileHeight,_p._setTileHeight),cc.TMXLayer.create=function(a,b,c){return new cc.TMXLayer(a,b,c)},function(){cc.TMXLayer.CanvasRenderCmd=function(a){cc.SpriteBatchNode.CanvasRenderCmd.call(this,a),this._needDraw=!0,this._realWorldTransform={a:1,b:0,c:0,d:1,tx:0,ty:0};var b=cc._canvas,c=cc.newElement("canvas");c.width=b.width,c.height=b.height,this._cacheCanvas=c,this._cacheContext=new cc.CanvasContextWrapper(this._cacheCanvas.getContext("2d"));var d=new cc.Texture2D;d.initWithElement(c),d.handleLoadedTexture(),this._cacheTexture=d,this._cacheDirty=!1};var a=cc.TMXLayer.CanvasRenderCmd.prototype=Object.create(cc.SpriteBatchNode.CanvasRenderCmd.prototype);a.constructor=cc.TMXLayer.CanvasRenderCmd,a._setNodeDirtyForCache=function(){this._cacheDirty=!0},a._renderingChildToCache=function(){if(this._cacheDirty){var a=this._cacheContext,b=a.getContext(),c=this._cacheCanvas;b.setTransform(1,0,0,1,0,0),b.clearRect(0,0,c.width,c.height);for(var d=this._node._children,e=0,f=d.length;f>e;e++)if(d[e]){var g=d[e]._renderCmd;g&&(g.rendering(a,1,1),g._cacheDirty=!1)}this._cacheDirty=!1}},a.rendering=function(a,b,c){var d=this._displayedOpacity/255;if(!(0>=d)){var e=this._node;this._renderingChildToCache();var f=a||cc._renderContext,g=f.getContext();f.setGlobalAlpha(d);var h=0|-this._anchorPointInPoints.x,i=0|-this._anchorPointInPoints.y,j=this._cacheCanvas;if(j&&0!==j.width&&0!==j.height){f.setTransform(this._realWorldTransform,b,c);var k=j.height*c;if(e.layerOrientation===cc.TMX_ORIENTATION_HEX){var l=.5*e._mapTileSize.height*c;g.drawImage(j,0,0,j.width,j.height,h,-(i+k)+l,j.width*b,k)}else g.drawImage(j,0,0,j.width,j.height,h,-(i+k),j.width*b,k)}cc.g_NumberOfDraws++}},a._updateCacheContext=function(a,b){var c=this._node,d=c._contentSize,e=this._cacheCanvas,f=cc.contentScaleFactor();e.width=0|1.5*d.width*f,e.height=0|1.5*d.height*f,c.layerOrientation===cc.TMX_ORIENTATION_HEX?this._cacheContext.setOffset(0,.5*-c._mapTileSize.height):this._cacheContext.setOffset(0,0);var g=this._cacheTexture._contentSize;g.width=e.width,g.height=e.height},a.getTexture=function(){return this._cacheTexture},a.visit=function(a){var b,c,d=this._node,e=d._children;if(d._visible&&e&&0!==e.length){if(a=a||this.getParentRenderCmd(),a&&(this._curLevel=a._curLevel+1),this._syncStatus(a),this._cacheDirty){var f=this._cacheContext,g=this._cacheCanvas,h=f.getContext(),i=d.__instanceId,j=cc.renderer;for(j._turnToCacheMode(i),d.sortAllChildren(),b=0,c=e.length;c>b;b++)if(e[b]){var k=e[b]._renderCmd;k&&(k.visit(this),k._cacheDirty=!1)}h.setTransform(1,0,0,1,0,0),h.clearRect(0,0,g.width,g.height),j._renderingToCacheCanvas(f,i),this._cacheDirty=!1}cc.renderer.pushRenderCommand(this),this._dirtyFlag=0}},a.transform=function(a,b){var c=this.getNodeToParentTransform(),d=this._realWorldTransform;if(a){var e=a._worldTransform;d.a=c.a*e.a+c.b*e.c,d.b=c.a*e.b+c.b*e.d,d.c=c.c*e.a+c.d*e.c,d.d=c.c*e.b+c.d*e.d;var f=a._transform,g=-(f.b+f.c)*c.ty,h=-(f.b+f.c)*c.tx;d.tx=c.tx*e.a+c.ty*e.c+e.tx+g,d.ty=c.tx*e.b+c.ty*e.d+e.ty+h}else d.a=c.a,d.b=c.b,d.c=c.c,d.d=c.d,d.tx=c.tx,d.ty=c.ty;if(b){var i=this._node._children;if(!i||0===i.length)return;var j,k;for(j=0,k=i.length;k>j;j++)i[j]._renderCmd.transform(this,b)}},a.initImageSize=function(){var a=this._node;a.tileset.imageSize=this._originalTexture.getContentSizeInPixels()},a._reusedTileWithRect=function(a){var b=this._node;return b._reusedTile=new cc.Sprite,b._reusedTile.initWithTexture(b._renderCmd._texture,a,!1),b._reusedTile.batchNode=b,b._reusedTile.parent=b,b._reusedTile._renderCmd._cachedParent=b._renderCmd,b._reusedTile}}();