//UNCOMMENT FOR JS LINT
console.log('%c•!!!!!!!!!!!!!!!!!!IF YOU SEE THIS YOU FORGOT TO UNCOMMENT THE TEST CODE FOR JS LINT!!!!!!!•', 'background: linear-gradient(to right,red,white,white,red); color:black;text-shadow: 0 0 8px white;');
var randomInteger = function () {'use strict';};
var getSectionIDs = function () {'use strict';};
var getTranslationByKey = function () {'use strict';};
var getAttrs = function () {'use strict';};
var setAttrs = function () {'use strict';};
var on = function () {'use strict';};
var removeRepeatingRow = function () {'use strict';};
var generateRowID = function () {'use strict';};
var _ = _ || (function () {'use strict';
return { dummy  : 0};
}());


/* ---- BEGIN: TheAaronSheet.js ---- */
// Github:   https://github.com/shdwjk/TheAaronSheet/blob/master/TheAaronSheet.js
// By:       The Aaron, Arcane Scriptomancer
// Contact:  https://app.roll20.net/users/104025/the-aaron

var TAS = TAS || (function(){
    'use strict';

    var version = '0.2.5',
        lastUpdate = 1504710542,

        loggingSettings = {
            debug: {
                key:     'debug',
                title:   'DEBUG',
                color: {
                    bgLabel: '#7732A2',
                    label:   '#F2EF40',
                    bgText:  '#FFFEB7',
                    text:    '#7732A2'
                }
            },
            error: {
                key:     'error',
                title:   'Error',
                color: {
                    bgLabel: '#C11713',
                    label:   'white',
                    bgText:  '#C11713',
                    text:    'white'
                }
            },
            warn: {
                key:     'warn',
                title:   'Warning',
                color: {
                    bgLabel: '#F29140',
                    label:   'white',
                    bgText:  '#FFD8B7',
                    text:    'black'
                }
            },
            info: {
                key:     'info',
                title:   'Info',
                color: {
                    bgLabel: '#413FA9',
                    label:   'white',
                    bgText:  '#B3B2EB',
                    text:    'black'
                }
            },
            notice: {
                key:     'notice',
                title:   'Notice',
                color: {
                    bgLabel: '#33C133',
                    label:   'white',
                    bgText:  '#ADF1AD',
                    text:    'black'
                }
            },
            log: {
                key:     'log',
                title:   'Log',
                color: {
                    bgLabel: '#f2f240',
                    label:   'black',
                    bgText:  '#ffff90',
                    text:    'black'
                }
            },
            callstack: {
                key:     'TAS',
                title:   'function',
                color: {
                    bgLabel: '#413FA9',
                    label:   'white',
                    bgText:  '#B3B2EB',
                    text:    'black'
                }
            },
            callstack_async: {
                key:     'TAS',
                title:   'ASYNC CALL',
                color: {
                    bgLabel: '#413FA9',
                    label:   'white',
                    bgText:  '#413FA9',
                    text:    'white'
                }
            },
            TAS: {
                key:     'TAS',
                title:   'TAS',
                color: {
                    bgLabel: 'grey',
                    label:   'black;background:linear-gradient(#304352,#d7d2cc,#d7d2cc,#d7d2cc,#304352)',
                    bgText:  'grey',
                    text:    'black;background:linear-gradient(#304352,#d7d2cc,#d7d2cc,#d7d2cc,#304352)'
                }
            }
        },


        config = {
            debugMode: false,
            logging: {
                log: true,
                notice: true,
                info: true,
                warn: true,
                error: true,
                debug: false
            }
        },

        callstackRegistry = [],
        queuedUpdates = {}, //< Used for delaying saves till the last moment.

    complexType = function(o){
        switch(typeof o){
            case 'string':
                return 'string';
            case 'boolean':
                return 'boolean';
            case 'number':
                return (_.isNaN(o) ? 'NaN' : (o.toString().match(/\./) ? 'decimal' : 'integer'));
            case 'function':
                return 'function: '+(o.name ? o.name+'()' : '(anonymous)');
            case 'object':
                return (_.isArray(o) ? 'array' : (_.isArguments(o) ? 'arguments' : ( _.isNull(o) ? 'null' : 'object')));
            default:
                return typeof o;
        }
    },

    dataLogger = function(primaryLogger,secondaryLogger,data){
        _.each(data,function(m){
            var type = complexType(m);
            switch(type){
                case 'string':
                    primaryLogger(m);
                    break;
                case 'undefined':
                case 'null':
                case 'NaN':
                    primaryLogger('['+type+']');
                    break;
                case 'number':
                case 'not a number':
                case 'integer':
                case 'decimal':
                case 'boolean':
                    primaryLogger('['+type+']: '+m);
                    break;
                default:
                    primaryLogger('['+type+']:=========================================');
                    secondaryLogger(m);
                    primaryLogger('=========================================================');
                    break;
            }
        });
    },


    colorLog = function(options){
        var coloredLoggerFunction,
            key = options.key,
            label = options.title || 'TAS',
            lBGColor = (options.color && options.color.bgLabel) || 'blue',
            lTxtColor = (options.color && options.color.label) || 'white',
            mBGColor = (options.color && options.color.bgText) || 'blue',
            mTxtColor = (options.color && options.color.text) || 'white';

        coloredLoggerFunction = function(message){
            /* eslint-disable no-console */
            console.log(
                '%c '+label+': %c '+message + ' ',
                'background-color: '+lBGColor+';color: '+lTxtColor+'; font-weight:bold;',
                'background-color: '+mBGColor+';color: '+mTxtColor+';'
            );
            /* eslint-enable no-console */
        };
        return function(){
            if('TAS'===key || config.logging[key]){
                /* eslint-disable no-console */
               dataLogger(coloredLoggerFunction,function(m){console.log(m);},_.toArray(arguments));
                /* eslint-enable no-console */
            }
        };
    },

    logDebug  = colorLog(loggingSettings.debug),
    logError  = colorLog(loggingSettings.error),
    logWarn   = colorLog(loggingSettings.warn),
    logInfo   = colorLog(loggingSettings.info),
    logNotice = colorLog(loggingSettings.notice),
    logLog    = colorLog(loggingSettings.log),
    log       = colorLog(loggingSettings.TAS),
    logCS     = colorLog(loggingSettings.callstack),
    logCSA    = colorLog(loggingSettings.callstack_async),

    registerCallstack = function(callstack,label){
        var idx=_.findIndex(callstackRegistry,function(o){
            return (_.difference(o.stack,callstack).length === _.difference(callstack,o.stack).length) &&
                _.difference(o.stack,callstack).length === 0 &&
                o.label === label;
        });
        if(-1 === idx){
            idx=callstackRegistry.length;
            callstackRegistry.push({
                stack: callstack,
                label: label
            });
        }
        return idx;
    },

    setConfigOption = function(options){
        var newconf =_.defaults(options,config);
        newconf.logging=_.defaults(
            (options && options.logging)||{},
            config.logging
        );
        config=newconf;
    },

    isDebugMode = function(){
        return config.debugMode;
    },

    debugMode = function(){
        config.logging.debug=true;
        config.debugMode = true;
    },

    getCallstack = function(){
        var e = new Error('dummy'),
            stack = _.map(_.rest(e.stack.replace(/^[^(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
            .split('\n')),function(l){
                return l.replace(/\s+.*$/,'');
            });
        return stack;
    },
    logCallstackSub = function(cs){
        var matches, csa;
        _.find(cs,function(line){
            matches = line.match(/TAS_CALLSTACK_(\d+)/);
            if(matches){
               csa=callstackRegistry[matches[1]];
               logCSA( '===================='+(csa.label ? '> '+csa.label+' <' : '')+'====================');
               logCallstackSub(csa.stack);
               return true;
            }
            logCS(line);
            return false;
        });
    },
    logCallstack = function(){
        var cs;
        if(config.debugMode){
            cs = getCallstack();
            cs.shift();
            log('==============================> CALLSTACK <==============================');
            logCallstackSub(cs);
            log('=========================================================================');
        }
    },


    wrapCallback = function (label, callback, context){
        var callstack;
        if('function' === typeof label){
            context=callback;
            callback=label;
            label=undefined;
        }
        if(!config.debugMode){
            return (function(cb,ctx){
                return function(){
                    cb.apply(ctx||{},arguments);
                };
            }(callback,context));
        }

        callstack = getCallstack();
        callstack.shift();

        return (function(cb,ctx,cs,lbl){
            var ctxref=registerCallstack(cs,lbl);

            /*jshint -W054 */
            return new Function('cb','ctx','TASlog',
                "return function TAS_CALLSTACK_"+ctxref+"(){"+
                    "var start,end;"+
                    "TASlog('Entering: '+(cb.name||'(anonymous function)'));"+
                    "start=_.now();"+
                    "cb.apply(ctx||{},arguments);"+
                    "end=_.now();"+
                    "TASlog('Exiting: '+(cb.name||'(anonymous function)')+' :: '+(end-start)+'ms elapsed');"+
                "};")(cb,ctx,log);
            /*jshint +W054 */
        }(callback,context,callstack,label));
    },


    prepareUpdate = function( attribute, value ){
        queuedUpdates[attribute]=value;
    },

    applyQueuedUpdates = function() {
      setAttrs(queuedUpdates);
      queuedUpdates = {};
    },

    namesFromArgs = function(args,base){
        return _.chain(args)
            .reduce(function(memo,attr){
                if('string' === typeof attr) {
                    memo.push(attr);
                } else if(_.isArray(args) || _.isArguments(args)){
                    memo = namesFromArgs(attr,memo);
                }
                return memo;
            },(_.isArray(base) && base) || [])
            .uniq()
            .value();
    },

    addId = function(obj,value){
        Object.defineProperty(obj,'id',{
            value: value,
            writable: false,
            enumerable: false
        });
    },

    addProp = function(obj,prop,value,fullname){
        (function(){
            var pname=(_.contains(['S','F','I','D'],prop) ? '_'+prop : prop),
                full_pname = fullname || prop,
                pvalue=value;

            _.each(['S','I','F'],function(p){
                if( !_.has(obj,p)){
                    Object.defineProperty(obj, p, {
                        value: {},
                        enumerable: false,
                        readonly: true
                    });
                }
            });
            if( !_.has(obj,'D')){
                Object.defineProperty(obj, 'D', {
                    value: _.reduce(_.range(10),function(m,d){
                            Object.defineProperty(m, d, {
                                value: {},
                                enumerable: true,
                                readonly: true
                            });
                            return m;
                        },{}),
                    enumerable: false,
                    readonly: true
                });
            }


            // Raw value
            Object.defineProperty(obj, pname, {
                enumerable: true,
                set: function(v){
                    if(v!==pvalue) {
                        pvalue=v;
                        prepareUpdate(full_pname,v);
                    }
                },
                get: function(){
                    return pvalue;
                }
            });

            // string value
            Object.defineProperty(obj.S, pname, {
                enumerable: true,
                set: function(v){
                    var val=v.toString();
                    if(val !== pvalue) {
                        pvalue=val;
                        prepareUpdate(full_pname,val);
                    }
                },
                get: function(){
                    return pvalue.toString();
                }
            });

            // int value
            Object.defineProperty(obj.I, pname, {
                enumerable: true,
                set: function(v){
                    var val=parseInt(v,10) || 0;
                    if(val !== pvalue){
                        pvalue=val;
                        prepareUpdate(full_pname,val);
                    }
                },
                get: function(){
                    return parseInt(pvalue,10) || 0;
                }
            });

            // float value
            Object.defineProperty(obj.F, pname, {
                enumerable: true,
                set: function(v){
                    var val=parseFloat(v) || 0;
                    if(val !== pvalue) {
                        pvalue=val;
                        prepareUpdate(full_pname,val);
                    }
                },
                get: function(){
                    return parseFloat(pvalue) || 0;
                }
            });
            _.each(_.range(10),function(d){
                Object.defineProperty(obj.D[d], pname, {
                    enumerable: true,
                    set: function(v){
                        var val=(parseFloat(v) || 0).toFixed(d);
                        if(val !== pvalue){
                            pvalue=val;
                            prepareUpdate(full_pname,val);
                        }
                    },
                    get: function(){
                        return (parseFloat(pvalue) || 0).toFixed(d);
                    }
                });
            });

        }());
    },

    repeating = function( section ) {
        return (function(s){
            var sectionName = s,
                attrNames = [],
                fieldNames = [],
                operations = [],
                after = [],

            repAttrs = function TAS_Repeating_Attrs(){
                attrNames = namesFromArgs(arguments,attrNames);
                return this;
            },
            repFields = function TAS_Repeating_Fields(){
                fieldNames = namesFromArgs(arguments,fieldNames);
                return this;
            },
            repReduce = function TAS_Repeating_Reduce(func, initial, final, context) {
                operations.push({
                    type: 'reduce',
                    func: (func && _.isFunction(func) && func) || _.noop,
                    memo: (_.isUndefined(initial) && 0) || initial,
                    final: (final && _.isFunction(final) && final) || _.noop,
                    context: context || {}
                });
                return this;
            },
            repMap = function TAS_Repeating_Map(func, final, context) {
                operations.push({
                    type: 'map',
                    func: (func && _.isFunction(func) && func) || _.noop,
                    final: (final && _.isFunction(final) && final) || _.noop,
                    context: context || {}
                });
                return this;
            },
            repEach = function TAS_Repeating_Each(func, final, context) {
                operations.push({
                    type: 'each',
                    func: (func && _.isFunction(func) && func) || _.noop,
                    final: (final && _.isFunction(final) && final) || _.noop,
                    context: context || {}
                });
                return this;
            },
            repTap = function TAS_Repeating_Tap(final, context) {
                operations.push({
                    type: 'tap',
                    final: (final && _.isFunction(final) && final) || _.noop,
                    context: context || {}
                });
                return this;
            },
            repAfter = function TAS_Repeating_After(callback,context) {
                after.push({
                    callback: (callback && _.isFunction(callback) && callback) || _.noop,
                    context: context || {}
                });
                return this;
            },
            repExecute = function TAS_Repeating_Execute(callback,context){
                var rowSet = {},
                    attrSet = {},
                    fieldIds = [],
                    fullFieldNames = [];

                repAfter(callback,context);

                // call each operation per row.
                // call each operation's final
                getSectionIDs("repeating_"+sectionName,function(ids){
                    fieldIds = ids;
                    fullFieldNames = _.reduce(fieldIds,function(memo,id){
                        return memo.concat(_.map(fieldNames,function(name){
                            return 'repeating_'+sectionName+'_'+id+'_'+name;
                        }));
                    },[]);
                    getAttrs( _.uniq(attrNames.concat(fullFieldNames)), function(values){
                        _.each(attrNames,function(aname){
                            if(values.hasOwnProperty(aname)){
                                addProp(attrSet,aname,values[aname]);
                            }
                        });

                        rowSet = _.reduce(fieldIds,function(memo,id){
                            var r={};
                            addId(r,id);
                            _.each(fieldNames,function(name){
                                var fn = 'repeating_'+sectionName+'_'+id+'_'+name;
                                addProp(r,name,values[fn],fn);
                            });

                            memo[id]=r;

                            return memo;
                        },{});

                        _.each(operations,function(op){
                            var res;
                            switch(op.type){
                                case 'tap':
                                    _.bind(op.final,op.context,rowSet,attrSet)();
                                    break;

                                case 'each':
                                    _.each(rowSet,function(r){
                                        _.bind(op.func,op.context,r,attrSet,r.id,rowSet)();
                                    });
                                    _.bind(op.final,op.context,rowSet,attrSet)();
                                    break;

                                case 'map':
                                    res = _.map(rowSet,function(r){
                                        return _.bind(op.func,op.context,r,attrSet,r.id,rowSet)();
                                    });
                                    _.bind(op.final,op.context,res,rowSet,attrSet)();
                                    break;

                                case 'reduce':
                                    res = op.memo;
                                    _.each(rowSet,function(r){
                                        res = _.bind(op.func,op.context,res,r,attrSet,r.id,rowSet)();
                                    });
                                    _.bind(op.final,op.context,res,rowSet,attrSet)();
                                    break;
                            }
                        });

                        // finalize attrs
                        applyQueuedUpdates();
                        _.each(after,function(op){
                            _.bind(op.callback,op.context)();
                        });
                    });
                });
            };

            return {
                attrs: repAttrs,
                attr: repAttrs,

                column: repFields,
                columns: repFields,
                field: repFields,
                fields: repFields,

                reduce: repReduce,
                inject: repReduce,
                foldl: repReduce,

                map: repMap,
                collect: repMap,

                each: repEach,
                forEach: repEach,

                tap: repTap,
                'do': repTap,

                after: repAfter,
                last: repAfter,
                done: repAfter,

                execute: repExecute,
                go: repExecute,
                run: repExecute
            };
        }(section));
    },


    repeatingSimpleSum = function(section, field, destination){
        repeating(section)
            .attr(destination)
            .field(field)
            .reduce(function(m,r){
                return m + (r.F[field]);
            },0,function(t,r,a){
                a.S[destination]=t;
            })
            .execute();
    };

    /* eslint-disable no-console */
    console.log('%c•.¸¸.•*´¨`*•.¸¸.•*´¨`*•.¸  The Aaron Sheet  v'+version+'  ¸.•*´¨`*•.¸¸.•*´¨`*•.¸¸.•','background: linear-gradient(to right,green,white,white,green); color:black;text-shadow: 0 0 8px white;');
    console.log('%c•.¸¸.•*´¨`*•.¸¸.•*´¨`*•.¸  Last update: '+(new Date(lastUpdate*1000))+'  ¸.•*´¨`*•.¸¸.•*´¨`*•.¸¸.•','background: linear-gradient(to right,green,white,white,green); color:black;text-shadow: 0 0 8px white;');
    /* eslint-enable no-console */


    return {
        /* Repeating Sections */
        repeatingSimpleSum: repeatingSimpleSum,
        repeating: repeating,

        /* Configuration */
        config: setConfigOption,

        /* Debugging */
        callback: wrapCallback,
        callstack: logCallstack,
        debugMode: debugMode,
        isDebugMode: isDebugMode,
        _fn: wrapCallback,

        /* Logging */
        debug: logDebug,
        error: logError,
        warn: logWarn,
        info: logInfo,
        notice: logNotice,
        log: logLog
    };
}());

/* ---- END: TheAaronSheet.js ---- */

TAS.config({
    logging: {
        error: true,
        warning: true,
        info: true,
        debug: true
    }
});
TAS.debugMode();

var CoC_Sheet = CoC_Sheet || (function() {

    var initSheet = function (eventInfo) {
            CoC_Skills.InitSkills(eventInfo);

            getAttrs(["initSheet"], function(values){
                if (typeof values.initSheet !== 'undefined') {

                    var valInitSheet=parseInt(values.initSheet);

                    if(valInitSheet==1){

                        var newrowid = generateRowID();
                        var newrowattrs = {};

                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-name"] = "Fist";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-score-base"] = "50";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-score-mod"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-score"] = "50";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-damage"] = "1d3";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_damage-mod"] = "@{dmg-bonus}";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-range"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-hands"] = "1";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-attacks-per-round"] = "1";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-mal"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-hp"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-hp_max"] = "0";

                        setAttrs(newrowattrs);
                        newrowid = generateRowID();
                        newrowattrs = {};

                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-name"] = "Grapple";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-score-base"] = "25";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-score-mod"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-score"] = "25";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-damage"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_damage-mod"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-range"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-hands"] = "2";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-attacks-per-round"] = "1";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-mal"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-hp"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-hp_max"] = "0";

                        setAttrs(newrowattrs);
                        newrowid = generateRowID();
                        newrowattrs = {};

                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-name"] = "Head";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-score-base"] = "10";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-score-mod"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-score"] = "10";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-damage"] = "1d4";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_damage-mod"] = "@{dmg-bonus}";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-range"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-hands"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-attacks-per-round"] = "1";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-mal"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-hp"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-hp_max"] = "0";

                        setAttrs(newrowattrs);
                        newrowid = generateRowID();
                        newrowattrs = {};

                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-name"] = "Kick";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-score-base"] = "25";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-score-mod"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-score"] = "25";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-damage"] = "1d6";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_damage-mod"] = "@{dmg-bonus}";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-range"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-hands"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-attacks-per-round"] = "1";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-mal"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-hp"] = "0";
                        newrowattrs["repeating_melee-weapons_" + newrowid + "_weapon-hp_max"] = "0";

                        setAttrs(newrowattrs);

                        setAttrs({
                            'initSheet': 0
                        });
                    }
                }
            });
        },

        registerEventHandlers = function (eventInfo) {

            on("sheet:opened", TAS.callback( function sheetOpened (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                initSheet(eventInfo);
            }));

        };

    registerEventHandlers();

    TAS.log("CoC_Sheet loaded");

}());

var CoC_Characteristics = CoC_Characteristics || (function() {

    var updateStrength = function (eventInfo) {
            getAttrs(["str"], function(values){
                if (typeof values.str !== 'undefined') {

                }
            });
        },
        updateConstitution = function (eventInfo) {
            getAttrs(["con"], function(values){
                if (typeof values.con !== 'undefined') {

                }
            });
        },
        updateSize = function (eventInfo) {
            getAttrs(["siz"], function(values){
                if (typeof values.siz !== 'undefined') {

                }
            });
        },
        updateDexterity = function (eventInfo) {
            getAttrs(["dex"], function(values){
                if (typeof values.dex !== 'undefined') {
                    CoC_Skills.InitSkills(eventInfo);
                }
            });
        },
        updateAppearance = function (eventInfo) {
            getAttrs(["app"], function(values){
                if (typeof values.app !== 'undefined') {

                }
            });
        },
        updateSanity = function (eventInfo) {
            getAttrs(["san"], function(values){
                if (typeof values.san !== 'undefined') {

                }
            });
        },

        updateIntelligence = function (eventInfo) {
            getAttrs(["int"], function(values){
                if (typeof values.int !== 'undefined') {
                    var val=parseInt(values.int);

                    setAttrs({
                        'idea': val*5
                    });
                }
            });
        },
        updatePower = function (eventInfo) {
            getAttrs(["pow","initSan","initMp"], function(values){

                if (typeof values.pow !== 'undefined' && typeof values.initSan !== 'undefined' && typeof values.initMp !== 'undefined') {
                    var val=parseInt(values.pow),
                        valInitSan=parseInt(values.initSan),
                        valInitMp=parseInt(values.initMp);

                    setAttrs({
                        'luck': val*5,
                        'mp_max': val
                    });

                    if(valInitSan==1){
                        setAttrs({
                            'san': val*5,
                            'initSan': 0
                        });
                    }

                    if(valInitMp==1){
                        setAttrs({
                            'mp': val,
                            'initMp': 0
                        });
                    }
                }
            });
        },
        updateEducation = function (eventInfo) {
            getAttrs(["edu"], function(values){
                if (typeof values.edu !== 'undefined') {
                    var val=parseInt(values.edu);

                    setAttrs({
                        'know': val*5
                    });

                    CoC_Skills.InitSkills(eventInfo);
                }
            });
        },
        updateHitPoints = function (eventInfo) {
            getAttrs(["con","siz","initHp"], function(values){
                if (typeof values.con !== 'undefined' && typeof values.siz !== 'undefined' && typeof values.initHp !== 'undefined') {
                    var valCon=parseInt(values.con),
                        valSiz=parseInt(values.siz),
                        valInitHp=parseInt(values.initHp),
                        result = parseInt((valCon+valSiz)/2);

                    setAttrs({
                        'hp_max': result
                    });

                    if(valInitHp==1){
                        setAttrs({
                            'hp': result,
                            'valInitHp': 0
                        });
                    }
                }
            });
        },
        updateDamageBonus = function (eventInfo) {
            getAttrs(["str","siz"], function(values){
                if (typeof values.str !== 'undefined' && typeof values.siz !== 'undefined') {

                    var valStr=parseInt(values.str),
                        valSiz=parseInt(values.siz),
                        val=valStr+valSiz,
                        result="0";

                    if(val < 13){
                        result="-1d6";
                    }
                    else if(val < 17){
                        result="-1d4";
                    }
                    else if(val < 25){
                        result="0";
                    }
                    else if(val < 33){
                        result="1d4";
                    }
                    else if(val < 41){
                        result="1d6";
                    }
                    else if(val < 57){
                        result="2d6";
                    }
                    else if(val < 73){
                        result="3d6";
                    }
                    else if(val < 89){
                        result="4d6";
                    }
                    else if(val < 105){
                        result="5d6";
                    }
                    else if(val < 121){
                        result="6d6";
                    }
                    else if(val < 137){
                        result="7d6";
                    }
                    else if(val < 153){
                        result="8d6";
                    }
                    else if(val < 179){
                        result="9d6";
                    }
                    else if(val < 185){
                        result="10d6";
                    }
                    else {
                        var calcValue= Math.floor(val/16);
                        result=calcValue+"d6";
                    }

                    setAttrs({
                        'dmg-bonus': result
                    });
                }
            });
        },

        registerEventHandlers = function (eventInfo) {

            on("change:str", TAS.callback( function updateStrengthValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateStrength(eventInfo);
                updateDamageBonus(eventInfo);
            }));
            on("change:con", TAS.callback( function updateConstitutionValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateConstitution(eventInfo);
                updateHitPoints(eventInfo);
            }));
            on("change:siz", TAS.callback( function updateSizeValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateSize(eventInfo);
                updateHitPoints(eventInfo);
                updateDamageBonus(eventInfo);
            }));
            on("change:dex", TAS.callback( function updateDexterityValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateDexterity(eventInfo);
            }));
            on("change:app", TAS.callback( function updateAppearanceValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateAppearance(eventInfo);
            }));
            on("change:san", TAS.callback( function updateSanityValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateSanity(eventInfo);
            }));
            on("change:int", TAS.callback( function updateIntelligenceValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateIntelligence(eventInfo);
            }));
            on("change:pow", TAS.callback( function updatePowerValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updatePower(eventInfo);
            }));
            on("change:edu", TAS.callback( function updateEducationValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateEducation(eventInfo);
            }));

        };

    registerEventHandlers();

    TAS.log("CoC_Characteristics loaded");

}());

var CoC_Skills = CoC_Skills || (function() {

    var skills=["accounting","anthropology","archaeology","art-version-1","art-version-2","astronomy","bargain","biology","chemistry","climb","computer-use","conceal","craft-version-1","craft-version-2","credit-rating","cthulhu-mythos","disguise","dodge","drive-auto","drive-carriage","electr-repair","electronics","fast-talk","first-aid","geology","hide","history","jump","law","library-use","listen","locksmith","martial-arts","mech-repair","medicine","natural-history","navigate","occult","opr-hvy-mch","other-language-version-1","other-language-version-2","other-language-version-3","own-language-version-1","persuade","pharmacy","photography","physics","pilot-version-1","pilot-version-2","psychoanalysis","psychology","ride","sneak","spot-hidden","swim","throw","track","handgun","machine-gun","rifle","shotgun","smg"];

    var initSkills = function (eventInfo) {

            getAttrs(["initSkills","dex","edu"], function(values){
                if (typeof values.initSkills !== 'undefined' && typeof values.dex !== 'undefined' && typeof values.edu !== 'undefined') {

                    var valInitSkills=parseInt(values.initSkills),
                        valDex=parseInt(values.dex),
                        valEdu=parseInt(values.edu);

                    setAttrs({
                        'accounting-base':10,
                        'anthropology-base':1,
                        'archaeology-base':1,
                        'art-base':5,
                        'art-version-1-base': 5,
                        'art-version-2-base': 5,
                        'astronomy-base':1,
                        'bargain-base': 5,
                        'biology-base':1,
                        'chemistry-base':1,
                        'climb-base':40,
                        'computer-use-base':1,
                        'conceal-base':15,
                        'craft-base':5,
                        'craft-version-1-base':5,
                        'craft-version-2-base':5,
                        'credit-rating-base':15,
                        'cthulhu-mythos-base':0,
                        'disguise-base':1,
                        'dodge-base':valDex*2,
                        'drive-auto-base':20,
                        'drive-carriage-base':20,
                        'electr-repair-base':10,
                        'electronics-base':1,
                        'fast-talk-base':5,
                        'first-aid-base':30,
                        'geology-base':1,
                        'hide-base':10,
                        'history-base':20,
                        'jump-base':25,
                        'law-base':5,
                        'library-use-base':25,
                        'listen-base':25,
                        'locksmith-base':1,
                        'martial-arts-base':1,
                        'mech-repair-base':20,
                        'medicine-base':5,
                        'natural-history-base':10,
                        'navigate-base':10,
                        'occult-base':5,
                        'opr-hvy-mch-base':1,
                        'other-language-base':1,
                        'other-language-version-1-base':1,
                        'other-language-version-2-base':1,
                        'other-language-version-3-base':1,
                        'own-language-base':valEdu*5,
                        'own-language-version-1-base':valEdu*5,
                        'persuade-base':15,
                        'pharmacy-base':1,
                        'photography-base':10,
                        'physics-base':1,
                        'pilot-base':1,
                        'pilot-version-1-base':1,
                        'pilot-version-2-base':1,
                        'psychoanalysis-base':1,
                        'psychology-base':5,
                        'ride-base':5,
                        'sneak-base':10,
                        'spot-hidden-base':25,
                        'swim-base':25,
                        'throw-base':25,
                        'track-base':10,

                        'handgun-base':20,
                        'machine-gun-base':15,
                        'rifle-base':25,
                        'shotgun-base':30,
                        'smg-base':15
                    });

                    if(valInitSkills==1){
                        setAttrs({
                            'accounting-mod':0,
                            'anthropology-mod':0,
                            'archaeology-mod':0,
                            'art-version-1-mod': 0,
                            'art-version-2-mod': 0,
                            'astronomy-mod':0,
                            'bargain-mod':0,
                            'biology-mod':0,
                            'chemistry-mod':0,
                            'climb-mod':0,
                            'computer-use-mod':0,
                            'conceal-mod':0,
                            'craft-version-1-mod':0,
                            'craft-version-2-mod':0,
                            'credit-rating-mod':0,
                            'cthulhu-mythos-mod':0,
                            'disguise-mod':0,
                            'dodge-mod':0,
                            'drive-auto-mod':0,
                            'drive-carriage-mod':0,
                            'electr-repair-mod':0,
                            'electronics-mod':0,
                            'fast-talk-mod':0,
                            'first-aid-mod':0,
                            'geology-mod':0,
                            'hide-mod':0,
                            'history-mod':0,
                            'jump-mod':0,
                            'law-mod':0,
                            'library-use-mod':0,
                            'listen-mod':0,
                            'locksmith-mod':0,
                            'martial-arts-mod':0,
                            'mech-repair-mod':0,
                            'medicine-mod':0,
                            'natural-history-mod':0,
                            'navigate-mod':0,
                            'occult-mod':0,
                            'opr-hvy-mch-mod':0,
                            'other-language-version-1-mod':0,
                            'other-language-version-2-mod':0,
                            'other-language-version-3-mod':0,
                            'own-language-version-1-mod':0,
                            'persuade-mod':0,
                            'pharmacy-mod':0,
                            'photography-mod':0,
                            'physics-mod':0,
                            'pilot-version-1-mod':0,
                            'pilot-version-2-mod':0,
                            'psychoanalysis-mod':0,
                            'psychology-mod':0,
                            'ride-mod':0,
                            'sneak-mod':0,
                            'spot-hidden-mod':0,
                            'swim-mod':0,
                            'throw-mod':0,
                            'track-mod':0,

                            'handgun-mod':0,
                            'machine-gun-mod':0,
                            'rifle-mod':0,
                            'shotgun-mod':0,
                            'smg-mod':0,

                            'initSkills':0
                        });

                        setAttrs({
                            'accounting':10,
                            'anthropology':1,
                            'archaeology':1,
                            'art':5,
                            'art-version-1': 5,
                            'art-version-2': 5,
                            'astronomy':1,
                            'bargain': 5,
                            'biology':1,
                            'chemistry':1,
                            'climb':40,
                            'computer-use':1,
                            'conceal':15,
                            'craft':5,
                            'craft-version-1':5,
                            'craft-version-2':5,
                            'credit-rating':15,
                            'cthulhu-mythos':0,
                            'disguise':1,
                            'dodge':valDex*2,
                            'drive-auto':20,
                            'drive-carriage':20,
                            'electr-repair':10,
                            'electronics':1,
                            'fast-talk':5,
                            'first-aid':30,
                            'geology':1,
                            'hide':10,
                            'history':20,
                            'jump':25,
                            'law':5,
                            'library-use':25,
                            'listen':25,
                            'locksmith':1,
                            'martial-arts':1,
                            'mech-repair':20,
                            'medicine':5,
                            'natural-history':10,
                            'navigate':10,
                            'occult':5,
                            'opr-hvy-mch':1,
                            'other-language':1,
                            'other-language-version-1':1,
                            'other-language-version-2':1,
                            'other-language-version-3':1,
                            'own-language':valEdu*5,
                            'own-language-version-1':valEdu*5,
                            'persuade':15,
                            'pharmacy':1,
                            'photography':10,
                            'physics':1,
                            'pilot':1,
                            'pilot-version-1':1,
                            'pilot-version-2':1,
                            'psychoanalysis':1,
                            'psychology':5,
                            'ride':5,
                            'sneak':10,
                            'spot-hidden':25,
                            'swim':25,
                            'throw':25,
                            'track':10,

                            'handgun':20,
                            'machine-gun':15,
                            'rifle':25,
                            'shotgun':30,
                            'smg':15
                        });
                    }
                }
            });

        },
        updateSkill = function (skillname, eventInfo) {

            getAttrs([skillname+"-base",skillname+"-mod"], function(values){
                if (typeof values[skillname+"-base"] !== 'undefined' && typeof values[skillname+"-mod"] !== 'undefined') {
                    var valBase=parseInt(values[skillname+"-base"]),
                        valMod=parseInt(values[skillname+"-mod"]),

                        attrs = {};

                    attrs[skillname] = valBase+valMod;
                    setAttrs(attrs);
                }
            });

            CoC_Weapons.UpdateFirearmsWeapons();
        },
        updateMiscSkills = function (eventInfo) {

            TAS.repeating('misc-skills')
                .fields('skill-base','skill-mod','skill')
                .each(function(f){

                    var result = f.I["skill-base"]+f.I["skill-mod"];

                    f["skill"]=result;
                })
                .execute();

        },
        updateCthulhuMythos = function (eventInfo) {
            getAttrs(["cthulhu-mythos"], function(values){
                if (typeof values["cthulhu-mythos"] !== 'undefined') {
                    var valScore=parseInt(values["cthulhu-mythos"]);

                    setAttrs({
                        'sp_max':99-valScore
                    });
                }
            });
        },

        registerEventHandlers = function (eventInfo) {

            _.each(skills, function (skillname) {
                on("change:" + skillname + "-mod", TAS.callback(function updateSkillValues(eventInfo) {
                    TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                    updateSkill(skillname, eventInfo);
                }));
            });

            on("change:repeating_misc-skills:skill-base change:repeating_misc-skills:skill-mod", TAS.callback( function updateMiscSkillsValues(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateMiscSkills(eventInfo);
            }));

            on("change:cthulhu-mythos", TAS.callback( function updateCthulhuMythosValues(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateCthulhuMythos(eventInfo);
            }));
        };

    registerEventHandlers();

    TAS.log("CoC_Skills loaded");

    return {
        InitSkills: initSkills,
        Skills: skills
    };
}());

var CoC_Weapons = CoC_Weapons || (function() {
     var updateMeleeWeapons = function (eventInfo) {

            TAS.repeating('melee-weapons')
                .fields('weapon-score-base','weapon-score-mod','weapon-score')
                .each(function(f){

                    var result = f.I["weapon-score-base"]+f.I["weapon-score-mod"];

                    f["weapon-score"]=result;
                })
                .execute();

        },
        updateFirearmsWeapons = function (eventInfo) {

            TAS.repeating('firearms-weapons')
                .attrs(CoC_Skills.Skills)
                .fields('weapon-score-base','weapon-score-mod','weapon-score')
                .each(function(f,a){

                    var valBase=a.I[f["weapon-score-base"]];

                    var result = valBase+f.I["weapon-score-mod"];

                    f["weapon-score"]=result;
                })
                .execute();

        },

        registerEventHandlers = function (eventInfo) {

            on("change:repeating_melee-weapons", TAS.callback( function updateMeleeWeaponsValues(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateMeleeWeapons(eventInfo);
            }));

            on("change:repeating_firearms-weapons", TAS.callback( function updateFirearmsWeaponsValues(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateFirearmsWeapons(eventInfo);
            }));
        };

    registerEventHandlers();

    TAS.log("CoC_Weapons loaded");

    return {
        UpdateFirearmsWeapons: updateFirearmsWeapons
    };

}());
