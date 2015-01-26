cc.LabelAtlas=cc.AtlasNode.extend({_string:null,_mapStartChar:null,_textureLoaded:!1,_loadedEventListeners:null,_className:"LabelAtlas",ctor:function(a,b,c,d,e){cc.AtlasNode.prototype.ctor.call(this),b&&cc.LabelAtlas.prototype.initWithString.call(this,a,b,c,d,e)},textureLoaded:function(){return this._textureLoaded},addLoadedEventListener:function(a,b){this._loadedEventListeners||(this._loadedEventListeners=[]),this._loadedEventListeners.push({eventCallback:a,eventTarget:b})},_callLoadedEventCallbacks:function(){if(this._loadedEventListeners){this._textureLoaded=!0;for(var a=this._loadedEventListeners,b=0,c=a.length;c>b;b++){var d=a[b];d.eventCallback.call(d.eventTarget,this)}a.length=0}},initWithString:function(a,b,c,d,e){var f,g,h,i,j=a+"";if(void 0===c){var k=cc.loader.getRes(b);if(1!==parseInt(k.version,10))return cc.log("cc.LabelAtlas.initWithString(): Unsupported version. Upgrade cocos2d version"),!1;f=cc.path.changeBasename(b,k.textureFilename);var l=cc.contentScaleFactor();g=parseInt(k.itemWidth,10)/l,h=parseInt(k.itemHeight,10)/l,i=String.fromCharCode(parseInt(k.firstChar,10))}else f=b,g=c||0,h=d||0,i=e||" ";var m=null;m=f instanceof cc.Texture2D?f:cc.textureCache.addImage(f);var n=m.isLoaded();return this._textureLoaded=n,n||m.addLoadedEventListener(function(){this.initWithTexture(m,g,h,j.length),this.string=j,this._callLoadedEventCallbacks()},this),this.initWithTexture(m,g,h,j.length)?(this._mapStartChar=i,this.string=j,!0):!1},setColor:function(a){cc.AtlasNode.prototype.setColor.call(this,a),this.updateAtlasValues()},getString:function(){return this._string},draw:function(a){if(cc.AtlasNode.prototype.draw.call(this,a),cc.LABELATLAS_DEBUG_DRAW){var b=this.size,c=[cc.p(0,0),cc.p(b.width,0),cc.p(b.width,b.height),cc.p(0,b.height)];cc._drawingUtil.drawPoly(c,4,!0)}},_addChildForCanvas:function(a,b,c){a._lateChild=!0,cc.Node.prototype.addChild.call(this,a,b,c)},updateAtlasValues:null,_updateAtlasValuesForCanvas:function(){for(var a=this._string||"",b=a.length,c=this.texture,d=this._itemWidth,e=this._itemHeight,f=0;b>f;f++){var g=a.charCodeAt(f)-this._mapStartChar.charCodeAt(0),h=parseInt(g%this._itemsPerRow,10),i=parseInt(g/this._itemsPerRow,10),j=cc.rect(h*d,i*e,d,e),k=a.charCodeAt(f),l=this.getChildByTag(f);l?32==k?(l.init(),l.setTextureRect(cc.rect(0,0,10,10),!1,cc.size(0,0))):(l.initWithTexture(c,j),l.visible=!0,l.opacity=this._displayedOpacity):(l=new cc.Sprite,32==k?(l.init(),l.setTextureRect(cc.rect(0,0,10,10),!1,cc.size(0,0))):l.initWithTexture(c,j),cc.Node.prototype.addChild.call(this,l,0,f)),l.setPosition(f*d+d/2,e/2)}},_updateAtlasValuesForWebGL:function(){var a=this._string,b=a.length,c=this.textureAtlas,d=c.texture,e=d.pixelsWidth,f=d.pixelsHeight,g=this._itemWidth,h=this._itemHeight;this._ignoreContentScaleFactor||(g=this._itemWidth*cc.contentScaleFactor(),h=this._itemHeight*cc.contentScaleFactor()),b>c.getCapacity()&&cc.log("cc.LabelAtlas._updateAtlasValues(): Invalid String length");for(var i=c.quads,j=this._displayedColor,k={r:j.r,g:j.g,b:j.b,a:this._displayedOpacity},l=this._itemWidth,m=0;b>m;m++){var n,o,p,q,r=a.charCodeAt(m)-this._mapStartChar.charCodeAt(0),s=r%this._itemsPerRow,t=0|r/this._itemsPerRow;cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL?(n=(2*s*g+1)/(2*e),o=n+(2*g-2)/(2*e),p=(2*t*h+1)/(2*f),q=p+(2*h-2)/(2*f)):(n=s*g/e,o=n+g/e,p=t*h/f,q=p+h/f);var u=i[m],v=u.tl,w=u.tr,x=u.bl,y=u.br;v.texCoords.u=n,v.texCoords.v=p,w.texCoords.u=o,w.texCoords.v=p,x.texCoords.u=n,x.texCoords.v=q,y.texCoords.u=o,y.texCoords.v=q,x.vertices.x=m*l,x.vertices.y=0,x.vertices.z=0,y.vertices.x=m*l+l,y.vertices.y=0,y.vertices.z=0,v.vertices.x=m*l,v.vertices.y=this._itemHeight,v.vertices.z=0,w.vertices.x=m*l+l,w.vertices.y=this._itemHeight,w.vertices.z=0,v.colors=k,w.colors=k,x.colors=k,y.colors=k}if(b>0){c.dirty=!0;var z=c.totalQuads;b>z&&c.increaseTotalQuadsWith(b-z)}},setString:null,_setStringForCanvas:function(a){a=String(a);var b=a.length;if(this._string=a,this.width=b*this._itemWidth,this.height=this._itemHeight,this._children){var c=this._children;b=c.length;for(var d=0;b>d;d++){var e=c[d];e&&!e._lateChild&&(e.visible=!1)}}this.updateAtlasValues(),this.quadsToDraw=b},_setStringForWebGL:function(a){a=String(a);var b=a.length;b>this.textureAtlas.totalQuads&&this.textureAtlas.resizeCapacity(b),this._string=a,this.width=b*this._itemWidth,this.height=this._itemHeight,this.updateAtlasValues(),this.quadsToDraw=b},setOpacity:null,_setOpacityForCanvas:function(a){if(this._displayedOpacity!==a){cc.AtlasNode.prototype.setOpacity.call(this,a);for(var b=this._children,c=0,d=b.length;d>c;c++)b[c]&&(b[c].opacity=a)}},_setOpacityForWebGL:function(a){this._opacity!==a&&cc.AtlasNode.prototype.setOpacity.call(this,a)}});var _p=cc.LabelAtlas.prototype;cc._renderType===cc._RENDER_TYPE_WEBGL?(_p.updateAtlasValues=_p._updateAtlasValuesForWebGL,_p.setString=_p._setStringForWebGL,_p.setOpacity=_p._setOpacityForWebGL):(_p.updateAtlasValues=_p._updateAtlasValuesForCanvas,_p.setString=_p._setStringForCanvas,_p.setOpacity=_p._setOpacityForCanvas,_p.addChild=_p._addChildForCanvas),cc.defineGetterSetter(_p,"opacity",_p.getOpacity,_p.setOpacity),_p.string,cc.defineGetterSetter(_p,"string",_p.getString,_p.setString),cc.LabelAtlas.create=function(a,b,c,d,e){return new cc.LabelAtlas(a,b,c,d,e)},cc.LABEL_AUTOMATIC_WIDTH=-1,cc.LabelBMFont=cc.SpriteBatchNode.extend({_opacityModifyRGB:!1,_string:"",_config:null,_fntFile:"",_initialString:"",_alignment:cc.TEXT_ALIGNMENT_CENTER,_width:-1,_lineBreakWithoutSpaces:!1,_imageOffset:null,_reusedChar:null,_displayedOpacity:255,_realOpacity:255,_displayedColor:null,_realColor:null,_cascadeColorEnabled:!0,_cascadeOpacityEnabled:!0,_textureLoaded:!1,_loadedEventListeners:null,_className:"LabelBMFont",_setString:function(a,b){b?this._initialString=a:this._string=a;var c=this._children;if(c)for(var d=0;d<c.length;d++){var e=c[d];e&&e.setVisible(!1)}this._textureLoaded&&(this.createFontChars(),b&&this.updateLabel())},ctor:function(a,b,c,d,e){var f=this;cc.SpriteBatchNode.prototype.ctor.call(f),f._imageOffset=cc.p(0,0),f._displayedColor=cc.color(255,255,255,255),f._realColor=cc.color(255,255,255,255),f._reusedChar=[],this.initWithString(a,b,c,d,e)},textureLoaded:function(){return this._textureLoaded},addLoadedEventListener:function(a,b){this._loadedEventListeners||(this._loadedEventListeners=[]),this._loadedEventListeners.push({eventCallback:a,eventTarget:b})},_callLoadedEventCallbacks:function(){if(this._loadedEventListeners){for(var a=this._loadedEventListeners,b=0,c=a.length;c>b;b++){var d=a[b];d.eventCallback.call(d.eventTarget,this)}a.length=0}},draw:function(a){if(cc.SpriteBatchNode.prototype.draw.call(this,a),cc.LABELBMFONT_DEBUG_DRAW){var b=this.getContentSize(),c=cc.p(0|-this._anchorPointInPoints.x,0|-this._anchorPointInPoints.y),d=[cc.p(c.x,c.y),cc.p(c.x+b.width,c.y),cc.p(c.x+b.width,c.y+b.height),cc.p(c.x,c.y+b.height)];cc._drawingUtil.setDrawColor(0,255,0,255),cc._drawingUtil.drawPoly(d,4,!0)}},setColor:function(a){var b=this._displayedColor,c=this._realColor;if((c.r!=a.r||c.g!=a.g||c.b!=a.b||c.a!=a.a)&&(b.r=c.r=a.r,b.g=c.g=a.g,b.b=c.b=a.b,this._textureLoaded&&this._cascadeColorEnabled)){var d=cc.color.WHITE,e=this._parent;e&&e.cascadeColor&&(d=e.getDisplayedColor()),this.updateDisplayedColor(d)}},isOpacityModifyRGB:function(){return this._opacityModifyRGB},setOpacityModifyRGB:function(a){this._opacityModifyRGB=a;var b=this._children;if(b)for(var c=0;c<b.length;c++){var d=b[c];d&&(d.opacityModifyRGB=this._opacityModifyRGB)}},getOpacity:function(){return this._realOpacity},getDisplayedOpacity:function(){return this._displayedOpacity},setOpacity:function(a){if(this._displayedOpacity=this._realOpacity=a,this._cascadeOpacityEnabled){var b=255,c=this._parent;c&&c.cascadeOpacity&&(b=c.getDisplayedOpacity()),this.updateDisplayedOpacity(b)}this._displayedColor.a=this._realColor.a=a},updateDisplayedOpacity:function(a){this._displayedOpacity=this._realOpacity*a/255;for(var b=this._children,c=0;c<b.length;c++){var d=b[c];cc._renderType==cc._RENDER_TYPE_WEBGL?d.updateDisplayedOpacity(this._displayedOpacity):(cc.Node.prototype.updateDisplayedOpacity.call(d,this._displayedOpacity),d.setNodeDirty())}this._changeTextureColor()},isCascadeOpacityEnabled:function(){return!1},setCascadeOpacityEnabled:function(a){this._cascadeOpacityEnabled=a},getColor:function(){var a=this._realColor;return cc.color(a.r,a.g,a.b,a.a)},getDisplayedColor:function(){var a=this._displayedColor;return cc.color(a.r,a.g,a.b,a.a)},updateDisplayedColor:function(a){var b=this._displayedColor,c=this._realColor;b.r=c.r*a.r/255,b.g=c.g*a.g/255,b.b=c.b*a.b/255;for(var d=this._children,e=0;e<d.length;e++){var f=d[e];cc._renderType==cc._RENDER_TYPE_WEBGL?f.updateDisplayedColor(this._displayedColor):(cc.Node.prototype.updateDisplayedColor.call(f,this._displayedColor),f.setNodeDirty())}this._changeTextureColor()},_changeTextureColor:function(){if(cc._renderType!=cc._RENDER_TYPE_WEBGL){var a=this.getTexture();if(a&&a.getContentSize().width>0){var b=this._originalTexture.getHtmlElementObj();if(!b)return;var c=a.getHtmlElementObj(),d=cc.rect(0,0,b.width,b.height);c instanceof HTMLCanvasElement&&!this._rectRotated?(cc.generateTintImageWithMultiply(b,this._displayedColor,d,c),this.setTexture(a)):(c=cc.generateTintImageWithMultiply(b,this._displayedColor,d),a=new cc.Texture2D,a.initWithElement(c),a.handleLoadedTexture(),this.setTexture(a))}}},isCascadeColorEnabled:function(){return!1},setCascadeColorEnabled:function(a){this._cascadeColorEnabled=a},init:function(){return this.initWithString(null,null,null,null,null)},initWithString:function(a,b,c,d,e){var f=this,g=a||"";f._config&&cc.log("cc.LabelBMFont.initWithString(): re-init is no longer supported");var h;if(b){var i=cc.loader.getRes(b);if(!i)return cc.log("cc.LabelBMFont.initWithString(): Impossible to create font. Please check file"),!1;f._config=i,f._fntFile=b,h=cc.textureCache.addImage(i.atlasName);var j=h.isLoaded();f._textureLoaded=j,j||h.addLoadedEventListener(function(a){var b=this;b._textureLoaded=!0,b.initWithTexture(a,b._initialString.length),b.setString(b._initialString,!0),b._callLoadedEventCallbacks()},f)}else{h=new cc.Texture2D;var k=new Image;h.initWithElement(k),f._textureLoaded=!1}if(f.initWithTexture(h,g.length)){if(f._alignment=d||cc.TEXT_ALIGNMENT_LEFT,f._imageOffset=e||cc.p(0,0),f._width=null==c?-1:c,f._displayedOpacity=f._realOpacity=255,f._displayedColor=cc.color(255,255,255,255),f._realColor=cc.color(255,255,255,255),f._cascadeOpacityEnabled=!0,f._cascadeColorEnabled=!0,f._contentSize.width=0,f._contentSize.height=0,f.setAnchorPoint(.5,.5),cc._renderType===cc._RENDER_TYPE_WEBGL){var l=f.textureAtlas.texture;f._opacityModifyRGB=l.hasPremultipliedAlpha();var m=f._reusedChar=new cc.Sprite;m.initWithTexture(l,cc.rect(0,0,0,0),!1),m.batchNode=f}return f.setString(g,!0),!0}return!1},createFontChars:function(){var a=this,b=cc._renderType,c=b===cc._RENDER_TYPE_CANVAS?a.texture:a.textureAtlas.texture,d=0,e=cc.size(0,0),f=0,g=1,h=a._string,i=h?h.length:0;if(0!==i){var j,k=a._config,l=k.kerningDict,m=k.commonHeight,n=k.fontDefDictionary;for(j=0;i-1>j;j++)10==h.charCodeAt(j)&&g++;var o=m*g,p=-(m-m*g),q=-1;for(j=0;i>j;j++){var r=h.charCodeAt(j);if(0!=r)if(10!==r){var s=l[q<<16|65535&r]||0,t=n[r];if(t){var u=cc.rect(t.rect.x,t.rect.y,t.rect.width,t.rect.height);u=cc.rectPixelsToPoints(u),u.x+=a._imageOffset.x,u.y+=a._imageOffset.y;var v=a.getChildByTag(j);v?32===r&&b===cc._RENDER_TYPE_CANVAS?v.setTextureRect(u,!1,cc.size(0,0)):(v.setTextureRect(u,!1),v.visible=!0):(v=new cc.Sprite,32===r&&b===cc._RENDER_TYPE_CANVAS&&(u=cc.rect(0,0,0,0)),v.initWithTexture(c,u,!1),v._newTextureWhenChangeColor=!0,a.addChild(v,0,j)),v.opacityModifyRGB=a._opacityModifyRGB,cc._renderType==cc._RENDER_TYPE_WEBGL?(v.updateDisplayedColor(a._displayedColor),v.updateDisplayedOpacity(a._displayedOpacity)):(cc.Node.prototype.updateDisplayedColor.call(v,a._displayedColor),cc.Node.prototype.updateDisplayedOpacity.call(v,a._displayedOpacity),v.setNodeDirty());var w=k.commonHeight-t.yOffset,x=cc.p(d+t.xOffset+.5*t.rect.width+s,p+w-.5*u.height*cc.contentScaleFactor());v.setPosition(cc.pointPixelsToPoints(x)),d+=t.xAdvance+s,q=r,d>f&&(f=d)}else cc.log("cocos2d: LabelBMFont: character not found "+h[j])}else d=0,p-=k.commonHeight}e.width=t&&t.xAdvance<t.rect.width?f-t.xAdvance+t.rect.width:f,e.height=o,a.setContentSize(cc.sizePixelsToPoints(e))}},updateString:function(a){var b=this,c=b._children;if(c)for(var d=0,e=c.length;e>d;d++){var f=c[d];f&&(f.visible=!1)}b._config&&b.createFontChars(),a||b.updateLabel()},getString:function(){return this._initialString},setString:function(a,b){a=String(a),null==b&&(b=!0),null!=a&&cc.isString(a)||(a+=""),this._initialString=a,this._setString(a,b)},_setStringForSetter:function(a){this.setString(a,!1)},setCString:function(a){this.setString(a,!0)},updateLabel:function(){var a=this;if(a.string=a._initialString,a._width>0){for(var b,c=a._string.length,d=[],e=[],f=1,g=0,h=!1,i=!1,j=-1,k=-1,l=0,m=0,n=a._children.length;n>m;m++){for(var o=0;!(b=a.getChildByTag(m+l+o));)o++;if(l+=o,g>=c)break;var p=a._string[g];if(i||(k=a._getLetterPosXLeft(b),i=!0),h||(j=k,h=!0),10!=p.charCodeAt(0))if(this._isspace_unicode(p))e.push(p),d=d.concat(e),e.length=0,i=!1,k=-1,g++;else if(a._getLetterPosXRight(b)-j>a._width)if(a._lineBreakWithoutSpaces){if(this._utf8_trim_ws(e),e.push("\n"),d=d.concat(e),e.length=0,i=!1,h=!1,k=-1,j=-1,f++,g>=c)break;k||(k=a._getLetterPosXLeft(b),i=!0),j||(j=k,h=!0),m--}else{e.push(p);var q=d.lastIndexOf(" ");-1!=q?this._utf8_trim_ws(d):d=[],d.length>0&&d.push("\n"),f++,h=!1,j=-1,g++}else e.push(p),g++;else{if(e.push("\n"),d=d.concat(e),e.length=0,i=!1,h=!1,k=-1,j=-1,m--,l-=o,f++,g>=c)break;p=a._string[g],k||(k=a._getLetterPosXLeft(b),i=!0),j||(j=k,h=!0),g++}}d=d.concat(e);var r=d.length,s="";for(g=0;r>g;++g)s+=d[g];s+=String.fromCharCode(0),a._setString(s,!1)}if(a._alignment!=cc.TEXT_ALIGNMENT_LEFT){g=0;for(var t=0,u=a._string.length,v=[],w=0;u>w;w++)if(10!=a._string[w].charCodeAt(0)&&0!=a._string[w].charCodeAt(0))v.push(a._string[g]);else{var x=0,y=v.length;if(0==y){t++;continue}var z=g+y-1+t;if(0>z)continue;var A=a.getChildByTag(z);if(null==A)continue;x=A.getPositionX()+A._getWidth()/2;var B=0;switch(a._alignment){case cc.TEXT_ALIGNMENT_CENTER:B=a.width/2-x/2;break;case cc.TEXT_ALIGNMENT_RIGHT:B=a.width-x}if(0!=B)for(m=0;y>m;m++)z=g+m+t,0>z||(b=a.getChildByTag(z),b&&(b.x+=B));g+=y,t++,v.length=0}}},setAlignment:function(a){this._alignment=a,this.updateLabel()},_getAlignment:function(){return this._alignment},setBoundingWidth:function(a){this._width=a,this.updateLabel()},_getBoundingWidth:function(){return this._width},setLineBreakWithoutSpace:function(a){this._lineBreakWithoutSpaces=a,this.updateLabel()},setScale:function(a,b){cc.Node.prototype.setScale.call(this,a,b),this.updateLabel()},setScaleX:function(a){cc.Node.prototype.setScaleX.call(this,a),this.updateLabel()},setScaleY:function(a){cc.Node.prototype.setScaleY.call(this,a),this.updateLabel()},setFntFile:function(a){var b=this;if(null!=a&&a!=b._fntFile){var c=cc.loader.getRes(a);if(!c)return void cc.log("cc.LabelBMFont.setFntFile() : Impossible to create font. Please check file");b._fntFile=a,b._config=c;var d=cc.textureCache.addImage(c.atlasName),e=d.isLoaded();b._textureLoaded=e,b.texture=d,cc._renderType===cc._RENDER_TYPE_CANVAS&&(b._originalTexture=b.texture),e?b.createFontChars():d.addLoadedEventListener(function(a){var b=this;b._textureLoaded=!0,b.texture=a,b.createFontChars(),b._changeTextureColor(),b.updateLabel(),b._callLoadedEventCallbacks()},b)}},getFntFile:function(){return this._fntFile},setAnchorPoint:function(a,b){cc.Node.prototype.setAnchorPoint.call(this,a,b),this.updateLabel()},_setAnchor:function(a){cc.Node.prototype._setAnchor.call(this,a),this.updateLabel()},_setAnchorX:function(a){cc.Node.prototype._setAnchorX.call(this,a),this.updateLabel()},_setAnchorY:function(a){cc.Node.prototype._setAnchorY.call(this,a),this.updateLabel()},_atlasNameFromFntFile:function(){},_kerningAmountForFirst:function(a,b){var c=0,d=a<<16|65535&b;if(this._configuration.kerningDictionary){var e=this._configuration.kerningDictionary[d.toString()];e&&(c=e.amount)}return c},_getLetterPosXLeft:function(a){return a.getPositionX()*this._scaleX-a._getWidth()*this._scaleX*a._getAnchorX()},_getLetterPosXRight:function(a){return a.getPositionX()*this._scaleX+a._getWidth()*this._scaleX*a._getAnchorX()},_isspace_unicode:function(a){return a=a.charCodeAt(0),a>=9&&13>=a||32==a||133==a||160==a||5760==a||a>=8192&&8202>=a||8232==a||8233==a||8239==a||8287==a||12288==a},_utf8_trim_ws:function(a){var b=a.length;if(!(0>=b)){var c=b-1;if(this._isspace_unicode(a[c])){for(var d=c-1;d>=0&&this._isspace_unicode(a[d]);--d)c=d;this._utf8_trim_from(a,c)}}},_utf8_trim_from:function(a,b){var c=a.length;b>=c||0>b||a.splice(b,c)}});var _p=cc.LabelBMFont.prototype;cc._renderType===cc._RENDER_TYPE_CANVAS&&(cc.sys._supportCanvasNewBlendModes||(_p._changeTextureColor=function(){if(cc._renderType!=cc._RENDER_TYPE_WEBGL){var a,b=this.getTexture();if(b&&b.getContentSize().width>0){if(a=b.getHtmlElementObj(),!a)return;var c=cc.textureCache.getTextureColors(this._originalTexture.getHtmlElementObj());c&&(a instanceof HTMLCanvasElement&&!this._rectRotated?(cc.generateTintImage(a,c,this._displayedColor,null,a),this.setTexture(b)):(a=cc.generateTintImage(a,c,this._displayedColor),b=new cc.Texture2D,b.initWithElement(a),b.handleLoadedTexture(),this.setTexture(b)))}}}),_p.setTexture=function(a){for(var b=this._children,c=this._displayedColor,d=0;d<b.length;d++){var e=b[d],f=e._displayedColor;(this._textureForCanvas==e._texture||f.r===c.r&&f.g===c.g&&f.b===c.b)&&(e.texture=a)}this._textureForCanvas=a}),_p.string,cc.defineGetterSetter(_p,"string",_p.getString,_p._setStringForSetter),_p.boundingWidth,cc.defineGetterSetter(_p,"boundingWidth",_p._getBoundingWidth,_p.setBoundingWidth),_p.textAlign,cc.defineGetterSetter(_p,"textAlign",_p._getAlignment,_p.setAlignment),cc.LabelBMFont.create=function(a,b,c,d,e){return new cc.LabelBMFont(a,b,c,d,e)},cc._fntLoader={INFO_EXP:/info [^\n]*(\n|$)/gi,COMMON_EXP:/common [^\n]*(\n|$)/gi,PAGE_EXP:/page [^\n]*(\n|$)/gi,CHAR_EXP:/char [^\n]*(\n|$)/gi,KERNING_EXP:/kerning [^\n]*(\n|$)/gi,ITEM_EXP:/\w+=[^ \r\n]+/gi,INT_EXP:/^[\-]?\d+$/,_parseStrToObj:function(a){var b=a.match(this.ITEM_EXP),c={};if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d],g=f.indexOf("="),h=f.substring(0,g),i=f.substring(g+1);i.match(this.INT_EXP)?i=parseInt(i):'"'==i[0]&&(i=i.substring(1,i.length-1)),c[h]=i}return c},parseFnt:function(a,b){var c=this,d={},e=c._parseStrToObj(a.match(c.INFO_EXP)[0]),f=e.padding.split(","),g=({left:parseInt(f[0]),top:parseInt(f[1]),right:parseInt(f[2]),bottom:parseInt(f[3])},c._parseStrToObj(a.match(c.COMMON_EXP)[0]));if(d.commonHeight=g.lineHeight,cc._renderType===cc._RENDER_TYPE_WEBGL){var h=cc.configuration.getMaxTextureSize();(g.scaleW>h.width||g.scaleH>h.height)&&cc.log("cc.LabelBMFont._parseCommonArguments(): page can't be larger than supported")}1!==g.pages&&cc.log("cc.LabelBMFont._parseCommonArguments(): only supports 1 page");var i=c._parseStrToObj(a.match(c.PAGE_EXP)[0]);0!==i.id&&cc.log("cc.LabelBMFont._parseImageFileName() : file could not be found"),d.atlasName=cc.path.changeBasename(b,i.file);for(var j=a.match(c.CHAR_EXP),k=d.fontDefDictionary={},l=0,m=j.length;m>l;l++){var n=c._parseStrToObj(j[l]),o=n.id;k[o]={rect:{x:n.x,y:n.y,width:n.width,height:n.height},xOffset:n.xoffset,yOffset:n.yoffset,xAdvance:n.xadvance}}var p=d.kerningDict={},q=a.match(c.KERNING_EXP);if(q)for(var l=0,m=q.length;m>l;l++){var r=c._parseStrToObj(q[l]);p[r.first<<16|65535&r.second]=r.amount}return d},load:function(a,b,c,d){var e=this;cc.loader.loadTxt(a,function(a,c){return a?d(a):void d(null,e.parseFnt(c,b))})}},cc.loader.register(["fnt"],cc._fntLoader);