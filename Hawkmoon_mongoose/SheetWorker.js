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


/** Sheet **/

var HM_Sheet = HM_Sheet || (function () {

    var initCSheet = function (eventInfo) {
            getAttrs(["initSheet"], function(values){

                var valinitSheet=parseInt(values.initSheet);

                if(valinitSheet==1){
                    setAttrs({
                        'acrobatics-mod': 0,
                        'athletics-mod': 0,
                        'boating-mod': 0,
                        'dodge-mod': 0,
                        'driving-mod': 0,
                        'evaluate-mod': 0,
                        'first-aid-mod': 0,
                        'influence-mod': 0,
                        'lore-animal-mod': 0,
                        'lore-plant-mod': 0,
                        'lore-world-mod': 0,
                        'perception-mod': 0,
                        'persistence-mod': 0,
                        'resilience-mod': 0,
                        'riding-mod': 0,
                        'sing-mod': 0,
                        'sleight-mod': 0,
                        'stealth-mod': 0,
                        'throwing-mod': 0,
                        'unarmed-mod': 0,
                        'basic-close-combat-mod':0,
                        'basic-ranged-mod':0,
                        'rep':0,
                        'initSheet':0
                    });
                }
            });
        },
        registerEventHandlers = function (eventInfo) {
            on("sheet:opened", TAS.callback( function sheetOpened (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                initCSheet(eventInfo);
            }));
        };

    registerEventHandlers();

    TAS.log("HM_Sheet loaded");
}());


/**  Character  **/

var HM_Characteristics = HM_Characteristics || (function () {

    // Calculate and update the Combat Action
    var updateCombatAction = function (eventInfo) {

        getAttrs(["dex"], function (values) {

            var resValue = parseInt(values.dex);

            if (resValue < 7) {
                setAttrs({
                    'ca': 1
                });
            } else if (resValue < 13) {
                setAttrs({
                    'ca': 2
                });
            } else if (resValue < 19) {
                setAttrs({
                    'ca': 3
                });
            } else{
                setAttrs({
                    'ca': 4
                });
            }
        });

    },
    // Calculate and update the Strike Rank
    updateStrikeRank = function(eventInfo) {

        getAttrs(["dex", "int"], function (values) {

            var resValue = parseInt(values.dex)+parseInt(values.int);
            var result = Math.ceil(resValue/2);

            setAttrs({
                'sr': result
            });
        });

    },
    // Calculate and update the Fate Points
    updateFatePoints = function(eventInfo) {

        getAttrs(["pow","initFate"], function (values) {

            var resValue = parseInt(values.pow);
            var result = Math.floor(resValue/2);

            var valInitFate=parseInt(values.initFate);

            if(valInitFate==1){
                setAttrs({
                    'fate-points': result,
                    'fate-points-total': result,
                    'initFate': 0
                });
            }

            setAttrs({
                'focus-points_max': resValue
            });
        });

    },
    // Calculate and update the Hit Points Locations
    updateHitPointLocations = function(eventInfo) {
        getAttrs(["siz", "con", "initHp"], function (values) {

            var valInitHp=parseInt(values.initHp);
            var resValue = parseInt(values.siz) + parseInt(values.con);

            if (resValue < 6) {
                if(valInitHp==1){
                    setAttrs({
                        'right-leg-hp': 1,
                        'left-leg-hp': 1,
                        'abdomen-hp': 2,
                        'chest-hp': 3,
                        'right-arm-hp': 1,
                        'left-arm-hp': 1,
                        'head-hp': 1,
                        'initHp': 0
                    });
                }
                setAttrs({
                    'right-arm-hp_max': 1,
                    'right-leg-hp_max': 1,
                    'left-leg-hp_max': 1,
                    'abdomen-hp_max': 2,
                    'chest-hp_max': 3,
                    'left-arm-hp_max': 1,
                    'head-hp_max': 1
                });
            } else if (resValue < 11) {
                if(valInitHp==1){
                    setAttrs({
                        'right-leg-hp': 2,
                        'left-leg-hp': 2,
                        'abdomen-hp': 3,
                        'chest-hp': 4,
                        'right-arm-hp': 1,
                        'left-arm-hp': 1,
                        'head-hp': 2,
                        'initHp': 0
                    });
                }
                setAttrs({
                    'right-leg-hp_max': 2,
                    'left-leg-hp_max': 2,
                    'abdomen-hp_max': 3,
                    'chest-hp_max': 4,
                    'right-arm-hp_max': 1,
                    'left-arm-hp_max': 1,
                    'head-hp_max': 2
                });
            } else if (resValue < 16) {
                if(valInitHp==1){
                    setAttrs({
                        'right-leg-hp': 3,
                        'left-leg-hp': 3,
                        'abdomen-hp': 4,
                        'chest-hp': 5,
                        'right-arm-hp': 2,
                        'left-arm-hp': 2,
                        'head-hp': 3,
                        'initHp': 0
                    });
                }
                setAttrs({
                    'right-leg-hp_max': 3,
                    'left-leg-hp_max': 3,
                    'abdomen-hp_max': 4,
                    'right-arm-hp_max': 2,
                    'left-arm-hp_max': 2,
                    'head-hp_max': 3
                });
            } else if (resValue < 21) {
                if(valInitHp==1){
                    setAttrs({
                        'right-leg-hp': 4,
                        'left-leg-hp': 4,
                        'abdomen-hp': 5,
                        'chest-hp': 6,
                        'right-arm-hp': 3,
                        'left-arm-hp': 3,
                        'head-hp': 4,
                        'initHp': 0
                    });
                }
                setAttrs({
                    'right-leg-hp_max': 4,
                    'left-leg-hp_max': 4,
                    'abdomen-hp_max': 5,
                    'chest-hp_max': 6,
                    'right-arm-hp_max': 3,
                    'left-arm-hp_max': 3,
                    'head-hp_max': 4
                });
            } else if (resValue < 26) {
                if(valInitHp==1){
                    setAttrs({
                        'right-leg-hp': 5,
                        'left-leg-hp': 5,
                        'abdomen-hp': 6,
                        'chest-hp': 7,
                        'right-arm-hp': 4,
                        'left-arm-hp': 4,
                        'head-hp': 5,
                        'initHp': 0
                    });
                }
                setAttrs({
                    'right-leg-hp_max': 5,
                    'left-leg-hp_max': 5,
                    'abdomen-hp_max': 6,
                    'chest-hp_max': 7,
                    'right-arm-hp_max': 4,
                    'left-arm-hp_max': 4,
                    'head-hp_max': 5
                });
            } else if (resValue < 31) {
                if(valInitHp==1){
                    setAttrs({
                        'right-leg-hp': 6,
                        'left-leg-hp': 6,
                        'abdomen-hp': 7,
                        'chest-hp': 8,
                        'right-arm-hp': 5,
                        'left-arm-hp': 5,
                        'head-hp': 6,
                        'initHp': 0
                    });
                }
                setAttrs({
                    'right-leg-hp_max': 6,
                    'left-leg-hp_max': 6,
                    'abdomen-hp_max': 7,
                    'chest-hp_max': 8,
                    'right-arm-hp_max': 5,
                    'left-arm-hp_max': 5,
                    'head-hp_max': 6
                });
            } else if (resValue < 36) {
                if(valInitHp==1){
                    setAttrs({
                        'right-leg-hp': 7,
                        'left-leg-hp': 7,
                        'abdomen-hp': 8,
                        'chest-hp': 9,
                        'right-arm-hp': 6,
                        'left-arm-hp': 6,
                        'head-hp': 7,
                        'initHp': 0
                    });
                }
                setAttrs({
                    'right-leg-hp_max': 7,
                    'left-leg-hp_max': 7,
                    'abdomen-hp_max': 8,
                    'chest-hp_max': 9,
                    'right-arm-hp_max': 6,
                    'left-arm-hp_max': 6,
                    'head-hp_max': 7
                });
            } else if (resValue < 41) {
                if(valInitHp==1){
                    setAttrs({
                        'right-leg-hp': 8,
                        'left-leg-hp': 8,
                        'abdomen-hp': 9,
                        'chest-hp': 10,
                        'right-arm-hp': 7,
                        'left-arm-hp': 7,
                        'head-hp': 8,
                        'initHp': 0
                    });
                }
                setAttrs({
                    'right-leg-hp_max': 8,
                    'left-leg-hp_max': 8,
                    'abdomen-hp_max': 9,
                    'chest-hp_max': 10,
                    'right-arm-hp_max': 7,
                    'left-arm-hp_max': 7,
                    'head-hp_max': 8
                });
            } else{
                calValue=Math.round((resValue/5)-7)

                if(valInitHp==1){
                    setAttrs({
                        'right-leg-hp': 8+calValue,
                        'left-leg-hp': 8+calValue,
                        'abdomen-hp': 9+calValue,
                        'chest-hp': 10+calValue,
                        'right-arm-hp': 7+calValue,
                        'left-arm-hp': 7+calValue,
                        'head-hp': 8+calValue,
                        'initHp': 0
                    });
                }

                setAttrs({
                    'right-leg-hp_max': 8+calValue,
                    'left-leg-hp_max': 8+calValue,
                    'abdomen-hp_max': 9+calValue,
                    'chest-hp_max': 10+calValue,
                    'right-arm-hp_max': 7+calValue,
                    'left-arm-hp_max': 7+calValue,
                    'head-hp_max': 8+calValue
                });
            }
        });
    },
    // Calculate and update the damage modifier
    updateDamageModifier = function(eventInfo) {

        getAttrs(["str", "siz"], function (values) {

            var resValue = parseInt(values.str) + parseInt(values.siz);

            if (resValue < 6) {
                setAttrs({
                    'dmg-mod': "-1d8"
                });
            } else if (resValue < 11) {
                setAttrs({
                    'dmg-mod': "-1d6"
                });
            } else if (resValue < 16) {
                setAttrs({
                    'dmg-mod': "-1d4"
                });
            } else if (resValue < 21) {
                setAttrs({
                    'dmg-mod': "-1d2"
                });
            } else if (resValue < 26) {
                setAttrs({
                    'dmg-mod': "0"
                });
            } else if (resValue < 31) {
                setAttrs({
                    'dmg-mod': "1d2"
                });
            } else if (resValue < 36) {
                setAttrs({
                    'dmg-mod': "1d4"
                });
            } else if (resValue < 41) {
                setAttrs({
                    'dmg-mod': "1d6"
                });
            } else if (resValue < 46) {
                setAttrs({
                    'dmg-mod': "1d8"
                });
            } else if (resValue < 51) {
                setAttrs({
                    'dmg-mod': "1d10"
                });
            } else if (resValue < 61) {
                setAttrs({
                    'dmg-mod': "1d12"
                });
            } else if (resValue < 71) {
                setAttrs({
                    'dmg-mod': "2d6"
                });
            } else if (resValue < 81) {
                setAttrs({
                    'dmg-mod': "2d8"
                });
            } else if (resValue < 91) {
                setAttrs({
                    'dmg-mod': "2d10"
                });
            } else if (resValue < 101) {
                setAttrs({
                    'dmg-mod': "2d12"
                });
            } else if (resValue < 121) {
                setAttrs({
                    'dmg-mod': "3d10"
                });
            } else if (resValue < 141) {
                setAttrs({
                    'dmg-mod': "3d12"
                });
            } else if (resValue < 161) {
                setAttrs({
                    'dmg-mod': "4d10"
                });
            } else if (resValue < 181) {
                setAttrs({
                    'dmg-mod': "4d12"
                });
            } else {
                setAttrs({
                    'dmg-mod': "5d10"
                });
            }
        });
    },
    // Calculate and update the maximum encumbrance
    updateMaxEncumbrance = function(eventInfo) {

        getAttrs(["str", "siz"], function (values) {

            var resValue = parseInt(values.str) + parseInt(values.siz);

            setAttrs({
                'total-enc-overload': resValue,
                'total-enc_max': resValue*2
            });
        });

    },
    // Calculate and update all the basic skills
    updateBasicSkills = function(eventInfo) {

        getAttrs(["str", "con", "dex", "siz", "int", "pow", "cha"], function (values) {

            var strValue = parseInt(values.str);
            var conValue = parseInt(values.con);
            var dexValue = parseInt(values.dex);
            var sizValue = parseInt(values.siz);
            var intValue = parseInt(values.int);
            var powValue = parseInt(values.pow);
            var chaValue = parseInt(values.cha);

            setAttrs({
                'acrobatics-base': dexValue,
                'athletics-base': strValue+dexValue,
                'boating-base': strValue,
                'dodge-base': 10+dexValue-sizValue,
                'driving-base': 10+powValue,
                'evaluate-base': intValue,
                'first-aid-base': intValue,
                'influence-base': 10+chaValue,
                'lore-animal-base': intValue,
                'lore-plant-base': intValue,
                'lore-world-base': intValue,
                'perception-base': intValue+powValue,
                'persistence-base': 40+chaValue+powValue,
                'resilience-base': 40+conValue+powValue,
                'riding-base': dexValue+powValue,
                'sing-base': chaValue,
                'sleight-base': dexValue,
                'stealth-base': 10+dexValue-sizValue,
                'throwing-base': dexValue,
                'unarmed-base': strValue,
                'basic-close-combat-base':strValue+dexValue,
                'basic-ranged-base':dexValue
            });

        });

        HM_Skills.UpdateWeaponsAndAdvancedScore();

    },

    // Register All the events
    registerEventHandlers = function () {

        on("change:dex", TAS.callback( function updateDexterity (eventInfo) {

            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateCombatAction(eventInfo);
            updateStrikeRank(eventInfo);
            updateBasicSkills(eventInfo);
        }));


        on("change:int", TAS.callback( function updateIntelligence(eventInfo){
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateStrikeRank(eventInfo);
            updateBasicSkills(eventInfo);
        }));

        on("change:pow", TAS.callback( function updatePower(eventInfo){
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateFatePoints(eventInfo);
            updateBasicSkills(eventInfo);
        }));

        on("change:siz", TAS.callback( function updateSize(eventInfo){
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateHitPointLocations(eventInfo);
            updateDamageModifier(eventInfo);
            updateMaxEncumbrance(eventInfo);
            updateBasicSkills(eventInfo);
        }));

        on("change:con", TAS.callback( function updateConstitution(eventInfo){
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateHitPointLocations(eventInfo);
            updateBasicSkills(eventInfo);
        }));

        on("change:str", TAS.callback( function updateStrength(eventInfo){
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateDamageModifier(eventInfo);
            updateMaxEncumbrance(eventInfo);
            updateBasicSkills(eventInfo);
        }));

        on("change:cha", TAS.callback( function updateCharisma(eventInfo){
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateBasicSkills(eventInfo);
        }));

    };

    registerEventHandlers();

    TAS.log("HM_Characteristics loaded");

}());

var HM_Skills = HM_Skills || (function () {

    // Update the skills values when the armor change (based on Dexterity)
    var updateArmorSkills = function (eventInfo) {
            TAS.debug('updateArmorSkills');

            updateAcrobatics();
            updateAthletics();
            updateDodge();
            updateRiding();
            updateSleight();
            updateStealth();
            updateThrowing();
            updateCloseCombat();
            updateRangedCombat();
            updateWeaponsAndAdvancedScore();
        },
        // Calculate and update the final score for Acrobatics
        updateAcrobatics = function (eventInfo) {

            getAttrs(["acrobatics-base","acrobatics-mod","total_armor_penalty","useArmorPenalty"], function (values) {

                var acrobaticsBase = parseInt(values["acrobatics-base"]);
                var acrobaticsMod = parseInt(values["acrobatics-mod"]);
                var penaltyVal = parseInt(values["total_armor_penalty"]);
                var usePenalty = parseInt(values["useArmorPenalty"]);

                if(usePenalty==1){
                    if((acrobaticsMod+penaltyVal)>=0){
                        setAttrs({
                            'acrobatics': acrobaticsBase+acrobaticsMod+penaltyVal
                        });
                    }
                    else{
                        setAttrs({
                            'acrobatics': acrobaticsBase
                        });
                    }
                }
                else{
                    setAttrs({
                        'acrobatics': acrobaticsBase+acrobaticsMod
                    });
                }
            });

        },
        // Calculate and update the final score for Athletics
        updateAthletics = function (eventInfo) {
            getAttrs(["athletics-base","athletics-mod","total_armor_penalty","useArmorPenalty"], function (values) {

                var athleticsBase = parseInt(values["athletics-base"]);
                var athleticsMod = parseInt(values["athletics-mod"]);
                var penaltyVal = parseInt(values["total_armor_penalty"]);
                var usePenalty = parseInt(values["useArmorPenalty"]);

                if(usePenalty==1){
                    if((athleticsMod+penaltyVal)>=0){
                        setAttrs({
                            'athletics': athleticsBase+athleticsMod+penaltyVal
                        });
                    }
                    else{
                        setAttrs({
                            'athletics': athleticsBase
                        });
                    }
                }
                else{
                    setAttrs({
                        'athletics': athleticsBase+athleticsMod
                    });
                }
            });
        },
        // Calculate and update the final score for Boating
        updateBoating = function (eventInfo) {
            getAttrs(["boating-base","boating-mod"], function (values) {

                var boatingBase = parseInt(values["boating-base"]);
                var boatingMod = parseInt(values["boating-mod"]);

                setAttrs({
                    'boating': boatingBase+boatingMod
                });

            });
        },
        // Calculate and update the final score for Dodge
        updateDodge = function (eventInfo) {
            getAttrs(["dodge-base","dodge-mod","total_armor_penalty","useArmorPenalty"], function (values) {

                var dodgeBase = parseInt(values["dodge-base"]);
                var dodgeMod = parseInt(values["dodge-mod"]);
                var penaltyVal = parseInt(values["total_armor_penalty"]);
                var usePenalty = parseInt(values["useArmorPenalty"]);

                if(usePenalty==1){
                    if((dodgeMod+penaltyVal)>=0){
                        setAttrs({
                            'dodge': dodgeBase+dodgeMod+penaltyVal
                        });
                    }
                    else{
                        setAttrs({
                            'dodge': dodgeBase
                        });
                    }
                }
                else {
                    setAttrs({
                        'dodge': dodgeBase+dodgeMod
                    });
                }
            });
        },
        // Calculate and update the final score for Driving
        updateDriving = function (eventInfo) {
            getAttrs(["driving-base","driving-mod"], function (values) {

                var drivingBase = parseInt(values["driving-base"]);
                var drivingMod = parseInt(values["driving-mod"]);

                setAttrs({
                    'driving': drivingBase+drivingMod
                });

            });
        },
        // Calculate and update the final score for Evaluate
        updateEvaluate = function (eventInfo) {

            getAttrs(["evaluate-base","evaluate-mod"], function (values) {

                var evaluateBase = parseInt(values["evaluate-base"]);
                var evaluateMod = parseInt(values["evaluate-mod"]);

                setAttrs({
                    'evaluate': evaluateBase+evaluateMod
                });

            });

        },
        // Calculate and update the final score for Influence
        updateInfluence = function (eventInfo) {
            getAttrs(["influence-base","influence-mod"], function (values) {

                var influenceBase = parseInt(values["influence-base"]);
                var influenceMod = parseInt(values["influence-mod"]);

                setAttrs({
                    'influence': influenceBase+influenceMod
                });

            });
        },
        // Calculate and update the final score for First Aid
        updateFirstAid = function (eventInfo) {
            getAttrs(["first-aid-base","first-aid-mod"], function (values) {

                var firstAidBase = parseInt(values["first-aid-base"]);
                var firstAidMod = parseInt(values["first-aid-mod"]);

                setAttrs({
                    'first-aid': firstAidBase+firstAidMod
                });

            });
        },
        // Calculate and update the final score for Lore Animal
        updateLoreAnimal = function (eventInfo) {
            getAttrs(["lore-animal-base","lore-animal-mod"], function (values) {

                var loreAnimalBase = parseInt(values["lore-animal-base"]);
                var loreAnimalMod = parseInt(values["lore-animal-mod"]);

                setAttrs({
                    'lore-animal': loreAnimalBase+loreAnimalMod
                });

            });
        },
        // Calculate and update the final score for Lore Plant
        updateLorePlant = function (eventInfo) {
            getAttrs(["lore-plant-base","lore-plant-mod"], function (values) {

                var lorePlantBase = parseInt(values["lore-plant-base"]);
                var lorePlantMod = parseInt(values["lore-plant-mod"]);

                setAttrs({
                    'lore-plant': lorePlantBase+lorePlantMod
                });

            });
        },
        // Calculate and update the final score for Lore World
        updateLoreWorld = function (eventInfo) {
            getAttrs(["lore-world-base","lore-world-mod"], function (values) {

                var loreWorldBase = parseInt(values["lore-world-base"]);
                var loreWorldMod = parseInt(values["lore-world-mod"]);

                setAttrs({
                    'lore-world': loreWorldBase+loreWorldMod
                });

            });
        },
        // Calculate and update the final score for Perception
        updatePerception = function (eventInfo) {
                getAttrs(["perception-base","perception-mod"], function (values) {

                var perceptionBase = parseInt(values["perception-base"]);
                var perceptionMod = parseInt(values["perception-mod"]);

                setAttrs({
                    'perception': perceptionBase+perceptionMod
                });

            });
        },
        // Calculate and update the final score for Persistence
        updatePersistence = function (eventInfo) {
            getAttrs(["persistence-base","persistence-mod"], function (values) {

                var persistenceBase = parseInt(values["persistence-base"]);
                var persistenceMod = parseInt(values["persistence-mod"]);

                setAttrs({
                    'persistence': persistenceBase+persistenceMod
                });

            });
        },
        // Calculate and update the final score for Resilience
        updateResilience = function (eventInfo) {
            getAttrs(["resilience-base","resilience-mod"], function (values) {

                var resilienceBase = parseInt(values["resilience-base"]);
                var resilienceMod = parseInt(values["resilience-mod"]);

                setAttrs({
                    'resilience': resilienceBase+resilienceMod
                });

            });
        },
        // Calculate and update the final score for Riding
        updateRiding = function (eventInfo) {

            getAttrs(["riding-base","riding-mod","total_armor_penalty","useArmorPenalty"], function (values) {

                var ridingBase = parseInt(values["riding-base"]);
                var ridingMod = parseInt(values["riding-mod"]);
                var penaltyVal = parseInt(values["total_armor_penalty"]);
                var usePenalty = parseInt(values["useArmorPenalty"]);

                if(usePenalty==1){
                    if((ridingMod+penaltyVal)>=0){
                        setAttrs({
                            'riding': ridingBase+ridingMod+penaltyVal
                        });
                    }
                    else{
                        setAttrs({
                            'riding': ridingBase
                        });
                    }
                }
                else{
                    setAttrs({
                        'riding': ridingBase+ridingMod
                    });
                }
            });
        },
        // Calculate and update the final score for Sing
        updateSing = function (eventInfo){
            getAttrs(["sing-base","sing-mod"], function (values) {

                var singBase = parseInt(values["sing-base"]);
                var singMod = parseInt(values["sing-mod"]);

                setAttrs({
                    'sing': singBase+singMod
                });

            });
        },
        // Calculate and update the final score for Sleight
        updateSleight = function (eventInfo) {
            getAttrs(["sleight-base","sleight-mod","total_armor_penalty","useArmorPenalty"], function (values) {

                var sleightBase = parseInt(values["sleight-base"]);
                var sleightMod = parseInt(values["sleight-mod"]);
                var penaltyVal = parseInt(values["total_armor_penalty"]);
                var usePenalty = parseInt(values["useArmorPenalty"]);

                if(usePenalty==1){
                    if((sleightMod+penaltyVal)>=0){
                        setAttrs({
                            'sleight': sleightBase+sleightMod+penaltyVal
                        });
                    }
                    else{
                        setAttrs({
                            'sleight': sleightBase
                        });
                    }
                }
                else{
                    setAttrs({
                        'sleight': sleightBase+sleightMod
                    });
                }
            });
        },
        // Calculate and update the final score for Stealth
        updateStealth = function (eventInfo) {
            getAttrs(["stealth-base","stealth-mod","total_armor_penalty","useArmorPenalty"], function (values) {

                var stealthBase = parseInt(values["stealth-base"]);
                var stealthMod = parseInt(values["stealth-mod"]);
                var penaltyVal = parseInt(values["total_armor_penalty"]);
                var usePenalty = parseInt(values["useArmorPenalty"]);

                if(usePenalty==1){
                    if((stealthMod+penaltyVal)>=0){
                        setAttrs({
                            'stealth': stealthBase+stealthMod+penaltyVal
                        });
                    }
                    else{
                        setAttrs({
                            'stealth': stealthBase
                        });
                    }
                }
                else{
                    setAttrs({
                        'stealth': stealthBase+stealthMod
                    });
                }
            });
        },
        // Calculate and update the final score for Throwing
        updateThrowing = function (eventInfo) {
            getAttrs(["throwing-base","throwing-mod","total_armor_penalty","useArmorPenalty"], function (values) {

            var throwingBase = parseInt(values["throwing-base"]);
            var throwingMod = parseInt(values["throwing-mod"]);
            var penaltyVal = parseInt(values["total_armor_penalty"]);
            var usePenalty = parseInt(values["useArmorPenalty"]);

            if(usePenalty==1){
                if((throwingMod+penaltyVal)>=0){
                    setAttrs({
                        'throwing': throwingBase+throwingMod+penaltyVal
                    });
                }
                else{
                    setAttrs({
                        'throwing': throwingBase
                    });
                }
            }
            else{
                setAttrs({
                    'throwing': throwingBase+throwingMod
                });
            }
        });
        },
        // Calculate and update the final score for Unarmed
        updateUnarmed = function (eventInfo) {
            getAttrs(["unarmed-base","unarmed-mod"], function (values) {

                var unarmedBase = parseInt(values["unarmed-base"]);
                var unarmedMod = parseInt(values["unarmed-mod"]);

                setAttrs({
                    'unarmed': unarmedBase+unarmedMod
                });

            });
        },
        // Calculate and update the final score for Close Combat
        updateCloseCombat = function (eventInfo){
            getAttrs(["basic-close-combat-base","basic-close-combat-mod","total_armor_penalty","useArmorPenalty"], function (values) {

                var basicCloseCombatBase = parseInt(values["basic-close-combat-base"]);
                var basicCloseCombatMod = parseInt(values["basic-close-combat-mod"]);
                var penaltyVal = parseInt(values["total_armor_penalty"]);
                var usePenalty = parseInt(values["useArmorPenalty"]);

                if(usePenalty==1){
                    if((basicCloseCombatMod+penaltyVal)>=0){
                        setAttrs({
                            'basic-close-combat': basicCloseCombatBase+basicCloseCombatMod+penaltyVal
                        });
                    }
                    else{
                        setAttrs({
                            'basic-close-combat': basicCloseCombatBase
                        });
                    }
                }
                else{
                    setAttrs({
                        'basic-close-combat': basicCloseCombatBase+basicCloseCombatMod
                    });
                }
            });
        },
        // Calculate and update the final score for Ranged Combat
        updateRangedCombat = function (eventInfo) {
            getAttrs(["basic-ranged-base","basic-ranged-mod","total_armor_penalty","useArmorPenalty"], function (values) {

                var basicRangedBase = parseInt(values["basic-ranged-base"]);
                var basicRangedMod = parseInt(values["basic-ranged-mod"]);
                var penaltyVal = parseInt(values["total_armor_penalty"]);
                var usePenalty = parseInt(values["useArmorPenalty"]);

                if(usePenalty==1){
                    if((basicRangedMod+penaltyVal)>=0){
                        setAttrs({
                            'basic-ranged': basicRangedBase+basicRangedMod+penaltyVal
                        });
                    }
                    else{
                        setAttrs({
                            'basic-ranged': basicRangedBase
                        });
                    }
                }
                else{
                    setAttrs({
                        'basic-ranged': basicRangedBase+basicRangedMod
                    });
                }
            });
        },
        // Calculate and update the final score for Weapons Skills
        updateWeapons = function (eventInfo) {
            getAttrs([
                "repeating_weaponskills_weaponSkillName",
                "repeating_weaponskills_weaponSkillChar1",
                "repeating_weaponskills_weaponSkillChar2",
                "repeating_weaponskills_weaponSkillMod",
                "total_armor_penalty",
                "useArmorPenalty",
                "str",
                "con",
                "dex",
                "siz",
                "int",
                "pow",
                "cha"
                ], function (values) {

                var modVal=parseInt(values.repeating_weaponskills_weaponSkillMod);
                var penaltyVal=parseInt(values.total_armor_penalty);

                var usePenalty = parseInt(values["useArmorPenalty"]);

                var charVal1=parseInt(values[values.repeating_weaponskills_weaponSkillChar1])||0;
                var charVal2=parseInt(values[values.repeating_weaponskills_weaponSkillChar2])||0;

                var baseVal= charVal1 + charVal2;

                var scoreVal= 0;

                if(usePenalty==1){
                    if((modVal + penaltyVal)>=0){
                        scoreVal= baseVal + modVal + penaltyVal;
                    }
                    else{
                        scoreVal= baseVal;
                    }
                }
                else{
                    scoreVal= baseVal + modVal;
                }

                setAttrs({
                    'repeating_weaponskills_weaponSkillBase': baseVal,
                    'repeating_weaponskills_weaponSkill':scoreVal
                });

                TAS.repeating('close-combat-weapons')
                    .fields('close-combat-weapon-skill','close-combat-weapon-skill-score')
                    .each(function(f){

                        if(values['repeating_weaponskills_weaponSkillName']==f['close-combat-weapon-skill']) {
                            f['close-combat-weapon-skill-score']=scoreVal
                        }

                    })
                    .execute();

                TAS.repeating('ranged-weapons')
                    .fields('ranged-weapon-skill','ranged-weapon-skill-score')
                    .each(function(f){

                        if(values['repeating_weaponskills_weaponSkillName']==f['ranged-weapon-skill']) {
                            f['ranged-weapon-skill-score']=scoreVal
                        }

                    })
                    .execute();

            });
        },
        // Calculate and update the final score for Advanced Skills
        updateAdvanced = function (eventInfo) {
            getAttrs([
                "repeating_advancedskills_advancedSkillChar1",
                "repeating_advancedskills_advancedSkillChar2",
                "repeating_advancedskills_advancedSkillMod",
                "total_armor_penalty",
                "useArmorPenalty",
                "str",
                "con",
                "dex",
                "siz",
                "int",
                "pow",
                "cha"
                ], function (values) {

                var modVal=parseInt(values.repeating_advancedskills_advancedSkillMod);
                var penaltyVal=parseInt(values.total_armor_penalty);

                var usePenalty = parseInt(values["useArmorPenalty"]);

                var charVal1=parseInt(values[values.repeating_advancedskills_advancedSkillChar1])||0;
                var charVal2=parseInt(values[values.repeating_advancedskills_advancedSkillChar2])||0;

                var baseVal= charVal1 + charVal2;

                var scoreVal= 0;

                if(usePenalty==1){
                    if((modVal + penaltyVal)>=0){
                        scoreVal= baseVal + modVal + penaltyVal;
                    }
                    else{
                        scoreVal= baseVal;
                    }
                }
                else{
                    scoreVal= baseVal + modVal;
                }


                setAttrs({
                    'repeating_advancedskills_advancedSkillBase': baseVal,
                    'repeating_advancedskills_advancedSkill':scoreVal
                });

            });
        },
        // Calculate and update the skills score
        updateWeaponsAndAdvancedScore = function (eventInfo) {

            TAS.repeating('advancedSkills')
                .attrs('str','con','dex','siz','int','pow','cha','total_armor_penalty','useArmorPenalty')
                .fields('advancedSkillChar1','advancedSkillChar2','advancedSkillMod','advancedSkillBase','advancedSkill')
                .each(function(r,f){
                    var charVal1=f.I[r.advancedSkillChar1]||0;
                    var charVal2=f.I[r.advancedSkillChar2]||0;

                    var modVal=r.I.advancedSkillMod;

                    var penaltyVal=0;

                    var usePenalty=f.I['useArmorPenalty'];

                    if(r.advancedSkillChar1=='dex' || r.advancedSkillChar2=='dex')
                        penaltyVal=f.I['total_armor_penalty'];

                    var baseVal= charVal1 + charVal2;

                    var scoreVal= 0;

                    if(usePenalty==1){
                        if((modVal + penaltyVal)>=0){
                            scoreVal= baseVal + modVal + penaltyVal;
                        }
                        else{
                            scoreVal= baseVal;
                        }
                    }
                    else{
                        scoreVal= baseVal + modVal;
                    }

                    r.advancedSkillBase=baseVal;
                    r.advancedSkill=scoreVal;
                })
                .execute();

            TAS.repeating('weaponskills')
                .attrs('str','con','dex','siz','int','pow','cha','total_armor_penalty','useArmorPenalty')
                .fields('weaponskillChar1','weaponskillChar2','weaponskillMod','weaponskillBase','weaponskill')
                .each(function(r,f){
                    var charVal1=f.I[r.weaponskillChar1]||0;
                    var charVal2=f.I[r.weaponskillChar2]||0;

                    var modVal=r.I.weaponskillMod;

                    var penaltyVal=0;

                    var usePenalty=f.I['useArmorPenalty'];

                    if(r.weaponskillChar1=='dex' || r.weaponskillChar2=='dex')
                        penaltyVal=f.I['total_armor_penalty'];

                    var baseVal= charVal1 + charVal2;

                    var scoreVal= 0;

                    if(usePenalty==1){
                        if((modVal + penaltyVal)>=0){
                            scoreVal= baseVal + modVal + penaltyVal;
                        }
                        else{
                            scoreVal= baseVal;
                        }
                    }
                    else{
                        scoreVal= baseVal + modVal;
                    }

                    r.weaponskillBase=baseVal;
                    r.weaponskill=scoreVal;
                })
                .execute();
            HM_Weapons.UpdateCloseAndRangedCombatSkillScore();
        },

        // Register all the events related to the Skills
        registerEventHandlers = function () {

            on("change:acrobatics-base change:acrobatics-mod", TAS.callback( function updateAcrobaticsValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateAcrobatics(eventInfo);
            }));
            on("change:athletics-base change:athletics-mod", TAS.callback( function updateAthleticsValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateAthletics(eventInfo);
            }));
            on("change:boating-base change:boating-mod", TAS.callback( function updateBoatingValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateBoating(eventInfo);
            }));
            on("change:dodge-base change:dodge-mod", TAS.callback( function updateDodgeValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateDodge(eventInfo);
            }));
            on("change:driving-base change:driving-mod", TAS.callback( function updateDrivingValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateDriving(eventInfo);
            }));
            on("change:evaluate-base change:evaluate-mod", TAS.callback( function updateEvaluateValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateEvaluate(eventInfo);
            }));
            on("change:influence-base change:influence-mod", TAS.callback( function updateInfluenceValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateInfluence(eventInfo);
            }));
            on("change:first-aid-base change:first-aid-mod", TAS.callback( function updateFirstAidValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateFirstAid(eventInfo);
            }));
            on("change:lore-animal-base change:lore-animal-mod", TAS.callback( function updateLoreAnimalValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateLoreAnimal(eventInfo);
            }));
            on("change:lore-plant-base change:lore-plant-mod", TAS.callback( function updateLorePlantValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateLorePlant(eventInfo);
            }));
            on("change:lore-world-base change:lore-world-mod", TAS.callback( function updateLoreWorldValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateLoreWorld(eventInfo);
            }));
            on("change:perception-base change:perception-mod", TAS.callback( function updatePerceptionValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updatePerception(eventInfo);
            }));
            on("change:persistence-base change:persistence-mod", TAS.callback( function updatePersistenceValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updatePersistence(eventInfo);
            }));
            on("change:resilience-base change:resilience-mod", TAS.callback( function updateResilienceValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateResilience(eventInfo);
            }));
            on("change:riding-base change:riding-mod", TAS.callback( function updateRidingValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateRiding(eventInfo);
            }));
            on("change:sing-base change:sing-mod", TAS.callback( function updateSingValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateSing(eventInfo);
            }));
            on("change:sleight-base change:sleight-mod", TAS.callback( function updateSleightValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateSleight(eventInfo);
            }));
            on("change:stealth-base change:stealth-mod", TAS.callback( function updateStealthValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateStealth(eventInfo);
            }));
            on("change:throwing-base change:throwing-mod", TAS.callback( function updateThrowingValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateThrowing(eventInfo);
            }));
            on("change:unarmed-base change:unarmed-mod", TAS.callback( function updateUnarmedValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateUnarmed(eventInfo);
            }));

            on("change:basic-close-combat-base change:basic-close-combat-mod", TAS.callback( function updateCloseCombatValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateCloseCombat(eventInfo);
            }));
            on("change:basic-ranged-base change:basic-ranged-mod", TAS.callback( function updateRangedCombatValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateRangedCombat(eventInfo);
            }));

            on("change:repeating_weaponskills:weaponSkillChar1 change:repeating_weaponskills:weaponSkillChar2 change:repeating_weaponskills:weaponSkillMod", TAS.callback( function updateWeaponsValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateWeapons(eventInfo);
            }));
            on("change:repeating_advancedskills:advancedSkillChar1 change:repeating_advancedskills:advancedSkillChar2 change:repeating_advancedskills:advancedSkillMod", TAS.callback( function updateAdvancedValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateAdvanced(eventInfo);
            }));

        };

    registerEventHandlers();

    TAS.log('HM_Skills loaded');

    return {
        UpdateArmorSkills: updateArmorSkills,
        UpdateWeaponsAndAdvancedScore: updateWeaponsAndAdvancedScore
    };

}());

var HM_Armors = HM_Armors || (function () {

    // Update the skills values when the armor change (based on Dexterity)
    var updateSkills = function (eventInfo) {
        HM_Skills.UpdateArmorSkills();
    },
        updateArmorPenalty = function (eventInfo) {
            TAS.repeatingSimpleSum('armors','armor-penalty','total_armor_penalty');
        },

        registerEventHandlers = function () {

            on("change:total_armor_penalty change:usearmorpenalty", TAS.callback( function updateArmorsValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateSkills(eventInfo);
            }));
            on("change:repeating_armors:armor-penalty", TAS.callback( function updateArmorPenaltyValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateArmorPenalty(eventInfo);
            }));
            on("remove:repeating_armors", TAS.callback( function removeArmorPenaltyValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateArmorPenalty(eventInfo);
            }));

        };

    registerEventHandlers();

    TAS.log('HM_Armors loaded');

}());

var HM_Equipments = HM_Equipments || (function () {

    var updateTotalEncumbrance = function (eventInfo) {
        getAttrs(["total_enc_armors","total_enc_close_weapons","total_enc_ranged_weapons","total_enc_items"], function (values) {

            var armorsVal=parseInt(values.total_enc_armors);
            var closeWeaponsVal=parseInt(values.total_enc_close_weapons);
            var rangedWeaponsVal=parseInt(values.total_enc_ranged_weapons);
            var itemsVal=parseInt(values.total_enc_items);

            setAttrs({
                'total-enc': armorsVal+closeWeaponsVal+rangedWeaponsVal+itemsVal
            });

        });
    },
    updateEncumbrance = function (eventInfo) {
        TAS.repeatingSimpleSum('armors','armor-enc','total_enc_armors');
        TAS.repeatingSimpleSum('close-combat-weapons','close-combat-weapon-enc','total_enc_close_weapons');
        TAS.repeatingSimpleSum('ranged-weapons','ranged-weapon-enc','total_enc_ranged_weapons');

        TAS.repeating('equipments')
            .attrs('total_enc_items')
            .fields('item-enc','item-number')
            .reduce(function(memo,row,attrSet,id,rowSet){
                memo.push(row.I["item-enc"]*row.I["item-number"]);
                return memo;
            },[], function(memo,rowSet,attrSet){
                var count = 0;
                   for(var i=0, n=memo.length; i < n; i++)
                   {
                      count += memo[i];
                   }
                attrSet["total_enc_items"]=count;
            })
            .execute();
    },

    registerEventHandlers = function () {

        on("change:total_enc_armors change:total_enc_close_weapons change:total_enc_ranged_weapons change:total_enc_items", TAS.callback( function updateTotalEncumbranceValue(eventInfo){
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateTotalEncumbrance(eventInfo);
        }));
        on("change:repeating_equipments:item-enc change:repeating_equipments:item-number change:repeating_armors:armor-enc change:repeating_close-combat-weapons:close-combat-weapon-enc change:repeating_ranged-weapons:ranged-weapon-enc", TAS.callback( function updateEncumbranceValue(eventInfo){
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateEncumbrance(eventInfo);
        }));
        on("remove:repeating_equipments remove:repeating_armors remove:repeating_close-combat-weapons remove:repeating_ranged-weapons", TAS.callback( function removeEncumbranceValue(eventInfo){
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateEncumbrance(eventInfo);
        }));

    };

    registerEventHandlers();

    TAS.log('HM_Equipments loaded');

}());

var HM_Weapons = HM_Weapons || ( function () {

    var updateCloseCombatMaxDamages = function (eventInfo){
        getAttrs(["repeating_close-combat-weapons_close-combat-weapon-damage","dmg-mod"], function (values) {

            var weaponDamage=values["repeating_close-combat-weapons_close-combat-weapon-damage"].split("+");
            var dmgMod=values["dmg-mod"];

            var result=0;

            for(var i=0;i < weaponDamage.length;i++){
                var value=weaponDamage[i].trim();

                if(value.indexOf("d") !== -1){
                    result+=parseInt(value.split("d")[1]);
                }
                else{
                    result+=parseInt(value);
                }
            }

            if(dmgMod.indexOf("d") !== -1){
                var maxMod=parseInt(dmgMod.split("d")[1]);
                if(dmgMod.startsWith("-")){
                    result-=maxMod;
                }
                else{
                    result+=maxMod;
                }
            }
            else{
                if(dmgMod.startsWith("-")){
                    result-=parseInt(dmgMod);
                }
                else{
                    result+=parseInt(dmgMod);
                }
            }

            setAttrs({
                'repeating_close-combat-weapons_max_damages':result
            });
        });
    },
        updateRangedCombatMaxDamages = function (eventInfo) {
            getAttrs(["repeating_ranged-weapons_ranged-weapon-damage","repeating_ranged-weapons_ranged-weapon-damage-mod","dmg-mod"], function (values) {

                var weaponDamage=values["repeating_ranged-weapons_ranged-weapon-damage"].split("+");
                var damageMod=values["repeating_ranged-weapons_ranged-weapon-damage-mod"];
                var dmgMod=values["dmg-mod"];

                var result=0;

                for(var i=0;i < weaponDamage.length;i++){
                    var value=weaponDamage[i].trim();

                    if(value.indexOf("d") !== -1){
                        result+=parseInt(value.split("d")[1]);
                    }
                    else{
                        result+=parseInt(value);
                    }
                }

                var modFinal='[['+dmgMod+']]';

                if(damageMod=="half"){
                    var modVal=0
                    if(dmgMod.indexOf("d") !== -1){
                        modVal = parseInt(dmgMod.split("d")[1]);
                    }
                    else{
                        modVal = parseInt(dmgMod);
                    }

                    if(dmgMod.startsWith("-")){
                        result-=Math.ceil(modVal/2);

                        modFinal='-ceil([['+dmgMod.substr(1)+']]/2)';
                    }
                    else{
                        result+=Math.ceil(modVal/2);

                        modFinal='ceil([['+dmgMod+'}]]/2)';
                    }

                }
                else if(damageMod=="full"){

                    if(dmgMod.indexOf("d") !== -1){

                        if(dmgMod.startsWith("-")){
                            result-=parseInt(dmgMod.split("d")[1]);
                        }
                        else{
                            result+=parseInt(dmgMod.split("d")[1]);
                        }
                    }
                    else{

                        if(dmgMod.startsWith("-")){
                            result-=parseInt(dmgMod);
                        }
                        else{
                            result+=parseInt(dmgMod);
                        }
                    }
                }
                else{
                    modFinal='0';
                }

                setAttrs({
                    'repeating_ranged-weapons_max_damages':result,
                    'repeating_ranged-weapons_damage_mod':modFinal
                });
            });
        },
        updateCloseCombatSkillScore = function (eventInfo) {
            getAttrs(["repeating_close-combat-weapons_close-combat-weapon-skill"], function (values) {

                var skillName=values["repeating_close-combat-weapons_close-combat-weapon-skill"];
                var result=0;

                TAS.repeating('weaponskills')
                    .fields('weaponSkillName','weaponSkill')
                    .each(function(f){

                        if(skillName==f['weaponSkillName']) {
                            result=f.I['weaponSkill'];
                        }

                        setAttrs({
                            'repeating_close-combat-weapons_close-combat-weapon-skill-score':result
                        });
                    })
                    .execute();
            });
        },
        updateRangedCombatSkillScore = function (eventInfo) {
            getAttrs(["repeating_ranged-weapons_ranged-weapon-skill"], function (values) {

                var skillName=values["repeating_ranged-weapons_ranged-weapon-skill"];
                var result=0;

                TAS.repeating('weaponskills')
                    .fields('weaponSkillName','weaponSkill')
                    .each(function(f){

                        if(skillName==f['weaponSkillName']) {
                            result=f.I['weaponSkill'];
                        }

                        setAttrs({
                            'repeating_ranged-weapons_ranged-weapon-skill-score':result
                        });
                    })
                    .execute();
            });
        },
        updateCloseAndRangedCombatSkillScore = function (eventInfo) {

            TAS.repeating('close-combat-weapons')
                .fields("close-combat-weapon-skill","close-combat-weapon-skill-score")
                .each(function(w){

                    var skillName = w["close-combat-weapon-skill"];

                    TAS.repeating('weaponskills')
                        .fields('weaponSkillName','weaponSkill')
                        .each(function(f){

                            if(skillName==f['weaponSkillName']) {
                                w["close-combat-weapon-skill-score"]=f.I['weaponSkill'];
                            }

                        })
                        .execute();

                })
                .execute();

            TAS.repeating('ranged-weapons')
                .fields("ranged-weapon-skill","ranged-weapon-skill-score")
                .each(function(w){

                    var skillName = w["ranged-weapon-skill"];

                    TAS.repeating('weaponskills')
                        .fields('weaponSkillName','weaponSkill')
                        .each(function(f){

                            if(skillName==f['weaponSkillName']) {
                                w["ranged-weapon-skill-score"]=f.I['weaponSkill'];
                            }

                        })
                        .execute();

                })
                .execute();

        },

        registerEventHandlers = function () {

            on("change:repeating_close-combat-weapons:close-combat-weapon-damage", TAS.callback( function updateCloseCombatMaxDamagesValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateCloseCombatMaxDamages(eventInfo);
            }));
            on("change:repeating_ranged-weapons:ranged-weapon-damage change:repeating_ranged-weapons:ranged-weapon-damage-mod", TAS.callback( function updateRangedCombatMaxDamagesValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateRangedCombatMaxDamages(eventInfo);
            }));

            on("change:repeating_close-combat-weapons:close-combat-weapon-skill", TAS.callback( function updateCloseCombatSkillScoreValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateCloseCombatSkillScore(eventInfo);
            }));
            on("change:repeating_ranged-weapons:ranged-weapon-skill", TAS.callback( function updateRangedCombatSkillScoreValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateRangedCombatSkillScore(eventInfo);
            }));

        };

    registerEventHandlers();

    TAS.log('HM_Weapons loaded');

    return {
        UpdateCloseAndRangedCombatSkillScore: updateCloseAndRangedCombatSkillScore
    };

} ());


/**  Mount  **/

var HM_Mount_Characteristics = HM_Mount_Characteristics || (function () {

    var updateCombatAction = function (eventInfo) {

        getAttrs(["mount-dex"], function (values) {

            var resValue = parseInt(values["mount-dex"]);

            if (resValue < 7) {
                setAttrs({
                    'mount-ca': 1
                });
            } else if (resValue < 13) {
                setAttrs({
                    'mount-ca': 2
                });
            } else if (resValue < 19) {
                setAttrs({
                    'mount-ca': 3
                });
            } else{
                setAttrs({
                    'mount-ca': 4
                });
            }
        });

    },
        updateStrikeRank = function (eventInfo) {

            getAttrs(["mount-dex", "mount-int"], function (values) {

                var resValue = parseInt(values["mount-dex"])+parseInt(values["mount-int"]);
                var result = Math.ceil(resValue/2);

                setAttrs({
                    'mount-sr': result
                });
            });

        },
        updateMaxEncumbrance = function (eventInfo){
            getAttrs(["mount-str", "mount-siz"], function (values) {

                var resValue = parseInt(values["mount-str"]) + parseInt(values["mount-siz"]);

                setAttrs({
                    'mount_total-enc-overload': resValue,
                    'mount_total-enc_max': resValue*2
                });

            });
        },
        updateDamageModifier = function(eventInfo) {

            getAttrs(["mount-str", "mount-siz"], function (values) {

                var resValue = parseInt(values["mount-str"]) + parseInt(values["mount-siz"]);

                if (resValue < 6) {
                    setAttrs({
                        'mount-dmg-mod': "-1d8"
                    });
                } else if (resValue < 11) {
                    setAttrs({
                        'mount-dmg-mod': "-1d6"
                    });
                } else if (resValue < 16) {
                    setAttrs({
                        'mount-dmg-mod': "-1d4"
                    });
                } else if (resValue < 21) {
                    setAttrs({
                        'mount-dmg-mod': "-1d2"
                    });
                } else if (resValue < 26) {
                    setAttrs({
                        'mount-dmg-mod': "0"
                    });
                } else if (resValue < 31) {
                    setAttrs({
                        'mount-dmg-mod': "1d2"
                    });
                } else if (resValue < 36) {
                    setAttrs({
                        'mount-dmg-mod': "1d4"
                    });
                } else if (resValue < 41) {
                    setAttrs({
                        'mount-dmg-mod': "1d6"
                    });
                } else if (resValue < 46) {
                    setAttrs({
                        'mount-dmg-mod': "1d8"
                    });
                } else if (resValue < 51) {
                    setAttrs({
                        'mount-dmg-mod': "1d10"
                    });
                } else if (resValue < 61) {
                    setAttrs({
                        'mount-dmg-mod': "1d12"
                    });
                } else if (resValue < 71) {
                    setAttrs({
                        'mount-dmg-mod': "2d6"
                    });
                } else if (resValue < 81) {
                    setAttrs({
                        'mount-dmg-mod': "2d8"
                    });
                } else if (resValue < 91) {
                    setAttrs({
                        'mount-dmg-mod': "2d10"
                    });
                } else if (resValue < 101) {
                    setAttrs({
                        'mount-dmg-mod': "2d12"
                    });
                } else if (resValue < 121) {
                    setAttrs({
                        'mount-dmg-mod': "3d10"
                    });
                } else if (resValue < 141) {
                    setAttrs({
                        'mount-dmg-mod': "3d12"
                    });
                } else if (resValue < 161) {
                    setAttrs({
                        'mount-dmg-mod': "4d10"
                    });
                } else if (resValue < 181) {
                    setAttrs({
                        'mount-dmg-mod': "4d12"
                    });
                } else {
                    setAttrs({
                        'mount-dmg-mod': "5d10"
                    });
                }
            });
        },
        updateSkills = function (eventInfo) {
            TAS.repeating('mountskills')
                .attrs('mount-str','mount-con','mount-dex','mount-siz','mount-int','mount-pow','mount-cha')
                .fields('mountskillChar1','mountskillChar2','mountskillMod','mountskillBase','mountskill')
                .each(function(r,f){
                    var charVal1=f.I[r.mountskillChar1]||0;
                    var charVal2=f.I[r.mountskillChar2]||0;

                    r.mountskillBase=charVal1 + charVal2;
                    r.mountskill=charVal1 + charVal2 + r.I.mountskillMod;
                })
                .execute();
        },

        registerEventHandlers = function () {

            on("change:mount-dex", TAS.callback( function updateMountDexterity (eventInfo) {

                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateCombatAction(eventInfo);
                updateStrikeRank(eventInfo);
                updateSkills(eventInfo);
            }));
            on("change:mount-int", TAS.callback( function updateMountIntelligence (eventInfo) {

                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateStrikeRank(eventInfo);
                updateSkills(eventInfo);
            }));
            on("change:mount-str", TAS.callback( function updateMountStrength (eventInfo) {

                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateMaxEncumbrance(eventInfo);
                updateSkills(eventInfo);
                updateDamageModifier(eventInfo);
            }));
            on("change:mount-siz", TAS.callback( function updateMountSize (eventInfo) {

                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateMaxEncumbrance(eventInfo);
                updateSkills(eventInfo);
                updateDamageModifier(eventInfo);
            }));
            on("change:mount-con", TAS.callback( function updateMountConstitution (eventInfo) {

                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateSkills(eventInfo);
            }));
            on("change:mount-pow", TAS.callback( function updateMountPower (eventInfo) {

                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateSkills(eventInfo);
            }));
            on("change:mount-cha", TAS.callback( function updateMountCharisma (eventInfo) {

                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateSkills(eventInfo);
            }));

        };

    registerEventHandlers();

    TAS.log('HM_Mount_Characteristics loaded');

}());

var HM_Mount_Skills = HM_Mount_Skills || (function () {

    var updateSkills = function (eventInfo) {
            getAttrs([
                "repeating_mountskills_mountskillname",
                "repeating_mountskills_mountskillchar1",
                "repeating_mountskills_mountskillchar2",
                "repeating_mountskills_mountskillmod",
                "mount_total_armor_penalty",
                "useArmorPenalty",
                "mount-str",
                "mount-con",
                "mount-dex",
                "mount-siz",
                "mount-int",
                "mount-pow",
                "mount-cha"
                ], function (values) {

                    var modVal=parseInt(values.repeating_mountskills_mountskillmod);

                    var usePenalty = parseInt(values["useArmorPenalty"]);

                    var charVal1=parseInt(values[values.repeating_mountskills_mountskillchar1])||0;
                    var charVal2=parseInt(values[values.repeating_mountskills_mountskillchar2])||0;

                    var baseVal= charVal1 + charVal2;

                    var scoreVal= 0;
                    var penaltyVal=0;

                    if(r.weaponskillChar1=='dex' || r.weaponskillChar2=='dex')
                        penaltyVal=parseInt(values.mount_total_armor_penalty);

                    if(usePenalty==1){
                        if((modVal + penaltyVal)>=0){
                            scoreVal= baseVal + modVal + penaltyVal;
                        }
                        else{
                            scoreVal= baseVal;
                        }
                    }
                    else{
                        scoreVal= baseVal + modVal;
                    }

                    setAttrs({
                        'repeating_mountskills_mountskillbase': baseVal,
                        'repeating_mountskills_mountskill':scoreVal
                    });

                    TAS.repeating('mount-close-combat-weapons')
                        .fields('close-combat-weapon-skill','close-combat-weapon-skill-score')
                        .each(function(f){

                            if(values['repeating_mountskills_mountskillname']==f['close-combat-weapon-skill']) {
                                f['close-combat-weapon-skill-score']=scoreVal
                            }

                        })
                        .execute();

                    TAS.repeating('mount-ranged-weapons')
                        .fields('ranged-weapon-skill','ranged-weapon-skill-score')
                        .each(function(f){

                            if(values['repeating_mountskills_mountskillname']==f['ranged-weapon-skill']) {
                                f['ranged-weapon-skill-score']=scoreVal
                            }

                        })
                        .execute();

            });


            HM_Mount_Weapons.UpdateCloseAndRangedCombatSkillScore();
        },

        registerEventHandlers = function () {
            on("change:repeating_mountskills:mountskillchar1 change:repeating_mountskills:mountskillchar2 change:repeating_mountskills:mountskillmod", TAS.callback( function updateSkillsValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateSkills(eventInfo);
            }));
        };

    registerEventHandlers();

    TAS.log('HM_Mount_Skills loaded');

}());

var HM_Mount_Armors = HM_Mount_Armors || (function () {

    var updateSkills = function (eventInfo) {

            TAS.repeating('mountSkills')
                .attrs('mount-str','con','mount-dex','mount-siz','mount-int','mount-pow','mount-cha','mount_total_armor_penalty','useArmorPenalty')
                .fields('mountSkillChar1','mountSkillChar2','mountSkillMod','mountSkillBase','mountSkill')
                .each(function(r,f){
                    var charVal1=f.I[r.mountSkillChar1]||0;
                    var charVal2=f.I[r.mountSkillChar2]||0;

                    var modVal=r.I.mountSkillMod;

                    var penaltyVal=0;

                    var usePenalty=f.I['useArmorPenalty'];

                    if(r.mountSkillChar1=='mount-dex' || r.mountSkillChar2=='mount-dex')
                        penaltyVal=f.I['mount_total_armor_penalty'];

                    var baseVal= charVal1 + charVal2;

                    var scoreVal= 0;

                    if(usePenalty==1){
                        if((modVal + penaltyVal)>=0){
                            scoreVal= baseVal + modVal + penaltyVal;
                        }
                        else{
                            scoreVal= baseVal;
                        }
                    }
                    else{
                        scoreVal= baseVal + modVal;
                    }

                    r.mountSkillBase=baseVal;
                    r.mountSkill=scoreVal;
                })
                .execute();
            HM_Mount_Weapons.UpdateCloseAndRangedCombatSkillScore();
        },
        updateArmorPenalty = function (eventInfo) {
            TAS.repeatingSimpleSum('mount-armors','armor-penalty','mount_total_armor_penalty');
        },

        registerEventHandlers = function () {
            on("change:mount_total_armor_penalty change:usearmorpenalty", TAS.callback( function updateArmorsValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateSkills(eventInfo);
            }));
            on("change:repeating_mount-armors:armor-penalty", TAS.callback( function updateArmorPenaltyValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateArmorPenalty(eventInfo);
            }));
            on("remove:repeating_mount-armors", TAS.callback( function removeArmorPenaltyValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateArmorPenalty(eventInfo);
            }));
        };

    registerEventHandlers();

    TAS.log('HM_Mount_Armors loaded');

}());

var HM_Mount_Equipments = HM_Mount_Equipments || (function () {

    var updateTotalEncumbrance = function () {
            getAttrs(["mount_total_enc_close_weapons","mount_total_enc_ranged_weapons","mount_total_enc_items","mount_total_enc_armors"], function (values) {

                var closeWeaponsVal=parseInt(values.mount_total_enc_close_weapons);
                var rangedWeaponsVal=parseInt(values.mount_total_enc_ranged_weapons);
                var itemsVal=parseInt(values.mount_total_enc_items);
                var armorsVal=parseInt(values.mount_total_enc_armors);

                setAttrs({
                    'mount_total-enc': armorsVal+closeWeaponsVal+rangedWeaponsVal+itemsVal
                });

            });
        },
        updateEncumbrance = function () {
            TAS.repeatingSimpleSum('mount-close-combat-weapons','close-combat-weapon-enc','mount_total_enc_close_weapons');
            TAS.repeatingSimpleSum('mount-ranged-weapons','ranged-weapon-enc','mount_total_enc_ranged_weapons');
            TAS.repeatingSimpleSum('mount-armors','armor-enc','mount_total_enc_armors');

            TAS.repeating('mount-equipments')
                .attrs('mount_total_enc_items')
                .fields('item-enc','item-number')
                .reduce(function(memo,row,attrSet,id,rowSet){
                    memo.push(row.I["item-enc"]*row.I["item-number"]);
                    return memo;
                },[], function(memo,rowSet,attrSet){
                    var count = 0;
                       for(var i=0, n=memo.length; i < n; i++)
                       {
                          count += memo[i];
                       }
                    attrSet["mount_total_enc_items"]=count;
                })
                .execute();
        },

        registerEventHandlers = function () {

            on("change:mount_total_enc_close_weapons change:mount_total_enc_ranged_weapons change:mount_total_enc_items change:mount_total_enc_armors", TAS.callback( function updateTotalEncumbranceValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateTotalEncumbrance(eventInfo);
            }));
            on("change:repeating_mount-equipments:item-enc change:repeating_mount-armors:armor-enc change:repeating_mount-equipments:item-number change:repeating_mount-close-combat-weapons:close-combat-weapon-enc change:repeating_mount-ranged-weapons:ranged-weapon-enc", TAS.callback( function updateEncumbranceValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateEncumbrance(eventInfo);
            }));
            on("remove:repeating_mount-equipments remove:repeating_mount-armors remove:repeating_mount-close-combat-weapons remove:repeating_mount-ranged-weapons", TAS.callback( function removeEncumbranceValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateEncumbrance(eventInfo);
            }));

        };

    registerEventHandlers();

    TAS.log('HM_Mount_Equipments loaded');

}());

var HM_Mount_Weapons = HM_Mount_Weapons || (function () {

    var updateCloseCombatMaxDamages = function (eventInfo){
        getAttrs(["repeating_mount-close-combat-weapons_close-combat-weapon-damage","mount-dmg-mod"], function (values) {

            var weaponDamage=values["repeating_mount-close-combat-weapons_close-combat-weapon-damage"].split("+");
            var dmgMod=values["mount-dmg-mod"];

            var result=0;

            for(var i=0;i < weaponDamage.length;i++){
                var value=weaponDamage[i].trim();

                if(value.indexOf("d") !== -1){
                    result+=parseInt(value.split("d")[1]);
                }
                else{
                    result+=parseInt(value);
                }
            }

            if(dmgMod.indexOf("d") !== -1){
                var maxMod=parseInt(dmgMod.split("d")[1]);
                if(dmgMod.startsWith("-")){
                    result-=maxMod;
                }
                else{
                    result+=maxMod;
                }
            }
            else{
                if(dmgMod.startsWith("-")){
                    result-=parseInt(dmgMod);
                }
                else{
                    result+=parseInt(dmgMod);
                }
            }

            setAttrs({
                'repeating_mount-close-combat-weapons_max_damages':result
            });
        });
    },
        updateRangedCombatMaxDamages = function (eventInfo) {
            getAttrs(["repeating_mount-ranged-weapons_ranged-weapon-damage","repeating_mount-ranged-weapons_ranged-weapon-damage-mod","mount-dmg-mod"], function (values) {

                var weaponDamage=values["repeating_mount-ranged-weapons_ranged-weapon-damage"].split("+");
                var damageMod=values["repeating_mount-ranged-weapons_ranged-weapon-damage-mod"];
                var dmgMod=values["mount-dmg-mod"];

                var result=0;

                for(var i=0;i < weaponDamage.length;i++){
                    var value=weaponDamage[i].trim();

                    if(value.indexOf("d") !== -1){
                        result+=parseInt(value.split("d")[1]);
                    }
                    else{
                        result+=parseInt(value);
                    }
                }

                var modFinal='[['+dmgMod+']]';

                if(damageMod=="half"){
                    var modVal=0
                    if(dmgMod.indexOf("d") !== -1){
                        modVal = parseInt(dmgMod.split("d")[1]);
                    }
                    else{
                        modVal = parseInt(dmgMod);
                    }

                    if(dmgMod.startsWith("-")){
                        result-=Math.ceil(modVal/2);

                        modFinal='-ceil([['+dmgMod.substr(1)+']]/2)';
                    }
                    else{
                        result+=Math.ceil(modVal/2);

                        modFinal='ceil([['+dmgMod+'}]]/2)';
                    }

                }
                else if(damageMod=="full"){

                    if(dmgMod.indexOf("d") !== -1){

                        if(dmgMod.startsWith("-")){
                            result-=parseInt(dmgMod.split("d")[1]);
                        }
                        else{
                            result+=parseInt(dmgMod.split("d")[1]);
                        }
                    }
                    else{

                        if(dmgMod.startsWith("-")){
                            result-=parseInt(dmgMod);
                        }
                        else{
                            result+=parseInt(dmgMod);
                        }
                    }
                }
                else{
                    modFinal='0';
                }

                setAttrs({
                    'repeating_mount-ranged-weapons_max_damages':result,
                    'repeating_mount-ranged-weapons_damage_mod':modFinal
                });
            });
        },
        updateCloseCombatSkillScore = function (eventInfo) {
            getAttrs(["repeating_mount-close-combat-weapons_close-combat-weapon-skill"], function (values) {

                var skillName=values["repeating_mount-close-combat-weapons_close-combat-weapon-skill"];
                var result=0;

                TAS.repeating('mountskills')
                    .fields('mountSkillName','mountSkill')
                    .each(function(f){

                        if(skillName==f['mountSkillName']) {
                            result=f.I['mountSkill'];
                        }

                        setAttrs({
                            'repeating_mount-close-combat-weapons_close-combat-weapon-skill-score':result
                        });
                    })
                    .execute();
            });
        },
        updateRangedCombatSkillScore = function (eventInfo) {
            getAttrs(["repeating_mount-ranged-weapons_ranged-weapon-skill"], function (values) {

                var skillName=values["repeating_mount-ranged-weapons_ranged-weapon-skill"];
                var result=0;

                TAS.repeating('mountskills')
                    .fields('mountSkillName','mountSkill')
                    .each(function(f){

                        if(skillName==f['mountSkillName']) {
                            result=f.I['mountSkill'];
                        }

                        setAttrs({
                            'repeating_mount-ranged-weapons_ranged-weapon-skill-score':result
                        });
                    })
                    .execute();
            });
        },
        updateCloseAndRangedCombatSkillScore = function (eventInfo) {

            TAS.repeating('mount-close-combat-weapons')
                .fields("close-combat-weapon-skill","close-combat-weapon-skill-score")
                .each(function(w){

                    var skillName = w["close-combat-weapon-skill"];

                    TAS.repeating('mountskills')
                        .fields('mountSkillName','mountSkill')
                        .each(function(f){

                            if(skillName==f['mountSkillName']) {
                                w["close-combat-weapon-skill-score"]=f.I['mountSkill'];
                            }

                        })
                        .execute();

                })
                .execute();

            TAS.repeating('mount-ranged-weapons')
                .fields("ranged-weapon-skill","ranged-weapon-skill-score")
                .each(function(w){

                    var skillName = w["ranged-weapon-skill"];

                    TAS.repeating('mountskills')
                        .fields('mountSkillName','mountSkill')
                        .each(function(f){

                            if(skillName==f['mountSkillName']) {
                                w["ranged-weapon-skill-score"]=f.I['mountSkill'];
                            }

                        })
                        .execute();

                })
                .execute();

        },

        registerEventHandlers = function () {

            on("change:repeating_mount-close-combat-weapons:close-combat-weapon-damage", TAS.callback( function updateCloseCombatMaxDamagesValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateCloseCombatMaxDamages(eventInfo);
            }));
            on("change:repeating_mount-ranged-weapons:ranged-weapon-damage change:repeating_mount-ranged-weapons:ranged-weapon-damage-mod", TAS.callback( function updateRangedCombatMaxDamagesValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateRangedCombatMaxDamages(eventInfo);
            }));

            on("change:repeating_mount-close-combat-weapons:close-combat-weapon-skill", TAS.callback( function updateCloseCombatSkillScoreValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateCloseCombatSkillScore(eventInfo);
            }));
            on("change:repeating_mount-ranged-weapons:ranged-weapon-skill", TAS.callback( function updateRangedCombatSkillScoreValue(eventInfo){
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateRangedCombatSkillScore(eventInfo);
            }));

        };

    registerEventHandlers();

    TAS.log('HM_Mount_Weapons loaded');

    return {
        UpdateCloseAndRangedCombatSkillScore: updateCloseAndRangedCombatSkillScore
    };

}());
