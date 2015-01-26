cc.stencilBits=-1,cc.ClippingNode=cc.Node.extend({alphaThreshold:0,inverted:!1,_rendererSaveCmd:null,_rendererClipCmd:null,_rendererRestoreCmd:null,_beforeVisitCmd:null,_afterDrawStencilCmd:null,_afterVisitCmd:null,_stencil:null,_godhelpme:!1,_clipElemType:null,_currentStencilFunc:null,_currentStencilRef:null,_currentStencilValueMask:null,_currentStencilFail:null,_currentStencilPassDepthFail:null,_currentStencilPassDepthPass:null,_currentStencilWriteMask:null,_currentStencilEnabled:null,_currentDepthWriteMask:null,_mask_layer_le:null,ctor:function(a){cc.Node.prototype.ctor.call(this),this._stencil=null,this.alphaThreshold=0,this.inverted=!1,a=a||null,cc.ClippingNode.prototype.init.call(this,a)},_initRendererCmd:function(){cc._renderType===cc._RENDER_TYPE_CANVAS?(this._rendererSaveCmd=new cc.ClippingNodeSaveRenderCmdCanvas(this),this._rendererClipCmd=new cc.ClippingNodeClipRenderCmdCanvas(this),this._rendererRestoreCmd=new cc.ClippingNodeRestoreRenderCmdCanvas(this)):(this._beforeVisitCmd=new cc.CustomRenderCmdWebGL(this,this._onBeforeVisit),this._afterDrawStencilCmd=new cc.CustomRenderCmdWebGL(this,this._onAfterDrawStencil),this._afterVisitCmd=new cc.CustomRenderCmdWebGL(this,this._onAfterVisit))},init:null,_className:"ClippingNode",_initForWebGL:function(a){return this._stencil=a,this.alphaThreshold=1,this.inverted=!1,cc.ClippingNode._init_once=!0,cc.ClippingNode._init_once&&(cc.stencilBits=cc._renderContext.getParameter(cc._renderContext.STENCIL_BITS),cc.stencilBits<=0&&cc.log("Stencil buffer is not enabled."),cc.ClippingNode._init_once=!1),!0},_initForCanvas:function(a){this._stencil=a,this.alphaThreshold=1,this.inverted=!1},onEnter:function(){cc.Node.prototype.onEnter.call(this),this._stencil.onEnter()},onEnterTransitionDidFinish:function(){cc.Node.prototype.onEnterTransitionDidFinish.call(this),this._stencil.onEnterTransitionDidFinish()},onExitTransitionDidStart:function(){this._stencil.onExitTransitionDidStart(),cc.Node.prototype.onExitTransitionDidStart.call(this)},onExit:function(){this._stencil.onExit(),cc.Node.prototype.onExit.call(this)},visit:null,_visitForWebGL:function(a){a||cc._renderContext;if(cc.stencilBits<1)return void cc.Node.prototype.visit.call(this,a);if(!this._stencil||!this._stencil.visible)return void(this.inverted&&cc.Node.prototype.visit.call(this,a));if(cc.ClippingNode._layer+1==cc.stencilBits)return cc.ClippingNode._visit_once=!0,cc.ClippingNode._visit_once&&(cc.log("Nesting more than "+cc.stencilBits+"stencils is not supported. Everything will be drawn without stencil for this node and its childs."),cc.ClippingNode._visit_once=!1),void cc.Node.prototype.visit.call(this,a);cc.renderer.pushRenderCommand(this._beforeVisitCmd);var b=cc.current_stack;b.stack.push(b.top),cc.kmMat4Assign(this._stackMatrix,b.top),b.top=this._stackMatrix,this.transform(),this._stencil.visit(),cc.renderer.pushRenderCommand(this._afterDrawStencilCmd);var c=this._children;if(c&&c.length>0){var d=c.length;this.sortAllChildren();for(var e=0;d>e&&(c[e]&&c[e]._localZOrder<0);e++)c[e].visit();for(this._rendererCmd&&cc.renderer.pushRenderCommand(this._rendererCmd);d>e;e++)c[e]&&c[e].visit()}else this._rendererCmd&&cc.renderer.pushRenderCommand(this._rendererCmd);cc.renderer.pushRenderCommand(this._afterVisitCmd),b.top=b.stack.pop()},_onBeforeVisit:function(a){var b=a||cc._renderContext;cc.ClippingNode._layer++;var c=1<<cc.ClippingNode._layer,d=c-1;if(this._mask_layer_le=c|d,this._currentStencilEnabled=b.isEnabled(b.STENCIL_TEST),this._currentStencilWriteMask=b.getParameter(b.STENCIL_WRITEMASK),this._currentStencilFunc=b.getParameter(b.STENCIL_FUNC),this._currentStencilRef=b.getParameter(b.STENCIL_REF),this._currentStencilValueMask=b.getParameter(b.STENCIL_VALUE_MASK),this._currentStencilFail=b.getParameter(b.STENCIL_FAIL),this._currentStencilPassDepthFail=b.getParameter(b.STENCIL_PASS_DEPTH_FAIL),this._currentStencilPassDepthPass=b.getParameter(b.STENCIL_PASS_DEPTH_PASS),b.enable(b.STENCIL_TEST),b.stencilMask(c),this._currentDepthWriteMask=b.getParameter(b.DEPTH_WRITEMASK),b.depthMask(!1),b.stencilFunc(b.NEVER,c,c),b.stencilOp(this.inverted?b.REPLACE:b.ZERO,b.KEEP,b.KEEP),this._drawFullScreenQuadClearStencil(),b.stencilFunc(b.NEVER,c,c),b.stencilOp(this.inverted?b.ZERO:b.REPLACE,b.KEEP,b.KEEP),this.alphaThreshold<1){var e=cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLORALPHATEST),f=b.getUniformLocation(e.getProgram(),cc.UNIFORM_ALPHA_TEST_VALUE_S);cc.glUseProgram(e.getProgram()),e.setUniformLocationWith1f(f,this.alphaThreshold),cc.setProgram(this._stencil,e)}},_drawFullScreenQuadClearStencil:function(){cc.kmGLMatrixMode(cc.KM_GL_PROJECTION),cc.kmGLPushMatrix(),cc.kmGLLoadIdentity(),cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW),cc.kmGLPushMatrix(),cc.kmGLLoadIdentity(),cc._drawingUtil.drawSolidRect(cc.p(-1,-1),cc.p(1,1),cc.color(255,255,255,255)),cc.kmGLMatrixMode(cc.KM_GL_PROJECTION),cc.kmGLPopMatrix(),cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW),cc.kmGLPopMatrix()},_onAfterDrawStencil:function(a){var b=a||cc._renderContext;b.depthMask(this._currentDepthWriteMask),b.stencilFunc(b.EQUAL,this._mask_layer_le,this._mask_layer_le),b.stencilOp(b.KEEP,b.KEEP,b.KEEP)},_onAfterVisit:function(a){var b=a||cc._renderContext;b.stencilFunc(this._currentStencilFunc,this._currentStencilRef,this._currentStencilValueMask),b.stencilOp(this._currentStencilFail,this._currentStencilPassDepthFail,this._currentStencilPassDepthPass),b.stencilMask(this._currentStencilWriteMask),this._currentStencilEnabled||b.disable(b.STENCIL_TEST),cc.ClippingNode._layer--},_visitForCanvas:function(a){this._clipElemType=this._cangodhelpme()||this._stencil instanceof cc.Sprite;var b,c,d=a||cc._renderContext,e=this._children;if(!this._stencil||!this._stencil.visible)return void(this.inverted&&cc.Node.prototype.visit.call(this,a));if(this._rendererSaveCmd&&cc.renderer.pushRenderCommand(this._rendererSaveCmd),this._clipElemType?cc.Node.prototype.visit.call(this,d):this._stencil.visit(d),this._rendererClipCmd&&cc.renderer.pushRenderCommand(this._rendererClipCmd),this.transform(),this._clipElemType)this._stencil.visit();else{this._cangodhelpme(!0);var f=e.length;if(f>0){for(this.sortAllChildren(),b=0;f>b&&(c=e[b],c._localZOrder<0);b++)c.visit(d);for(this._rendererCmd&&cc.renderer.pushRenderCommand(this._rendererCmd);f>b;b++)e[b].visit(d)}else this._rendererCmd&&cc.renderer.pushRenderCommand(this._rendererCmd);this._cangodhelpme(!1)}this._rendererRestoreCmd&&cc.renderer.pushRenderCommand(this._rendererRestoreCmd)},getStencil:function(){return this._stencil},setStencil:null,_setStencilForWebGL:function(a){this._stencil!=a&&(this._stencil&&(this._stencil._parent=null),this._stencil=a,this._stencil&&(this._stencil._parent=this))},_setStencilForCanvas:function(a){if(this._stencil=a,a._buffer)for(var b=0;b<a._buffer.length;b++)a._buffer[b].isFill=!1,a._buffer[b].isStroke=!1;cc._renderContext;a instanceof cc.DrawNode&&(a._rendererCmd.rendering=function(b,c,d){c=c||cc.view.getScaleX(),d=d||cc.view.getScaleY();var e=b||cc._renderContext,f=this._node._transformWorld;e.save(),e.transform(f.a,f.b,f.c,f.d,f.tx*c,-f.ty*d),e.beginPath();for(var g=0;g<a._buffer.length;g++){var h=a._buffer[g].verts,i=h[0];e.moveTo(i.x*c,-i.y*d);for(var j=1,k=h.length;k>j;j++)e.lineTo(h[j].x*c,-h[j].y*d)}e.restore()})},getAlphaThreshold:function(){return this.alphaThreshold},setAlphaThreshold:function(a){this.alphaThreshold=a},isInverted:function(){return this.inverted},setInverted:function(a){this.inverted=a},_cangodhelpme:function(a){return(a===!0||a===!1)&&(cc.ClippingNode.prototype._godhelpme=a),cc.ClippingNode.prototype._godhelpme},_transformForRenderer:function(a){cc.Node.prototype._transformForRenderer.call(this,a),this._stencil&&this._stencil._transformForRenderer(this._stackMatrix)}});var _p=cc.ClippingNode.prototype;cc._renderType===cc._RENDER_TYPE_WEBGL?(_p.init=_p._initForWebGL,_p.visit=_p._visitForWebGL,_p.setStencil=_p._setStencilForWebGL):(_p.init=_p._initForCanvas,_p.visit=_p._visitForCanvas,_p.setStencil=_p._setStencilForCanvas),cc.defineGetterSetter(_p,"stencil",_p.getStencil,_p.setStencil),_p.stencil,cc.ClippingNode._init_once=null,cc.ClippingNode._visit_once=null,cc.ClippingNode._layer=-1,cc.ClippingNode._sharedCache=null,cc.ClippingNode._getSharedCache=function(){return cc.ClippingNode._sharedCache||(cc.ClippingNode._sharedCache=document.createElement("canvas"))},cc.ClippingNode.create=function(a){return new cc.ClippingNode(a)};