/*
 * Copyright (c) 2015 Memorial Sloan-Kettering Cancer Center.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS
 * FOR A PARTICULAR PURPOSE. The software and documentation provided hereunder
 * is on an 'as is' basis, and Memorial Sloan-Kettering Cancer Center has no
 * obligations to provide maintenance, support, updates, enhancements or
 * modifications. In no event shall Memorial Sloan-Kettering Cancer Center be
 * liable to any party for direct, indirect, special, incidental or
 * consequential damages, including lost profits, arising out of the use of this
 * software and its documentation, even if Memorial Sloan-Kettering Cancer
 * Center has been advised of the possibility of such damage.
 */

/*
 * This file is part of cBioPortal.
 *
 * cBioPortal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';
(function(iViz, _, cbio) {
  iViz.util = (function() {
    var content = {};

    /**
     * Convert number to specific precision end.
     * @param {number} number The number you want to convert.
     * @param {integer} precision Significant figures.
     * @param {number} threshold The upper bound threshold.
     * @return {number} Converted number.
     */
    content.toPrecision = function(number, precision, threshold) {
      if (number >= 0.000001 && number < threshold) {
        return number.toExponential(precision);
      }
      return number.toPrecision(precision);
    };
    content.getRandomDate = function (){
                  var from = new Date ("2016-01-01").getTime(); //this is in milliseconds, so math can be done later on it
                  var to = new Date ("2016-12-31").getTime(); //also in milliseconds
                  var randomDate = new Date (from + (Math.random()*(to-from))); //create a new date object after math is done
                  return randomDate.getMonth()+1 + "-" + randomDate.getDate() + "-" + randomDate.getFullYear(); //create a date string: "m-d-yyyy"
                  };
    /**
     * iViz color schema.
     * @return {string[]} Color array.
     */
    content.getColors = function() {
      return [
        '#2986e2', '#dc3912', '#f88508', '#109618',
        '#990099', '#0099c6', '#dd4477', '#66aa00',
        '#b82e2e', '#316395', '#994499', '#22aa99',
        '#aaaa11', '#6633cc', '#e67300', '#8b0707',
        '#651067', '#329262', '#5574a6', '#3b3eac',
        '#b77322', '#16d620', '#b91383', '#f4359e',
        '#9c5935', '#a9c413', '#2a778d', '#668d1c',
        '#bea413', '#0c5922', '#743411', '#743440',
        '#9986e2', '#6c3912', '#788508', '#609618',
        '#790099', '#5099c6', '#2d4477', '#76aa00',
        '#882e2e', '#916395', '#794499', '#92aa99',
        '#2aaa11', '#5633cc', '#667300', '#100707',
        '#751067', '#229262', '#4574a6', '#103eac',
        '#177322', '#66d620', '#291383', '#94359e',
        '#5c5935', '#29c413', '#6a778d', '#868d1c',
        '#5ea413', '#6c5922', '#243411', '#103440',
        '#2886e2', '#d93912', '#f28508', '#110618',
        '#970099', '#0109c6', '#d10477', '#68aa00',
        '#b12e2e', '#310395', '#944499', '#24aa99',
        '#a4aa11', '#6333cc', '#e77300', '#820707',
        '#610067', '#339262', '#5874a6', '#313eac',
        '#b67322', '#13d620', '#b81383', '#f8359e',
        '#935935', '#a10413', '#29778d', '#678d1c',
        '#b2a413', '#075922', '#763411', '#773440',
        '#2996e2', '#dc4912', '#f81508', '#104618',
        '#991099', '#0049c6', '#dd2477', '#663a00',
        '#b84e2e', '#312395', '#993499', '#223a99',
        '#aa1a11', '#6673cc', '#e66300', '#8b5707',
        '#656067', '#323262', '#5514a6', '#3b8eac',
        '#b71322', '#165620', '#b99383', '#f4859e',
        '#9c4935', '#a91413', '#2a978d', '#669d1c',
        '#be1413', '#0c8922', '#742411', '#744440',
        '#2983e2', '#dc3612', '#f88808', '#109518',
        '#990599', '#0092c6', '#dd4977', '#66a900',
        '#b8282e', '#316295', '#994199', '#22a499',
        '#aaa101', '#66310c', '#e67200', '#8b0907',
        '#651167', '#329962', '#5573a6', '#3b37ac',
        '#b77822', '#16d120', '#b91783', '#f4339e',
        '#9c5105', '#a9c713', '#2a710d', '#66841c',
        '#bea913', '#0c5822', '#743911', '#743740',
        '#298632', '#dc3922', '#f88588', '#109658',
        '#990010', '#009916', '#dd4447', '#66aa60',
        '#b82e9e', '#316365', '#994489', '#22aa69',
        '#aaaa51', '#66332c', '#e67390', '#8b0777',
        '#651037', '#329232', '#557486', '#3b3e4c',
        '#b77372', '#16d690', '#b91310', '#f4358e',
        '#9c5910', '#a9c493', '#2a773d', '#668d5c',
        '#bea463', '#0c5952', '#743471', '#743450',
        '#2986e3', '#dc3914', '#f88503', '#109614',
        '#990092', '#0099c8', '#dd4476', '#66aa04',
        '#b82e27', '#316397', '#994495', '#22aa93',
        '#aaaa14', '#6633c1', '#e67303', '#8b0705',
        '#651062', '#329267', '#5574a1', '#3b3ea5'
      ];
    };

    content.idMapping = function(mappingObj, inputCases) {
      var _selectedMappingCases = [];
      _selectedMappingCases.length = 0;
      var resultArr_ = [];
      var tempArr_ = {};
      _.each(inputCases, function(_case) {
        _.each(mappingObj[_case],function(_caseSel){
          if(tempArr_[_caseSel] === undefined){
            tempArr_[_caseSel] = true;
            resultArr_.push(_caseSel)
          }
        });
        //_selectedMappingCases = _selectedMappingCases.concat(mappingObj[_case]);
      });
      return resultArr_;
      //return content.unique(_selectedMappingCases);
    };
    
    content.unique = function(arr_){
      var resultArr_ = [];
      var tempArr_ = {};
      _.each(arr_,function(obj_){
        if(tempArr_[obj_] === undefined){
          tempArr_[obj_] = true;
          resultArr_.push(obj_);
        }
      });
      return resultArr_;
    };

    content.isRangeFilter = function(filterObj) {
      if (filterObj.filterType !== undefined) {
        if (filterObj.filterType === 'RangedFilter') {
          return true;
        }
      }
      return false;
    };

    content.sortByAttribute = function(objs, attrName) {
      function compare(a, b) {
        if (a[attrName] < b[attrName]) {
          return -1;
        }
        if (a[attrName] > b[attrName]) {
          return 1;
        }
        return 0;
      }

      objs.sort(compare);
      return objs;
    };

    content.download = function(chartType, fileType, content) {
      switch (chartType) { 
        case 'pieChart':
          pieChartDownload(fileType, content);
          break;
        case 'barChart':
          barChartDownload(fileType, content);
          break;
        case 'survivalPlot':
          survivalChartDownload(fileType, content);
          break;
        case 'scatterPlot':
          survivalChartDownload(fileType, content);
          break;
        case 'lineChart':
          lineChartDownload(fileType, content);
          break;  
        case 'table':
          tableDownload(fileType, content);
        default:
          break;
      }
    };

    content.restrictNumDigits = function(str) {
      if (!isNaN(str)) {
        var num = Number(str);
        if (num % 1 !== 0) {
          num = num.toFixed(2);
          str = num.toString();
        }
      }
      return str;
    }

    function tableDownload(fileType, content) {
      switch (fileType) {
        case 'tsv':
          csvDownload(content.fileName, content.data);
          break;
        default:
          break;
      }
    }

    function pieChartDownload(fileType, content) {
      switch (fileType) {
        case 'tsv':
          csvDownload(content.fileName || 'data', content.data);
          break;
        case 'svg':
          pieChartCanvasDownload(content, {
            filename: content.fileName + '.svg'
          });
          break;
        case 'pdf':
          pieChartCanvasDownload(content, {
            filename: content.fileName + '.pdf',
            contentType: 'application/pdf',
            servletName: 'http://localhost:8080/cbioportal/svgtopdf.do'
          });
          break;
        default:
          break;
      }
    }

    function getPieWidthInfo(data) {
      var length = data.title.length;
      var labels = data.labels;
      var labelMaxName = _.last(_.sortBy(_.pluck(labels, 'name'), function(item) {
        return item.toString().length;
      })).toString().length;
      var labelMaxNumber = _.last(_.sortBy(_.pluck(labels, 'samples'), function(item) {
        return item.toString().length;
      })).toString().length;
      var labelMaxFreq = _.last(_.sortBy(_.pluck(labels, 'sampleRate'), function(item) {
        return item.toString().length;
      })).toString().length;

      if (labelMaxName > length) {
        length = labelMaxName;
      }
      length = length * 10 + labelMaxNumber * 10 + labelMaxFreq * 10 + 30;

      return {
        svg: length,
        name: labelMaxName > data.title.length ? labelMaxName : data.title.length,
        number: labelMaxNumber,
        freq: labelMaxFreq
      };
    }

    function pieChartCanvasDownload(data, downloadOpts) {
      var _svgElement;

      var _width = getPieWidthInfo(data);
      var _valueXCo = 0;
      var _pieLabelString = '';
      var _pieLabelYCoord = 0;
      var _svg = $('#' + data.chartId + ' svg');
      var _previousHidden = false;

      if ($('#' + data.chartDivId).css('display') === 'none') {
        _previousHidden = true;
        $('#' + data.chartDivId).css('display', 'block');
      }

      var _svgHeight = _svg.height();
      var _text = _svg.find('text');
      var _textLength = _text.length;
      var _slice = _svg.find('g .pie-slice');
      var _sliceLength = _slice.length;
      var _pieLabel = data.labels;
      var _pieLabelLength = _pieLabel.length;
      var i = 0;

      if (_previousHidden) {
        $('#' + data.chartDivId).css('display', 'none');
      }

      // Change pie slice text styles
      for (i = 0; i < _textLength; i++) {
        $(_text[i]).css({
          'fill': 'white',
          'font-size': '14px',
          'stroke': 'white',
          'stroke-width': '1px'
        });
      }

      // Change pie slice styles
      for (i = 0; i < _sliceLength; i++) {
        $($(_slice[i]).find('path')[0]).css({
          'stroke': 'white',
          'stroke-width': '1px'
        });
      }

      if (_width.svg < 180) {
        _width.svg = 180;
      }

      // Draw sampleSize header
      _pieLabelString += '<g transform="translate(0, ' +
        _pieLabelYCoord + ')"><text x="13" y="10" ' +
        'style="font-size:12px; font-weight:bold">' +
        data.title + '</text>' +
        '<text x="' + _width.name * 10 + '" y="10" ' +
        'style="font-size:12px; font-weight:bold">#</text>' +
        '<text x="' + (_width.name + _width.number) * 10 + '" y="10" ' +
        'style="font-size:12px; font-weight:bold">Freq</text>' +
        '<line x1="0" y1="14" x2="' + ((_width.name + _width.number) * 10 - 20) + '" y2="14" ' +
        'style="stroke:black;stroke-width:2"></line>' +
        '<line x1="' + (_width.name * 10 - 10) + '" y1="14" x2="' + (_width.svg - 20) + '" y2="14" ' +
        'style="stroke:black;stroke-width:2"></line>' +
        '<line x1="' + ((_width.name + _width.number) * 10 - 10) + '" y1="14" x2="' + (_width.svg - 20) + '" y2="14" ' +
        'style="stroke:black;stroke-width:2"></line>' +
        '</g>';

      _pieLabelYCoord += 18;

      // Draw pie label into output
      for (i = 0; i < _pieLabelLength; i++) {
        var _label = _pieLabel[i];

        _pieLabelString += '<g transform="translate(0, ' +
          _pieLabelYCoord + ')"><rect height="10" width="10" fill="' + _label.color +
          '"></rect><text x="13" y="10" ' +
          'style="font-size:15px">' + _label.name + '</text>' +
          '<text x="' + _width.name * 10 + '" y="10" ' +
          'style="font-size:15px">' + _label.samples + '</text>' +
          '<text x="' + (_width.name + _width.number) * 10 + '" y="10" ' +
          'style="font-size:15px">' + _label.sampleRate + '</text>' +
          '</g>';

        _pieLabelYCoord += 15;
      }

      _svgElement = cbio.download.serializeHtml($('#' + data.chartId + ' svg>g')[0]);

      var svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + _width.svg + '" height="' + (180 + _pieLabelYCoord) + '">' +
        '<g><text x="' + (_width.svg / 2) + '" y="20" style="font-weight: bold;" text-anchor="middle">' +
        data.title + '</text></g>' +
        '<g transform="translate(' + (_width.svg / 2 - 65) + ', 20)">' + _svgElement + '</g>' +
        '<g transform="translate(10, ' + (_svgHeight + 20) + ')">' +
        _pieLabelString + '</g></svg>';

      cbio.download.initDownload(svg, downloadOpts);

      // Remove pie slice text styles
      for (i = 0; i < _textLength; i++) {
        $(_text[i]).css({
          'fill': '',
          'font-size': '',
          'stroke': '',
          'stroke-width': ''
        });
      }

      // Remove pie slice styles
      for (i = 0; i < _sliceLength; i++) {
        $($(_slice[i]).find('path')[0]).css({
          'stroke': '',
          'stroke-width': ''
        });
      }
    }

    function barChartCanvasDownload(data, downloadOpts) {
      var _svgElement = '';
      var _svg = $('#' + data.chartId + ' svg');
      var _brush = _svg.find('g.brush');
      var _brushWidth = Number(_brush.find('rect.extent').attr('width'));
      var i = 0;

      if (_brushWidth === 0) {
        _brush.css('display', 'none');
      }

      _brush.find('rect.extent')
        .css({
          'fill-opacity': '0.2',
          'fill': '#2986e2'
        });

      _brush.find('.resize path')
        .css({
          'fill': '#eee',
          'stroke': '#666'
        });

      // Change deselected bar chart
      var _chartBody = _svg.find('.chart-body');
      var _deselectedCharts = _chartBody.find('.bar.deselected');
      var _deselectedChartsLength = _deselectedCharts.length;

      for (i = 0; i < _deselectedChartsLength; i++) {
        $(_deselectedCharts[i]).css({
          'stroke': '',
          'fill': '#ccc'
        });
      }

      // Change axis style
      var _axis = _svg.find('.axis');
      var _axisDomain = _axis.find('.domain');
      var _axisDomainLength = _axisDomain.length;
      var _axisTick = _axis.find('.tick.major line');
      var _axisTickLength = _axisTick.length;

      for (i = 0; i < _axisDomainLength; i++) {
        $(_axisDomain[i]).css({
          'fill': 'white',
          'fill-opacity': '0',
          'stroke': 'black'
        });
      }

      for (i = 0; i < _axisTickLength; i++) {
        $(_axisTick[i]).css({
          'stroke': 'black'
        });
      }

      //Change x/y axis text size
      var _chartText = _svg.find('.axis text'),
        _chartTextLength = _chartText.length;

      for (i = 0; i < _chartTextLength; i++) {
        $(_chartText[i]).css({
          'font-size': '12px'
        });
      }

      $('#' + data.chartId + ' svg>g').each(function(i, e) {
        _svgElement += cbio.download.serializeHtml(e);
      });
      $('#' + data.chartId + ' svg>defs').each(function(i, e) {
        _svgElement += cbio.download.serializeHtml(e);
      });

      var svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="370" height="200">' +
        '<g><text x="180" y="20" style="font-weight: bold; text-anchor: middle">' +
        data.title + '</text></g>' +
        '<g transform="translate(0, 20)">' + _svgElement + '</g></svg>';

      cbio.download.initDownload(
        svg, downloadOpts);

      _brush.css('display', '');

      // Remove added styles
      _brush.find('rect.extent')
        .css({
          'fill-opacity': '',
          'fill': ''
        });

      _brush.find('.resize path')
        .css({
          'fill': '',
          'stroke': ''
        });

      for (i = 0; i < _deselectedChartsLength; i++) {
        $(_deselectedCharts[i]).css({
          'stroke': '',
          'fill': ''
        });
      }

      for (i = 0; i < _axisDomainLength; i++) {
        $(_axisDomain[i]).css({
          'fill': '',
          'fill-opacity': '',
          'stroke': ''
        });
      }

      for (i = 0; i < _axisTickLength; i++) {
        $(_axisTick[i]).css({
          'stroke': ''
        });
      }

      for (i = 0; i < _chartTextLength; i++) {
        $(_chartText[i]).css({
          'font-size': ''
        });
      }
    }

    function survivalChartDownload(fileType, content) {
      switch (fileType) {
        case 'svg':
          survivalChartCanvasDownload(content, {
            filename: content.fileName + '.svg'
          });
          break;
        case 'pdf':
          survivalChartCanvasDownload(content, {
            filename: content.fileName + '.pdf',
            contentType: 'application/pdf',
            servletName: 'http://localhost:8080/cbioportal/svgtopdf.do'
          });
          break;
        default:
          break;
      }
    }

    function survivalChartCanvasDownload(data, downloadOpts) {
      var _svgElement, _svgLabels, _svgTitle,
        _labelTextMaxLength = 0,
        _numOfLabels = 0,
        _svgWidth = 360,
        _svgheight = 360;

      _svgElement = cbio.download.serializeHtml($('#' + data.chartDivId + ' svg')[0]);
      // _svgLabels = $('#' + data.labelDivId + ' svg');
      //
      // _svgLabels.find('image').remove();
      // _svgLabels.find('text').each(function(i, obj) {
      //   var _value = $(obj).attr('oValue');
      //
      //   if (typeof _value === 'undefined') {
      //     _value = $(obj).text();
      //   }
      //
      //   if (_value.length > _labelTextMaxLength) {
      //     _labelTextMaxLength = _value.length;
      //   }
      //   $(obj).text(_value);
      //   _numOfLabels++;
      // });

      _svgWidth += _labelTextMaxLength * 14;

      if (_svgheight < _numOfLabels * 20) {
        _svgheight = _numOfLabels * 20 + 40;
      }

      // _svgLabels = cbio.download.serializeHtml(_svgLabels[0]);

      _svgTitle = '<g><text text-anchor="middle" x="210" y="30" ' +
        'style="font-weight:bold">' + data.title + '</text></g>';

      _svgElement = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + _svgWidth + 'px" height="' + _svgheight + 'px" style="font-size:14px">' +
        _svgTitle + '<g transform="translate(0,40)">' +
        _svgElement + '</g>' +
        // '<g transform="translate(370,50)">' +
        // _svgLabels + '</g>' +
        '</svg>';

      cbio.download.initDownload(
        _svgElement, downloadOpts);
    }
    
    function lineChartDownload(fileType, content) { //used barchartdownload as an example
      switch (fileType) {
        case 'tsv':
          csvDownload(content.fileName || 'data', content.data);
          break;
        case 'svg':
          lineChartCanvasDownload(content, {
            filename: content.fileName + '.svg'
          });
          break;
        case 'pdf':
          lineChartCanvasDownload(content, {
            filename: content.fileName + '.pdf',
            contentType: 'application/pdf',
            servletName: 'http://localhost:8080/cbioportal/svgtopdf.do'
          });
          break;
        default:
          break;
      }
    }
    
    function lineChartCanvasDownload(data, downloadOpts) {
      var _svgElement = ''; //will contain the linechart
      var _svgRangeElement = ''; //will contain the rangechart
      var _svg = $(data.chartId + ' svg');
      var _svgRange = $(data.rangeChartId + ' svg');
      var _brush = _svgRange.find('g.brush');
      var _brushWidth = Number(_brush.find('rect.extent').attr('width'));
      var i = 0;

      if (_brushWidth === 0) {
        _brush.css('display', 'none');
      }

      _brush.find('rect.extent')
        .css({
          'fill-opacity': '0.2',
          'fill': '#2986e2'
        });

      _brush.find('.resize path')
        .css({
          'fill': '#eee',
          'stroke': '#666'
        });
      
      _svgRange.find('g.y') //remove y axis of range chart
        .css({
         'display': 'none'         
        });

      // Change deselected bar chart
      var _chartBody = _svgRange.find('.chart-body');
      var _deselectedCharts = _chartBody.find('.bar.deselected');
      var _deselectedChartsLength = _deselectedCharts.length;

      for (i = 0; i < _deselectedChartsLength; i++) {
        $(_deselectedCharts[i]).css({
          'stroke': '',
          'fill': '#ccc'
        });
      }
      //change axis style of line chart
      var _axis = _svg.find('.axis');
      var _axisDomain = _axis.find('.domain');
      var _axisDomainLength = _axisDomain.length;
      var _axisTick = _axis.find('.tick.major line');
      var _axisTickLength = _axisTick.length;

      for (i = 0; i < _axisDomainLength; i++) {
        $(_axisDomain[i]).css({
          'fill': 'white',
          'fill-opacity': '0',
          'stroke': 'black'
        });
      }

      for (i = 0; i < _axisTickLength; i++) {
        $(_axisTick[i]).css({
          'stroke': 'black'
        });
      }

      // Change axis style of range chart
      var _axisRange = _svgRange.find('.axis');
      var _axisDomainRange = _axisRange.find('.domain');
      var _axisDomainLengthRange = _axisDomainRange.length;
      var _axisTickRange = _axisRange.find('.tick.major line');
      var _axisTickLengthRange = _axisTickRange.length;

      for (i = 0; i < _axisDomainLengthRange; i++) {
        $(_axisDomainRange[i]).css({
          'fill': 'white',
          'fill-opacity': '0',
          'stroke': 'black'
        });
      }

      for (i = 0; i < _axisTickLengthRange; i++) {
        $(_axisTickRange[i]).css({
          'stroke': 'black'
        });
      }

      //change x/y axis text size of line chart
      var _chartText = _svg.find('.axis text'),
        _chartTextLength = _chartText.length;

      for (i = 0; i < _chartTextLength; i++) {
        $(_chartText[i]).css({
          'font-size': '12px'
        });
      }
      
      //Change x/y axis text size of range chart
      var _chartTextRange = _svgRange.find('.axis text'),
        _chartTextLengthRange = _chartTextRange.length;

      for (i = 0; i < _chartTextLengthRange; i++) {
        $(_chartTextRange[i]).css({
          'font-size': '12px'
        });
      }
      
      //change line style of line chart
      _svg.find('g.chart-body').css({
         'fill': 'none' 
      });
      
      //convert SVGs to strings
      $(data.chartId + ' svg>g').each(function(i, e) {
        _svgElement += cbio.download.serializeHtml(e);
      });
      $(data.chartId + ' svg>defs').each(function(i, e) {
        _svgElement += cbio.download.serializeHtml(e);
      });
      $(data.rangeChartId + ' svg>g').each(function(i,e){
         _svgRangeElement += cbio.download.serializeHtml(e);
      });
      $(data.rangeChartId + ' svg>defs').each(function(i,e){
         _svgRangeElement += cbio.download.serializeHtml(e) ;
      });

      var svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="375" height="340">' +
        '<g><text x="180" y="20" style="font-weight: bold; text-anchor: middle">' +
        data.title + '</text></g>' + //data.title is from initCanvasDownloadData in lineChart.js
        '<g transform="translate(0, 20)">' + _svgElement + '</g>' +
        '<g transform="translate(0,260)">' +_svgRangeElement + '</g></svg>';

      cbio.download.initDownload(
        svg, downloadOpts);
      
      // Remove added styles of LINE chart
      for (i = 0; i < _axisDomainLength; i++) {
        $(_axisDomain[i]).css({
          'fill': '',
          'fill-opacity': '',
          'stroke': ''
        });
      }

      for (i = 0; i < _axisTickLength; i++) {
        $(_axisTick[i]).css({
          'stroke': ''
        });
      }

      for (i = 0; i < _chartTextLength; i++) {
        $(_chartText[i]).css({
          'font-size': ''
        });
      }
    
      // Remove added styles of RANGE chart
      for (i = 0; i < _deselectedChartsLength; i++) {
        $(_deselectedCharts[i]).css({
          'stroke': '',
          'fill': ''
        });
      }
      _brush.css('display', '');
      
      _brush.find('rect.extent')
        .css({
          'fill-opacity': '',
          'fill': ''
        });

      _brush.find('.resize path')
        .css({
          'fill': '',
          'stroke': ''
        });
        
      _svgRange.find('g.y').css('display', '');
      
      for (i = 0; i < _axisDomainLengthRange; i++) {
        $(_axisDomain[i]).css({
          'fill': '',
          'fill-opacity': '',
          'stroke': ''
        });
      }

      for (i = 0; i < _axisTickLengthRange; i++) {
        $(_axisTick[i]).css({
          'stroke': ''
        });
      }
      
      for (i = 0; i < _chartTextLengthRange; i++) {
        $(_chartTextRange[i]).css({
          'font-size': ''
        });
      }

    }; 

    function csvDownload(fileName, content) {
      fileName = fileName || 'test';
      var downloadOpts = {
        filename: fileName + '.txt',
        contentType: 'text/plain;charset=utf-8',
        preProcess: false
      };

      cbio.download.initDownload(content, downloadOpts);
    }

    function barChartDownload(fileType, content) {
      switch (fileType) {
        case 'tsv':
          csvDownload(content.fileName || 'data', content.data);
          break;
        case 'svg':
          barChartCanvasDownload(content, {
            filename: content.fileName + '.svg'
          });
          break;
        case 'pdf':
          barChartCanvasDownload(content, {
            filename: content.fileName + '.pdf',
            contentType: 'application/pdf',
            servletName: 'http://localhost:8080/cbioportal/svgtopdf.do'
          });
          break;
        default:
          break;
      }
    }

    function downloadTextFile(content, delimiter) {

    }

    /**
     * Finds the intersection elements between two arrays in a simple fashion.
     * Should have O(n) operations, where n is n = MIN(a.length, b.length)
     *
     * @param a {Array} first array, must already be sorted
     * @param b {Array} second array, must already be sorted
     * @returns {Array}
     */
    content.intersection = function(a, b) {
      var result = [], i = 0, j = 0, aL = a.length, bL = b.length, size = 0;
      while (i < aL && j < bL) {
        if (a[i] < b[j]) {
          ++i;
        }
        else if (a[i] > b[j]) {
          ++j;
        }
        else /* they're equal */
        {
          result.push(a[i]);
          ++i;
          ++j;
        }
      }

      return result;
    };

    content.compare = function(arr1, arr2) {
      if (arr1.length != arr2.length){
        return false;
      }else{
        for (var i = 0; i < arr1.length; i++) {
          if (arr1[i] !== arr2[i])
            return false;
        }
      }
      return true;
    };

    return content;
  })();
})(window.iViz,
  window._, window.cbio);
