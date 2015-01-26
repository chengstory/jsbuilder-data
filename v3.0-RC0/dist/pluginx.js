(function(l){if(void 0!==cc){var d=cc.game.config.plugin||{},h={user:null,share:null,social:null},g={getSDK:function(){return h},isSupportFunction:function(b){return"function"===typeof this[b]?!0:!1},getUserPlugin:function(){return{callStringFuncWithParam:function(){return this.callFuncWithParam.apply(this,arguments)},callFuncWithParam:function(b,c){if(d.common&&d.common.user&&f[d.common.user]){var a=f[d.common.user];if("function"==typeof a.user[b])return a.user[b](c);if("function"==typeof a[b])return a[b](c)}}}},
getSharePlugin:function(){return{callStringFuncWithParam:function(){return this.callFuncWithParam.apply(this,arguments)},callFuncWithParam:function(b,c){if(d.common&&d.common.share&&f[d.common.share]){var a=f[d.common.share];if("function"==typeof a.share[b])return a.share[b](c);if("function"==typeof a[b])return a[b](c)}}}}},f={};g.extend=function(b,c){var a=!1,e;for(e in d.common)if(d.common[e]==b){for(var k in c[e])g[k]=c[e][k];a=!0;h[e]=b}a&&c.init(d[b]);f[b]=c};var m={loadPlugin:function(b){if(!b)return cc.log("PliginManager - PluginName error"),
null;b=b.match(/[A-Z][a-z]+/g);if(2!==b.length)return cc.log("PliginManager - PluginName error"),null;var c={setDebugMode:function(){},startSession:function(){},setCaptureUncaughtException:function(){},callFuncWithParam:function(a){if(f[e]){var b=f[e].common[a];if(b){var c=Array.prototype.slice.call(arguments,1);return b.apply(b,c)}}},getPluginName:function(){return e},getPluginVersion:function(){return"1.0"},callStringFuncWithParam:function(){return c.callFuncWithParam.apply(c,arguments)}},a=b[0].toLowerCase(),
e=b[1].toLowerCase();if(!f[e])return cc.log("Plugin does not exist"),c;f[e].init();for(var d in f[e][a])c[d]=f[e][a][d];return c}};l.plugin={extend:g.extend,agentManager:g,AgentManager:{getInstance:function(){return plugin.agentManager}},PluginManager:{getInstance:function(){return m}}};plugin.PluginParam=function(b,c){var a=plugin.PluginParam.ParamType;switch(b){case a.TypeInt:a=parseInt(c);break;case a.TypeFloat:a=parseFloat(c);break;case a.TypeBool:a=Boolean(c);break;case a.TypeString:a=String(c);
break;case a.TypeStringMap:a=c;break;default:a=c}return a};plugin.PluginParam.ParamType={TypeInt:1,TypeFloat:2,TypeBool:3,TypeString:4,TypeStringMap:5};plugin.PluginParam.AdsResultCode={AdsReceived:0,FullScreenViewShown:1,FullScreenViewDismissed:2,PointsSpendSucceed:3,PointsSpendFailed:4,NetworkError:5,UnknownError:6};plugin.PluginParam.PayResultCode={PaySuccess:0,PayFail:1,PayCancel:2,PayTimeOut:3};plugin.PluginParam.ShareResultCode={ShareSuccess:0,ShareFail:1,ShareCancel:2,ShareTimeOut:3}}})(window);