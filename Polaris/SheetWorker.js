
//UNCOMMENT FOR JS LINT
/*console.log('%c•!!!!!!!!!!!!!!!!!!IF YOU SEE THIS YOU FORGOT TO UNCOMMENT THE TEST CODE FOR JS LINT!!!!!!!•', 'background: linear-gradient(to right,red,white,white,red); color:black;text-shadow: 0 0 8px white;');
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

var Polaris_Sheet = Polaris_Sheet || (function () {

    var initCSheet = function (eventInfo) {
            getAttrs(["initSheet"], function(values){

                var valinitSheet=parseInt(values.initSheet);

                if(valinitSheet==1){
                    setAttrs({
                        'strBase':10,
                        'conBase':10,
                        'cooBase':10,
                        'adaBase':10,
                        'perBase':10,
                        'intBase':10,
                        'wilBase':10,
                        'preBase':10,

                        'strModGen':0,
                        'conModGen':0,
                        'cooModGen':0,
                        'adaModGen':0,
                        'perModGen':0,
                        'intModGen':0,
                        'wilModGen':0,
                        'preModGen':0,

                        'strModPC':0,
                        'conModPC':0,
                        'cooModPC':0,
                        'adaModPC':0,
                        'perModPC':0,
                        'intModPC':0,
                        'wilModPC':0,
                        'preModPC':0,


                        'str':10,
                        'con':10,
                        'coo':10,
                        'ada':10,
                        'per':10,
                        'int':10,
                        'wil':10,
                        'pre':10,

                        'strNaturalGift':1,
                        'conNaturalGift':1,
                        'cooNaturalGift':1,
                        'adaNaturalGift':1,
                        'perNaturalGift':1,
                        'intNaturalGift':1,
                        'wilNaturalGift':1,
                        'preNaturalGift':1,




                        'acrobaticsBalanceMast':0,
                        'athleticMast':0,
                        'enduranceMast':0,
                        'climbingMast':0,
                        'zerogManeuveringMast':0,
                        'submarineManeuveringMast':0,
                        'fofBreathingMast':0,

                        'heavyWeaponMeleeMast':0,
                        'specialWeaponMeleeMast':0,
                        'wrestlingMAMast':0,
                        'defenseTechniquesMast':0,
                        'offenseTechniquesMast':0,
                        'armedCombatMast':0,
                        'handToHandCombatMast':0,

                        'throwingWeaponsMast':0,
                        'heavyWeaponShootingMast':0,
                        'handgunsMast':0,
                        'submarineWeaponsMast':0,
                        'specialWeaponRangedMast':0,
                        'rangedWeaponMast':0,
                        'riflesShoulderFiredWeaponsMast':0,
                        'automaticShootMast':0,
                        'sharpShootingMast':0,

                        'empathicAnalysisMast':0,
                        'singingMast':0,
                        'actingStorytellingMast':0,
                        'leadershipMast':0,
                        'dancingMast':0,
                        'eloquencePersuasionMast':0,
                        'socializingSeductionMast':0,
                        'musicInstrumentMast':0,
                        'intimidationMast':0,

                        'bureaucracyMast':0,
                        'cartographyMast':0,
                        'businessTraffickingWeaponsMast':0,
                        'businessTraffickingDrugsMast':0,
                        'businessTraffickingSpecial1Mast':0,
                        'businessTraffickingSpecial2Mast':0,
                        'nationsAndOrgaKnowledge1Mast':0,
                        'nationsAndOrgaKnowledge2Mast':0,
                        'nationsAndOrgaKnowledge3Mast':0,
                        'cryptographyMast':0,
                        'eductionGeneralKnowledgeMast':0,
                        'gamblingMast':0,
                        'navigateMast':0,
                        'findingInformationMast':0,
                        'scienceSpecializedKnowledge1Mast':0,
                        'scienceSpecializedKnowledge2Mast':0,
                        'strategyMast':0,
                        'tacticsNavalCombatMast':0,
                        'tacticsMast':0,

                        'camouflageConcealmentMast':0,
                        'diguiseDeceptionMast':0,
                        'discretionShadowingMast':0,
                        'escapeMast':0,
                        'furtiveSilentMovementMast':0,
                        'pickpocketMast':0,

                        'foreignLanguage1Mast':0,
                        'foreignLanguage2Mast':0,
                        'ancientLanguageMast':0,
                        'specificLanguageMast':0,

                        'submarineArmorManeuverMast':0,
                        'armorManeuverMast':0,
                        'submarineScooterPilotageMast':0,
                        'pilotLightShipMast':0,
                        'specificPilotMast':0,
                        'telePilotageMast':0,

                        'huntingTrackingMast':0,
                        'oceansKnowledgeMast':0,
                        'undergroundKnowledgeMast':0,
                        'surfaceKnowledgeMast':0,
                        'observationMast':0,
                        'orientationMast':0,
                        'survivalMast':0,

                        'soundscanAnalysisMast':0,
                        'onboardWeaponsMast':0,
                        'armoryMast':0,
                        'aquacultureLivestockFarmingMast':0,
                        'surgeryMast':0,
                        'trainingMast':0,
                        'electronicsMast':0,
                        'spyingMast':0,
                        'explosivesMast':0,
                        'artCraftmanshipMast':0,
                        'technicalEngineering1Mast':0,
                        'technicalEngineering2Mast':0,
                        'technicalEngineering3Mast':0,
                        'computingMast':0,
                        'survivalMechanicMast':0,
                        'mechanic1Mast':0,
                        'mechanic2Mast':0,
                        'trapsMast':0,
                        'computerHackingMast':0,
                        'firstAidMast':0,
                        'securitySystemsMast':0,

                        'specialComp1Mast':0,
                        'specialComp2Mast':0,
                        'specialComp3Mast':0,
                        'specialComp4Mast':0,

                        'initSheet':0
                    });
                }

                Polaris_Skills.UpdateSkills(eventInfo);
            });
        },
        registerEventHandlers = function (eventInfo) {
            on("sheet:opened", TAS.callback( function sheetOpened (eventInfo) {
                TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
                initCSheet(eventInfo);
            }));
        };

    registerEventHandlers();

    TAS.log("Polaris_Sheet loaded");
}());


/**  Character  **/

var Polaris_Attributes = Polaris_Attributes || (function () {


    var updateStrength = function (eventInfo) {

        updateAbilities("str",eventInfo);

    },
    updateConstitution = function (eventInfo) {

        updateAbilities("con",eventInfo);

    },
    updateCoordination = function (eventInfo) {

        updateAbilities("coo",eventInfo);

    },
    updateAdaptation = function (eventInfo) {

        updateAbilities("ada",eventInfo);

    },
    updatePerception = function (eventInfo) {

        updateAbilities("per",eventInfo);

    },
    updateIntelligence = function (eventInfo) {

        updateAbilities("int",eventInfo);

    },
    updateWillpower = function (eventInfo) {

        updateAbilities("wil",eventInfo);

    },
    updatePresence = function (eventInfo) {

        updateAbilities("pre",eventInfo);

    },

    updateAbilities = function (abilityShort, eventInfo) {

        getAttrs([abilityShort+'Base',abilityShort+'ModGen',abilityShort+'ModPC'], function (values) {

            //TAS.debug("values[abilityShort+'Base']:"+values[abilityShort+'Base']);
            //TAS.debug("values[abilityShort+'ModGen']:"+values[abilityShort+'ModGen']);
            //TAS.debug("values[abilityShort+'ModPC']:"+values[abilityShort+'ModPC']);

            if (typeof values[abilityShort+'Base'] !== 'undefined' && typeof values[abilityShort+'ModGen'] !== 'undefined' && typeof values[abilityShort+'ModPC'] !== 'undefined') {

                var ability = parseInt(values[abilityShort+'Base']);
                var abilityGen = parseInt(values[abilityShort+'ModGen']);
                var abilityPC = parseInt(values[abilityShort+'ModPC']);

                //TAS.debug("ability:"+ability);
                //TAS.debug("abilityGen:"+abilityGen);
                //TAS.debug("abilityPC:"+abilityPC);

                var result = ability+abilityGen+abilityPC;

                var gift = 0;

                if(result<4){
                  gift = -4;
                }
                else if(result==4){
                  gift = -3;
                }
                else if(result==5){
                  gift = -2;
                }
                else if(result<8){
                  gift = -1;
                }
                else if(result<10){
                  gift = 0;
                }
                else if(result<13){
                  gift = 1;
                }
                else if(result<16){
                  gift = 2;
                }
                else if(result<19){
                  gift = 3;
                }
                else if(result<22){
                  gift = 4;
                }
                else if(result<25){
                  gift = 5;
                }
                else{
                  gift = 6;
                }

                var setObj = {};

                setObj[abilityShort]=result;
                setObj[abilityShort+'NaturalGift']=gift;

                setAttrs(setObj);
            }
        });

    },

    updateDamageResist = function(eventInfo) {

        getAttrs(["str","con"], function(values) {

            if (typeof values["str"] !== 'undefined' && typeof values["con"] !== 'undefined') {

                var result = parseInt(values["str"])+parseInt(values["con"]);

                var damageResistValue = 0;


                if(result < 6){
                  damageResistValue = 6;
                }
                else if(result < 10){
                  damageResistValue = 4;
                }
                else if(result < 14){
                  damageResistValue = 2;
                }
                else if(result < 18){
                  damageResistValue = 1;
                }
                else if(result < 22){
                  damageResistValue = 0;
                }
                else if(result < 26){
                  damageResistValue = -1;
                }
                else if(result < 30){
                  damageResistValue = -2;
                }
                else if(result < 34){
                  damageResistValue = -3;
                }
                else if(result < 38){
                  damageResistValue = -4;
                }
                else if(result < 42){
                  damageResistValue = -5;
                }
                else{
                  var calcul = Math.round(0-(result/7));

                  damageResistValue = calcul;
                }

                setAttrs({
                    'damagesResist': damageResistValue
                });
            }

        });
    },
    updateDrugResist = function(eventInfo) {

        getAttrs(["wil","con"], function(values) {

            if (typeof values["wil"] !== 'undefined' && typeof values["con"] !== 'undefined') {

                var result = Math.round((parseInt(values["wil"])+parseInt(values["con"]))/2);

                var drugResistValue = 0;

                if(result < 3){
                  drugResistValue = 6;
                }
                else if(result < 5){
                  drugResistValue = 4;
                }
                else if(result < 7){
                  drugResistValue = 2;
                }
                else if(result < 9){
                  drugResistValue = 1;
                }
                else if(result < 12){
                  drugResistValue = 0;
                }
                else if(result < 14){
                  drugResistValue = -1;
                }
                else if(result < 16){
                  drugResistValue = -2;
                }
                else if(result < 18){
                  drugResistValue = -3;
                }
                else if(result < 20){
                  drugResistValue = -4;
                }
                else if(result < 22){
                  drugResistValue = -5;
                }
                else{
                  var calcul = Math.floor(1-(result/3));

                  drugResistValue = calcul;
                }

                setAttrs({
                    'drugsResist': drugResistValue
                });
            }
        });
    },
    updateOtherResist = function(eventInfo) {
        getAttrs(["con"], function(values) {

            if (typeof values["con"] !== 'undefined') {

                var result = parseInt(values["con"]);

                var poisonsDeseasesRadiationsResistValue = 0;

                if(result < 3){
                  poisonsDeseasesRadiationsResistValue = 6;
                }
                else if(result < 5){
                  poisonsDeseasesRadiationsResistValue = 4;
                }
                else if(result < 7){
                  poisonsDeseasesRadiationsResistValue = 2;
                }
                else if(result < 9){
                  poisonsDeseasesRadiationsResistValue = 1;
                }
                else if(result < 12){
                  poisonsDeseasesRadiationsResistValue = 0;
                }
                else if(result < 14){
                  poisonsDeseasesRadiationsResistValue = -1;
                }
                else if(result < 16){
                  poisonsDeseasesRadiationsResistValue = -2;
                }
                else if(result < 18){
                  poisonsDeseasesRadiationsResistValue = -3;
                }
                else if(result < 20){
                  poisonsDeseasesRadiationsResistValue = -4;
                }
                else if(result < 22){
                  poisonsDeseasesRadiationsResistValue = -5;
                }
                else{
                  var calcul = Math.floor(1-(result/3));

                  poisonsDeseasesRadiationsResistValue = calcul;
                }

                setAttrs({
                    'poisonsDeseasesRadiationsResist': poisonsDeseasesRadiationsResistValue
                });
            }
        });
    },
    updateDamageMod = function(eventInfo) {

        getAttrs(["str"], function(values) {

            if (typeof values["str"] !== 'undefined') {

                var result = parseInt(values["str"]);

                var meleeDamageModValue = 0;

                if(result < 3){
                    meleeDamageModValue = -6;
                }
                else if(result < 5){
                    meleeDamageModValue = -4;
                }
                else if(result < 7){
                    meleeDamageModValue = -2;
                }
                else if(result < 9){
                    meleeDamageModValue = -1;
                }
                else if(result < 12){
                    meleeDamageModValue = 0;
                }
                else if(result < 14){
                    meleeDamageModValue = 1;
                }
                else if(result < 16){
                    meleeDamageModValue = 2;
                }
                else if(result < 18){
                    meleeDamageModValue = 3;
                }
                else if(result < 20){
                    meleeDamageModValue = 4;
                }
                else if(result < 22){
                    meleeDamageModValue = 5;
                }
                else{
                    var calcul = Math.round(((result-10) / 2)-0.1);

                    meleeDamageModValue = calcul;
                }

                setAttrs({
                    meleeDamageMod: meleeDamageModValue
                });
            }
        });
    },

    updateSecondaryAttributes = function(eventInfo) {

        getAttrs(["str","con","wil","ada","per"], function(values) {

            if (typeof values["str"] !== 'undefined' && typeof values["con"] !== 'undefined' && typeof values["wil"] !== 'undefined' && typeof values["ada"] !== 'undefined' && typeof values["per"] !== 'undefined') {

                var strValue = parseInt(values["str"]);
                var conValue = parseInt(values["con"]);
                var wilValue = parseInt(values["wil"]);
                var adaValue = parseInt(values["ada"]);
                var perValue = parseInt(values["per"]);

                var stunThresholdValue = Math.floor((strValue+conValue+wilValue)/3);
                var knockoutThresholdValue = stunThresholdValue+10;
                var reactionValue = Math.floor((adaValue+perValue)/2);
                var apneaValue = Math.floor((conValue+wilValue)/2);

                setAttrs({
                    stunThreshold: stunThresholdValue,
                    knockoutThreshold: knockoutThresholdValue,
                    reaction: reactionValue,
                    apnea: apneaValue
                });
            }
        });

    },

    updateMoves = function(eventInfo) {

        getAttrs(["coo","geneticType"], function(values) {

            if (typeof values["coo"] !== 'undefined') {

                var cooValue = parseInt(values["coo"]);
                var geneticTypeValue = values["geneticType"];

                var result=0;

                if(cooValue < 6){
                    result=6;
                }
                else if(cooValue < 11){
                    result=8;
                }
                else if(cooValue < 16){
                    result=10;
                }
                else if(cooValue < 21){
                    result=12;
                }
                else if(cooValue < 26){
                    result=14;
                }
                else{
                    var calcValue = (Math.ceil( cooValue/5 )+2) * 2;

                    result=calcValue;
                }

                var groundSpeedMeanValue = result;
                var groundSpeedSlowValue = Math.floor(groundSpeedMeanValue/2);
                var groundSpeedFastValue = groundSpeedMeanValue*2;
                var groundSpeedMaxValue = groundSpeedMeanValue*4;


                var uwResult=0;


                if(cooValue < 6){
                    uwResult=1;
                }
                else if(cooValue < 11){
                    uwResult=2;
                }
                else if(cooValue < 16){
                    uwResult=3;
                }
                else if(cooValue < 21){
                    uwResult=4;
                }
                else if(cooValue < 26){
                    uwResult=5;
                }
                else{
                    var calcValue = ((Math.ceil(cooValue/5))*2)-5;

                    uwResult=calcValue;
                }


                if(geneticTypeValue=="techno-hybrid"){
                    uwResult=(uwResult*2)+2;
                }
                if(geneticTypeValue=="geno-hybrid" || geneticTypeValue=="natural-hybrid"){
                    uwResult=(uwResult*2)+4;
                }
                else{ //human

                }



                var underwaterSpeedMeanValue = uwResult;
                var underwaterSpeedSlowValue = Math.ceil(underwaterSpeedMeanValue/2);
                if(uwResult==1){
                    underwaterSpeedSlowValue=0.5;
                }
                var underwaterSpeedFastValue = underwaterSpeedMeanValue*2;
                var underwaterSpeedMaxValue = underwaterSpeedMeanValue*4;

                setAttrs({
                    groundSpeedSlow: groundSpeedSlowValue,
                    groundSpeedMean: groundSpeedMeanValue,
                    groundSpeedFast: groundSpeedFastValue,
                    groundSpeedMax: groundSpeedMaxValue,

                    underwaterSpeedSlow: underwaterSpeedSlowValue,
                    underwaterSpeedMean: underwaterSpeedMeanValue,
                    underwaterSpeedFast: underwaterSpeedFastValue,
                    underwaterSpeedMax: underwaterSpeedMaxValue
                });
            }
        });

    },

    // Register All the events
    registerEventHandlers = function () {

        on("change:strBase change:strModGen change:strModPC", TAS.callback( function updateStrengthBase (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateStrength(eventInfo);
        }));
        on("change:conBase change:conModGen change:conModPC", TAS.callback( function updateConstitutionBase (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateConstitution(eventInfo);
        }));
        on("change:cooBase change:cooModGen change:cooModPC", TAS.callback( function updateCoordinationBase (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateCoordination(eventInfo);
        }));
        on("change:adaBase change:adaModGen change:adaModPC", TAS.callback( function updateAdaptationBase (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateAdaptation(eventInfo);
        }));
        on("change:perBase change:perModGen change:perModPC", TAS.callback( function updatePerceptionBase (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updatePerception(eventInfo);
        }));
        on("change:intBase change:intModGen change:intModPC", TAS.callback( function updateIntelligenceBase (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateIntelligence(eventInfo);
        }));
        on("change:wilBase change:wilModGen change:wilModPC", TAS.callback( function updateWillpowerBase (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updateWillpower(eventInfo);
        }));
        on("change:preBase change:preModGen change:preModPC", TAS.callback( function updatePresenceBase (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);
            updatePresence(eventInfo);
        }));

        on("change:str change:con change:coo change:ada change:per change:int change:wil change:pre change:geneticType", TAS.callback( function updateSecondaryAttributesFunc (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);

            updateDamageResist(eventInfo);
            updateDrugResist(eventInfo);
            updateOtherResist(eventInfo);
            updateDamageMod(eventInfo);

            updateSecondaryAttributes(eventInfo);

            updateMoves(eventInfo);

        }));

        on("change:strNaturalGift change:conNaturalGift change:cooNaturalGift change:adaNaturalGift change:perNaturalGift change:intNaturalGift change:wilNaturalGift change:preNaturalGift", TAS.callback( function updateSkillsFunc (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);

            Polaris_Skills.UpdateSkills(eventInfo);

        }));

    };

    registerEventHandlers();

    TAS.log("Polaris_Attributes loaded");

}());

var Polaris_Skills = Polaris_Skills || (function () {

    var updateSkills = function (eventInfo) {

        updateSkill("acrobaticsBalance","coo","per",eventInfo);
        updateSkill("athletic","str","coo",eventInfo);
        updateSkill("endurance","con","wil",eventInfo);
        updateSkill("climbing","str","coo",eventInfo);
        updateSkill("zerogManeuvering","coo","ada",eventInfo);
        updateSkill("submarineManeuvering","str","coo",eventInfo);
        updateSkill("fofBreathing","con","wil",eventInfo);

        updateSkill("heavyWeaponMelee","str","str",eventInfo);
        updateSkill("specialWeaponMelee","str","coo",eventInfo);
        updateSkill("wrestlingMA","coo","ada",eventInfo);
        updateSkill("defenseTechniques","coo","coo",eventInfo);
        updateSkill("offenseTechniques","coo","ada",eventInfo);
        updateSkill("armedCombat","str","coo",eventInfo);
        updateSkill("handToHandCombat","str","coo",eventInfo);

        updateSkill("throwingWeapons","coo","per",eventInfo);
        updateSkill("heavyWeaponShooting","coo","per",eventInfo);
        updateSkill("handguns","coo","per",eventInfo);
        updateSkill("submarineWeapons","coo","per",eventInfo);
        updateSkill("specialWeaponRanged","coo","per",eventInfo);
        updateSkill("rangedWeapon","coo","per",eventInfo);
        updateSkill("riflesShoulderFiredWeapons","coo","per",eventInfo);
        updateSkill("automaticShoot","str","per",eventInfo);
        updateSkill("sharpShooting","per","wil",eventInfo);

        updateSkill("empathicAnalysis","int","per",eventInfo);
        updateSkill("singing","int","pre",eventInfo);
        updateSkill("actingStorytelling","ada","pre",eventInfo);
        updateSkill("leadership","wil","pre",eventInfo);
        updateSkill("dancing","coo","pre",eventInfo);
        updateSkill("eloquencePersuasion","int","pre",eventInfo);
        updateSkill("socializingSeduction","pre","pre",eventInfo);
        updateSkill("musicInstrument","coo","pre",eventInfo);
        updateSkill("intimidation","wil","pre",eventInfo);

        updateSkill("bureaucracy","int","int",eventInfo);
        updateSkill("cartography","int","int",eventInfo);
        updateSkill("businessTraffickingWeapons","int","pre",eventInfo);
        updateSkill("businessTraffickingDrugs","int","pre",eventInfo);
        updateSkill("businessTraffickingSpecial1","int","pre",eventInfo);
        updateSkill("businessTraffickingSpecial2","int","pre",eventInfo);
        updateSkill("nationsAndOrgaKnowledge1","int","int",eventInfo);
        updateSkill("nationsAndOrgaKnowledge2","int","int",eventInfo);
        updateSkill("nationsAndOrgaKnowledge3","int","int",eventInfo);
        updateSkill("cryptography","int","int",eventInfo);
        updateSkill("eductionGeneralKnowledge","int","int",eventInfo);
        updateSkill("gambling","int","wil",eventInfo);
        updateSkill("navigate","int","int",eventInfo);
        updateSkill("findingInformation","int","int",eventInfo);
        updateSkill("scienceSpecializedKnowledge1","int","int",eventInfo);
        updateSkill("scienceSpecializedKnowledge2","int","int",eventInfo);
        updateSkill("strategy","int","int",eventInfo);
        updateSkill("tacticsNavalCombat","int","ada",eventInfo);
        updateSkill("tactics","int","ada",eventInfo);

        updateSkill("camouflageConcealment","per","ada",eventInfo);
        updateSkill("diguiseDeception","ada","pre",eventInfo);
        updateSkill("discretionShadowing","per","ada",eventInfo);
        updateSkill("escape","coo","wil",eventInfo);
        updateSkill("furtiveSilentMovement","per","ada",eventInfo);
        updateSkill("pickpocket","coo","ada",eventInfo);

        updateSkill("foreignLanguage1","int","int",eventInfo);
        updateSkill("foreignLanguage2","int","int",eventInfo);
        updateSkill("ancientLanguage","int","int",eventInfo);
        updateSkill("specificLanguage","int","int",eventInfo);

        updateSkill("submarineArmorManeuver","coo","ada",eventInfo);
        updateSkill("armorManeuver","coo","ada",eventInfo);
        updateSkill("submarineScooterPilotage","per","ada",eventInfo);
        updateSkill("pilotLightShip","int","int",eventInfo);
                                                                //updateSkill("specificPilot","xxx","xxx",eventInfo);
        updateSkill("telePilotage","int","ada",eventInfo);

        updateSkill("huntingTracking","per","ada",eventInfo);
        updateSkill("oceansKnowledge","int","ada",eventInfo);
        updateSkill("undergroundKnowledge","int","ada",eventInfo);
        updateSkill("surfaceKnowledge","int","ada",eventInfo);
        updateSkill("observation","per","wil",eventInfo);
        updateSkill("orientation","per","ada",eventInfo);
        updateSkill("survival","ada","wil",eventInfo);

        updateSkill("soundscanAnalysis","int","ada",eventInfo);
        updateSkill("onboardWeapons","int","int",eventInfo);
        updateSkill("armory","int","int",eventInfo);
        updateSkill("aquacultureLivestockFarming","int","int",eventInfo);
        updateSkill("surgery","int","int",eventInfo);
        updateSkill("training","wil","pre",eventInfo);
        updateSkill("electronics","int","int",eventInfo);
        updateSkill("spying","int","int",eventInfo);
        updateSkill("explosives","int","int",eventInfo);
        updateSkill("artCraftmanship","int","per",eventInfo);
        updateSkill("technicalEngineering1","int","int",eventInfo);
        updateSkill("technicalEngineering2","int","int",eventInfo);
        updateSkill("technicalEngineering3","int","int",eventInfo);
        updateSkill("computing","int","int",eventInfo);
        updateSkill("survivalMechanic","int","int",eventInfo);
        updateSkill("mechanic1","int","int",eventInfo);
        updateSkill("mechanic2","int","int",eventInfo);
        updateSkill("traps","int","per",eventInfo);
        updateSkill("computerHacking","int","int",eventInfo);
        updateSkill("firstAid","int","ada",eventInfo);
        updateSkill("securitySystems","int","int",eventInfo);


    },
    updateSpecificPilot = function (eventInfo) {

        getAttrs(['pilotingFirstAbility','pilotingSecondAbility'], function (values) {

            if (typeof values['pilotingFirstAbility'] !== 'undefined' && typeof values['pilotingSecondAbility'] !== 'undefined') {

                var firstAbility = values['pilotingFirstAbility'];
                var secondAbility = values['pilotingSecondAbility'];

                updateSkill("specificPilot",firstAbility,secondAbility,eventInfo);
            }
        });

    },
    updateSpecialComp = function (number,eventInfo) {

        getAttrs(['specialComp'+number+'FirstAbility','specialComp'+number+'SecondAbility'], function (values) {

            if (typeof values['specialComp'+number+'FirstAbility'] !== 'undefined' && typeof values['specialComp'+number+'SecondAbility'] !== 'undefined') {

                var firstAbility = values['specialComp'+number+'FirstAbility'];
                var secondAbility = values['specialComp'+number+'SecondAbility'];

                updateSkill('specialComp'+number,firstAbility,secondAbility,eventInfo);
            }
        });

    },

    updateSkill = function (skillName, abilityOne, abilityTwo, eventInfo){

        //TAS.debug('skillName: '+skillName);
        //TAS.debug('abilityOne: '+abilityOne);
        //TAS.debug('abilityTwo: '+abilityTwo);

        getAttrs([skillName+'Mast',abilityOne+'NaturalGift',abilityTwo+'NaturalGift'], function (values) {

            if (typeof values[skillName+'Mast'] !== 'undefined' && typeof values[abilityOne+'NaturalGift'] !== 'undefined' && typeof values[abilityTwo+'NaturalGift'] !== 'undefined') {

                var skillMast = parseInt(values[skillName+'Mast']);
                var abilityOneValue = parseInt(values[abilityOne+'NaturalGift']);
                var abilityTwoValue = parseInt(values[abilityTwo+'NaturalGift']);

                //TAS.debug('skillMast: '+skillMast);
                //TAS.debug('abilityOneValue: '+abilityOneValue);
                //TAS.debug('abilityTwoValue: '+abilityTwoValue);

                var skillBaseName = skillName+"Base";
                var skillBaseValue = abilityOneValue+abilityTwoValue;

                var skillValue = skillMast+skillBaseValue;

                var setObj = {};

                setObj[skillBaseName]=skillBaseValue;
                setObj[skillName]=skillValue;

                setAttrs(setObj);

            }
        });
    },
       // Register All the events
    registerEventHandlers = function () {

        on("change:pilotingFirstAbility change:pilotingSecondAbility", TAS.callback( function updateSpecificPilotAbilities (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);

            updateSpecificPilot(eventInfo);
        }));

        on("change:specialComp1FirstAbility change:specialComp1SecondAbility", TAS.callback( function updateSpecialComp1Abilities (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);

            updateSpecialComp("1",eventInfo);
        }));
        on("change:specialComp2FirstAbility change:specialComp2SecondAbility", TAS.callback( function updateSpecialComp2Abilities (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);

            updateSpecialComp("2",eventInfo);
        }));
        on("change:specialComp3FirstAbility change:specialComp3SecondAbility", TAS.callback( function updateSpecialComp3Abilities (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);

            updateSpecialComp("3",eventInfo);
        }));
        on("change:specialComp4FirstAbility change:specialComp4SecondAbility", TAS.callback( function updateSpecialComp4Abilities (eventInfo) {
            TAS.debug("caught " + eventInfo.sourceAttribute + " event: " + eventInfo.sourceType);

            updateSpecialComp("4",eventInfo);
        }));
    };

    registerEventHandlers();

    TAS.log("Polaris_Skills loaded");

    return {
        UpdateSkills: updateSkills
    };
}());

/**  Armor  **/

/**  Vehicle  **/

/**  Old Script  **/
