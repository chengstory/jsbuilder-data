cc.NodeGrid=cc.Node.extend({grid:null,_target:null,getGrid:function(){return this.grid},setGrid:function(a){this.grid=a},setTarget:function(a){this._target=a},addChild:function(a,b,c){cc.Node.prototype.addChild.call(this,a,b,c),a&&!this._target&&(this._target=a)},visit:function(){var a=this;if(a._visible){var b=cc._renderType==cc._RENDER_TYPE_WEBGL,c=a.grid;b&&c&&c._active&&c.beforeDraw(),a.transform();var d=this._children;if(d&&d.length>0){var e=d.length;for(this.sortAllChildren(),i=0;e>i;i++){var f=d[i];f&&f.visit()}}b&&c&&c._active&&c.afterDraw(a._target)}},_transformForWebGL:function(){var a=this._transform4x4,b=cc.current_stack.top,c=this.nodeToParentTransform(),d=a.mat;if(d[0]=c.a,d[4]=c.c,d[12]=c.tx,d[1]=c.b,d[5]=c.d,d[13]=c.ty,d[14]=this._vertexZ,cc.kmMat4Multiply(b,b,a),!(null==this._camera||this.grid&&this.grid.isActive())){var e=this._anchorPointInPoints.x,f=this._anchorPointInPoints.y,g=0!==e||0!==f;g?(cc.SPRITEBATCHNODE_RENDER_SUBPIXEL||(e=0|e,f=0|f),cc.kmGLTranslatef(e,f,0),this._camera.locate(),cc.kmGLTranslatef(-e,-f,0)):this._camera.locate()}}});var _p=cc.NodeGrid.prototype;cc._renderType===cc._RENDER_TYPE_WEBGL&&(_p.transform=_p._transformForWebGL),_p.grid,_p.target,cc.defineGetterSetter(_p,"target",null,_p.setTarget),cc.NodeGrid.create=function(){return new cc.NodeGrid};