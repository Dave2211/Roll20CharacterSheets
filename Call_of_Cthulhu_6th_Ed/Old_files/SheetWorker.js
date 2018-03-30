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
            getAttrs(["initSheet","edu","int"], function(values){

                var valinitSheet=parseInt(values.initSheet);
                var valEdu=parseInt(values.edu);
                var valInt=parseInt(values.int);

                if(valinitSheet==1){

                    setAttrs({
                        'initSheet': 0,
                        'bureaucracy': 10,
                        'artistic-culture':10,
                        'mother-tongue':valEdu*5,
                        'occult-sciences': 5,
                        'do-it-yourself': 20,
                        'hypnosis': 5,
                        'medicine': 5,
                        'photography': 10,
                        'first-aid': 30,
                        'library-use': 25,
                        'stealth': 10,
                        'concealment': 15,
                        'listen': 25,
                        'direction': 10,
                        'track': 10,
                        'psychology': 5,
                        'hide': 10,
                        'sho': 25,
                        'vigilance': 25,
                        'spiel': 5,
                        'contact-and-resources': 10,
                        'credit': 15,
                        'interview': 10,
                        'bargain': 5,
                        'insight': valInt*2,
                        'persuade': 15,
                        'manners': valEdu*2,
                        'athleticism': 15,
                        'ride': 5
                    });
                }
            });
        },

        recalculateSheetValues = function (eventInfo) {
            setAttrs({
                'recalc1': 0,
                'initSheet': 1
            });
        },

        registerEventHandlers = function (eventInfo) {
            on("sheet:opened", TAS.callback( function sheetOpened (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                initSheet(eventInfo);
                CoC_Weapons.InitWeaponsCommand(eventInfo);
                CoC_Skills.InitSkillsCommand(eventInfo);
            }));

            on("change:recalc1", TAS.callback( function recalculateSheet (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                recalculateSheetValues(eventInfo);
                initSheet(eventInfo);
            }));
        };

    registerEventHandlers();

    TAS.log("CoC_Sheet loaded");

}());

var CoC_Characteristics = CoC_Characteristics || (function() {

    var updateApparence = function (eventInfo) {
            getAttrs(["app"], function(values){
                var val=parseInt(values.app);

                setAttrs({
                    'presence': val*5
                });
            });
        },
        updateConstitution = function (eventInfo) {
            getAttrs(["con"], function(values){
                var val=parseInt(values.con);

                setAttrs({
                    'stamina': val*5
                });
            });
        },
        updateStrength = function (eventInfo) {
            getAttrs(["str"], function(values){
                var val=parseInt(values.str);

                setAttrs({
                    'strength': val*5
                });
            });
        },
        updateSize = function (eventInfo) {
            getAttrs(["siz"], function(values){
                var val=parseInt(values.siz);

                setAttrs({
                    'corpulence': val*5
                });
            });
        },
        updateEducation = function (eventInfo) {
            getAttrs(["edu"], function(values){
                var val=parseInt(values.edu);

                setAttrs({
                    'knowledge': val*5
                });
            });
        },
        updateDexterity = function (eventInfo) {
            getAttrs(["dex"], function(values){
                var val=parseInt(values.dex);

                setAttrs({
                    'agility': val*5,
                    'hand-to-hand': val*2
                });
            });
        },
        updateIntelligence = function (eventInfo) {
            getAttrs(["int"], function(values){
                var val=parseInt(values.int);

                setAttrs({
                    'intuition': val*5
                });
            });
        },
        updatePower = function (eventInfo) {
            getAttrs(["pow"], function(values){
                var val=parseInt(values.pow);

                setAttrs({
                    'willpower': val*5,
                    'mp_max': val,
                    'initSanity': val*5
                });
            });
        },

        updateHitPointsStats = function (eventInfo){
            getAttrs(["con","siz"], function(values){

                var valCon=parseInt(values.con);
                var valSiz=parseInt(values.siz);

                var val=valCon+valSiz;

                setAttrs({
                    'woundThreshold': Math.round(val/4),
                    'hp_max': Math.round(val/2)
                });
            });
        },

        registerEventHandlers = function (eventInfo) {
            on("change:app", TAS.callback( function updateApparenceValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateApparence(eventInfo);
            }));
            on("change:con", TAS.callback( function updateConstitutionValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateConstitution(eventInfo);
                updateHitPointsStats(eventInfo);
            }));
            on("change:str", TAS.callback( function updateStrengthValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateStrength(eventInfo);
            }));
            on("change:siz", TAS.callback( function updateSizeValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateSize(eventInfo);
                updateHitPointsStats(eventInfo);
            }));
            on("change:edu", TAS.callback( function updateEducationValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateEducation(eventInfo);
            }));
            on("change:dex", TAS.callback( function updateDexterityValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateDexterity(eventInfo);
            }));
            on("change:int", TAS.callback( function updateIntelligenceValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateIntelligence(eventInfo);
            }));
            on("change:pow", TAS.callback( function updatePowerValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updatePower(eventInfo);
            }));
        };

    registerEventHandlers();

    TAS.log("CoC_Characteristics loaded");

}());

var CoC_Skills = CoC_Skills || (function() {

    var updateSkills = function (eventInfo) {
            initSkillsCommand(eventInfo);
        },
        updateCthulhuMythos = function (eventInfo) {
            getAttrs(["cthulhuMythos"], function(values){
                var val=parseInt(values.cthulhuMythos);

                setAttrs({
                    'sanity_max': 99-val
                });
            });
        },

        initSkillsCommand = function(eventInfo) {

            var baseSkillMacro = "/w \"@{character_name}\" &{template:coc_buttons} {{character_name=@{character_name}}} {{character_id=@{character_id}}} {{name=^{skills}}} ",
                attrs = {};

            getSectionIDs("repeating_skills", function (idarray) {

                getAttrs(["_reporder_repeating_skills"], function (repValues) {

                    var atkattrs = ["cthulhuMythos","criminalistics","psychoanalysis","survival","imposture","game","game-name","navigate","misc-skill-1","misc-skill-name-1","misc-skill-2","misc-skill-name-2","misc-skill-3","misc-skill-name-3","misc-skill-4","misc-skill-name-4","artistic-culture-name-1","artistic-culture-1","artistic-culture-name-2","artistic-culture-2","language-name-1","language-1","language-name-2","language-2","language-name-3","language-3","earth-science-1","earth-science-name-1","earth-science-2","earth-science-name-2","earth-science-3","earth-science-name-3","life-sciences-1","life-sciences-name-1","life-sciences-2","life-sciences-name-2","life-sciences-3","life-sciences-name-3","formal-sciences-1","formal-sciences-name-1","formal-sciences-2","formal-sciences-name-2","formal-sciences-3","formal-sciences-name-3","human-sciences-1","human-sciences-name-1","human-sciences-2","human-sciences-name-2","human-sciences-3","human-sciences-name-3","craft-1","craft-name-1","craft-2","craft-name-2","craft-3","craft-name-3","craft-4","craft-name-4","art-1","art-name-1","art-2","art-name-2","art-3","art-name-3","drive-1","drive-name-1","drive-2","drive-name-2","pilot-1","pilot-name-1","pilot-2","pilot-name-2"];

                    _.each(idarray, function (id) {
                        atkattrs.push("repeating_skills_" + id + "_misc-skill-name-x");
                        atkattrs.push("repeating_skills_" + id + "_misc-skill-x");
                    });

                    getAttrs(atkattrs, function (values) {
                        var attrs = {},repList;
                        if (!_.isUndefined(repValues._reporder_repeating_skills) && repValues._reporder_repeating_skills != "") {
                            repList = repValues._reporder_repeating_skills.split(",");
                            repList = _.map(repList, function (ID) {
                                return ID.toLowerCase();
                            });
                        }
                        var orderedList = _.union(repList, idarray);

                        /* ======================================== KNOWLEDGE SKILLS ======================================== */

                        var knowledgeSkillMacro = "{{**^{knowledge}**}} ";
                        knowledgeSkillMacro += "{{ [^{bureaucracy} (@{bureaucracy})](~@{character_id}|check_bureaucracy) ";
                        knowledgeSkillMacro += "[^{artistic-culture} (@{artistic-culture})](~@{character_id}|check_artistic-culture) ";

                        var val=parseInt(values["artistic-culture-1"]),name=values["artistic-culture-name-1"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{artistic-culture}: @{artistic-culture-name-1} (" + val + ")](~@{character_id}|check_artistic-culture-1) ";
                        }
                        val=parseInt(values["artistic-culture-2"]),name=values["artistic-culture-name-2"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{artistic-culture}: @{artistic-culture-name-2} (" + val + ")](~@{character_id}|check_artistic-culture-2) ";
                        }

                        knowledgeSkillMacro += "[^{mother-tongue}: @{mother-tongue-name} (@{mother-tongue})](~@{character_id}|check_mother-tongue) ";

                        val=parseInt(values["language-1"]),name=values["language-name-1"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{languages}: @{language-name-1} (" + val + ")](~@{character_id}|check_language-1) ";
                        }
                        val=parseInt(values["language-2"]),name=values["language-name-2"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{languages}: @{language-name-2} (" + val + ")](~@{character_id}|check_language-2) ";
                        }
                        val=parseInt(values["language-3"]),name=values["language-name-3"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{languages}: @{language-name-3} (" + val + ")](~@{character_id}|check_language-3) ";
                        }

                        val=parseInt(values["cthulhuMythos"]);
                        if (!isNaN(val)){
                            knowledgeSkillMacro += "[^{cthulhu-mythos} (" + val + ")](~@{character_id}|check_cthulhu-mythos) ";
                        }

                        val=parseInt(values["earth-science-1"]),name=values["earth-science-name-1"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{earth-sciences}: @{earth-science-name-1} (" + val + ")](~@{character_id}|check_earth-science-1) ";
                        }
                        val=parseInt(values["earth-science-2"]),name=values["earth-science-name-2"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{earth-sciences}: @{earth-science-name-2} (" + val + ")](~@{character_id}|check_earth-science-2) ";
                        }
                        val=parseInt(values["earth-science-3"]),name=values["earth-science-name-3"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{earth-sciences}: @{earth-science-name-3} (" + val + ")](~@{character_id}|check_earth-science-3) ";
                        }

                        val=parseInt(values["life-sciences-1"]),name=values["life-sciences-name-1"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{life-sciences}: @{life-sciences-name-1} (" + val + ")](~@{character_id}|check_life-sciences-1) ";
                        }
                        val=parseInt(values["life-sciences-2"]),name=values["life-sciences-name-2"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{life-sciences}: @{life-sciences-name-2} (" + val + ")](~@{character_id}|check_life-sciences-2) ";
                        }
                        val=parseInt(values["life-sciences-3"]),name=values["life-sciences-name-3"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{life-sciences}: @{life-sciences-name-3} (" + val + ")](~@{character_id}|check_life-sciences-3) ";
                        }

                        val=parseInt(values["formal-sciences-1"]),name=values["formal-sciences-name-1"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{formal-sciences}: @{formal-sciences-name-1} (" + val + ")](~@{character_id}|check_formal-sciences-1) ";
                        }
                        val=parseInt(values["formal-sciences-2"]),name=values["formal-sciences-name-2"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{formal-sciences}: @{formal-sciences-name-2} (" + val + ")](~@{character_id}|check_formal-sciences-2) ";
                        }
                        val=parseInt(values["formal-sciences-3"]),name=values["formal-sciences-name-3"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{formal-sciences}: @{formal-sciences-name-3} (" + val + ")](~@{character_id}|check_formal-sciences-3) ";
                        }

                        val=parseInt(values["human-sciences-1"]),name=values["human-sciences-name-1"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{human-sciences}: @{human-sciences-name-1} (" + val + ")](~@{character_id}|check_human-sciences-1) ";
                        }
                        val=parseInt(values["human-sciences-2"]),name=values["human-sciences-name-2"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{human-sciences}: @{human-sciences-name-2} (" + val + ")](~@{character_id}|check_human-sciences-2) ";
                        }
                        val=parseInt(values["human-sciences-3"]),name=values["human-sciences-name-3"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[^{human-sciences}: @{human-sciences-name-3} (" + val + ")](~@{character_id}|check_human-sciences-3) ";
                        }

                        knowledgeSkillMacro += "[^{occult-sciences} (@{occult-sciences})](~@{character_id}|check_occult-sciences) ";

                        val=parseInt(values["misc-skill-1"]),name=values["misc-skill-name-1"];
                        if (!isNaN(val) && !(name==='')){
                            knowledgeSkillMacro += "[@{misc-skill-name-1} (" + val + ")](~@{character_id}|check_misc-skill-1) ";
                        }

                        knowledgeSkillMacro += "}} "

                        /* ======================================== EXPERTISE SKILLS ======================================== */

                        var expertiseSkillMacro = "{{**^{expertise}**}} ";

                        expertiseSkillMacro += "{{ [^{do-it-yourself} (@{do-it-yourself})](~@{character_id}|check_do-it-yourself) ";

                        val=parseInt(values["criminalistics"]);
                        if (!isNaN(val)){
                            expertiseSkillMacro += "[^{criminalistics} (" + val + ")](~@{character_id}|check_criminalistics) ";
                        }

                        expertiseSkillMacro += "[^{hypnosis} (@{hypnosis})](~@{character_id}|check_hypnosis) ";
                        expertiseSkillMacro += "[^{medicine} (@{medicine})](~@{character_id}|check_medicine) ";
                        expertiseSkillMacro += "[^{craft} (5)](~@{character_id}|check_craft) ";

                        val=parseInt(values["craft-1"]),name=values["craft-name-1"];
                        if (!isNaN(val) && !(name==='')){
                            expertiseSkillMacro += "[^{craft}: @{craft-name-1} (" + val + ")](~@{character_id}|check_craft-1) ";
                        }
                        val=parseInt(values["craft-2"]),name=values["craft-name-2"];
                        if (!isNaN(val) && !(name==='')){
                            expertiseSkillMacro += "[^{craft}: @{craft-name-2} (" + val + ")](~@{character_id}|check_craft-2) ";
                        }
                        val=parseInt(values["craft-3"]),name=values["craft-name-3"];
                        if (!isNaN(val) && !(name==='')){
                            expertiseSkillMacro += "[^{craft}: @{craft-name-3} (" + val + ")](~@{character_id}|check_craft-3) ";
                        }
                        val=parseInt(values["craft-4"]),name=values["craft-name-4"];
                        if (!isNaN(val) && !(name==='')){
                            expertiseSkillMacro += "[^{craft}: @{craft-name-4} (" + val + ")](~@{character_id}|check_craft-4) ";
                        }

                        expertiseSkillMacro += "[^{photography} (@{photography})](~@{character_id}|check_photography) ";
                        expertiseSkillMacro += "[^{art} (5)](~@{character_id}|check_art) ";

                        val=parseInt(values["art-1"]),name=values["art-name-1"];
                        if (!isNaN(val) && !(name==='')){
                            expertiseSkillMacro += "[^{art}: @{art-name-1} (" + val + ")](~@{character_id}|check_art-1) ";
                        }
                        val=parseInt(values["art-2"]),name=values["art-name-2"];
                        if (!isNaN(val) && !(name==='')){
                            expertiseSkillMacro += "[^{art}: @{art-name-2} (" + val + ")](~@{character_id}|check_art-2) ";
                        }
                        val=parseInt(values["art-3"]),name=values["art-name-3"];
                        if (!isNaN(val) && !(name==='')){
                            expertiseSkillMacro += "[^{art}: @{art-name-3} (" + val + ")](~@{character_id}|check_art-3) ";
                        }

                        expertiseSkillMacro += "[^{first-aid} (@{first-aid})](~@{character_id}|check_first-aid) ";

                        val=parseInt(values["psychoanalysis"]);
                        if (!isNaN(val)){
                            expertiseSkillMacro += "[^{psychoanalysis} (" + val + ")](~@{character_id}|check_psychoanalysis) ";
                        }

                        val=parseInt(values["survival"]);
                        if (!isNaN(val)){
                            expertiseSkillMacro += "[^{survival} (" + val + ")](~@{character_id}|check_survival) ";
                        }

                        val=parseInt(values["misc-skill-2"]),name=values["misc-skill-name-2"];
                        if (!isNaN(val) && !(name==='')){
                            expertiseSkillMacro += "[@{misc-skill-name-2} (" + val + ")](~@{character_id}|check_misc-skill-2) ";
                        }

                        expertiseSkillMacro += "}} "

                        /* ======================================== SENSORY SKILLS ======================================== */

                        var sensorySkillMacro = "{{**^{sensory}**}} ";

                        sensorySkillMacro += "{{ [^{library-use} (@{library-use})](~@{character_id}|check_library-use) ";
                        sensorySkillMacro += "[^{stealth} (@{stealth})](~@{character_id}|check_stealth) ";
                        sensorySkillMacro += "[^{concealment} (@{concealment})](~@{character_id}|check_concealment) ";
                        sensorySkillMacro += "[^{listen} (@{listen})](~@{character_id}|check_listen) ";
                        sensorySkillMacro += "[^{direction} (@{direction})](~@{character_id}|check_direction) ";
                        sensorySkillMacro += "[^{track} (@{track})](~@{character_id}|check_track) ";
                        sensorySkillMacro += "[^{psychology} (@{psychology})](~@{character_id}|check_psychology) ";
                        sensorySkillMacro += "[^{hide} (@{hide})](~@{character_id}|check_hide) ";
                        sensorySkillMacro += "[^{spot-hidden-object} (@{sho})](~@{character_id}|check_spot-hidden-object) ";
                        sensorySkillMacro += "[^{vigilance} (@{vigilance})](~@{character_id}|check_vigilance) ";

                        val=parseInt(values["misc-skill-3"]),name=values["misc-skill-name-3"];
                        if (!isNaN(val) && !(name==='')){
                            sensorySkillMacro += "[@{misc-skill-name-3} (" + val + ")](~@{character_id}|check_misc-skill-3) ";
                        }

                        sensorySkillMacro += "}} "

                        /* ======================================== SENSORY SKILLS ======================================== */

                        var influenceSkillMacro = "{{**^{influence}**}} ";

                        influenceSkillMacro += "{{ [^{spiel} (@{spiel})](~@{character_id}|check_spiel) ";
                        influenceSkillMacro += "[^{contact-and-resources} (@{contact-and-resources})](~@{character_id}|check_contact-and-resources) ";
                        influenceSkillMacro += "[^{credit} (@{credit})](~@{character_id}|check_credit) ";

                        val=parseInt(values["imposture"]);
                        if (!isNaN(val)){
                            influenceSkillMacro += "[^{imposture} (" + val + ")](~@{character_id}|check_imposture) ";
                        }

                        influenceSkillMacro += "[^{interview} (@{interview})](~@{character_id}|check_interview) ";
                        influenceSkillMacro += "[^{game} (10)](~@{character_id}|check_game) ";

                        val=parseInt(values["game"]),name=values["game-name"];
                        if (!isNaN(val) && !(name==='')){
                            influenceSkillMacro += "[^{game}: @{game-name} (" + val + ")](~@{character_id}|check_game-1) ";
                        }

                        influenceSkillMacro += "[^{bargain} (@{bargain})](~@{character_id}|check_bargain) ";
                        influenceSkillMacro += "[^{insight} (@{insight})](~@{character_id}|check_insight) ";
                        influenceSkillMacro += "[^{persuade} (@{persuade})](~@{character_id}|check_persuade) ";
                        influenceSkillMacro += "[^{manners} (@{manners})](~@{character_id}|check_manners) ";

                        val=parseInt(values["misc-skill-4"]),name=values["misc-skill-name-4"];
                        if (!isNaN(val) && !(name==='')){
                            influenceSkillMacro += "[@{misc-skill-name-4} (" + val + ")](~@{character_id}|check_misc-skill-4) ";
                        }

                        influenceSkillMacro += "}} "

                        /* ======================================== ACTION SKILLS ======================================== */

                        var actionSkillMacro = "{{**^{action}**}} ";

                        actionSkillMacro += "{{ [^{firearms} (20)](~@{character_id}|check_firearms) ";
                        actionSkillMacro += "[^{bladed-weapons} (20)](~@{character_id}|check_bladed-weapons) ";
                        actionSkillMacro += "[^{gunnery} (15)](~@{character_id}|check_gunnery) ";
                        actionSkillMacro += "[^{athleticism} (@{athleticism})](~@{character_id}|check_athleticism) ";
                        actionSkillMacro += "[^{drive} (20)](~@{character_id}|check_drive) ";

                        val=parseInt(values["drive-1"]),name=values["drive-name-1"];
                        if (!isNaN(val) && !(name==='')){
                            actionSkillMacro += "[^{drive}: @{drive-name-1} (" + val + ")](~@{character_id}|check_drive-1) ";
                        }
                        val=parseInt(values["drive-2"]),name=values["drive-name-2"];
                        if (!isNaN(val) && !(name==='')){
                            actionSkillMacro += "[^{drive}: @{drive-name-2} (" + val + ")](~@{character_id}|check_drive-2) ";
                        }

                        actionSkillMacro += "[^{hand-to-hand} (@{hand-to-hand})](~@{character_id}|check_hand-to-hand) ";
                        actionSkillMacro += "[^{ride} (@{ride})](~@{character_id}|check_ride) ";

                        val=parseInt(values["navigate"]);
                        if (!isNaN(val)){
                            actionSkillMacro += "[^{navigate} (@{navigate})](~@{character_id}|check_navigate) ";
                        }

                        val=parseInt(values["pilot-1"]),name=values["pilot-name-1"];
                        if (!isNaN(val) && !(name==='')){
                            actionSkillMacro += "[^{pilot}: @{pilot-name-1} (" + val + ")](~@{character_id}|check_pilot-1) ";
                        }
                        val=parseInt(values["pilot-2"]),name=values["pilot-name-2"];
                        if (!isNaN(val) && !(name==='')){
                            actionSkillMacro += "[^{pilot}: @{pilot-name-2} (" + val + ")](~@{character_id}|check_pilot-2) ";
                        }

                        actionSkillMacro += "}} "

                        /* ======================================== MISC SKILLS ======================================== */

                        var miscSkillMacro = "{{** ^{others} ^{skills} **}} {{ ";

                        _.each(orderedList, function (ID) {
                            var skillName = values["repeating_skills_" + ID + "_misc-skill-name-x"],
                                skillValue = values["repeating_skills_" + ID + "_misc-skill-x"];

                            if (!_.isUndefined(skillValue) && !_.isUndefined(skillName)){
                                miscSkillMacro += "[" + skillName + " (" + skillValue + ")](~@{character_id}|repeating_skills_" + ID + "_check_misc-skill-x) ";
                            }
                        });

                        miscSkillMacro += "}}"


                        //TAS.debug(baseSkillMacro + knowledgeSkillMacro + expertiseSkillMacro + sensorySkillMacro + influenceSkillMacro + actionSkillMacro + miscSkillMacro);

                        attrs["skills-macro"] = baseSkillMacro + knowledgeSkillMacro + expertiseSkillMacro + sensorySkillMacro + influenceSkillMacro + actionSkillMacro + miscSkillMacro;
                        setAttrs(attrs);
                    });

                });
            });
        },


        registerEventHandlers = function (eventInfo) {
            on("change:repeating_skills", TAS.callback( function updateSkillsValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateSkills(eventInfo);
            }));

            on("change:cthulhuMythos", TAS.callback( function updateCthulhuMythosValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                updateCthulhuMythos(eventInfo);
            }));
        };

    registerEventHandlers();

    TAS.log("CoC_Skills loaded");

    return {
        InitSkillsCommand: initSkillsCommand
    };

}());

var CoC_Weapons = CoC_Weapons || (function() {
    var initWeaponsCommand = function(eventInfo) {

            var baseMacro = "/w \"@{character_name}\" &{template:coc_buttons} {{character_name=@{character_name}}} {{character_id=@{character_id}}} {{name=^{weapons}}} {{**^{hand-to-hand}**}} {{[^{feet} (@{hand-to-hand})](~@{character_id}|feet-attack-roll) [^{hands} (@{hand-to-hand})](~@{character_id}|hands-attack-roll) [^{head} (@{hand-to-hand})](~@{character_id}|head-attack-roll)}} ";

            getSectionIDs("repeating_weapons", function (idarray) {

                getAttrs(["_reporder_repeating_weapons"], function (repValues) {

                    var atkattrs = [];
                    _.each(idarray, function (id) {
                        atkattrs.push("repeating_weapons_" + id + "_weapon-name");
                        atkattrs.push("repeating_weapons_" + id + "_weapon-skill");
                    });

                    getAttrs(atkattrs, function (values) {
                        var melee = "{{** ^{weapons} **}} {{",
                            attrs = {},
                            repList;

                        if (!_.isUndefined(repValues._reporder_repeating_weapons) && repValues._reporder_repeating_weapons != "") {
                            repList = repValues._reporder_repeating_weapons.split(",");
                            repList = _.map(repList, function (ID) {
                                return ID.toLowerCase();
                            });
                        }
                        var orderedList = _.union(repList, idarray);
                        _.each(orderedList, function (ID) {
                            var attackName = values["repeating_weapons_" + ID + "_weapon-name"],
                                skillValue = values["repeating_weapons_" + ID + "_weapon-skill"];

                            if (!_.isUndefined(skillValue)){
                                var temproll = " [" + attackName + " (" + skillValue + ")](~@{character_id}|repeating_weapons_" + ID + "_attack-roll)";
                                melee+=temproll;
                            }
                        });
                        melee += "}}";

                        //TAS.debug(baseMacro + melee);

                        attrs["attacks-macro"] = baseMacro + melee;
                        setAttrs(attrs);
                    });

                });
            });
        },

        registerEventHandlers = function (eventInfo) {
            on("change:repeating_weapons", TAS.callback( function updateWeaponsValue (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                initWeaponsCommand(eventInfo);
            }));
        };

    registerEventHandlers();

    TAS.log("CoC_Weapons loaded");

    return {
        InitWeaponsCommand: initWeaponsCommand
    };

}());

